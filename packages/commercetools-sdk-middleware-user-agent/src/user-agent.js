/* @flow */
import type {
  Middleware,
  ClientRequest,
  ClientResponse,
  UserAgentMiddlewareOptions,
} from 'types/sdk'
import createUserAgent from './create-user-agent'

export default function createUserAgentMiddleware (
  options: UserAgentMiddlewareOptions,
): Middleware {
  const userAgent = createUserAgent(options)

  return next => (request: ClientRequest, response: ClientResponse) => {
    const requestWithUserAgent = {
      ...request,
      headers: {
        ...request.headers,
        'User-Agent': userAgent,
      },
    }
    next(requestWithUserAgent, response)
  }
}
