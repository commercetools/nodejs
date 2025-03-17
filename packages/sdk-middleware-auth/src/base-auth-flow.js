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
import { errors } from '@commercetools/sdk-middleware-http'
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
    // Add a gap of 5 minutes before expiration time.
    5 * 60 * 1000
  )
}

function calcDelayDuration(
  retryCount: number,
  retryDelay: number = 60000, // 60 seconds retry delay
  maxRetries: number,
  backoff: boolean = true,
  maxDelay: number = Infinity
): number {
  if (backoff)
    return retryCount !== 0 // do not increase if it's the first retry
      ? Math.min(
          Math.round((Math.random() + 1) * retryDelay * 2 ** retryCount),
          maxDelay
        )
      : retryDelay
  return retryDelay
}

function executeRequest({
  fetcher,
  url,
  basicAuth,
  body,
  request,
  tokenCache,
  requestState,
  pendingTasks,
  response,
  tokenCacheKey,
  timeout,
  getAbortController,
  retryConfig: {
    retryDelay = 300, // 60 seconds retry delay
    maxRetries = 10,
    backoff = true, // encourage exponential backoff
    maxDelay = Infinity,
  } = {},
}: executeRequestOptions) {
  // if timeout is configured and no instance of AbortController is passed then throw
  if (
    timeout &&
    !getAbortController &&
    typeof AbortController === 'undefined'
  ) {
    throw new Error(
      '`AbortController` is not available. Please pass in `getAbortController` as an option or have AbortController globally available when using timeout.'
    )
  }

  // ensure that the passed value of the timeout is of type number
  if (timeout && typeof timeout !== 'number')
    throw new Error(
      'The passed value for timeout is not a number, please provide a timeout of type number.'
    )

  let retryCount = 0
  function executeFetch() {
    let signal
    let abortController: any
    if (timeout || getAbortController)
      abortController =
        (getAbortController ? getAbortController() : null) ||
        new AbortController()
    if (abortController) {
      signal = abortController.signal
    }

    let timer
    if (timeout)
      timer = setTimeout(() => {
        abortController.abort()
      }, timeout)
    fetcher(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Length': Buffer.byteLength(body).toString(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
      signal,
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
                tokenCache.set(
                  { token, expirationTime, refreshToken },
                  tokenCacheKey
                )

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

          // to notify that token is either fetched or failed
          // in the below case token failed to be fetched
          // and reset requestState to false
          // so requestState could be shared between multi authMiddlewareBase functions
          requestState.set(false)

          // check that error message matches the pattern '...is suspended'
          if (error.message.includes('is suspended')) {
            // empty the tokenCache
            tokenCache.set(null)

            // retry
            if (retryCount < maxRetries) {
              setTimeout(
                executeFetch,
                calcDelayDuration(
                  retryCount,
                  retryDelay,
                  maxRetries,
                  backoff,
                  maxDelay
                )
              )
              retryCount += 1
              return
            }

            // construct a suitable error message for the caller
            const errorResponse = {
              message: error.body.error,
              statusCode: error.body.statusCode,
              originalRequest: request,
              retryCount,
            }
            response.reject(errorResponse)
          }

          response.reject(error)
        })
      })
      .catch((error: Error & { type?: string }) => {
        // to notify that token is either fetched or failed
        // in the below case token failed to be fetched
        // and reset requestState to false
        // so requestState could be shared between multi authMiddlewareBase functions
        requestState.set(false)

        if (response && typeof response.reject === 'function')
          response.reject(error)

        if (
          response &&
          typeof response.reject === 'function' &&
          error?.type === 'aborted'
        ) {
          const _error = new errors.NetworkError(error.message, {
            type: error.type,
            request,
          })
          response.reject(_error)
        }
      })
      .finally(() => {
        clearTimeout(timer)
      })
  }

  executeFetch()
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
    tokenCacheKey,
    fetch: fetcher,
    timeout,
    getAbortController,
    retryConfig,
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
  const tokenObj = tokenCache.get(tokenCacheKey)
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
    if (!userOptions)
      throw new Error('Missing required options')
      // eslint-disable-next-line
    ;(userOptions: AuthMiddlewareOptions | PasswordAuthMiddlewareOptions)
    executeRequest({
      fetcher,
      ...buildRequestForRefreshTokenFlow({
        ...userOptions,
        refreshToken: tokenObj.refreshToken,
      }),
      tokenCacheKey,
      request,
      tokenCache,
      requestState,
      pendingTasks,
      response,
      timeout,
      getAbortController,
      retryConfig,
    })
    return
  }

  // Token and refreshToken are not present or invalid. Request a new token...
  executeRequest({
    fetcher,
    url,
    basicAuth,
    body,
    request,
    tokenCacheKey,
    tokenCache,
    requestState,
    pendingTasks,
    response,
    timeout,
    getAbortController,
    retryConfig,
  })
}
