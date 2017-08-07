/* @flow */
import type {
  ApiConfigOptions,
  Configuration,
  ExporterOptions,
  LoggerOptions,
  ProcessedPriceObject,
  UnprocessedPriceObject,
} from 'types/price'
import type {
  Client,
  ClientRequest,
} from 'types/sdk'

import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import {
  createAuthMiddlewareForClientCredentialsFlow,
} from '@commercetools/sdk-middleware-auth'
import {
  createUserAgentMiddleware,
} from '@commercetools/sdk-middleware-user-agent'
import csv from 'fast-csv'
import JSONStream from 'JSONStream'
import Promise from 'bluebird'
import { flatten } from 'flat'
import { flattenDeep } from 'lodash'
import pkg from '../package.json'

export default class PriceExporter {
  // Set flowtype annotations
  apiConfig: ApiConfigOptions;
  client: Client;
  config: Configuration;
  logger: LoggerOptions;
  _cache: Object;
  _resolveEachReferenceType: Function;

  constructor (
    options: ExporterOptions,
    logger: LoggerOptions,
  ) {
    if (!options.apiConfig)
      throw new Error('The constructor must be passed an `apiConfig` object')
    if (!options.csvHeaders && options.exportFormat === 'csv')
      throw new Error(
        'The constructor must be passed a `csvHeaders` array for CSV export',
      )
    this.apiConfig = options.apiConfig
    this.client = createClient({
      middlewares: [
        createAuthMiddlewareForClientCredentialsFlow(this.apiConfig),
        createUserAgentMiddleware({
          libraryName: pkg.name,
          libraryVersion: pkg.version,
        }),
        createHttpMiddleware({ host: this.apiConfig.apiUrl }),
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
    this._cache = {}

    this._resolveEachReferenceType = this._resolveEachReferenceType.bind(this)
  }

  run (outputStream: stream$Writable) {
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

  _getProducts (
    outputStream: stream$Writable,
    pipeStream: stream$Writable,
  ) {
    const request = this._buildRequest('productProjections')
    this.client.process(request, ({ body: { results: products } }) => {
      this.logger.verbose(`Fetched ${products.length} products`)
      return Promise.map(products, product => PriceExporter._getPrices(product))
      .then(pricesArray => this._flattenPrices(pricesArray))
      .then((allPricesBatches) => {
        this._writePrices(allPricesBatches, pipeStream)
      })
    }, { accumulate: false })
    .then(() => {
      if (outputStream !== process.stdout)
        pipeStream.end()
      this.logger.info('Export operation completed successfully')
    })
    .catch((e) => {
      outputStream.emit('error', e)
    })
  }

  _flattenPrices (productPricesArray: Array<UnprocessedPriceObject>) {
    const flatPrices = flattenDeep(productPricesArray)
    this.logger.verbose('Processing prices from products')
    if (this.config.exportFormat === 'csv')
      return Promise.resolve(this._resolveReferences(flatPrices))
    return Promise.resolve(flatPrices)
  }

  _writePrices (
    retrievedPrices: Array<any>,
    pipeStream: stream$Writable,
  ) {
    if (this.config.exportFormat === 'csv') {
      const flatCSVPrices = flattenDeep(retrievedPrices)
      flatCSVPrices.forEach((price) => {
        pipeStream.write(price)
      })
      this.logger.verbose(`Exported ${flatCSVPrices.length} prices`)
    } else
        retrievedPrices.forEach((skuPriceGroup) => {
          pipeStream.write(skuPriceGroup)
        })
  }

  _resolveReferences (flatPrices: Array<UnprocessedPriceObject>) {
    return Promise.map(flatPrices, variantPrice => (
      Promise.map(variantPrice.prices, individualPrice => (
        this._resolveEachReferenceType('channel', individualPrice)
        .then(price => this._resolveEachReferenceType('customerGroup', price))
        .then(price => this._resolveEachReferenceType('custom', price))
      ))
      .then((prices: Array<ProcessedPriceObject>) => (
        prices.length
          ? prices.map(flatten)
          : prices
      ))
    ), { concurrency: 10 }) // Add currency to maximize cache usage
  }

  _resolveEachReferenceType (
    type: string,
    price: Object,
  ): Promise<Object> {
    // type: customerGroup, channel, custom
    // Return the object if the type does not exist
    if (!price[type])
      return Promise.resolve(price)

    const resolvedPrice: Object = Object.assign({}, price)
    if (type === 'custom') {
      delete resolvedPrice[type]
      resolvedPrice.customField = price[type].fields

      // Get from cache if it's already been cached
      if (this._cache[price[type].type.id]) {
        resolvedPrice.customType = this._cache[price.custom.type.id]
        return Promise.resolve(resolvedPrice)
      }

      // If not in cache, resolve from API
      const request = this._buildRequest(type, price)
      return this.client.execute(request)
      .then((response: Object): Promise<Object> => {
        // Save resolved id to cache
        this._cache[price[type].type.id] = response.body.key
        resolvedPrice.customType = response.body.key
        return Promise.resolve(resolvedPrice)
      })
    }
    resolvedPrice[type] = {}

    // Get from cache if it's already been cached
    if (this._cache[price[type].id]) {
      if (type === 'customerGroup')
        resolvedPrice[type].groupName = this._cache[price[type].id]
      else
        resolvedPrice[type].key = this._cache[price[type].id]
      return Promise.resolve(resolvedPrice)
    }

    // If not in cache, resolve from API
    const request = this._buildRequest(type, price)
    return this.client.execute(request)
    .then((response: Object): Promise<Object> => {
      // Save resolve to cache
      if (type === 'customerGroup') {
        resolvedPrice[type].groupName = response.body.name
        this._cache[price[type].id] = response.body.name
      } else {
        this._cache[price[type].id] = response.body.key
        resolvedPrice[type].key = response.body.key
      }
      return Promise.resolve(resolvedPrice)
    })
  }

  _buildRequest (
    type: string,
    price?: Object,
  ): ClientRequest {
    const priceObject = { ...price }
    let serviceType
    let uri
    switch (type) {
      case 'custom':
        serviceType = 'types'
        break
      case 'customerGroup':
        serviceType = 'customerGroups'
        break
      case 'channel':
        serviceType = 'channels'
        break
      default:
        serviceType = type
    }
    const service = this._createService(serviceType)
    switch (type) {
      case 'productProjections':
        uri = `${service.build()}`
        break
      case 'custom':
        uri = service.byId(priceObject[type].type.id).build()
        break
      default:
        uri = service.byId(priceObject[type].id).build()
    }
    const request: Object = {
      uri,
      method: 'GET',
    }
    if (this.config.accessToken)
      request.headers = {
        Authorization: `Bearer ${this.config.accessToken}`,
      }
    return request
  }

  _createService (serviceType: string): Object {
    const service = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })[serviceType]

    if (serviceType === 'productProjections') {
      service.staged(this.config.staged)
      if (this.config.predicate)
        service.where(this.config.predicate)
    }

    return service
  }

  // Get prices from products
  static _getPrices (product: Object) {
    const masterVariantPricesArray = product.masterVariant.prices
    // Get the price array for the master variant
    const modifiedMVP = masterVariantPricesArray.map(price => (
      { 'variant-sku': product.masterVariant.sku, ...price }
    ))
    // Loop through the variants array
    const variantPrices = product.variants.map((variant) => {
      // Get the price array from each variant in the variant array
      const singleVariantPrice = variant.prices.map(price => (
        { 'variant-sku': variant.sku, ...price }
      ))
      return {
        'variant-sku': variant.sku,
        prices: singleVariantPrice,
      }
    })
    const masterVariantPrices = {
      'variant-sku': product.masterVariant.sku,
      prices: modifiedMVP,
    }
    variantPrices.push(masterVariantPrices)

    return variantPrices
  }
}
