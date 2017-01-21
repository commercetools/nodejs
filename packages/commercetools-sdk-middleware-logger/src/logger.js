/* @flow */
import type {
  Middleware,
  ClientRequest,
  ClientResponse,
} from 'types/sdk'

export default function createLoggerMiddleware (): Middleware {
  return next => (request: ClientRequest, response: ClientResponse) => {
    const { error, body, statusCode } = response
    console.log('Request: ', request)
    console.log('Response: ', { error, body, statusCode })
    next(request, response)
  }
}
