/* @flow */
import type {
  PasswordAuthMiddlewareOptions,
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
  Next,
  Task,
} from 'types/sdk'

import { buildRequestForPasswordFlow } from './build-requests'
import authMiddlewareBase from './base-auth-flow'
import store from './utils'

export default function createAuthMiddlewareForPasswordFlow (
  options: PasswordAuthMiddlewareOptions,
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
      ...buildRequestForPasswordFlow(options),
      pendingTasks,
      requestState,
      tokenCache,
    }
    authMiddlewareBase(params, next)
  }
}
