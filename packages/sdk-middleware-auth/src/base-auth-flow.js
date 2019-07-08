/* @flow */

import type {
  MiddlewareRequest,
  Next,
  Task,
  AuthMiddlewareBaseOptions,
  PasswordAuthMiddlewareOptions,
  AuthMiddlewareOptions,
  executeRequestOptions,
} from 'types/sdk'
import { buildRequestForRefreshTokenFlow } from './build-requests'

function mergeAuthHeader(
  token: string,
  req: MiddlewareRequest
): MiddlewareRequest {
  return {
    ...req,
    headers: {
      ...req.headers,
      Authorization: `Bearer ${token}`,
    },
  }
}

function calculateExpirationTime(expiresIn: number): number {
  return (
    Date.now() +
    expiresIn * 1000 -
    // Add a gap of 2 hours before expiration time.
    2 * 60 * 60 * 1000
  )
}

function executeRequest({
  fetcher,
  url,
  basicAuth,
  body,
  tokenCache,
  requestState,
  pendingTasks,
  response,
}: executeRequestOptions) {
  fetcher(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Length': Buffer.byteLength(body).toString(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
    .then((res: Response): Promise<*> => {
      if (res.ok)
        return res
          .json()
          .then(
            ({
              access_token: token,
              expires_in: expiresIn,
              refresh_token: refreshToken,
            }: Object) => {
              const expirationTime = calculateExpirationTime(expiresIn)

              // Cache new token
              tokenCache.set({ token, expirationTime, refreshToken })

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
                // Continue by calling the task's own next function
                task.next(requestWithAuth, task.response)
              })
            }
          )

      // Handle error response
      return res.text().then((text: any) => {
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
      if (response && typeof response.reject === 'function')
        response.reject(error)
    })
}

export default function authMiddlewareBase(
  {
    request,
    response,
    url,
    basicAuth,
    body,
    pendingTasks,
    requestState,
    tokenCache,
    fetch: fetcher,
  }: AuthMiddlewareBaseOptions,
  next: Next,
  userOptions?: AuthMiddlewareOptions | PasswordAuthMiddlewareOptions
) {
  if (!fetcher && typeof fetch === 'undefined')
    throw new Error(
      '`fetch` is not available. Please pass in `fetch` as an option or have it globally available.'
    )
  if (!fetcher)
    // eslint-disable-next-line
    fetcher = fetch
  // Check if there is already a `Authorization` header in the request.
  // If so, then go directly to the next middleware.
  if (
    (request.headers && request.headers.authorization) ||
    (request.headers && request.headers.Authorization)
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
  // Keep pending tasks until a token is fetched
  // Save next function as well, to call it once the token has been fetched, which prevents
  // unexpected behaviour in a context in which the next function uses global vars
  // or Promises to capture the token to hand it to other libraries, e.g. Apollo
  pendingTasks.push({ request, response, next })

  // If a token is currently being fetched, just wait ;)
  if (requestState.get()) return

  // Mark that a token is being fetched
  requestState.set(true)

  // If there was a refreshToken in the tokenCache, and there was an expired
  // token or no token in the tokenCache, use the refreshToken flow
  if (
    tokenObj &&
    tokenObj.refreshToken &&
    (!tokenObj.token ||
      (tokenObj.token && Date.now() > tokenObj.expirationTime))
  ) {
    executeRequest({
      fetcher,
      ...buildRequestForRefreshTokenFlow({
        ...userOptions,
        refreshToken: tokenObj.refreshToken,
      }),
      tokenCache,
      requestState,
      pendingTasks,
      response,
    })
    return
  }

  // Token and refreshToken are not present or invalid. Request a new token...
  executeRequest({
    fetcher,
    url,
    basicAuth,
    body,
    tokenCache,
    requestState,
    pendingTasks,
    response,
  })
}
