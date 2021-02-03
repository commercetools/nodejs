// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock'
import fetch from 'node-fetch'
import AbortController from 'abort-controller'
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

  test('throw without `fetch` passed and globally available', () => {
    expect(() => {
      createHttpMiddleware({ host: testHost })
    }).toThrow(
      new Error(
        '`fetch` is not available. Please pass in `fetch` as an option or have it globally available.'
      )
    )
  })

  test('throw without `AbortController` passed or globally available when using timeout', () => {
    expect(() => {
      createHttpMiddleware({ host: testHost, timeout: 100, fetch })
    }).toThrow(
      new Error(
        '`AbortController` is not available. Please pass in `getAbortController` as an option or have AbortController globally available when using timeout.'
      )
    )
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
      const httpMiddleware = createHttpMiddleware({
        host: testHost,
        fetch,
      })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    }))

  test("execute a get request which doesn't return a json response", () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res).toEqual({
          ...response,
          body: 'not json response',
          statusCode: 200,
        })
        resolve()
      }
      // Use default options
      const httpMiddleware = createHttpMiddleware({
        host: testHost,
        fetch,
      })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(200, 'not json response')

      httpMiddleware(next)(request, response)
    }))

  test("execute a get request which doesn't return a json response with retry", () =>
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
      const httpMiddleware = createHttpMiddleware({
        host: testHost,
        fetch,
        enableRetry: true,
      })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(200, 'not json response')

      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    }))

  test('execute a get request with timeout (success)', () =>
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
      const httpMiddleware = createHttpMiddleware({
        host: testHost,
        timeout: 1000, // time out after 1s
        fetch,
        abortController: new AbortController(),
      })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .delay(10) // delay response with 10ms
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    }))

  test('execute a get request with getAbortController timeout (success)', () => {
    expect.assertions(1)
    return new Promise((resolve, reject) => {
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
      const httpMiddleware = createHttpMiddleware({
        host: testHost,
        timeout: 1000, // time out after 1s
        fetch,
        getAbortController: () => new AbortController(),
      })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .delay(10) // delay response with 10ms
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    })
  })

  test('execute a get request with short timeout (fail)', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res).toEqual({
          ...response,
          error: expect.any(Error),
          statusCode: 0,
        })
        resolve()
      }
      // Use default options
      const httpMiddleware = createHttpMiddleware({
        host: testHost,
        timeout: 10, // time out after 10ms
        fetch,
        abortController: new AbortController(),
      })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .delay(100) // delay response with 100ms
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    }))

  test('execute a get request with getAbortController short timeout (fail)', () => {
    expect.assertions(1)
    return new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res).toEqual({
          ...response,
          error: expect.any(Error),
          statusCode: 0,
        })
        resolve()
      }
      // Use default options
      const httpMiddleware = createHttpMiddleware({
        host: testHost,
        timeout: 10, // time out after 10ms
        fetch,
        getAbortController: () => new AbortController(),
      })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .delay(100) // delay response with 100ms
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    })
  })

  test('execute a request with timeout and client re-use', () =>
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
      const httpMiddleware = createHttpMiddleware({
        host: testHost,
        timeout: 100, // time out after 100ms
        fetch,
        abortController: new AbortController(),
      })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(200, { foo: 'bar' })
      // Set delay to emulate instantiated SDK sitting idle
      setTimeout(() => {
        httpMiddleware(next)(request, response)
      }, 110)
    }))

  test('should accept HEAD request and return without response body', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({ uri: '/foo', method: 'HEAD' })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res).toEqual({
          ...response,
          statusCode: 200,
        })
        resolve()
      }
      // Use default options
      const httpOptions = {
        host: testHost,
        includeResponseHeaders: true,
        fetch,
      }
      const httpMiddleware = createHttpMiddleware(httpOptions)
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .head('/foo')
        .reply(200)

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
      const httpOptions = {
        host: testHost,
        includeResponseHeaders: true,
        fetch,
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

  test('should return the request in the response when enabled', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res.request).toEqual(
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
            },
          })
        )
        resolve()
      }
      // Use default options
      const httpOptions = {
        host: testHost,
        includeOriginalRequest: true,
        fetch,
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

  test('should maskSensitiveHeaderData in response by default', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res.request).toEqual(
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ********',
            },
          })
        )
        resolve()
      }
      // Use default options
      const httpOptions = {
        host: testHost,
        includeOriginalRequest: true,
        fetch,
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

  test('should not maskSensitiveHeaderData in the response when disabled', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
        headers: {
          authorization: 'Bearer 123',
        },
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res.request).toEqual(
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
              authorization: 'Bearer 123',
            },
          })
        )
        resolve()
      }
      // Use custom options
      const httpOptions = {
        host: testHost,
        includeOriginalRequest: true,
        maskSensitiveHeaderData: false,
        fetch,
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
      const httpMiddleware = createHttpMiddleware({
        host: testHost,
        fetch,
      })
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
      const httpMiddleware = createHttpMiddleware({
        host: testHost,
        fetch,
      })
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
      const httpMiddleware = createHttpMiddleware({
        host: testHost,
        fetch,
      })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .replyWithError('Connection timeout')

      httpMiddleware(next)(request, response)
    }))

  describe('::repeater', () => {
    test('should retry on network error if enabled', () =>
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
          fetch,
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

    test('should retry on 503 (Service Unavailable) if enabled', () =>
      new Promise((resolve, reject) => {
        const request = createTestRequest({
          uri: '/foo/bar',
        })
        const response = { resolve, reject }
        const next = (req, res) => {
          expect(res.error.name).toBe('ServiceUnavailable')
          expect(res.error.originalRequest).toBeDefined()
          expect(res.body).toBeUndefined()
          expect(res.statusCode).toBe(503)
          expect(res.error.retryCount).toBe(2)
          resolve()
        }
        const options = {
          host: testHost,
          enableRetry: true,
          retryConfig: {
            maxRetries: 2,
            retryDelay: 300,
          },
          fetch,
        }
        const httpMiddleware = createHttpMiddleware(options)
        nock(testHost).get('/foo/bar').times(3).reply(503)

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
            fetch,
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
          fetch,
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
          'content-type': 'application/json',
        }
        expect(res).toEqual({
          ...response,
          statusCode: 400,
          error: expectedError,
        })
        resolve()
      }
      const httpMiddleware = createHttpMiddleware({
        host: testHost,
        fetch,
      })
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
          'content-type': 'application/json',
        }
        expect(res).toEqual({
          ...response,
          statusCode: 500,
          error: expectedError,
        })
        resolve()
      }
      const httpMiddleware = createHttpMiddleware({
        host: testHost,
        fetch,
      })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(500, 'non json error occurred')

      httpMiddleware(next)(request, response)
    }))

  test('should maskSensitiveHeaderData in non-JSON error by default', () =>
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
          'content-type': 'application/json',
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
        fetch,
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

  test('should not maskSensitiveHeaderData in non-JSON error when disabled', () =>
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
          'content-type': 'application/json',
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
            authorization: 'Bearer 123',
            Authorization: 'Bearer 123',
          },
        })
        resolve()
      }
      // Use custom options
      const httpOptions = {
        host: testHost,
        includeOriginalRequest: true,
        maskSensitiveHeaderData: false,
        fetch,
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
      const httpMiddleware = createHttpMiddleware({
        host: testHost,
        fetch,
      })
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
      const httpMiddleware = createHttpMiddleware({
        host: testHost,
        fetch,
      })
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

  test('should maskSensitiveHeaderData in error response by default', () =>
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
        fetch,
      }
      const httpMiddleware = createHttpMiddleware(httpOptions)
      nock(testHost)
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get('/foo/bar')
        .replyWithError({ code: 'ENOTFOUND' })

      httpMiddleware(next)(request, response)
    }))

  test('should not maskSensitiveHeaderData in error response when disabled', () =>
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
            authorization: 'Bearer 123',
            Authorization: 'Bearer 123',
          },
        })
        resolve()
      }
      // Use custom options
      const httpOptions = {
        host: testHost,
        includeOriginalRequest: true,
        maskSensitiveHeaderData: false,
        fetch,
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
      const httpMiddleware = createHttpMiddleware({
        host: sampleHost,
        fetch,
      })
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
      const httpMiddleware = createHttpMiddleware({
        host: sampleHost,
        fetch,
      })
      nock(sampleHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .get('/foo/bar')
        .reply(200, { foo: 'bar' })

      httpMiddleware(next)(request, response)
    }))

  test('execute a post request with empty 202 response', () =>
    new Promise((resolve, reject) => {
      const request = createTestRequest({
        uri: '/foo/bar',
        method: 'POST',
      })
      const response = { resolve, reject }
      const next = (req, res) => {
        expect(res).toEqual({
          ...response,
          body: {},
          statusCode: 202,
        })
        resolve()
      }
      // Use default options
      const httpMiddleware = createHttpMiddleware({
        host: testHost,
        fetch,
      })
      nock(testHost)
        .defaultReplyHeaders({
          'Content-Type': 'application/json',
        })
        .post('/foo/bar')
        .reply(202, undefined)

      httpMiddleware(next)(request, response)
    }))
})
