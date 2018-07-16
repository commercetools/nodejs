import { createLoggerMiddleware } from '../src'

function createTestRequest(options) {
  return {
    uri: '',
    method: 'GET',
    body: null,
    headers: {},
    ...options,
  }
}

function createTestResponse(options) {
  return {
    ...options,
  }
}
// eslint-disable-next-line
const originalConsoleLog = console.log

describe('Logger', () => {
  beforeEach(() => {
    // Mock `console.log`
    // eslint-disable-next-line
    console.log = jest.fn()
  })

  afterEach(() => {
    // Reset original `console.log`
    // eslint-disable-next-line
    console.log = originalConsoleLog
  })

  test('log request / response', () => {
    const request = createTestRequest({
      uri: '/foo/bar',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const response = createTestResponse({
      resolve: jest.fn(),
      reject: jest.fn(),
      statusCode: 200,
      body: { foo: 'bar' },
      error: new Error('Oops'),
    })
    const loggerMiddleware = createLoggerMiddleware()

    const next = () => {
      /* eslint-disable */
      expect(console.log).toHaveBeenCalledTimes(2)
      expect(console.log).toHaveBeenCalledWith('Request: ', request)
      expect(console.log).toHaveBeenCalledWith('Response: ', {
        statusCode: response.statusCode,
        body: response.body,
        error: response.error,
      }) /* eslint-enable */
    }
    loggerMiddleware(next)(request, response)
  })
})
