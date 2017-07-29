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
import { flattenDeep } from 'lodash'
import pkg from '../package.json'

export default class PriceExporter {
  constructor (options, logger) {
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
      exportFormat: 'json',
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
    // TODO: Remove
    this.count = 0

    this._resolveCustomerGroup = this._resolveCustomerGroup.bind(this)
    this._resolveCustomType = this._resolveCustomType.bind(this)
  }

  run (outputStream) {
    const service = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    }).productProjections

    const req = {
      // TODO: Replace `staged` with variable
      uri: `${service.build()}?staged=true`,
      method: 'GET',
    }

    const jsonStream = JSONStream.stringify()
    jsonStream.pipe(outputStream)

    this.client.process(req, (data) => {
      if (data.statusCode !== 200)
        return Promise.reject()
      // console.error(data.body.results[1].masterVariant.prices)
      const products = data.body.results
      Promise.map(products, product => this._returnPrices(product))
      // TODO: Remove output stream parameter
      .then(pricesArray => this._handlePrices(pricesArray, jsonStream))

      // .then((pricesArray) => {
      //   pricesArray.forEach((priceArray) => {
      //     priceArray.forEach(price => jsonStream.write(price))
      //   })
      // })

      return Promise.resolve()
    }, { accumulate: false })
    .then(() => {
      // jsonStream.end()
      console.log(this._cache)
    })
  }

  _handlePrices (productPricesArray, output) {
    const flatPrices = this._flattenPricesArray(productPricesArray)
    // TODO: Remove output stream parameter
    this._resolveReferences(flatPrices, output)
    // .then((resolvedPrices) => {
    //   resolvedPrices.forEach(price => output.write(price))
    return Promise.resolve()
    // })
  }

  _resolveReferences (flatPrices, output) {
    Promise.map(flatPrices, (variantPrice) => {
      const newVariantPrice = Object.assign({}, variantPrice)
      newVariantPrice.prices = []
      return Promise.map(variantPrice.prices, (individualPrice) => {
        return this._resolveChannel(individualPrice)
        .then(this._resolveCustomerGroup)
        .then(this._resolveCustomType)
      })
      .then((prices) => {
        newVariantPrice.prices = prices
        output.write(newVariantPrice)
      })
    })
    // .then((resolvedPrices) => {
      // resolvedPrices.forEach(resolvedPrice => output.write(resolvedPrice))
    // })
  }

  _resolveCustomType (price) {
    if (!price.custom)
      return Promise.resolve(price)

    const resolvedPrice = Object.assign({}, price)
    delete resolvedPrice.custom

    resolvedPrice.customField = price.custom.fields

    // Get from cache if it's already been cached
    if (this._cache[price.custom.type.id]) {
      resolvedPrice.customType = this._cache[price.custom.type.id]
      return Promise.resolve(resolvedPrice)
    }

    // If not in cache, resolve from API
    const service = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    }).types
    const req = {
      uri: service.byId(price.custom.type.id).build(),
      method: 'GET',
    }

    return this.client.execute(req)
    .then((custType) => {
      // Save resolve to cache
      this._cache[price.custom.type.id] = custType.body.key
      resolvedPrice.customType = custType.body.key
      return Promise.resolve(resolvedPrice)
    })
  }

  _resolveCustomerGroup (price) {
    if (!price.customerGroup)
      return Promise.resolve(price)

    const resolvedPrice = Object.assign({}, price)
    resolvedPrice.customerGroup = {}

    // Get from cache if it's already been cached
    if (this._cache[price.customerGroup.id]) {
      resolvedPrice.customerGroup.groupName = this._cache[price.customerGroup.id]
      return Promise.resolve(resolvedPrice)
    }

    // If not in cache, resolve from API
    const service = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    }).customerGroups
    const req = {
      uri: service.byId(price.customerGroup.id).build(),
      method: 'GET',
    }

    return this.client.execute(req)
    .then((custGroup) => {
      // Save resolve to cache
      this._cache[price.customerGroup.id] = custGroup.body.name
      resolvedPrice.customerGroup.groupName = custGroup.body.name
      return Promise.resolve(resolvedPrice)
    })
  }

  _resolveChannel (price) {
    if (!price.channel)
      return Promise.resolve(price)

    const resolvedPrice = Object.assign({}, price)
    resolvedPrice.channel = {}

    // Get from cache if it's already been cached
    if (this._cache[price.channel.id]) {
      resolvedPrice.channel.key = this._cache[price.channel.id]
      return Promise.resolve(resolvedPrice)
    }

    // If not in cache, resolve from API
    const service = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    }).channels
    const req = {
      uri: service.byId(price.channel.id).build(),
      method: 'GET',
    }

    return this.client.execute(req)
    .then((channel) => {
      // Save resolve to cache
      this._cache[price.channel.id] = channel.body.key
      resolvedPrice.channel.key = channel.body.key
      return Promise.resolve(resolvedPrice)
    })
  }

  _flattenPricesArray (productPricesArray) {
    return flattenDeep(productPricesArray)
  }

  _returnPrices (product) {
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

    return Promise.resolve(variantPrices)
  }
}
