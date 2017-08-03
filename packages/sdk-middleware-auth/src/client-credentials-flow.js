/* @flow */
import type {
  AuthMiddlewareOptions,
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
} from 'types/sdk'

/* global fetch */
import 'isomorphic-fetch'
import { buildRequestForClientCredentialsFlow } from './build-requests'

type TokenCache = {
  token: string;
  expirationTime: number;
}
type Task = {
  request: MiddlewareRequest;
  response: MiddlewareResponse;
}

export default function createAuthMiddlewareForClientCredentialsFlow (
  options: AuthMiddlewareOptions,
): Middleware {
  let cache: TokenCache
  let pendingTasks: Array<Task> = []
  let isFetchingToken = false

  return next => (request: MiddlewareRequest, response: MiddlewareResponse) => {
    // Check if there is already a `Authorization` header in the request.
    // If so, then go directly to the next middleware.
    if (
      (request.headers && request.headers['authorization']) ||
      (request.headers && request.headers['Authorization'])
    ) {
      next(request, response)
      return
    }

    // If there was a token in the cache, and it's not expired, append
    // the token in the `Authorization` header.
    if (cache && cache.token && Date.now() < cache.expirationTime) {
      const requestWithAuth = mergeAuthHeader(cache.token, request)
      next(requestWithAuth, response)
      return
    }
    // Token is not present or is invalid. Request a new token...

    // Keep pending tasks until a token is fetched
    pendingTasks.push({ request, response })

    // If a token is currently being fetched, just wait ;)
    if (isFetchingToken) return

    // Mark that a token is being fetched
    isFetchingToken = true

    const {
      basicAuth,
      url,
      body,
    } = buildRequestForClientCredentialsFlow(options)

    fetch(
      url,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Length': Buffer.byteLength(body).toString(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      },
    )
      .then((res: Response): Promise<*> => {
        if (res.ok)
          return res.json()
            .then((result: Object) => {
              const token = result.access_token
              const expiresIn = result.expires_in
              const expirationTime = calculateExpirationTime(expiresIn)
              // Cache new token
              cache = { token, expirationTime }

              // Dispatch all pending requests
              isFetchingToken = false
              // Freeze and copy pending queue, reset original one for accepting
              // new pending tasks
              const executionQueue = pendingTasks.slice()
              pendingTasks = []
              executionQueue.forEach((task) => {
                // Assign the new token in the request header
                const requestWithAuth = mergeAuthHeader(token, task.request)
                next(requestWithAuth, task.response)
              })
            })

        // Handle error response
        return res.text()
          .then((text: any) => {
            let parsed
            try {
              parsed = JSON.parse(text)
            } catch (error) {
              /* noop */
            }
            const error: Object = new Error(parsed ? parsed.message : text)
            if (parsed) error.body = parsed
            response.reject(error)
          })
      })
      .catch((error) => {
        response.reject(error)
      })
  }
}

function mergeAuthHeader (
  token: string,
  req: MiddlewareRequest,
): MiddlewareRequest {
  return {
    ...req,
    headers: {
      ...req.headers,
      Authorization: `Bearer ${token}`,
    },
  }
}

function calculateExpirationTime (expiresIn: number): number {
  return (
    Date.now() +
    (expiresIn * 1000)
  ) - (
    // Add a gap of 2 hours before expiration time.
    2 * 60 * 60 * 1000
  )
}
