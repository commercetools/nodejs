/* @flow */
import type {
  ApiRequestBuilder,
  ApiRequestBuilderServiceOptions,
} from 'types/sdk'
import services from './default-services'
import createService from './create-service'

// pass in the project key as the first parameter
// project key should be in an object:
// { projectKey: 'my-project-key' }
export default function createRequestBuilder (
  options: ApiRequestBuilderServiceOptions = {},
  customServices: Object = {},
): ApiRequestBuilder {
  const allServices = { ...services, ...customServices }

  return Object.keys(allServices).reduce((acc, key) => ({
    ...acc,
    [key]: createService(allServices[key], options),
  }), {})
}
