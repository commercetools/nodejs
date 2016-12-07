/* global fetch */
import 'isomorphic-fetch'
import {
  buildRequestForClientCredentialsFlow,
} from './build-requests'

export default function createAuthMiddlewareForClientCredentialsFlow (options) {
  const cache = {
    // [token]: expirationTime
  }

  return next => (request, response) => {
    const currentAuthHeader = (
      request.headers['authorization'] ||
      request.headers['Authorization']
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
          // TODO: check if this works in the browser
          'Content-Length': Buffer.byteLength(body),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      },
    )
    .then((res) => {
      if (res.ok)
        return res.json()
        .then((result) => {
          const token = result.access_token
          const expiresIn = result.expires_in
          const expirationTime = calculateExpirationTime(expiresIn)
          // Cache new token
          Object.assign(cache, { [token]: expirationTime })
          // Assign the new token in the request header
          const requestWithAuth = mergeAuthHeader(result.access_token, request)
          next(requestWithAuth, response)
        })

      // Handle error response
      return res.text()
      .then((text) => {
        let parsed
        try {
          parsed = JSON.parse(text)
        } catch (error) {
          /* noop */
        }
        const error = new Error(parsed ? parsed.message : text)
        if (parsed) error.body = parsed
        response.reject(error)
      })
    })
    .catch((error) => {
      response.reject(error)
    })
  }
}

function mergeAuthHeader (token, req) {
  return {
    ...req,
    headers: {
      ...req.headers,
      Authorization: `Bearer ${token}`,
    },
  }
}

function calculateExpirationTime (expiresIn) {
  return (
    Date.now() +
    (expiresIn * 1000)
  ) - (
    // Add a gap of 2 hours before expiration time.
    2 * 60 * 60 * 1000
  )
}
