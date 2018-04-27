/* @flow */
import type {
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
  ExistingTokenMiddlewareOptions,
  Next,
} from 'types/sdk'

export default function createAuthMiddlewareWithExistingToken(
  authorization: string = '',
  options: ExistingTokenMiddlewareOptions = {}
): Middleware {
  return (next: Next) => (
    request: MiddlewareRequest,
    response: MiddlewareResponse
  ) => {
    if (typeof authorization !== 'string')
      throw new Error('authorization must be a string')
    const force = options.force === undefined ? true : options.force

    /** The request will not be modified if:
     *  1. no argument is passed
     *  2. force is false and authorization header exists
     */
    if (
      !authorization ||
      (((request.headers && request.headers.authorization) ||
        (request.headers && request.headers.Authorization)) &&
        force === false)
    ) {
      return next(request, response)
    }
    const requestWithAuth = {
      ...request,
      headers: {
        ...request.headers,
        Authorization: authorization,
      },
    }
    return next(requestWithAuth, response)
  }
}
