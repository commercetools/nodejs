/* @flow */
/* global fetch Request Headers */
import 'isomorphic-fetch'
import parseHeaders from './parse-headers'
import getErrorByCode, { NetworkError, HttpError } from './errors'
import type {
  HttpErrorType,
  HttpMiddlewareOptions,
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
} from '../../../types/sdk'

function createError({ statusCode, message, ...rest }): HttpErrorType {
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

export default function createHttpMiddleware({
  host,
  credentialsMode,
  includeResponseHeaders,
  includeOriginalRequest,
  maskSensitiveHeaderData,
  enableRetry,
  retryConfig: {
    // encourage exponential backoff to prevent spamming the server if down
    maxRetries = 10,
    backoff = true,
    retryDelay = 200,
    maxDelay = Infinity,
  } = {},
}: HttpMiddlewareOptions): Middleware {
  return next => (request: MiddlewareRequest, response: MiddlewareResponse) => {
    const url = host.replace(/\/$/, '') + request.uri
    const body =
      typeof request.body === 'string' || Buffer.isBuffer(request.body)
        ? request.body
        : JSON.stringify(request.body)
    const requestHeader = {
      'Content-Type': 'application/json',
      ...request.headers,
      ...(body ? { 'Content-Length': Buffer.byteLength(body).toString() } : {}),
    }
    const requestObj: Object = new Request(url, {
      method: request.method,
      headers: new Headers(requestHeader),
      ...(credentialsMode ? { credentials: credentialsMode } : {}),
      ...(body ? { body } : {}),
    })
    let retryCount = 0
    // wrap in a fn so we can retry if error occur
    function executeFetch() {
      fetch(requestObj).then(
        (res: Response) => {
          if (res.ok) {
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
                  ...requestObj,
                  headers: parseHeaders(requestObj.headers),
                }
                if (maskSensitiveHeaderData)
                  parsedResponse.request.headers.authorization =
                    'Bearer ********'
              }
              next(request, parsedResponse)
            })
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
              headers: parseHeaders(res.headers),
              ...(typeof parsed === 'object'
                ? { message: parsed.message, body: parsed }
                : { message: parsed, body: parsed }),
            })
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
          if (maskSensitiveHeaderData) {
            request.headers.authorization = 'Bearer ********'
          }
          const error = new NetworkError(e.message, {
            originalRequest: request,
            retryCount,
          })
          next(request, { ...response, error, statusCode: 0 })
        }
      )
    }
    executeFetch()
  }
}
