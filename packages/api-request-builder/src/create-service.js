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
import * as defaultFeatures from './features'
import * as query from './query'
import * as queryId from './query-id'
import * as queryExpand from './query-expand'
import * as queryPage from './query-page'
import * as queryProjection from './query-projection'
import * as querySearch from './query-search'

type BuildOptions = {
  projectKey?: string;
}

const requiredDefinitionProps = [
  'type',
  'endpoint',
  'features',
]

export default function createService (
  definition: ServiceBuilderDefinition,
): ServiceBuilder {
  if (!definition)
    throw new Error('Cannot create a service without its definition.')

  requiredDefinitionProps.forEach((key: string) => {
    if (!definition[key])
      throw new Error(`Definition is missing required parameter ${key}.`)
  })

  if (!Array.isArray(definition.features) || !definition.features.length)
    throw new Error('Definition requires `features` to be a non empty array.')

  const { type, endpoint, features } = definition

  return classify({
    type,
    features,
    params: getDefaultQueryParams(),

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
    // - `projectKey`: will prefix the URI with the given projectKey
    build (options: BuildOptions = {}): string {
      const { projectKey } = options

      const queryParams = buildQueryString(this.params)

      const uri =
        (projectKey ? `/${projectKey}` : '') +
        endpoint +
        getIdOrKey(this.params) +
        (queryParams ? `?${queryParams}` : '')

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
  return ''
}
