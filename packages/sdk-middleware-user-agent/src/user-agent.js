/* @flow */
import createHttpUserAgent from '@commercetools/http-user-agent'
import type {
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
  UserAgentMiddlewareOptions,
  Next,
} from 'types/sdk'

export default function createUserAgentMiddleware(
  options: UserAgentMiddlewareOptions
): Middleware {
  const userAgent = createHttpUserAgent({
    name: 'commercetools-js-sdk',
    ...options,
  })

  return (next: Next): Next => (
    request: MiddlewareRequest,
    response: MiddlewareResponse
  ) => {
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
