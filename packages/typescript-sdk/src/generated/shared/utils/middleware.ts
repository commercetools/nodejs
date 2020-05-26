/**
 *
 *    Generated file, please do not change!!!
 *    From http://www.vrap.io/ with love
 *
 *                ,d88b.d88b,
 *                88888888888
 *                `Y8888888Y'
 *                  `Y888Y'
 *                    `Y'
 *
 */

import {
  ClientRequest,
  ClientResponse,
  executeRequest,
} from 'shared/utils/common-types'

export type Middleware = (
  request: ClientRequest,
  executor: executeRequest
) => Promise<ClientResponse>

export const createExecutorFromMiddlewares = (
  executor: executeRequest,
  midds?: Middleware[]
) => {
  if (!midds || midds.length == 0) {
    return executor
  }
  const reduced: Middleware = midds.reduce(reduceMiddleware)
  return middlewareToExecutor(reduced, executor)
}

function reduceMiddleware(
  middleware1: Middleware,
  middleware2: Middleware
): Middleware {
  return (request: ClientRequest, executor: executeRequest) =>
    middleware1(request, middlewareToExecutor(middleware2, executor))
}

function middlewareToExecutor(
  middleware: Middleware,
  executor: executeRequest
): executeRequest {
  return (request: ClientRequest) => middleware(request, executor)
}
