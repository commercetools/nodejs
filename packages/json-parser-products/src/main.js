/* @flow */
import type {
  ApiConfigOptions,
  ParserConfigOptions,
  ProductProjection,
  LoggerOptions,
} from 'types/product'

import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import {
  createAuthMiddlewareForClientCredentialsFlow,
} from '@commercetools/sdk-middleware-auth'
import {
  createUserAgentMiddleware,
} from '@commercetools/sdk-middleware-user-agent'
import Promise from 'bluebird'
import { memoize } from 'lodash'
import pkg from '../package.json'

export default class JSONParserProduct {
  // Set flowtype annotations
  accessToken: string;
  apiConfig: ApiConfigOptions;
  client: Client;
  parserConfig: ParserConfigOptions;
  logger: LoggerOptions;
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
      delimiter: ',',
      multiValueDelimiter: ';',
      continueOnProblems: false,
      categoryOrderHintBy: 'id',
    }

    this.parserConfig = { ...defaultConfig, ...parserConfig }
    this.logger = {
      error: () => {},
      warn: () => {},
      info: () => {},
      verbose: () => {},
      ...logger,
    }
    this.accessToken = accessToken
  }

  // I am using any because flow does not seem to know the difference between
  // a buffer and a stream! When it does, life would be easier
  parse (input: any) {
    this.logger.info('Starting conversion')

    let products = ''
    let incompleteProduct = ''
    input.setEncoding('utf8') // TODO: Move to CLI

    input.on('readable', () => {
      let productsArray = []
      products = input.read()
      // The input.read() will return null when all data has been read
      if (products) {
        // products = decoder.write(productsBuffer)
        // Split by the product marker set in the exporter
        const productsJsonArray = products.split('\n\n\n')
        // Concatenate the incomplete product of the last buffer to the first
        // product of the present buffer. This is an empty string initially
        if (incompleteProduct) {
          productsJsonArray[0] = `${incompleteProduct}${productsJsonArray[0]}`
          incompleteProduct = ''
        }

        // Check if the last product in this batch is complete. If it isn't,
        // remove it from the products array and save to the `incompleteProduct`
        // We check for the intermediate marker and the end marker
        if (!(products.endsWith('\n\n\n') || products.endsWith('\n\n')))
          incompleteProduct = productsJsonArray.pop()

        // Run this only if the array contains products
        if (productsJsonArray.length) {
          // TODO: Wrap in try/catch
          productsArray = productsJsonArray.map(product => JSON.parse(product))
          this._resolveReferences(productsArray)
        // .then(resolvedProducts => this._formatProducts(resolvedProduct))
        // .then(formattedProduct => this._writePtoducts(formattedProduct))
        }
      }
    })

    input.on('error', () => {
      // TODO: implement error handler
    })

    input.on('end', () => {
      // TODO: implement success handler
    })
  }

  _resolveReferences (productsArray) {
    // ReferenceTypes that need to be resolved:
    // PRODUCT LEVEL
    // **ProductType
    // **Categories [array]
    // **TaxCategory
    // **State
    // **CategoryOrderHints

    return Promise.map(productsArray, (product) => {
      const productToResolve = Object.assign({}, product)
      return Promise.all([
        this._resolveProductType(productToResolve),
        this._resolveTaxCategory(productToResolve),
        this._resolveState(productToResolve),
        this._resolveCategories(productToResolve),
        this._resolveCategoryOrderHints(productToResolve),
      ])
      .then(([productType, taxCategory, state, categories, categoryOrderHints]) => (
        { ...productToResolve, ...productType, ...taxCategory, ...state, ...categories, ...categoryOrderHints }
      ))
    })
  }

  _resolveProductType (product) {
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

  _resolveTaxCategory (product) {
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

  _resolveState (product) {
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

  _resolveCategories (product) {
    if (!product.categories || !product.categories.length)
      return {}

    const predicateArray = product.categories.map(category => category.id)
    const predicate = `id in ("${predicateArray.join('", "')}")`
    const categoriesService = this._createService('categories')
    const uri = categoriesService.where(predicate).build()
    return this.fetchReferences(uri)
      .then(({ body: { results } }) => {
        const categories = results.map(result => (
          result.key || result.externalId || result.name
        ))
        return { categories }
      })
  }

  _resolveCategoryOrderHints (product) {
    if (!product.categoryOrderHints || !Object.keys(product.categoryOrderHints).length)
      return {}

    const predicateArray = Object.keys(product.categoryOrderHints)
    const predicate = `id in ("${predicateArray.join('", "')}")`
    console.log(predicate)
    const categoriesService = this._createService('categories')
    const uri = categoriesService.where(predicate).build()
    return this.fetchReferences(uri)
      .then(({ body: { results } }) => {
        const categoryOrderHints = {}
        results.forEach((result) => {
          const categoryRef = result.key || result.externalId || result.name
          categoryOrderHints[categoryRef] = product.categoryOrderHints[result.id]
        })
        return { categoryOrderHints }
      })
  }

  _createService (serviceType) {
    const service = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })[serviceType]

    return service
  }

  _formatProducts () {
    // TODO: DO NOT FORGET TO PARSE BOOLEANS AND NUMBERS
    // TODO: IF FILL ALL ROWS, DUPLICATE ACROSS ALL CELLS
    // TODO: HANDLE ATTRIBUTES
  }
}

JSONParserProduct.prototype.fetchReferences = memoize(
  function _fetchReferences (uri) {
    const request = {
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
