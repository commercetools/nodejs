// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock'
import createAuthMiddlewareBase from '../src/base-auth-flow'
import {
  buildRequestForClientCredentialsFlow,
} from '../src/build-requests'
import store from '../src/utils'

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

function createBaseMiddleware (options, next) {
  const params = {
    request: createTestRequest(),
    response: createTestResponse(),
    pendingTasks: [],
    ...buildRequestForClientCredentialsFlow(createTestMiddlewareOptions()),
    requestState: store(false),
    tokenCache: store({}),
    ...options,
  }
  return createAuthMiddlewareBase(params, next)
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

describe('Base Auth Flow', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('get a new auth token if not present in request headers', () =>
    new Promise((resolve) => {
      const next = (req) => {
        expect(req).toHaveProperty('headers.Authorization', 'Bearer xxx')
        resolve()
      }
      const middlewareOptions = createTestMiddlewareOptions()

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
      createBaseMiddleware({ }, next)
    }),
  )

  it('reject if network error occur while fetching token', () =>
    new Promise((resolve, reject) => {
      const response = createTestResponse({
        resolve,
        reject: (error) => {
          expect(error.message).toMatch('socket timeout')
          resolve()
        },
      })
      const next = () => {
        reject(new Error('this method should not be called.'))
      }
      const middlewareOptions = createTestMiddlewareOptions()

      nock(middlewareOptions.host)
        .filteringRequestBody((body) => {
          expect(body).toBe(
            'grant_type=client_credentials&scope=manage_project:foo',
          )
          return '*'
        })
        .post('/oauth/token', '*')
        .replyWithError('socket timeout')
      createBaseMiddleware({ response }, next)
    }),
  )

  it('reject if auth request fails (JSON error response)', () =>
    new Promise((resolve, reject) => {
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
      nock(middlewareOptions.host)
        .filteringRequestBody(/.*/, '*')
        .post('/oauth/token', '*')
        .reply(400, { message: 'Oops' }) // <-- JSON error response

      createBaseMiddleware({ response }, next)
    }),
  )

  it('reject if auth request fails (non JSON error response)', () =>
    new Promise((resolve, reject) => {
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
      nock(middlewareOptions.host)
        .filteringRequestBody(/.*/, '*')
        .post('/oauth/token', '*')
        .reply(400, 'Oops') // <-- non JSON error response

      createBaseMiddleware({ response }, next)
    }),
  )

  it('retrieve a new token if previous one expired', () =>
    new Promise((resolve) => {
      const middlewareOptions = createTestMiddlewareOptions()
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

      const next = () => {
        expect(requestCount).toBe(2)
        resolve()
      }
      const tokenCache = store({})
      const requestState = store(false)
      // Third call:
      // - we simulate that the request has a token set in the headers
      // - the previous token is still valid, no more requests
      const call3 = () => {
        expect(requestCount).toBe(2)
        createBaseMiddleware({ requestState, tokenCache }, next)
      }
      // Second call:
      // - we simulate that the request has a token set in the headers
      // - the previous token was expired though, so we need to refetch it
      const call2 = () => {
        expect(requestCount).toBe(1)
        createBaseMiddleware({ requestState, tokenCache }, call3)
      }
      // First call:
      // - there is no token yet
      // - a new token is fetched
      createBaseMiddleware({ requestState, tokenCache }, call2)
    }),
  )

  it(
    'do not get a new token if one is already present in request headers ' +
    'but it does not match one of the cached tokens',
  () =>
    new Promise((resolve, reject) => {
      const response = createTestResponse({
        resolve,
        reject,
      })
      const middlewareOptions = createTestMiddlewareOptions()
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

      const next = () => {
        expect(requestCount).toBe(1)
        resolve()
      }
      const tokenCache = store({})
      const requestState = store(false)
      // Second call:
      // - we simulate that the request has a token set in the headers
      // which does not match any of the cached tokens. In this case
      // do not refetch and keep going.
      const call2 = (rq) => {
        const requestWithHeaders = {
          ...rq,
          headers: {
            Authorization: 'Bearer yyy',
          },
        }
        createBaseMiddleware({ request: requestWithHeaders }, next)
        createAuthMiddlewareBase({
          request: requestWithHeaders,
          response,
          pendingTasks: [],
          ...buildRequestForClientCredentialsFlow(middlewareOptions),
          requestState,
          tokenCache,
        }, next)
      }
      // First call:
      // - there is no token yet
      // - a new token is fetched
      createBaseMiddleware({}, call2)
    }),
  )

  it(
    'ensure to fetch new token only once and keep track of pending tasks',
  () =>
    new Promise((resolve) => {
      const middlewareOptions = createTestMiddlewareOptions()
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
      const pendingTasks = []
      const tokenCache = store({})
      const requestState = store(false)
      // Execute multiple requests at once.
      // This should queue all of them until the token has been fetched.
      createBaseMiddleware({ pendingTasks, tokenCache, requestState }, next)
      createBaseMiddleware({ pendingTasks, tokenCache, requestState }, next)
      createBaseMiddleware({ pendingTasks, tokenCache, requestState }, next)
      createBaseMiddleware({ pendingTasks, tokenCache, requestState }, next)
      createBaseMiddleware({ pendingTasks, tokenCache, requestState }, next)
      createBaseMiddleware({ pendingTasks, tokenCache, requestState }, next)
      createBaseMiddleware({ pendingTasks, tokenCache, requestState }, next)
    }),
  )

  it(
    'if a token has been fetched, use it for the new incoming requests',
  () =>
    new Promise((resolve) => {
      const middlewareOptions = createTestMiddlewareOptions()
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
      const pendingTasks = []
      const tokenCache = store({})
      const requestState = store(false)
      const next = (rq2) => {
        // 2. Should not get a new token
        expect(requestCount).toBe(1)
        expect(rq2).toEqual(expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer xxx',
          }),
        }))
        resolve()
      }
      // 2. Should not get a new token
      const call2 = createBaseMiddleware(
        { pendingTasks, tokenCache, requestState },
        next,
      )
      createBaseMiddleware({ pendingTasks, tokenCache, requestState }, call2)
    }),
  )
})
