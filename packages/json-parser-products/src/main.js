/* @flow */
import type {
  ApiConfigOptions,
  LoggerOptions,
  ParserConfigOptions,
  ProductProjection,
  ResolvedProductProjection,
  TypeReference,
} from 'types/product'
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
import highland from 'highland'
import Promise from 'bluebird'
import { flatten } from 'flat'
import { memoize } from 'lodash'
import pkg from '../package.json'

export default class JSONParserProduct {
  // Set flowtype annotations
  accessToken: string;
  apiConfig: ApiConfigOptions;
  categoriesCache: Object;
  client: Client;
  parserConfig: ParserConfigOptions;
  logger: LoggerOptions;
  fetchReferences: Function;
  _resolveReferences: Function;

  constructor (
    apiConfig: ApiConfigOptions,
    parserConfig: ParserConfigOptions,
    logger: LoggerOptions,
    accessToken: string,
  ) {
    this.apiConfig = apiConfig
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

    const defaultConfig = {
      batchSize: 5,
      categoryOrderHintBy: 'id',
      delimiter: ',',
      fillAllRows: false,
      headers: true,
      multiValueDelimiter: ';',
    }

    this.parserConfig = { ...defaultConfig, ...parserConfig }
    this.logger = {
      error: () => {},
      warn: () => {},
      info: () => {},
      debug: () => {},
      ...logger,
    }
    this.categoriesCache = {}
    this.accessToken = accessToken
  }

  // `any` is used because flow does not seem to know the difference between
  // a buffer and a stream! When it does, life would be easier
  parse (input: any, output) {
    this.logger.info('Starting conversion')
    let productCount = 0
    input.setEncoding('utf8') // TODO: Move to CLI

    const csvStream = csv.createWriteStream({
      headers: this.parserConfig.headers,
    })

    highland(input)
      // parse chunk and split into JSON object strings
      .splitBy('\n')
      // convert the JSON object strings to JS objects
      .map(JSON.parse)
      // handle a fixed amount of products concurrently
      .batch(this.parserConfig.batchSize)
      .flatMap(products => highland(this._resolveReferences(products)))
      .doto((data) => {
        productCount += data.length
        this.logger.debug(`Resolved references of ${productCount} products`)
      })
      // prepare the product objects for csv format
      .map(products => this._formatProducts(products))
      .flatten()
      // remove price information from each product
      .map(JSONParserProduct._removePrices)
      .map(flatten)
      .stopOnError((err) => {
        this.logger.error(err)
        output.emit('error', err)
      })
      .doto(() => {
        this.logger.info(`Done with conversion of ${productCount} products`)
      })
      .pipe(csvStream)
      .pipe(output)
  }

  _resolveReferences (
    productsArray: Array<ProductProjection>,
    ): Array<ResolvedProductProjection> {
    // ReferenceTypes that need to be resolved:
    // PRODUCT LEVEL
    // **ProductType
    // **Categories [array]
    // **TaxCategory
    // **State
    // **CategoryOrderHints

    return Promise.map(productsArray,
      (product: ProductProjection): Array<ResolvedProductProjection> => {
        const productToResolve = Object.assign({}, product)
        return Promise.all([
          this._resolveProductType(productToResolve),
          this._resolveTaxCategory(productToResolve),
          this._resolveState(productToResolve),
          this._resolveCategories(productToResolve),
          this._resolveCategoryOrderHints(productToResolve),
        ])
        .then(([
          productType,
          taxCategory,
          state,
          categories,
          categoryOrderHints,
        ]: Array<Object>): ResolvedProductProjection => (
          {
            ...productToResolve,
            ...productType,
            ...taxCategory,
            ...state,
            ...categories,
            ...categoryOrderHints,
          }
        ))
      })
  }

  _resolveProductType (product: ProductProjection): Object {
    if (!product.productType)
      return {}

    const productTypeService = this._createService('productTypes')
    const uri = productTypeService.byId(product.productType.id).build()
    return this.fetchReferences(uri)
      .then(({ body: { name } }) => {
        const resolvedProductType = { productType: name }
        return resolvedProductType
      })
  }

  _resolveTaxCategory (product: ProductProjection): Object {
    if (!product.taxCategory)
      return {}

    const taxCategoryService = this._createService('taxCategories')
    const uri = taxCategoryService.byId(product.taxCategory.id).build()
    return this.fetchReferences(uri)
      .then(({ body: { name, key } }) => {
        const resolvedTaxCategory = { taxCategory: key || name }
        return resolvedTaxCategory
      })
  }

