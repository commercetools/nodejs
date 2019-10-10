/* @flow */

import type {
  HttpErrorType,
  HttpMiddlewareOptions,
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
  Next,
} from 'types/sdk'

import getErrorByCode, { NetworkError, HttpError } from './errors'
import parseHeaders from './parse-headers'

function createError({ statusCode, message, ...rest }: Object): HttpErrorType {
  let errorMessage = message || 'Unexpected non-JSON error response'
  if (statusCode === 404)
    errorMessage = `URI not found: ${rest.originalRequest.uri}`

  const ResponseError = getErrorByCode(statusCode)
  if (ResponseError) return new ResponseError(errorMessage, rest)
  return new HttpError(statusCode, errorMessage, rest)
}

// calculates the delay duration exponentially
// More info about the algorithm use here https://goo.gl/Xk8h5f
function calcDelayDuration(
  retryCount: number,
  retryDelay: number,
  maxRetries: number,
  backoff: boolean,
  maxDelay: number
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

function maskAuthData(request: Object, maskSensitiveHeaderData: ?boolean) {
  if (maskSensitiveHeaderData) {
    if (request.headers.authorization)
      request.headers.authorization = ['Bearer ********']
    if (request.headers.Authorization)
      request.headers.Authorization = ['Bearer ********']
  }
}

export default function createHttpMiddleware({
  host,
  credentialsMode,
  includeResponseHeaders,
  includeOriginalRequest,
  maskSensitiveHeaderData = true,
  enableRetry,
  timeout,
  retryConfig: {
    // encourage exponential backoff to prevent spamming the server if down
    maxRetries = 10,
    backoff = true,
    retryDelay = 200,
    maxDelay = Infinity,
  } = {},
  fetch: fetcher,
  AbortController: _AbortController,
}: HttpMiddlewareOptions): Middleware {
  if (!fetcher && typeof fetch === 'undefined')
    throw new Error(
      '`fetch` is not available. Please pass in `fetch` as an option or have it globally available.'
    )
  if (timeout && !_AbortController && typeof AbortController === 'undefined')
    throw new Error(
      '`AbortController` is not available. Please pass in `AbortController` as an option or have it globally available when using timeout.'
    )

  if (!fetcher)
    // `fetcher` is set here rather than the destructuring to ensure fetch is
    // declared before referencing it otherwise it would cause a `ReferenceError`.
    // For reference of this pattern: https://github.com/apollographql/apollo-link/blob/498b413a5b5199b0758ce898b3bb55451f57a2fa/packages/apollo-link-http/src/httpLink.ts#L49

    // eslint-disable-next-line
    fetcher = fetch

  let abortController
  if (timeout || _AbortController)
    // eslint-disable-next-line
    abortController = _AbortController || new AbortController()

  let timer
  if (timeout)
    timer = setTimeout(() => {
      abortController.abort()
    }, timeout)

  return (next: Next): Next => (
    request: MiddlewareRequest,
    response: MiddlewareResponse
  ) => {
    const url = host.replace(/\/$/, '') + request.uri
    const body =
      typeof request.body === 'string' || Buffer.isBuffer(request.body)
        ? request.body
        : // NOTE: `stringify` of `null` gives the String('null')
          JSON.stringify(request.body || undefined)
    const requestHeader = {
      'Content-Type': ['application/json'],
      ...request.headers,
      ...(body
        ? { 'Content-Length': Buffer.byteLength(body).toString() }
        : null),
    }
    const fetchOptions: Object = {
      method: request.method,
      headers: requestHeader,
      ...(credentialsMode ? { credentials: credentialsMode } : {}),
      ...(timeout || abortController ? { signal: abortController.signal } : {}),
      ...(body ? { body } : null),
    }
    let retryCount = 0
    // wrap in a fn so we can retry if error occur
    function executeFetch() {
      // $FlowFixMe
      fetcher(url, fetchOptions)
        .then(
          (res: Response) => {
            if (res.ok) {
              if (fetchOptions.method === 'HEAD') {
                next(request, {
                  ...response,
                  statusCode: res.status,
                })
                return
              }

              res.json().then((result: Object) => {
                const parsedResponse: Object = {
                  ...response,
                  body: result,
                  statusCode: res.status,
                }

                if (includeResponseHeaders)
                  parsedResponse.headers = parseHeaders(res.headers)

                if (includeOriginalRequest) {
                  parsedResponse.request = {
                    ...fetchOptions,
                  }
                  maskAuthData(parsedResponse.request, maskSensitiveHeaderData)
                }
                next(request, parsedResponse)
              })
              return
            }
            if (res.status === 503 && enableRetry)
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

            // Server responded with an error. Try to parse it as JSON, then
            // return a proper error type with all necessary meta information.
            res.text().then((text: any) => {
              // Try to parse the error response as JSON
              let parsed
              try {
                parsed = JSON.parse(text)
              } catch (error) {
                parsed = text
              }

              const error: HttpErrorType = createError({
                statusCode: res.status,
                originalRequest: request,
                retryCount,
                headers: parseHeaders(res.headers),
                ...(typeof parsed === 'object'
                  ? { message: parsed.message, body: parsed }
                  : { message: parsed, body: parsed }),
              })
              maskAuthData(error.originalRequest, maskSensitiveHeaderData)
              // Let the final resolver to reject the promise
              const parsedResponse = {
                ...response,
                error,
                statusCode: res.status,
              }
              next(request, parsedResponse)
            })
          },
          // We know that this is a "network" error thrown by the `fetch` library
          (e: Error) => {
            if (enableRetry)
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

            const error = new NetworkError(e.message, {
              originalRequest: request,
              retryCount,
            })
            maskAuthData(error.originalRequest, maskSensitiveHeaderData)
            next(request, { ...response, error, statusCode: 0 })
          }
        )
        .finally(() => {
          clearTimeout(timer)
        })
    }
    executeFetch()
  }
}
