/* @flow */
import fs from 'fs'
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
      categoryBy: 'name', // key, externalId or namedPath supported
      categoryOrderHintBy: 'name', // key, externalId or name supported
      delimiter: ',',
      fillAllRows: false,
      headers: true,
      language: 'en',
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
  parse (input: stream$Readable, output: stream$Writable) {
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
      .map(JSONParserProduct._removeEmptyObjects)
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
      (product: ProductProjection): Array<ResolvedProductProjection> => (
        Promise.all([
          this._resolveProductType(product.productType),
          this._resolveTaxCategory(product.taxCategory),
          this._resolveState(product.state),
          this._resolveCategories(product.categories),
          this._resolveCategoryOrderHints(product.categoryOrderHints),
        ])
        .then(([
          productType,
          taxCategory,
          state,
          categories,
          categoryOrderHints,
        ]: Array<Object>): ResolvedProductProjection => (
          {
            ...product,
            ...productType,
            ...taxCategory,
            ...state,
            ...categories,
            ...categoryOrderHints,
          }
        ))
      ))
  }

  _resolveProductType (productTypeReference: TypeReference): Object {
    if (!productTypeReference)
      return {}

    const productTypeService = this._createService('productTypes')
    const uri = productTypeService.byId(productTypeReference.id).build()
    return this.fetchReferences(uri)
      .then(({ body }) => (
        { productType: body }
      ))
  }

  _resolveTaxCategory (taxCategoryReference: TypeReference): Object {
    if (!taxCategoryReference)
      return {}

    const taxCategoryService = this._createService('taxCategories')
    const uri = taxCategoryService.byId(taxCategoryReference.id).build()
    return this.fetchReferences(uri)
      .then(({ body }) => (
        { taxCategory: body }
      ))
  }

  _resolveState (stateReference: TypeReference): Object {
    if (!stateReference)
      return {}

    const stateService = this._createService('states')
    const uri = stateService.byId(stateReference.id).build()
    return this.fetchReferences(uri)
      .then(({ body: { key } }) => (
        { state: key }
      ))
  }

  _resolveCategories (categoriesReference: Array<TypeReference>): Object {
    if (!categoriesReference || !categoriesReference.length)
      return {}

    const catIdentifier = this.parserConfig.categoryBy
    const lang = this.parserConfig.language
    const multiValueDelimiter = this.parserConfig.multiValueDelimiter
    const categoryIds = categoriesReference.map(
      (category: TypeReference): string => category.id)
    return this._getCategories(categoryIds)
      .then(resolvedCategories => (
        Promise.map(resolvedCategories, (category) => {
          if (this.parserConfig.categoryBy === 'namedPath')
            return this._retrieveNamedPath(category)

          return catIdentifier === 'name'
            ? category[catIdentifier][lang]
            : category[catIdentifier]
        })
        .then((categoriesArray) => {
          const categories = categoriesArray.join(multiValueDelimiter) // Todo separate methods
          return { categories }
        })
      ))
  }

  _resolveCategoryOrderHints (categoryOrderHintsReference): Object {
    if (
      !categoryOrderHintsReference
      || !Object.keys(categoryOrderHintsReference).length
    )
      return {}

    const catIdentifier = this.parserConfig.categoryOrderHintBy
    const lang = this.parserConfig.language
    const categoryIds = Object.keys(categoryOrderHintsReference)
    return this._getCategories(categoryIds)
      .then((resolvedCategories) => {
        const categoryOrderHints = resolvedCategories.map((category) => {
          const catRef = catIdentifier === 'name'
            ? category[catIdentifier][lang]
            : category[catIdentifier]
          return `${catRef}:${categoryOrderHintsReference[category.id]}`
        }).join(this.parserConfig.multiValueDelimiter)
        return { categoryOrderHints }
      })
  }

  _retrieveNamedPath (category) {
    return new Promise((resolve, reject) => {
      const lang = this.parserConfig.language
      const categoryTree = []

      // define recursive function
      const getParent = (cat) => {
        categoryTree.unshift(cat.name[lang])
        if (!cat.parent)
          return resolve(categoryTree.join('>'))

        console.log('test')
        return this._getCategories([cat.parent.id])
          .then(resolvedCategory => (
            getParent(resolvedCategory[0])
          ))
      }
      getParent(category)
    })
  }

  // This method decides if to get the categories from cache or API
  _getCategories (ids: Array<string>): Promise<Array<Object>> {
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

  // This method removes empty objects from flattened price objects
  // This is necessary so the empty prices son't show up as [object Object]
  static _removeEmptyObjects (product) {
    const modifiedProduct = Object.assign({}, product)
    const keys = Object.keys(product)
    keys.forEach((key) => {
      if (
        product[key] !== null
        && typeof product[key] === 'object'
        && !Object.keys(product[key]).length
      )
        modifiedProduct[key] = ''
    })
    return modifiedProduct
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
