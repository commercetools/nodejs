/* @flow */
import type {
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
  Next,
} from 'types/sdk'

export default function createLoggerMiddleware(): Middleware {
  return (next: Next): Next => (
    request: MiddlewareRequest,
    response: MiddlewareResponse
  ) => {
    const { error, body, statusCode } = response
    /* eslint-disable */
    console.log('Request: ', request)
    console.log('Response: ', { error, body, statusCode })
    /* eslint-disable */
    next(request, response)
  }
}
