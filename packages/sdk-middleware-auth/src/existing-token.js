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

    if (
      config === null ||
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
