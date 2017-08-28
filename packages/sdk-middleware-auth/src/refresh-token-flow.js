/* @flow */
import type {
  RefreshAuthMiddlewareOptions,
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
  Next,
  Task,
} from 'types/sdk'

import { buildRequestForRefreshTokenFlow } from './build-requests'
import authMiddlewareBase from './base-auth-flow'
import store from './utils'

export default function createAuthMiddlewareForRefreshTokenFlow (
  options: RefreshAuthMiddlewareOptions,
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
      ...buildRequestForRefreshTokenFlow(options),
      pendingTasks,
      requestState,
      tokenCache,
    }
    authMiddlewareBase(params, next)
  }
}
