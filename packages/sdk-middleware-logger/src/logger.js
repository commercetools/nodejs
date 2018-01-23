/* @flow */
import type {
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
} from '../../../types/sdk'

export default function createLoggerMiddleware(): Middleware {
  return next => (request: MiddlewareRequest, response: MiddlewareResponse) => {
    const { error, body, statusCode } = response
    console.log('Request: ', request)
    console.log('Response: ', { error, body, statusCode })
    next(request, response)
  }
}
