/* @flow */
import type {
  ApiConfigOptions,
  Category,
  LoggerOptions,
  ParserConfigOptions,
  ProductProjection,
  ProductType,
  ResolvedProductProjection,
  State,
  TaxCategory,
  TypeReference,
} from 'types/product'
import type { Client, ClientRequest, SuccessResult } from 'types/sdk'

import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import highland from 'highland'
import fetch from 'node-fetch'
import Promise from 'bluebird'
import JSONStream from 'JSONStream'
import { memoize } from 'lodash'
import ProductMapping from './map-product-data'
import { writeToSingleCsvFile, writeToZipFile } from './writer'
import pkg from '../package.json'

export default class ProductJsonToCsv {
  // Set flowtype annotations
  accessToken: string

  apiConfig: ApiConfigOptions

  categoriesCache: Object

  client: Client

  parserConfig: ParserConfigOptions

  logger: LoggerOptions

  fetchReferences: Function

  _resolveReferences: Function

  _productMapping: Object

  constructor(
    apiConfig: ApiConfigOptions,
    parserConfig: ParserConfigOptions,
    logger: LoggerOptions,
    accessToken: string
  ) {
    this.apiConfig = apiConfig
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

    const defaultConfig = {
      categoryBy: 'name', // key, externalId or namedPath supported
      categoryOrderHintBy: 'name', // key, externalId or name supported
      delimiter: ',',
      fillAllRows: false,
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

    const mappingParams = {
      fillAllRows: this.parserConfig.fillAllRows,
      categoryBy: this.parserConfig.categoryBy,
      lang: this.parserConfig.language,
      multiValueDelimiter: this.parserConfig.multiValueDelimiter,
    }
    this._productMapping = new ProductMapping(mappingParams)
  }

  run(input: stream$Readable, output: stream$Writable) {
    const productStream = this.parse(input, output)
    const { headerFields } = this.parserConfig

    if (headerFields)
      writeToSingleCsvFile(
        productStream,
        output,
        this.logger,
        headerFields,
        this.parserConfig.delimiter
      )
    else
      writeToZipFile(
        productStream,
        output,
        this.logger,
        this.parserConfig.delimiter
      )
  }

  parse(input: stream$Readable, output: stream$Writable) {
    this.logger.info('Starting conversion')
    let productCount = 0

    return (
      highland(input)
        .through(JSONStream.parse('*'))
        .flatMap((product: ProductProjection) =>
          highland(this._resolveReferences(product))
        )
        .doto(() => {
          productCount += 1
          this.logger.debug(`Resolved references of ${productCount} products`)
        })
        // prepare the product objects for csv format
        .map((product: ResolvedProductProjection) =>
          this._productMapping.run(product)
        )
        .flatten()
        .doto(() => {
          this.logger.debug(`Done with conversion of ${productCount} products`)
        })
        .stopOnError((err: Error) => {
          this.logger.error(err)
          output.emit('error', err)
        })
    )
  }

  _resolveReferences(product: ProductProjection): ResolvedProductProjection {
    // ReferenceTypes that need to be resolved:
    // **ProductType
    // **Categories [array]
    // **TaxCategory
    // **State
    // **CategoryOrderHints

    return Promise.all([
      this._resolveProductType(product.productType),
      this._resolveTaxCategory(product.taxCategory),
      this._resolveState(product.state),
      this._resolveCategories(product.categories),
      this._resolveCategoryOrderHints(product.categoryOrderHints),
    ]).then(
      ([productType, taxCategory, state, categories, categoryOrderHints]: Array<
        Object
      >): ResolvedProductProjection => ({
        ...product,
        ...productType,
        ...taxCategory,
        ...state,
        ...categories,
        ...categoryOrderHints,
      })
    )
  }

  _resolveProductType(productTypeReference: TypeReference): Object {
    if (!productTypeReference) return {}

    const productTypeService = this._createService('productTypes')
    const uri = productTypeService.byId(productTypeReference.id).build()
    return this.fetchReferences(uri).then(
      ({
        body,
      }: SuccessResult): {
        productType: ProductType,
      } => ({ productType: body })
    )
  }

  _resolveTaxCategory(taxCategoryReference: TypeReference): Object {
    if (!taxCategoryReference) return {}

    const taxCategoryService = this._createService('taxCategories')
    const uri = taxCategoryService.byId(taxCategoryReference.id).build()
    return this.fetchReferences(uri).then(
      ({
        body,
      }: SuccessResult): {
        taxCategory: TaxCategory,
      } => ({ taxCategory: body })
    )
  }

  _resolveState(stateReference: TypeReference): Object {
    if (!stateReference) return {}

    const stateService = this._createService('states')
    const uri = stateService.byId(stateReference.id).build()
    return this.fetchReferences(uri).then(
      ({
        body,
      }: SuccessResult): {
        state: State,
      } => ({ state: body })
    )
  }

  _resolveCategories(
    categoriesReference: Array<TypeReference>
  ): Array<Category> | {} {
    if (!categoriesReference || !categoriesReference.length) return {}

    const categoryIds = categoriesReference.map(
      (category: TypeReference): string => category.id
    )
    return this._getCategories(categoryIds).then(
      (categories: Array<Category>): { categories: Array<Category> } => {
        if (this.parserConfig.categoryBy !== 'namedPath') return { categories }
        return Promise.map(
          categories,
          (cat: Category): Array<Category> => this._resolveAncestors(cat)
        ).then(
          (categoriesWithParents: Array<Category>): Object => ({
            categories: categoriesWithParents,
          })
        )
      }
    )
  }

  _resolveCategoryOrderHints(categoryOrderHintsReference: Object): Object {
    if (
      !categoryOrderHintsReference ||
      !Object.keys(categoryOrderHintsReference).length
    )
      return { categoryOrderHints: undefined }

    const catIdentifier = this.parserConfig.categoryOrderHintBy
    const lang = this.parserConfig.language
    const categoryIds = Object.keys(categoryOrderHintsReference)
    return this._getCategories(categoryIds).then(
      (resolvedCategories: Array<Category>): Object => {
        const categoryOrderHints = {}
        resolvedCategories.forEach((category: Category) => {
          const catRef =
            catIdentifier === 'name'
              ? category[catIdentifier][lang]
              : category[catIdentifier]
          categoryOrderHints[catRef] = categoryOrderHintsReference[category.id]
        })
        return { categoryOrderHints }
      }
    )
  }

  _resolveAncestors(category: Category): Promise<Category> {
    const getParent = (cat: Category): Promise<Category> => {
      if (!cat.parent) return Promise.resolve(cat)

      return this._getCategories([cat.parent.id])
        .then(
          (resolvedCategory: Object): Promise<Category> =>
            getParent(resolvedCategory[0])
        )
        .then((parent: Object): Promise<Category> => ({ ...cat, parent }))
    }
    return getParent(category)
  }

  // This method decides if to get the categories from cache or API
  _getCategories(ids: Array<string>): Promise<Array<Object>> {
    const notCachedIds = []
    const cachedCategories = []
    ids.forEach((id: string) => {
      if (this.categoriesCache[id])
        cachedCategories.push(this.categoriesCache[id])
      else notCachedIds.push(id)
    })
    if (!notCachedIds.length) return Promise.resolve(cachedCategories)

    const predicate = `id in ("${notCachedIds.join('", "')}")`
    const categoriesService = this._createService('categories')
    const uri = categoriesService.where(predicate).build()
    return this.fetchReferences(uri).then(
      ({ body: { results } }: SuccessResult): Array<Category> => {
        results.forEach((result: Category) => {
          cachedCategories.push(result)
          this.categoriesCache[result.id] = result
        })
        return cachedCategories
      }
    )
  }

  _createService(serviceType: string): Object {
    const service = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })[serviceType]

    return service
  }
}

ProductJsonToCsv.prototype.fetchReferences = memoize(function _fetchReferences(
  uri: string
): Promise<SuccessResult> {
  const request: ClientRequest = {
    uri,
    method: 'GET',
  }
  if (this.accessToken)
    request.headers = {
      Authorization: `Bearer ${this.accessToken}`,
    }
  return this.client.execute(request)
})
