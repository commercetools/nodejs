// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock'
import {
  createAuthMiddlewareForClientCredentialsFlow,
} from '../src'

function createTestRequest (options) {
  return {
    url: '',
    method: 'GET',
    body: null,
    headers: {},
    ...options,
  }
}

function createTestResponse (options) {
  return {
    ...options,
  }
}

function createTestMiddlewareOptions (options) {
  return {
    host: 'https://auth.commercetools.co',
    projectKey: 'foo',
    credentials: {
      clientId: '123',
      clientSecret: 'secret',
    },
    ...options,
  }
}

describe('Client Crentials Flow', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('get a new auth token if not present in request headers', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest()
      const response = createTestResponse({
        resolve,
        reject,
      })
      const next = (req /* , res */) => {
        expect(req).toEqual({
          ...request,
          headers: {
            ...request.headers,
            Authorization: 'Bearer xxx',
          },
        })
        resolve()
      }
      const middlewareOptions = createTestMiddlewareOptions()
      const authMiddleware = createAuthMiddlewareForClientCredentialsFlow(
        middlewareOptions,
      )
      nock(middlewareOptions.host)
        .filteringRequestBody((body) => {
          expect(body).toBe(
            'grant_type=client_credentials&scope=manage_project:foo',
          )
          return '*'
        })
        .post('/oauth/token', '*')
        .reply(200, {
          access_token: 'xxx',
          expires_in: 100,
        })

      authMiddleware(next)(request, response)
    }),
  )

  it('reject if auth request fails (JSON error response)', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest()
      const response = createTestResponse({
        resolve,
        reject: (error) => {
          expect(error.message).toBe('Oops')
          expect(error.body).toEqual({ message: 'Oops' })
          resolve()
        },
      })
      const next = () => {
        reject(
          'This function should never be called, the response was rejected',
        )
      }
      const middlewareOptions = createTestMiddlewareOptions()
      const authMiddleware = createAuthMiddlewareForClientCredentialsFlow(
        middlewareOptions,
      )
      nock(middlewareOptions.host)
        .filteringRequestBody(/.*/, '*')
        .post('/oauth/token', '*')
        .reply(400, { message: 'Oops' }) // <-- JSON error response

      authMiddleware(next)(request, response)
    }),
  )

  it('reject if auth request fails (non JSON error response)', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest()
      const response = createTestResponse({
        resolve,
        reject: (error) => {
          expect(error.message).toBe('Oops')
          expect(error.body).toBeUndefined()
          resolve()
        },
      })
      const next = () => {
        reject(
          'This function should never be called, the response was rejected',
        )
      }
      const middlewareOptions = createTestMiddlewareOptions()
      const authMiddleware = createAuthMiddlewareForClientCredentialsFlow(
        middlewareOptions,
      )
      nock(middlewareOptions.host)
        .filteringRequestBody(/.*/, '*')
        .post('/oauth/token', '*')
        .reply(400, 'Oops') // <-- non JSON error response

      authMiddleware(next)(request, response)
    }),
  )

  it('retrieve a new token if previous one expired', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest()
      const response = createTestResponse({
        resolve,
        reject,
      })
      const middlewareOptions = createTestMiddlewareOptions()
      const authMiddleware = createAuthMiddlewareForClientCredentialsFlow(
        middlewareOptions,
      )
      let requestCount = 0
      nock(middlewareOptions.host)
        .persist() // <-- use the same interceptor for all requests
        .log(() => { (requestCount += 1) }) // keep track of the request count
        .filteringRequestBody(/.*/, '*')
        .post('/oauth/token', '*')
        .reply(200, () => ({
          access_token: 'xxx',
          // Return the first 2 requests with an expired token
          expires_in: requestCount < 2
            ? 1 // <-- to ensure it expires
            : (Date.now() + (60 * 60 * 24)),
        }))

      // First call:
      // - there is no token yet
      // - a new token is fetched
      authMiddleware(
        () => {
          expect(requestCount).toBe(1)
          // Second call:
          // - we simulate that the request has a token set in the headers
          // - the previous token was expired though, so we need to refetch it
          authMiddleware(
            () => {
              expect(requestCount).toBe(2)
              // Third call:
              // - we simulate that the request has a token set in the headers
              // - the previous token is still valid, no more requests
              authMiddleware(
                () => {
                  expect(requestCount).toBe(2)
                  resolve()
                },
              )(request, response)
            },
          )(request, response)
        },
      )(request, response)
    }),
  )

  it(
    'do not get a new token if one is already present in request headers ' +
    'but it does not match one of the cached tokens',
  () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest()
      const response = createTestResponse({
        resolve,
        reject,
      })
      const middlewareOptions = createTestMiddlewareOptions()
      const authMiddleware = createAuthMiddlewareForClientCredentialsFlow(
        middlewareOptions,
      )
      let requestCount = 0
      nock(middlewareOptions.host)
        .persist() // <-- use the same interceptor for all requests
        .log(() => { (requestCount += 1) }) // keep track of the request count
        .filteringRequestBody(/.*/, '*')
        .post('/oauth/token', '*')
        .reply(200, {
          access_token: 'xxx',
          expires_in: (Date.now() + (60 * 60 * 24)),
        })

      // First call:
      // - there is no token yet
      // - a new token is fetched
      authMiddleware(
        () => {
          // Second call:
          // - we simulate that the request has a token set in the headers
          // which does not match any of the cached tokens. In this case
          // do not refetch and keep going.
          const requestWithHeaders = {
            ...request,
            headers: {
              Authorization: 'Bearer yyy',
            },
          }
          authMiddleware(
            () => {
              expect(requestCount).toBe(1)
              resolve()
            },
          )(requestWithHeaders, response)
        },
      )(request, response)
    }),
  )

  it(
    'ensure to fetch new token only once and keep track of pending tasks',
  () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest()
      const response = createTestResponse({
        resolve,
        reject,
      })
      const middlewareOptions = createTestMiddlewareOptions()
      const authMiddleware = createAuthMiddlewareForClientCredentialsFlow(
        middlewareOptions,
      )
      let requestCount = 0
      nock(middlewareOptions.host)
        .persist() // <-- use the same interceptor for all requests
        .log(() => { (requestCount += 1) }) // keep track of the request count
        .filteringRequestBody(/.*/, '*')
        .post('/oauth/token', '*')
        .reply(200, {
          access_token: 'xxx',
          expires_in: (Date.now() + (60 * 60 * 24)),
        })

      let nextCount = 0
      const next = () => {
        nextCount += 1
        if (nextCount === 6) {
          expect(requestCount).toBe(1)
          resolve()
        }
      }
      // Execute multiple requests at once.
      // This should queue all of them until the token has been fetched.
      authMiddleware(next)(request, response)
      authMiddleware(next)(request, response)
      authMiddleware(next)(request, response)
      authMiddleware(next)(request, response)
      authMiddleware(next)(request, response)
      authMiddleware(next)(request, response)
    }),
  )

  it(
    'if a token has been fetched, use it for the new incoming requests',
  () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest()
      const response = createTestResponse({
        resolve,
        reject,
      })
      const middlewareOptions = createTestMiddlewareOptions()
      const authMiddleware = createAuthMiddlewareForClientCredentialsFlow(
        middlewareOptions,
      )
      let requestCount = 0
      nock(middlewareOptions.host)
        .persist() // <-- use the same interceptor for all requests
        .log(() => { (requestCount += 1) }) // keep track of the request count
        .filteringRequestBody(/.*/, '*')
        .post('/oauth/token', '*')
        .reply(200, {
          access_token: 'xxx',
          expires_in: (Date.now() + (60 * 60 * 24)),
        })

      // 1. Execute multiple requests at once.
      // This should queue all of them until the token has been fetched.
      authMiddleware(() => {
        // 1. Got a token
        expect(requestCount).toBe(1)

        authMiddleware((rq2) => {
          // 2. Should not get a new token
          expect(requestCount).toBe(1)
          expect(rq2).toEqual(expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: 'Bearer xxx',
            }),
          }))
          resolve()
        })(request, response)
      })(request, response)
    }),
  )
})
