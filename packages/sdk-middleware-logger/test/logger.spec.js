import { createLoggerMiddleware } from '../src';

function createTestRequest(options) {
  return {
    uri: '',
    method: 'GET',
    body: null,
    headers: {},
    ...options,
  };
}

function createTestResponse(options) {
  return {
    ...options,
  };
}

const originalConsoleLog = console.log;

describe('Logger', () => {
  beforeEach(() => {
    // Mock `console.log`
    console.log = jest.fn();
  });

  afterEach(() => {
    // Reset original `console.log`
    console.log = originalConsoleLog;
  });

  it('log request / response', () => {
    const request = createTestRequest({
      uri: '/foo/bar',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = createTestResponse({
      resolve: jest.fn(),
      reject: jest.fn(),
      statusCode: 200,
      body: { foo: 'bar' },
      error: new Error('Oops'),
    });
    const loggerMiddleware = createLoggerMiddleware();

    const next = () => {
      expect(console.log).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledWith('Request: ', request);
      expect(console.log).toHaveBeenCalledWith('Response: ', {
        statusCode: response.statusCode,
        body: response.body,
        error: response.error,
      });
    };
    loggerMiddleware(next)(request, response);
  });
});
