/* @flow */
import type {
  ServiceBuilderDefaultParams,
} from 'types/sdk'
import * as features from './features'

/**
 * Return the default parameters for building a query string.
 *
 * @return {Object}
 */
export function getDefaultQueryParams (): ServiceBuilderDefaultParams {
  return {
    id: null,
    expand: [],
    pagination: {
      page: null,
      perPage: null,
      sort: [],
    },
    query: {
      operator: 'and',
      where: [],
    },
  }
}

/**
 * Return the default parameters for building a query search string.
 *
 * @return {Object}
 */
export function getDefaultSearchParams (): ServiceBuilderDefaultParams {
  return {
    expand: [],
    staged: true,
    pagination: {
      page: null,
      perPage: null,
      sort: [],
    },
    search: {
      facet: [],
      filter: [],
      filterByQuery: [],
      filterByFacets: [],
      fuzzy: false,
      text: null,
    },
  }
}

/**
 * Set the default parameters given the current service object.
 *
 * @return {void}
 */
export function setDefaultParams () {
  this.params.expand = getDefaultQueryParams().expand

  if (this.features.indexOf(features.queryOne) >= 0)
    this.params.id = getDefaultQueryParams().id

  if (this.features.indexOf(features.query) >= 0) {
    this.params.pagination = getDefaultQueryParams().pagination
    this.params.query = getDefaultQueryParams().query
  }

  if (this.features.indexOf(features.search) >= 0) {
    this.params.staged = getDefaultSearchParams().staged
    this.params.pagination = getDefaultSearchParams().pagination
    this.params.search = getDefaultSearchParams().search
  }

  if (this.features.indexOf(features.projection) >= 0)
    this.params.staged = true
}
