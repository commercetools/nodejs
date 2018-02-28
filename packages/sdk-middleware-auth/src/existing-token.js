/* @flow */
import type {
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
  ExistingTokenMiddlewareOptions,
  Next,
} from '../../../types/sdk'

export default function createAuthMiddlewareForExistingToken(
  options: ExistingTokenMiddlewareOptions | string
): Middleware {
  return (next: Next) => (
    request: MiddlewareRequest,
    response: MiddlewareResponse
  ) => {
    const config = options
      ? {
          tokenType:
            typeof options === 'object' && options !== null && options.tokenType
              ? options.tokenType
              : 'Bearer',
          token: typeof options === 'string' ? options : options.token,
          force: options.force !== undefined ? options.force : true,
        }
      : null

    /** The request will not be modified if:
     *  1. no argument is passed
     *  2. an object is passed that doesn't contain a `token`
     *  3. force is false and authorization header exists
     */
    if (
      config === null || !config.token ||
      (((request.headers && request.headers.authorization) ||
        (request.headers && request.headers.Authorization)) &&
        config.force === false)
    ) {
      return next(request, response)
    }
    const requestWithAuth = {
      ...request,
      headers: {
        ...request.headers,
        Authorization: `${config.tokenType} ${config.token}`,
      },
    }
    return next(requestWithAuth, response)
  }
}
