/* @flow */
import type {
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
} from '../../../types/sdk'

export default function createCorrelationIdMiddleware(): Middleware {
  return next => (request: MiddlewareRequest, response: MiddlewareResponse) => {
    const { error, body, statusCode } = response
    next(request, response)
  }
}
