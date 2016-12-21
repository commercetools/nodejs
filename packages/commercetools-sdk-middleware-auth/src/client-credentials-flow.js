/* @flow */
import type {
  AuthMiddlewareOptions,
  Middleware,
  ClientRequest,
  ClientResponse,
} from 'types/sdk'

/* global fetch */
import 'isomorphic-fetch'
import {
  buildRequestForClientCredentialsFlow,
} from './build-requests'

type TokensCache = {
  [key: string]: number;
}
type Task = {
  request: ClientRequest;
  response: ClientResponse;
}

export default function createAuthMiddlewareForClientCredentialsFlow (
  options: AuthMiddlewareOptions,
): Middleware {
  const cache: TokensCache = {
    // [token]: expirationTime
  }
  let pendingTasks: Array<Task> = []
  let isFetchingToken = false

  return next => (request: ClientRequest, response: ClientResponse) => {
    const currentAuthHeader = (
      (request.headers && request.headers['authorization']) ||
      (request.headers && request.headers['Authorization'])
    )

    if (currentAuthHeader) {
      const token = currentAuthHeader.replace('Bearer ', '')
      // Check that the token is cached and is not expired
      const tokenExpirationTime = cache[token]
      if (!tokenExpirationTime) {
        // Token is not in cache, meaning it's not been requested from
        // this middleware and was passed to the request manually.
        // In this case we assume the renewal of expired tokens will be
        // handled manually as well, outside of this middleare, since
        // we don't know the expiration time for that token.
        next(request, response)
        return
      }
      // Check if the cached token is still valid
      if (Date.now() < tokenExpirationTime) {
        // Token is valid, continue
        next(request, response)
        return
      }
      // Token is not present or is invalid. Request a new token...
    }

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
          Object.assign(cache, { [token]: expirationTime })

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

function mergeAuthHeader (token: string, req: ClientRequest): ClientRequest {
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
