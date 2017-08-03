/* @flow */
import type {
  ServiceBuilder,
  ServiceBuilderDefinition,
} from 'types/sdk'
import {
  getDefaultQueryParams,
  getDefaultSearchParams,
  setDefaultParams,
} from './default-params'
import classify from './classify'
import buildQueryString from './build-query-string'
import withVersion from './version'
import * as defaultFeatures from './features'
import * as query from './query'
import * as queryId from './query-id'
import * as queryExpand from './query-expand'
import * as queryPage from './query-page'
import * as queryProjection from './query-projection'
import * as querySuggest from './query-suggest'
import * as querySearch from './query-search'

type UseKey = {
  withProjectKey: boolean;
}

const requiredDefinitionProps = [
  'type',
  'endpoint',
  'features',
]

export default function createService (
  definition: ServiceBuilderDefinition,
  options: string = '',
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

    ...(
      features.reduce((acc, feature) => {
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
      }, {})
    ),

    // Call this method to get the built request URI
    // Pass some options to further configure the URI:
    // - `withProjectKey: false`: will omit the projectKey from the URI
    build (uriOptions: UseKey = { withProjectKey: true }): string {
      const { withProjectKey } = uriOptions

      const queryParams = buildQueryString(this.params)
      const version = this.params.version

      const uri =
        (withProjectKey ? `/${options}` : '') +
        endpoint +
        getIdOrKey(this.params) +
        (queryParams ? `?${queryParams}` : '') +
        (version ? `?version=${version}` : '')

      setDefaultParams.call(this)
      return uri
    },
  })
}

function getIdOrKey (params: Object): string {
  if (params.id)
    return `/${params.id}`
  else if (params.key)
    return `/key=${params.key}`
  else if (params.customerId)
    return `/?customerId=${params.customerId}`
  return ''
}
