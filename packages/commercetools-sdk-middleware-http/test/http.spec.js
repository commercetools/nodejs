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

const defaultHost = 'https://api.sphere.io'
const customHost = 'https://api.commercetools.co'

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
        })
        resolve()
      }
      // Use default options
      const httpMiddleware = createHttpMiddleware()
      nock(defaultHost)
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
        })
        resolve()
      }
      // Use custom options
      const httpMiddleware = createHttpMiddleware({ host: customHost })
      nock(customHost)
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
        expect(res.error.name).toBe('NetworkError')
        expect(res.error.headers).toBeUndefined()
        expect(res.error.originalRequest).toBeDefined()
        expect(res.error.message).toBe(
          // eslint-disable-next-line max-len
          `request to ${defaultHost}/foo/bar failed, reason: Connection timeout`,
        )
        expect(res.body).toBeUndefined()
        expect(res.statusCode).toBe(0)
        resolve()
      }
      const httpMiddleware = createHttpMiddleware()
      nock(defaultHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .replyWithError('Connection timeout')

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
        expectedError.headers = {
          'content-type': ['application/json'],
        }
        expect(res).toEqual({
          ...response,
          statusCode: 400,
          error: expectedError,
        })
        resolve()
      }
      const httpMiddleware = createHttpMiddleware()
      nock(defaultHost)
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

  it('handle failed response (not found)', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = createTestResponse({
        resolve,
        reject,
      })
      const next = (req, res) => {
        expect(res.error.message).toBe('URI not found: /foo/bar')
        expect(res.error.body).toBeUndefined()
        expect(res.body).toBeUndefined()
        expect(res.statusCode).toBe(404)
        resolve()
      }
      const httpMiddleware = createHttpMiddleware()
      nock(defaultHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(404)

      httpMiddleware(next)(request, response)
    }),
  )

  it('handle failed response (unmapped error code)', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = createTestResponse({
        resolve,
        reject,
      })
      const next = (req, res) => {
        expect(res.error.message).toBe('oops')
        expect(res.error.name).toBe('HttpError')
        expect(res.error.body).toEqual({ message: 'oops' })
        expect(res.body).toBeUndefined()
        expect(res.statusCode).toBe(415)
        resolve()
      }
      const httpMiddleware = createHttpMiddleware()
      nock(defaultHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(415, {
          message: 'oops',
        })

      httpMiddleware(next)(request, response)
    }),
  )
})
