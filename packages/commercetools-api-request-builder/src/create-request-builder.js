/* @flow */
import type {
  ApiRequestBuilder,
} from 'types/sdk'
import services from './services'
import createService from './create-service'

export default function createRequestBuilder (
  customServices: Object = {},
): ApiRequestBuilder {
  const allServices = { ...services, ...customServices }

  return Object.keys(allServices).reduce((acc, key) => ({
    ...acc,
    [key]: createService(allServices[key]),
  }), {})
}
