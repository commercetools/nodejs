/* @flow */
import type { Middleware, MiddlewareRequest } from '../../../types/sdk'

export default function createLoggerMiddleware(): Middleware {
  // return next => (request: MiddlewareRequest, response: MiddlewareResponse) => {
  //   const { error, body, statusCode } = response
  //   console.log('Request: ', request)
  //   console.log('Response: ', { error, body, statusCode })
  //   next(request, response)
  // }
  return (/* dispatch */) => next => (request: MiddlewareRequest) => {
    console.log('Request: ', request)
    return next(request).then(
      response => {
        const { error, body, statusCode } = response
        console.log('Response: ', { error, body, statusCode })
        return response
      },
      response => {
        const { error, body, statusCode } = response
        console.log('Response: ', { error, body, statusCode })
        throw response
      }
    )
  }
}
