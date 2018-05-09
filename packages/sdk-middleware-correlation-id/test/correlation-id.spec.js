import { createCorrelationIdMiddleware } from '../src'

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

describe('CorrelationId', () => {
  const correlationId = 'abc-def-123'
  const middlewareOptions = {
    generate: jest.fn(() => correlationId),
  }
  const request = createTestRequest({
    headers: {
      Authorization: '123',
    },
  })
  const response = createTestResponse()
  const correlationIdMiddleware = createCorrelationIdMiddleware(
    middlewareOptions
  )

  const next = req => {
    test('retains existing headers', () => {
      expect(req.headers.Authorization).toBe('123')
    })

    test('adds an `X-Correlation-ID` header', () => {
      expect(req.headers['X-Correlation-ID']).toBe(correlationId)
    })

    test('invokes `generate` on the middleware options', () => {
      expect(middlewareOptions.generate).toHaveBeenCalled()
    })
  }

  correlationIdMiddleware(next)(request, response)
})
