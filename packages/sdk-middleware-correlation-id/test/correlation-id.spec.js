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
  beforeEach(() => {})

  afterEach(() => {})
})
