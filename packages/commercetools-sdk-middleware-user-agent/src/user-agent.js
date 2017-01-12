/* @flow */
import type {
  Middleware,
  ClientRequest,
  ClientResponse,
  UserAgentMiddlewareOptions,
} from 'types/sdk'
import createHttpUserAgent from '@commercetools/http-user-agent'

export default function createUserAgentMiddleware (
  options: UserAgentMiddlewareOptions,
): Middleware {
  const userAgent = createHttpUserAgent({
    name: 'commercetools-js-sdk',
    ...options,
  })

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
