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
import * as utils from './utils'
import pkg from '../package.json'

export default class PriceExporter {
  // Set flowtype annotations
  apiConfig: ApiConfigOptions;
  client: Client;
  config: Configuration;
  logger: LoggerOptions;
  _cache: Object;
  _resolveReferences: Function;

  constructor (
    options: ExporterOptions,
    logger: LoggerOptions,
  ) {
    if (!options.apiConfig)
      throw new Error('The constructor must be passed an `apiConfig` object')
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
      multiValueDelimiter: ';',
      exportFormat: 'csv',
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

    this._resolveReferences = this._resolveReferences.bind(this)
  }

  run (outputStream: stream$Writable) {
    this.logger.verbose('Starting Export')
    const request = this._buildRequest('productProjections')
    this.client.process(request, (data) => {
      const products = data.body.results
      let processedBatch = []
      return Promise.map(products, product => utils._getPrices(product))
      .then((pricesArray) => {
        processedBatch = this._handlePrices(pricesArray)
        return Promise.resolve(processedBatch)
      })
    }, { accumulate: true })
    .then((allPricesBatches) => {
      this._handleOutput(allPricesBatches, outputStream)
    })
    .catch((e) => {
      outputStream.emit('error', e)
    })
  }

  _handlePrices (productPricesArray: Array<UnprocessedPriceObject>) {
    const flatPrices = utils._flattenPricesArray(productPricesArray)
    if (this.config.exportFormat === 'json')
      return Promise.resolve(flatPrices)
    return Promise.resolve(this._preparePrices(flatPrices))
  }

  _handleOutput (
    retrievedPrices: Array<ProcessedPriceObject>,
    outputStream: stream$Writable,
  ) {
    if (this.config.exportFormat === 'json') {
      // This makes the exported data compatible with the importer
      const jsonPrices = { prices: retrievedPrices }

      const jsonStream = JSONStream.stringify(false)
      jsonStream.pipe(outputStream)

      jsonStream.write(jsonPrices)
      if (outputStream !== process.stdout)
        jsonStream.end()
      this.logger.info('Export operation completed successfully')
    } else {
      const flatCSVPrices = flattenDeep(retrievedPrices)
      const headers = utils._getHeaders(flatCSVPrices)
      const csvOptions = {
        headers,
        delimiter: this.config.delimiter,
      }

      const csvStream = csv.createWriteStream(csvOptions)
      csvStream.pipe(outputStream)

      flatCSVPrices.forEach((price) => {
        csvStream.write(price)
      })
      csvStream.end()
      this.logger.info('Export operation completed successfully')
    }
  }

  _preparePrices (flatPrices: Array<UnprocessedPriceObject>) {
    return Promise.map(flatPrices, variantPrice => (
      Promise.map(variantPrice.prices, individualPrice => (
        this._resolveReferences('channel', individualPrice)
        .then(price => this._resolveReferences('customerGroup', price))
        .then(price => this._resolveReferences('custom', price))
      ))
      .then((prices: Array<ProcessedPriceObject>) => {
        if (prices.length)
          return prices.map(price => flatten(price))
        return prices
      })
    ), { concurrency: 10 }) // Add currency to maximize cache usage
  }

  _resolveReferences (
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
}
