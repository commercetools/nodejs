/* @flow */

import type {
  HttpHeaders,
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
      request.headers.authorization = 'Bearer ********'
    if (request.headers.Authorization)
      request.headers.Authorization = 'Bearer ********'
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
  abortController: _abortController,
  getAbortController,
}: HttpMiddlewareOptions): Middleware {
  if (!fetcher && typeof fetch === 'undefined')
    throw new Error(
      '`fetch` is not available. Please pass in `fetch` as an option or have it globally available.'
    )
  if (
    timeout &&
    !getAbortController &&
    !_abortController &&
    typeof AbortController === 'undefined'
  )
    throw new Error(
      '`AbortController` is not available. Please pass in `getAbortController` as an option or have AbortController globally available when using timeout.'
    )
  let fetchFunction: typeof fetch
  if (fetcher) {
    fetchFunction = fetcher
  } else {
    // `fetcher` is set here rather than the destructuring to ensure fetch is
    // declared before referencing it otherwise it would cause a `ReferenceError`.
    // For reference of this pattern: https://github.com/apollographql/apollo-link/blob/498b413a5b5199b0758ce898b3bb55451f57a2fa/packages/apollo-link-http/src/httpLink.ts#L49
    fetchFunction = fetch
  }

  return (next: Next): Next => (
    request: MiddlewareRequest,
    response: MiddlewareResponse
  ) => {
    let abortController: any
    if (timeout || getAbortController || _abortController)
      // eslint-disable-next-line
      abortController =
        (getAbortController ? getAbortController() : null) ||
        _abortController ||
        new AbortController()

    const url = host.replace(/\/$/, '') + request.uri
    const body =
      typeof request.body === 'string' || Buffer.isBuffer(request.body)
        ? request.body
        : // NOTE: `stringify` of `null` gives the String('null')
          JSON.stringify(request.body || undefined)

    const requestHeader: HttpHeaders = { ...request.headers }
    if (!Object.prototype.hasOwnProperty.call(requestHeader, 'Content-Type')) {
      requestHeader['Content-Type'] = 'application/json'
    }
    if (body) {
      requestHeader['Content-Length'] = Buffer.byteLength(body).toString()
    }
    const fetchOptions: RequestOptions = {
      method: request.method,
      headers: requestHeader,
    }
    if (credentialsMode) {
      fetchOptions.credentials = credentialsMode
    }
    if (abortController) {
      fetchOptions.signal = abortController.signal
    }
    if (body) {
      fetchOptions.body = body
    }
    let retryCount = 0
    // wrap in a fn so we can retry if error occur
    function executeFetch() {
      // Kick off timer for abortController directly before fetch.
      let timer
      if (timeout)
        timer = setTimeout(() => {
          abortController.abort()
        }, timeout)
      fetchFunction(url, fetchOptions)
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

              res.text().then((result: Object) => {
                // Try to parse the response as JSON
                let parsed
                try {
                  parsed = result.length > 0 ? JSON.parse(result) : {}
                } catch (err) {
                  if (enableRetry && retryCount < maxRetries) {
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
                  parsed = result
                }

                const parsedResponse: Object = {
                  ...response,
                  body: parsed,
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
