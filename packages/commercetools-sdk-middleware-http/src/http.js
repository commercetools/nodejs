/* @flow */
import type {
  HttpErrorType,
  HttpMiddlewareOptions,
  Middleware,
  ClientRequest,
  ClientResponse,
} from 'types/sdk'

/* global fetch */
import 'isomorphic-fetch'
import parseHeaders from './parse-headers'
import getErrorByCode, {
  NetworkError,
  HttpError,
} from './errors'

const defaultApiHost = 'https://api.sphere.io'

export default function createHttpMiddleware (
  options: HttpMiddlewareOptions = {
    host: defaultApiHost
  },
): Middleware {
  return next => (request: ClientRequest, response: ClientResponse) => {
    const url = options.host + request.uri
    const body = typeof request.body === 'string'
      ? request.body
      : JSON.stringify(request.body)

    fetch(
      url,
      {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          ...request.headers,
          ...(
            body
              ? { 'Content-Length': Buffer.byteLength(body).toString() }
              : {}
          ),
        },
        ...(body ? { body } : {}),
      },
    )
    .then(
      (res: Response) => {
        if (res.ok) {
          res.json()
          .then((result: Object) => {
            const parsedResponse = {
              ...response,
              body: result,
              statusCode: res.status,
            }
            next(request, parsedResponse)
          })
          return
        }

        // Server responded with an error. Try to parse it as JSON, then return
        // a proper error type with all necessary meta information.
        res.text()
        .then((text: any) => {
          // Try to parse the error response as JSON
          let parsed
          try {
            parsed = JSON.parse(text)
          } catch (error) {
            /* noop */
          }

          const error: HttpErrorType = createError({
            statusCode: res.status,
            originalRequest: request,
            headers: parseHeaders(res.headers),
            ...(parsed
              ? { message: parsed.message, body: parsed }
              : {}
            ),
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
        const error = new NetworkError(e.message, { originalRequest: request })
        next(request, { ...response, error, statusCode: 0 })
      },
    )
  }
}

function createError ({ statusCode, message, ...rest }): HttpErrorType {
  let errorMessage = message || 'Unexpected non-JSON error response'
  if (statusCode === 404)
    errorMessage = `URI not found: ${rest.originalRequest.uri}`

  const ResponseError = getErrorByCode(statusCode)
  if (ResponseError)
    return new ResponseError(errorMessage, rest)
  return new HttpError(statusCode, errorMessage, rest)
}
