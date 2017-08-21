/* @flow */
import type {
  MiddlewareRequest,
  Next,
  Task,
  AuthMiddlewareBaseOptions,
} from 'types/sdk'

/* global fetch */
import 'isomorphic-fetch'


export default function authMiddlewareBase ({
    request,
    response,
    url,
    basicAuth,
    body,
    pendingTasks,
    requestState,
    tokenCache,
  }: AuthMiddlewareBaseOptions,
  next: Next,
) {
  // Check if there is already a `Authorization` header in the request.
  // If so, then go directly to the next middleware.
  if (
    (request.headers && request.headers['authorization']) ||
    (request.headers && request.headers['Authorization'])
  ) {
    next(request, response)
    return
  }

  // If there was a token in the tokenCache, and it's not expired, append
  // the token in the `Authorization` header.
  const tokenObj = tokenCache.get()
  if (tokenObj && tokenObj.token && Date.now() < tokenObj.expirationTime) {
    const requestWithAuth = mergeAuthHeader(tokenObj.token, request)
    next(requestWithAuth, response)
    return
  }
  // Token is not present or is invalid. Request a new token...

  // Keep pending tasks until a token is fetched
  pendingTasks.push({ request, response })

  // If a token is currently being fetched, just wait ;)
  if (requestState.get()) return

  // Mark that a token is being fetched
  requestState.set(true)

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
          tokenCache.set({ token, expirationTime })

          // Dispatch all pending requests
          requestState.set(false)

          // Freeze and copy pending queue, reset original one for accepting
          // new pending tasks
          const executionQueue = pendingTasks.slice()
          // eslint-disable-next-line no-param-reassign
          pendingTasks = []
          executionQueue.forEach((task: Task) => {
            // Assign the new token in the request header
            const requestWithAuth = mergeAuthHeader(token, task.request)
            // console.log('test', cache, pendingTasks)
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
  .catch((error: Error) => {
    response.reject(error)
  })
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
