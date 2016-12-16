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

const requiredDefinitionProps = [
  'type',
  'endpoint',
  'features',
]

export default function createService (definition) {
  if (!definition)
    throw new Error('Cannot create a service without its definition.')

  requiredDefinitionProps.forEach((key) => {
    if (!definition[key])
      throw new Error(`Definition is missing required parameter ${key}.`)
  })

  if (!Array.isArray(definition.features) || !definition.features.length)
    throw new Error('Definition requires `features` to be a non empty array.')

  const { type, endpoint, features } = definition

  return classify({
    type,
    features,
    baseEndpoint: endpoint,
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
    build () {
      const endpointWithId = this.params.id
        ? `${this.baseEndpoint}/${this.params.id}`
        : this.baseEndpoint
      const queryParams = buildQueryString(this.params)
      const uri = endpointWithId + (queryParams ? `?${queryParams}` : '')

      setDefaultParams.call(this)
      return uri
    },
  })
}
