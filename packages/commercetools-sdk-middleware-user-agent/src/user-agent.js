/* @flow */
import type {
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
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

  return next => (request: MiddlewareRequest, response: MiddlewareResponse) => {
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
