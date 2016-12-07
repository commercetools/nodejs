import httpMiddleware from '../src/http-middleware'

function createTestRequest () {
  return {}
}

function createTestResponse (options) {
  return {
    resolve: jest.fn(),
    reject: jest.fn(),
    body: null,
    statusCode: null,
    raw: null,
    ...options,
  }
}

describe('http middleware', () => {
  it('call next function with correct response argument', () =>
    new Promise((resolve /* , reject */) => {
      const request = createTestRequest()
      const response = createTestResponse()
      const next = (req, res) => {
        expect(res).toEqual({
          ...response,
          body: { foo: 'bar' },
          statusCode: 200,
        })
        resolve()
      }
      httpMiddleware(next)(request, response)
    }),
  )
})
