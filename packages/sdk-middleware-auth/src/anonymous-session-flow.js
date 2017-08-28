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

export default function createAuthMiddlewareForAnonymousSessionFlow (
  options: AuthMiddlewareOptions,
): Middleware {
  const tokenCache = store({})
  const pendingTasks: Array<Task> = []

  const requestState = store(false)
  return (next: Next) => (
    request: MiddlewareRequest,
    response: MiddlewareResponse,
  ) => {
    const params = {
      request,
      response,
      ...buildRequestForAnonymousSessionFlow(options),
      pendingTasks,
      requestState,
      tokenCache,
    }
    authMiddlewareBase(params, next, options)
  }
}
