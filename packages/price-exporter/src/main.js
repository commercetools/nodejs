/* @flow */
import type {
  ApiConfigOptions,
  Configuration,
  ExporterOptions,
  LoggerOptions,
  ProcessedPriceObject,
  UnprocessedPriceObject,
} from 'types/price'
import type { Client } from 'types/sdk'

import fetch from 'node-fetch'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import csv from 'fast-csv'
import JSONStream from 'JSONStream'
import Promise from 'bluebird'
import { flatten } from 'flat'
import { memoize } from 'lodash'
import pkg from '../package.json'

export default class PriceExporter {
  // Set flowtype annotations
  apiConfig: ApiConfigOptions
  client: Client
  config: Configuration
  logger: LoggerOptions
  fetchReferences: Function

  constructor(options: ExporterOptions, logger: LoggerOptions) {
    if (!options.apiConfig)
      throw new Error('The constructor must be passed an `apiConfig` object')
    if (!options.csvHeaders && options.exportFormat === 'csv')
      throw new Error(
        'The constructor must be passed a `csvHeaders` array for CSV export'
      )
    this.apiConfig = options.apiConfig
    this.client = createClient({
      middlewares: [
        createAuthMiddlewareForClientCredentialsFlow({
          ...this.apiConfig,
          fetch,
        }),
        createUserAgentMiddleware({
          libraryName: pkg.name,
          libraryVersion: pkg.version,
        }),
        createHttpMiddleware({
          host: this.apiConfig.apiUrl,
          fetch,
        }),
      ],
    })

    const defaultOptions = {
      delimiter: ',',
      exportFormat: 'json',
      staged: false,
    }

    this.config = { ...defaultOptions, ...options }

    this.logger = {
      error: () => {},
      warn: () => {},
      info: () => {},
      verbose: () => {},
      ...logger,
    }
  }

  run(outputStream: stream$Writable) {
    this.logger.info('Starting Export')
    if (this.config.exportFormat === 'csv') {
      const csvOptions = {
        headers: this.config.csvHeaders,
        delimiter: this.config.delimiter,
      }
      const csvStream = csv.createWriteStream(csvOptions)
      csvStream.pipe(outputStream)
      this._getProducts(outputStream, csvStream)
    } else {
      // This makes the exported data compatible with the importer
      // Newlines make data more human-readable
      const jsonStream = JSONStream.stringify('{"prices": [\n', ',\n', '\n]}')
      jsonStream.pipe(outputStream)
      this._getProducts(outputStream, jsonStream)
    }
  }

  _getProducts(outputStream: stream$Writable, pipeStream: stream$Writable) {
    const service = this._createService('productProjections')
    const request: Object = {
      uri: service.build(),
      method: 'GET',
    }
    if (this.config.accessToken)
      request.headers = {
        Authorization: `Bearer ${this.config.accessToken}`,
      }
    this.client
      .process(
        request,
        ({ body: { results: products } }) => {
          this.logger.verbose(`Fetched ${products.length} products`)

          const prices = PriceExporter._getPrices(products)
          return this._resolveReferences(prices).then(resolvedPrices => {
            this._writePrices(resolvedPrices, pipeStream)
          })
        },
        { accumulate: false }
      )
      .then(() => {
        pipeStream.end()
        this.logger.info('Export operation completed successfully')
      })
      .catch(e => {
        outputStream.emit('error', e)
      })
  }

  _writePrices(retrievedPrices: Array<any>, pipeStream: stream$Writable) {
    if (this.config.exportFormat === 'csv')
      retrievedPrices.forEach(pricesArray => {
        pricesArray.prices.forEach(price => {
          pipeStream.write(flatten(price))
        })
      })
    else
      retrievedPrices.forEach(skuPriceGroup => {
        pipeStream.write(skuPriceGroup)
      })

    this.logger.verbose(
      `Exported prices from ${retrievedPrices.length} product variants`
    )
  }

  _resolveReferences(flatPrices: Array<Object>) {
    return Promise.map(flatPrices, variantPrice =>
      Promise.map(variantPrice.prices, individualPrice =>
        Promise.all([
          this._resolveChannel(individualPrice),
          this._resolveCustomerGroup(individualPrice),
          this._resolveCustomType(individualPrice),
        ]).then(([channel, customerGroup, custom]): ProcessedPriceObject => ({
          ...individualPrice,
          ...channel,
          ...customerGroup,
          ...custom,
        }))
      ).then(prices => ({ ...variantPrice, prices }))
    )
  }

  _resolveChannel(price: Object): Object {
    if (!price.channel) return {}

    const channelService = this._createService('channels')
    const uri = channelService.byId(price.channel.id).build()
    return this.fetchReferences(uri).then(
      ({ body: { key } }: Object): Object => {
        const channel = {}
        if (this.config.exportFormat === 'csv') channel.key = key
        else channel.id = key
        return { channel }
      }
    )
  }

  _resolveCustomerGroup(price: Object): Object {
    if (!price.customerGroup) return {}

    const customerGroupService = this._createService('customerGroups')
    const uri = customerGroupService.byId(price.customerGroup.id).build()
    return this.fetchReferences(uri).then(
      ({ body: { name } }: Object): Object => {
        const customerGroup = {}
        if (this.config.exportFormat === 'csv') customerGroup.groupName = name
        else customerGroup.id = name
        return { customerGroup }
      }
    )
  }

  _resolveCustomType(price: Object): Object {
    if (!price.custom) return {}

    if (this.config.exportFormat === 'json') {
      const modPrice = Object.assign({}, price)
      delete modPrice.custom.type.typeId
      return { custom: modPrice.custom }
    }
    const customTypeService = this._createService('types')
    const uri = customTypeService.byId(price.custom.type.id).build()
    return this.fetchReferences(uri).then(
      ({ body: { key } }: Object): Object => ({
        customType: key,
        customField: price.custom.fields,
      })
    )
  }

  _createService(serviceType: string): Object {
    const service = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })[serviceType]

    if (serviceType === 'productProjections') {
      service.staged(this.config.staged)
      if (this.config.predicate) service.where(this.config.predicate)
    }

    return service
  }

  // Get prices from products
  static _getPrices(products: Array<Object>): Array<Object> {
    const allPrices = []
    products.forEach((product: Object) => {
      const masterPrices = []
      const masterVariant = product.masterVariant
      masterVariant.prices.forEach((price: UnprocessedPriceObject) => {
        masterPrices.push({ 'variant-sku': masterVariant.sku, ...price })
      })
      allPrices.push({
        'variant-sku': product.masterVariant.sku,
        prices: masterPrices,
      })
      product.variants.forEach((variant: Object) => {
        const variantPrices = []
        variant.prices.forEach((price: UnprocessedPriceObject) => {
          variantPrices.push({ 'variant-sku': variant.sku, ...price })
        })
        allPrices.push({
          'variant-sku': variant.sku,
          prices: variantPrices,
        })
      })
    })
    return allPrices
  }
}

PriceExporter.prototype.fetchReferences = memoize(function _fetchReferences(
  uri: string
): Promise<Object> {
  const request: Object = {
    uri,
    method: 'GET',
  }
  if (this.config.accessToken)
    request.headers = {
      Authorization: `Bearer ${this.config.accessToken}`,
    }
  return this.client.execute(request)
})
