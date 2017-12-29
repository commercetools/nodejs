/* @flow */
import services from './default-services'
import createService from './create-service'
import type { ApiRequestBuilder } from '../../../types/sdk'

// pass an options argument of type object containing
// the `projectkey` (string) and `customServices` (object)
// The projectKey property is required
// A sample options object would be:
//
//     options: {
//       projectKey: 'myProject',
//       customServices: {
//         foo: {
//           type: 'foo',
//           endpoint: '/foo',
//           features: [
//             features.query,
//           ],
//         }
//       }
//     }
export default function createRequestBuilder(
  options: Object = {}
): ApiRequestBuilder {
  const allServices = { ...services, ...options.customServices }

  return Object.keys(allServices).reduce(
    (acc, key) => ({
      ...acc,
      [key]: createService(allServices[key], options.projectKey),
    }),
    {}
  )
}