  _resolveState (product: ProductProjection): Object {
    if (!product.state)
      return {}

    const stateService = this._createService('states')
    const uri = stateService.byId(product.state.id).build()
    return this.fetchReferences(uri)
      .then(({ body: { key } }) => {
        const resolvedState = { state: key }
        return resolvedState
      })
  }

  _resolveCategories (product: ProductProjection): Object {
    if (!product.categories || !product.categories.length)
      return {}

    const categoryIds = product.categories.map(
      (category: TypeReference): string => category.id)
    return this._manageCategories(categoryIds)
      .then((resolvedCategories) => {
        const categories = resolvedCategories.map(category => (
          category.key || category.externalId
        )).join(this.parserConfig.multiValueDelimiter)
        return { categories }
      })
  }

  _resolveCategoryOrderHints (product: ProductProjection): Object {
    if (!product.categoryOrderHints
      || !Object.keys(product.categoryOrderHints).length)
      return {}

    const categoryIds = Object.keys(product.categoryOrderHints)
    return this._manageCategories(categoryIds)
      .then((resolvedCategories) => {
        const categoryOrderHints = resolvedCategories.map((category) => {
          const catRef = category.key || category.externalId
          return `${catRef}:${product.categoryOrderHints[category.id]}`
        }).join(this.parserConfig.multiValueDelimiter)
        return { categoryOrderHints }
      })
  }

  // This method decides if to resolve the categories from cache or API
  _manageCategories (ids: Array<string>): Promise<Array<Object>> {
    const notCachedIds = []
    const cachedCategories = []
    ids.forEach((id: string) => {
      if (this.categoriesCache[id])
        cachedCategories.push(this.categoriesCache[id])
      else
        notCachedIds.push(id)
    })
    if (!notCachedIds.length)
      return Promise.resolve(cachedCategories)

    const predicate = `id in ("${notCachedIds.join('", "')}")`
    const categoriesService = this._createService('categories')
    const uri = categoriesService.where(predicate).build()
    return this.fetchReferences(uri)
      .then(({ body: { results } }) => {
        results.forEach((result) => {
          cachedCategories.push(result)
          this.categoriesCache[result.id] = result
        })
        return cachedCategories
      })
  }

  _createService (serviceType: string): Object {
    const service = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })[serviceType]

    return service
  }

  // Modify the structure of the product object to be ready for output
  _formatProducts (products) {
    const { multiValueDelimiter, fillAllRows } = this.parserConfig
    return products.map(product => (
      JSONParserProduct._mergeVariants(product)
    )).map(product => (
      JSONParserProduct._stringFromImages(product, multiValueDelimiter)
    )).map(product => (
      JSONParserProduct._variantToProduct(product, fillAllRows)
    ))

    // TODO: HANDLE ATTRIBUTES
  }

  // This method merges the masterVariants and other variant into a single array
  static _mergeVariants (product) {
    const merged = Object.assign({}, product)
    merged.variant = [product.masterVariant, ...product.variants]
    delete merged.masterVariant
    delete merged.variants
    return merged
  }

  // This method returns a stringified version of variant images
  static _stringFromImages (product, multiValueDelimiter) {
    const variantArray = product.variant.map((eachVariant) => {
      let images
      if (eachVariant.images)
        images = eachVariant.images.reduce((acc, image) => {
          const { url, dimensions, label = '' } = image
          const imageString = `${url}|${dimensions.w}|${dimensions.h}|${label}`
          if (!acc) return imageString
          return `${acc}${multiValueDelimiter}${imageString}`
        }, '')
      return { ...eachVariant, images }
    })
    return { ...product, variant: variantArray }
  }

  // This method returns one product object per variant in an array
  // This is necessary to bring all variants to the object root level
  // This also duplicates the object properties across all objects if
  // necessary in order to fill all rows
  static _variantToProduct (product, fillAllRows) {
    if (fillAllRows)
      return product.variant.map(eachVariant => (
        { ...product, variant: eachVariant }
      ))

    const productWithVariants = product.variant.map(eachVariant => (
      { variant: eachVariant }
    ))
    productWithVariants[0] = { ...product, ...productWithVariants[0] }
    return productWithVariants
  }

  // This method removes price data from product variants
  static _removePrices (product) {
    if (!product.variant || !product.variant.prices) return product
    const newProduct = Object.assign({}, product)
    delete newProduct.variant.prices
    return newProduct
  }
}

JSONParserProduct.prototype.fetchReferences = memoize(
  function _fetchReferences (uri: string): Promise<Object> {
    const request: ClientRequest = {
      uri,
      method: 'GET',
    }
    if (this.accessToken)
      request.headers = {
        Authorization: `Bearer ${this.accessToken}`,
      }
    return this.client.execute(request)
  },
)
