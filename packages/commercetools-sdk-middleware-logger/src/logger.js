/* @flow */
import type {
  Middleware,
  ClientRequest,
  ClientResponse,
} from 'types/sdk'

// TODO: allow to pass some configuration options:
// - name for the logger
// - predicate
// - filter
// - custom logger
// - format / colors
export default function createLoggerMiddleware (): Middleware {
  return next => (request: ClientRequest, response: ClientResponse) => {
    const { error, body, statusCode } = response
    console.log('Request: ', request)
    console.log('Response: ', { error, body, statusCode })
    next(request, response)
  }
}
