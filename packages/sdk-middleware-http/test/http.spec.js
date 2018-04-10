// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock'
import { createHttpMiddleware } from '../src'

function createTestRequest(options) {
  return {
    uri: '',
    method: 'GET',
    body: null,
    headers: {},
    ...options,
  }
}

const testHost = 'https://api.commercetools.com'

describe('Http', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  test('execute a get request (success)', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res).toEqual({
          ...response,
          body: { foo: 'bar' },
          statusCode: 200,
        })
        resolve()
      }
      // Use default options
      const httpMiddleware = createHttpMiddleware({ host: testHost })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    }))

  test('should return the headers in the response when enabled', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = { resolve, reject }
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
      // Use default options
      const httpOptions = { host: testHost, includeResponseHeaders: true }
      const httpMiddleware = createHttpMiddleware(httpOptions)
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    }))

  test('should return the request in the response when enabled', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res.request).toMatchObject({
          method: 'GET',
          path: '/foo/bar',
          headers: {
            'content-type': ['application/json'],
          },
        })
        resolve()
      }
      // Use default options
      const httpOptions = { host: testHost, includeOriginalRequest: true }
      const httpMiddleware = createHttpMiddleware(httpOptions)
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    }))

  test('should maskSensitiveHeaderData in the response when enabled', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res.request).toMatchObject({
          method: 'GET',
          path: '/foo/bar',
          headers: {
            'content-type': ['application/json'],
            authorization: 'Bearer ********',
          },
        })
        resolve()
      }
      // Use default options
      const httpOptions = {
        host: testHost,
        includeOriginalRequest: true,
        maskSensitiveHeaderData: true,
      }
      const httpMiddleware = createHttpMiddleware(httpOptions)
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    }))

  test('execute a post request (success)', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
        method: 'POST',
        body: { hello: 'world' },
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res).toEqual({
          ...response,
          body: { foo: 'bar' },
          statusCode: 200,
        })
        resolve()
      }
      // Use custom options
      const httpMiddleware = createHttpMiddleware({ host: testHost })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .filteringRequestBody(() => '*')
        .post('/foo/bar', '*')
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    }))

  test('should accept a Buffer body', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
        method: 'POST',
        body: Buffer.from('test'),
        headers: {
          'Content-Type': 'image/jpeg',
        },
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res).toEqual({
          ...response,
          body: { foo: 'bar' },
          statusCode: 200,
        })
        resolve()
      }
      // Use custom options
      const httpMiddleware = createHttpMiddleware({ host: testHost })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .post('/foo/bar', 'test')
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    }))

  test('handle failed response (network error)', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res.error.name).toBe('NetworkError')
        expect(res.error.headers).toBeUndefined()
        expect(res.error.originalRequest).toBeDefined()
        expect(res.error.message).toBe(
          `request to ${testHost}/foo/bar failed, reason: Connection timeout`
        )
        expect(res.body).toBeUndefined()
        expect(res.statusCode).toBe(0)
        resolve()
      }
      const httpMiddleware = createHttpMiddleware({ host: testHost })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .replyWithError('Connection timeout')

      httpMiddleware(next)(request, response)
    }))

  describe('::repeater', () => {
    test('should retry on network error(503) if enabled', () =>
      new Promise((resolve, reject) => {
        const request = createTestRequest({
          uri: '/foo/bar',
        })
        const response = { resolve, reject }
        const next = (req, res) => {
          expect(res.error.name).toBe('NetworkError')
          expect(res.error.headers).toBeUndefined()
          expect(res.error.originalRequest).toBeDefined()
          expect(res.error.retryCount).toBe(2)
          expect(res.error.message).toBe(
            `request to ${testHost}/foo/bar failed, reason: Connection timeout`
          )
          expect(res.body).toBeUndefined()
          expect(res.statusCode).toBe(0)
          resolve()
        }
        const options = {
          host: testHost,
          enableRetry: true,
          retryConfig: {
            maxRetries: 2,
            retryDelay: 300,
          },
        }
        const httpMiddleware = createHttpMiddleware(options)
        nock(testHost)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .get('/foo/bar')
          .times(3)
          .replyWithError('Connection timeout')

        httpMiddleware(next)(request, response)
      }))

    test(
      'should toggle `exponential backoff` off',
      () =>
        new Promise((resolve, reject) => {
          const request = createTestRequest({
            uri: '/foo/bar',
          })
          const response = { resolve, reject }
          const next = (req, res) => {
            expect(res.error.name).toBe('NetworkError')
            expect(res.error.headers).toBeUndefined()
            expect(res.error.originalRequest).toBeDefined()
            expect(res.error.retryCount).toBe(2)
            expect(res.error.message).toBe(
              `request to ${testHost}/foo/bar failed, reason: Connection timeout`
            )
            expect(res.body).toBeUndefined()
            expect(res.statusCode).toBe(0)
            resolve()
          }
          const options = {
            host: testHost,
            enableRetry: true,
            retryConfig: {
              maxRetries: 2,
              backoff: false,
              retryDelay: 300,
            },
          }
          const httpMiddleware = createHttpMiddleware(options)
          nock(testHost)
            .defaultReplyHeaders({
              'Content-Type': 'application/json',
            })
            .get('/foo/bar')
            .times(3)
            .replyWithError('Connection timeout')

          httpMiddleware(next)(request, response)
        }),
      700 /* retryDelay of 300 * 2 */
    )

    test('should not retry on 404 (not found) error', () =>
      new Promise((resolve, reject) => {
        const request = createTestRequest({
          uri: '/foo/bar',
        })
        const response = { resolve, reject }
        const next = (req, res) => {
          expect(res.error.message).toBe('URI not found: /foo/bar')
          expect(res.error.body).toBeFalsy()
          expect(res.body).toBeFalsy()
          expect(res.statusCode).toBe(404)
          resolve()
        }
        const options = {
          host: testHost,
          enableRetry: true,
          retryConfig: {
            maxRetries: 2,
            retryDelay: 300,
          },
        }
        const httpMiddleware = createHttpMiddleware(options)
        nock(testHost)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .get('/foo/bar')
          .reply(404)

        httpMiddleware(next)(request, response)
      }))
  })

  test('handle failed response (api error)', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = { resolve, reject }
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
      const httpMiddleware = createHttpMiddleware({ host: testHost })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(400, {
          message: 'oops',
          error: [{ code: 'InvalidField' }],
        })

      httpMiddleware(next)(request, response)
    }))

  test('return non-JSON error to user', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        const expectedError = new Error('non json error occurred')
        expectedError.body = {
          message: 'non json error occurred',
          error: [{ code: 'InvalidField' }],
        }
        expectedError.code = 500
        expectedError.statusCode = 500
        expectedError.headers = {
          'content-type': ['application/json'],
        }
        expect(res).toEqual({
          ...response,
          statusCode: 500,
          error: expectedError,
        })
        resolve()
      }
      const httpMiddleware = createHttpMiddleware({ host: testHost })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(500, 'non json error occurred')

      httpMiddleware(next)(request, response)
    }))

  test('should maskSensitiveHeaderData in non-JSON error', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
        headers: {
          authorization: 'Bearer 123',
          Authorization: 'Bearer 123',
        },
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        const expectedError = new Error('non json error occurred')
        expectedError.body = {
          message: 'non json error occurred',
          error: [{ code: 'InvalidField' }],
        }
        expectedError.code = 500
        expectedError.statusCode = 500
        expectedError.headers = {
          'content-type': ['application/json'],
        }
        expect(res).toEqual({
          ...response,
          statusCode: 500,
          error: expectedError,
        })
        expect(res.error.originalRequest).toMatchObject({
          body: null,
          method: 'GET',
          uri: '/foo/bar',
          headers: {
            authorization: 'Bearer ********',
            Authorization: 'Bearer ********',
          },
        })
        resolve()
      }
      // Use default options
      const httpOptions = {
        host: testHost,
        includeOriginalRequest: true,
        maskSensitiveHeaderData: true,
      }
      const httpMiddleware = createHttpMiddleware(httpOptions)
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(500, 'non json error occurred')

      httpMiddleware(next)(request, response)
    }))

  test('handle failed response (not found)', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res.error.message).toBe('URI not found: /foo/bar')
        expect(res.error.body).toBeFalsy()
        expect(res.body).toBeFalsy()
        expect(res.statusCode).toBe(404)
        resolve()
      }
      const httpMiddleware = createHttpMiddleware({ host: testHost })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(404)

      httpMiddleware(next)(request, response)
    }))

  test('handle failed response (unmapped error code)', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res.error.message).toBe('oops')
        expect(res.error.name).toBe('HttpError')
        expect(res.error.body).toEqual({ message: 'oops' })
        expect(res.body).toBeUndefined()
        expect(res.statusCode).toBe(415)
        resolve()
      }
      const httpMiddleware = createHttpMiddleware({ host: testHost })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(415, {
          message: 'oops',
        })

      httpMiddleware(next)(request, response)
    }))

  test('should maskSensitiveHeaderData in error response when enabled', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
        headers: {
          authorization: 'Bearer 123',
          Authorization: 'Bearer 123',
        },
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res.error.name).toBe('NetworkError')
        expect(res.error.originalRequest).toMatchObject({
          body: null,
          method: 'GET',
          uri: '/foo/bar',
          headers: {
            authorization: 'Bearer ********',
            Authorization: 'Bearer ********',
          },
        })
        resolve()
      }
      // Use default options
      const httpOptions = {
        host: testHost,
        includeOriginalRequest: true,
        maskSensitiveHeaderData: true,
      }
      const httpMiddleware = createHttpMiddleware(httpOptions)
      nock(testHost)
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/foo/bar')
        .replyWithError({ code: 'ENOTFOUND' })

      httpMiddleware(next)(request, response)
    }))

  test('parses a host that ends with slash', () =>
    new Promise((resolve, reject) => {
      const sampleHost = 'https://api.commercetools.com/'
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res.statusCode).toBe(200)
        resolve()
      }
      const httpMiddleware = createHttpMiddleware({ host: sampleHost })
      nock(sampleHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    }))

  test('parses a host that ends without slash', () =>
    new Promise((resolve, reject) => {
      const sampleHost = 'https://api.commercetools.com'
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res.statusCode).toBe(200)
        resolve()
      }
      const httpMiddleware = createHttpMiddleware({ host: sampleHost })
      nock(sampleHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    }))
})
