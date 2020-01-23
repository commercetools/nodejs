/* @flow */
import type {
  ServiceBuilderDefaultParams,
  ServiceBuilderParams,
} from 'types/sdk'
import * as features from './features'

/**
 * Return the default parameters for building a query string.
 *
 * @return {Object}
 */
export function getDefaultQueryParams(): ServiceBuilderDefaultParams {
  return {
    id: null,
    expand: [],
    pagination: {
      page: null,
      perPage: null,
      sort: [],
      withTotal: null,
    },
    location: {
      currency: '',
      country: '',
      state: '',
    },
    query: {
      operator: 'and',
      where: [],
    },
    searchKeywords: [],
  }
}

/**
 * Return the default parameters for building a query search string.
 *
 * @return {Object}
 */
export function getDefaultSearchParams(): ServiceBuilderDefaultParams {
  return {
    expand: [],
    searchKeywords: [],
    pagination: {
      page: null,
      perPage: null,
      sort: [],
      withTotal: null,
    },
    search: {
      facet: [],
      filter: [],
      filterByQuery: [],
      filterByFacets: [],
      fuzzy: false,
      fuzzyLevel: 0,
      markMatchingVariants: false,
      text: null,
    },
  }
}

/**
 * Set the default parameters given the current service object.
 *
 * @return {void}
 */
export function setDefaultParams() {
  this.params.expand = getDefaultQueryParams().expand

  this.params.key = null

  if (this.features.includes(features.queryOne))
    this.params.id = getDefaultQueryParams().id

  if (this.features.includes(features.query)) {
    this.params.pagination = getDefaultQueryParams().pagination
    this.params.query = getDefaultQueryParams().query
  }

  if (this.features.includes(features.search)) {
    this.params.pagination = getDefaultSearchParams().pagination
    this.params.search = getDefaultSearchParams().search
  }

  if (this.features.includes(features.queryLocation))
    this.params.location = getDefaultQueryParams().location

  if (this.features.includes(features.suggest)) this.params.searchKeywords = []
}

const hasKey = (obj: {}, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(obj, key)

/**
 * Set the supplied parameters given the current service object.
 *
 * @return {void}
 */
export function setParams(params: ServiceBuilderParams) {
  // verify params
  const knownKeys = [
    'expand',
    'id',
    'key',
    'customerId',
    'cartId',
    'sort',
    'page',
    'perPage',
    'staged',
    'priceCurrency',
    'priceCountry',
    'priceCustomerGroup',
    'priceChannel',
    'text',
    'fuzzy',
    'fuzzyLevel',
    'markMatchingVariants',
    'facet',
    'filter',
    'filterByQuery',
    'filterByFacets',
    'searchKeywords',
    'where',
    'whereOperator',
    'version',
    'country',
    'currency',
    'state',
    'dataErasure',
    'withTotal',
    'applyOrderEditTo',
    'container',
  ]
  Object.keys(params).forEach((key: string) => {
    if (!knownKeys.includes(key)) throw new Error(`Unknown key "${key}"`)
  })

  // query-expand
  if (params.expand)
    params.expand.forEach((expansion: string) => {
      this.expand(expansion)
    })

  // query-id
  if (hasKey(params, 'id')) this.byId(params.id)
  if (hasKey(params, 'key') && !hasKey(params, 'container'))
    this.byKey(params.key)
  if (hasKey(params, 'customerId')) this.byCustomerId(params.customerId)
  if (hasKey(params, 'cartId')) this.byCartId(params.cartId)

  // query-location
  if (hasKey(params, 'country')) this.byCountry(params.country)
  if (hasKey(params, 'currency')) this.byCurrency(params.currency)
  if (hasKey(params, 'state')) this.byState(params.state)

  // query-page
  if (params.sort)
    params.sort.forEach(
      (sortDesc: { by: string, direction: 'asc' | 'desc' }) => {
        this.sort(sortDesc.by, sortDesc.direction === 'asc')
      }
    )
  if (hasKey(params, 'page')) this.page(params.page)
  if (hasKey(params, 'perPage')) this.perPage(params.perPage)

  // query-projection
  if (hasKey(params, 'staged')) this.staged(params.staged)
  if (hasKey(params, 'priceCurrency')) this.priceCurrency(params.priceCurrency)
  if (hasKey(params, 'priceCountry')) this.priceCountry(params.priceCountry)
  if (hasKey(params, 'priceCustomerGroup'))
    this.priceCustomerGroup(params.priceCustomerGroup)
  if (hasKey(params, 'priceChannel')) this.priceChannel(params.priceChannel)

  // query-search
  if (params.text) this.text(params.text.value, params.text.language)
  if (params.fuzzy) this.fuzzy() // boolean switch
  if (hasKey(params, 'fuzzyLevel')) this.fuzzyLevel(params.fuzzyLevel)
  if (params.markMatchingVariants) this.markMatchingVariants() // boolean switch
  if (params.facet)
    params.facet.forEach((facet: string) => {
      this.facet(facet)
    })
  if (params.filter)
    params.filter.forEach((filter: string) => {
      this.filter(filter)
    })
  if (params.filterByQuery)
    params.filterByQuery.forEach((query: string) => {
      this.filterByQuery(query)
    })
  if (params.filterByFacets)
    params.filterByFacets.forEach((facet: string) => {
      this.filterByFacets(facet)
    })

  // query-suggest
  if (params.searchKeywords)
    params.searchKeywords.forEach(
      (searchKeyword: { value: string, language: string }) => {
        this.searchKeywords(searchKeyword.value, searchKeyword.language)
      }
    )

  // query
  if (params.where)
    params.where.forEach((predicate: string) => {
      this.where(predicate)
    })
  if (hasKey(params, 'whereOperator')) this.whereOperator(params.whereOperator)

  // version
  if (hasKey(params, 'version')) this.withVersion(params.version)

  // dataErasure
  if (hasKey(params, 'dataErasure')) this.withFullDataErasure()

  // withTotal
  if (hasKey(params, 'withTotal')) this.withTotal(params.withTotal)

  // withTotal
  if (hasKey(params, 'applyOrderEditTo'))
    this.applyOrderEditTo(params.applyOrderEditTo)

  // container and key
  if (hasKey(params, 'container') && hasKey(params, 'key'))
    this.byContainerAndKey(params.container, params.key)
}
