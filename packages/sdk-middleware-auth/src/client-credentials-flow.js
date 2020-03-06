/* @flow */
import type {
  AuthMiddlewareOptions,
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
  Next,
  Task,
} from 'types/sdk'

import { buildRequestForClientCredentialsFlow } from './build-requests'
import authMiddlewareBase from './base-auth-flow'
import store from './utils'

export default function createAuthMiddlewareForClientCredentialsFlow(
  options: AuthMiddlewareOptions
): Middleware {
  const tokenCache =
    options.tokenCache ||
    store({
      token: '',
      expirationTime: -1,
    })
  const requestState = store(false)
  const pendingTasks: Array<Task> = []

  return (next: Next): Next => (
    request: MiddlewareRequest,
    response: MiddlewareResponse
  ) => {
    // Check if there is already a `Authorization` header in the request.
    // If so, then go directly to the next middleware.
    if (
      (request.headers && request.headers.authorization) ||
      (request.headers && request.headers.Authorization)
    ) {
      next(request, response)
      return
    }
    const params = {
      request,
      response,
      ...buildRequestForClientCredentialsFlow(options),
      pendingTasks,
      requestState,
      tokenCache,
      fetch: options.fetch,
      clientId: options.credentials.clientId,
    }
    authMiddlewareBase(params, next)
  }
}
