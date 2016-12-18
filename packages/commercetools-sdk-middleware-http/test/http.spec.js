// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock'
import {
  createHttpMiddleware,
} from '../src'

function createTestRequest (options) {
  return {
    uri: '',
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
    host: 'https://api.commercetools.co',
    ...options,
  }
}

describe('Http', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('execute a get request (success)', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = createTestResponse({
        resolve,
        reject,
      })
      const next = (req, res) => {
        expect(res).toEqual({
          ...response,
          body: { foo: 'bar' },
          statusCode: 200,
          headers: {
            'content-type': ['application/json'],
          },
        })
        resolve()
      }
      const middlewareOptions = createTestMiddlewareOptions()
      const httpMiddleware = createHttpMiddleware(
        middlewareOptions,
      )
      nock(middlewareOptions.host)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    }),
  )

  it('execute a post request (success)', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
        method: 'POST',
        body: { hello: 'world' },
      })
      const response = createTestResponse({
        resolve,
        reject,
      })
      const next = (req, res) => {
        expect(res).toEqual({
          ...response,
          body: { foo: 'bar' },
          statusCode: 200,
          headers: {
            'content-type': ['application/json'],
          },
        })
        resolve()
      }
      const middlewareOptions = createTestMiddlewareOptions()
      const httpMiddleware = createHttpMiddleware(
        middlewareOptions,
      )
      nock(middlewareOptions.host)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .filteringRequestBody(() => '*')
        .post('/foo/bar', '*')
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    }),
  )

  it('handle failed response (network error)', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = createTestResponse({
        resolve,
        reject,
      })
      const next = (req, res) => {
        expect(res.error.message).toBe(
          // eslint-disable-next-line max-len
          'request to https://api.commercetools.co/foo/bar failed, reason: oops',
        )
        expect(res.body).toBeUndefined()
        expect(res.statusCode).toBeUndefined()
        expect(res.headers).toBeUndefined()
        resolve()
      }
      const middlewareOptions = createTestMiddlewareOptions()
      const httpMiddleware = createHttpMiddleware(
        middlewareOptions,
      )
      nock(middlewareOptions.host)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .replyWithError({ message: 'oops' })

      httpMiddleware(next)(request, response)
    }),
  )

  it('handle failed response (api error)', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = createTestResponse({
        resolve,
        reject,
      })
      const next = (req, res) => {
        const expectedError = new Error('oops')
        expectedError.body = {
          message: 'oops',
          error: [{ code: 'InvalidField' }],
        }
        expectedError.code = 400
        expectedError.statusCode = 400
        expect(res).toEqual({
          ...response,
          statusCode: 400,
          headers: {
            'content-type': ['application/json'],
          },
          error: expectedError,
        })
        resolve()
      }
      const middlewareOptions = createTestMiddlewareOptions()
      const httpMiddleware = createHttpMiddleware(
        middlewareOptions,
      )
      nock(middlewareOptions.host)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(400, {
          message: 'oops',
          error: [{ code: 'InvalidField' }],
        })

      httpMiddleware(next)(request, response)
    }),
  )
})
