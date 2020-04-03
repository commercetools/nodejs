/* @flow */
import type {
  ServiceBuilder,
  ServiceBuilderDefinition,
  ServiceBuilderParams,
} from 'types/sdk'

import {
  getDefaultQueryParams,
  getDefaultSearchParams,
  setDefaultParams,
  setParams,
} from './default-params'
import classify from './classify'
import buildQueryString from './build-query-string'
import withVersion from './version'
import withFullDataErasure from './data-erasure'
import applyOrderEditTo from './order-edit-apply'
import * as defaultFeatures from './features'
import * as query from './query'
import * as queryId from './query-id'
import * as queryLocation from './query-location'
import * as queryExpand from './query-expand'
import * as queryPage from './query-page'
import * as queryProjection from './query-projection'
import * as querySuggest from './query-suggest'
import * as querySearch from './query-search'

type UseKey = {
  withProjectKey: boolean,
  applyOrderEdit: boolean,
}

const requiredDefinitionProps = ['type', 'endpoint', 'features']

function getIdOrKey(params: Object): string {
  if (params.id) return `/${params.id}`
  if (params.orderNumber) return `/order-number=${params.orderNumber}`
  if (params.key && !params.container) return `/key=${params.key}`
  if (params.key && params.container)
    return `/${params.container}/${params.key}`
  return ''
}

export default function createService(
  definition: ServiceBuilderDefinition,
  options: string = ''
): ServiceBuilder {
  if (!definition)
    throw new Error('Cannot create a service without its definition.')

  requiredDefinitionProps.forEach((key: string) => {
    if (!definition[key])
      throw new Error(`Definition is missing required parameter ${key}.`)
  })

  if (!Array.isArray(definition.features) || !definition.features.length)
    throw new Error('Definition requires `features` to be a non empty array.')

  if (!options)
    throw new Error('No project defined. Please enter a project key')

  const { type, endpoint, features } = definition

  return classify({
    type,
    features,
    params: getDefaultQueryParams(),
    withVersion,
    withFullDataErasure,
    applyOrderEditTo,

    ...features.reduce((acc: Object, feature: string): Object => {
      if (feature === defaultFeatures.query)
        return {
          ...acc,
          ...query,
          ...queryPage,
        }

      if (feature === defaultFeatures.queryOne)
        return {
          ...acc,
          ...queryId,
        }

      if (feature === defaultFeatures.queryLocation)
        return {
          ...acc,
          ...queryLocation,
        }

      if (feature === defaultFeatures.queryExpand)
        return {
          ...acc,
          ...queryExpand,
        }

      if (feature === defaultFeatures.search)
        return {
          ...acc,
          ...querySearch,
          ...queryPage,
          params: getDefaultSearchParams(),
        }

      if (feature === defaultFeatures.suggest)
        return {
          ...acc,
          ...querySearch,
          ...queryPage,
          ...querySuggest,
        }

      if (feature === defaultFeatures.projection)
        return {
          ...acc,
          ...queryProjection,
        }

      return acc
    }, {}),

    // Call this method to get the built request URI
    // Pass some options to further configure the URI:
    // - `withProjectKey: false`: will omit the projectKey from the URI
    build(
      uriOptions: UseKey = { withProjectKey: true, applyOrderEdit: false }
    ): string {
      const { withProjectKey, applyOrderEdit } = uriOptions

      const queryParams = buildQueryString(this.params)

      const uri =
        (withProjectKey ? `/${options}` : '') +
        endpoint +
        // TODO this can lead to invalid URIs as getIdOrKey can return
        //   "/?customerId", so there can be multiple question marks,
        // same for when `queryParams` and `version` are present
        getIdOrKey(this.params) +
        (queryParams && !applyOrderEdit ? `?${queryParams}` : queryParams)

      setDefaultParams.call(this)
      return uri
    },

    // Call this method to parse an object as params
    parse(params: ServiceBuilderParams): Object {
      setParams.call(this, params)
      return this
    },
  })
}
