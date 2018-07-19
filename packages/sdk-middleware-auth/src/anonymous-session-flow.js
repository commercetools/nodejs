/* @flow */
import type {
  AuthMiddlewareOptions,
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
  Next,
  Task,
} from 'types/sdk'

import { buildRequestForAnonymousSessionFlow } from './build-requests'
import authMiddlewareBase from './base-auth-flow'
import store from './utils'

export default function createAuthMiddlewareForAnonymousSessionFlow(
  options: AuthMiddlewareOptions
): Middleware {
  const tokenCache = store({})
  const pendingTasks: Array<Task> = []

  const requestState = store(false)
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
      ...buildRequestForAnonymousSessionFlow(options),
      pendingTasks,
      requestState,
      tokenCache,
      fetch: options.fetch,
    }
    authMiddlewareBase(params, next, options)
  }
}
