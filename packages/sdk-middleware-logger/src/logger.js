/* @flow */
import type {
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
  Next,
} from 'types/sdk'

type CallbackFn = (
  request: MiddlewareRequest,
  response: MiddlewareResponse
) => void

const defaultCb = (
  request: MiddlewareRequest,
  response: MiddlewareResponse
) => {
  const { error, body, statusCode } = response
  console.log('Request: ', request)
  console.log('Response: ', { error, body, statusCode })
}

export default function createLoggerMiddleware(
  cb: CallbackFn = defaultCb
): Middleware {
  return (next: Next): Next => (
    request: MiddlewareRequest,
    response: MiddlewareResponse
  ) => {
    // Pass function to customize logging.
    cb(request, response)
    next(request, response)
  }
}
