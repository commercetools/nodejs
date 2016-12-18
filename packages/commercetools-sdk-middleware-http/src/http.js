/* global fetch */
import 'isomorphic-fetch'
import parseHeaders from './parse-headers'

const defaultApiHost = 'https://api.sphere.io'

export default function createHttpMiddleware (options) {
  const {
    host = defaultApiHost,
    // TODO: other options?
  } = options

  return next => (request, response) => {
    const url = host + request.uri
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
          // TODO: check if this works in the browser
          ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {}),
        },
        ...(body ? { body } : {}),
      },
    )
    .then((res) => {
      if (res.ok)
        return res.json()
        .then((result) => {
          const parsedResponse = {
            ...response,
            body: result,
            statusCode: res.status,
            headers: parseHeaders(res.headers),
            // TODO: anything else?
          }
          next(request, parsedResponse)
        })

      // Network request
      return res.text()
      .then((text) => {
        // Try to parse the error response as JSON
        let parsed
        try {
          parsed = JSON.parse(text)
        } catch (error) {
          /* noop */
        }
        // TODO: use typed errors based on status code
        // - BadRequest
        // - Unauthorized
        // - Forbidden
        // - ConcurrentModification
        // - InternalServerError
        // - ServiceUnavailable
        // - NotFound
        // - HttpError
        const error = new Error(parsed ? parsed.message : text)
        if (parsed) error.body = parsed
        error.code = res.status
        error.statusCode = res.status

        // Let the final resolver to reject the promise
        const parsedResponse = {
          ...response,
          statusCode: res.status,
          headers: parseHeaders(res.headers),
          error,
        }
        next(request, parsedResponse)
      })
    })
    .catch((error) => {
      next(request, { ...response, error })
    })
  }
}
