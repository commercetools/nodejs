import { createAuthMiddlewareForExistingToken } from '../src'

describe('Existing Token', () => {
  const response = {
    statusText: 'OK',
    status: 200,
    body: null,
    headers: {},
  }
  const restOfRequest = {
    url: '',
    method: 'GET',
    body: null,
  }
  function createRequest(options) {
    return {
      url: '',
      method: 'GET',
      body: null,
      headers: {},
      ...options,
    }
  }
  function createTestMiddlewareOptions(options) {
    return {
      token: 'my-optimized-access-token',
      tokenType: 'Bearer',
      force: true,
      ...options,
    }
  }

  describe('No ardument', () => {
    it('should not modify request if no argument passed', () => {
      const request = createRequest()
      const next = req => {
        expect(req).toBe(request)
      }
      const authMiddleware = createAuthMiddlewareForExistingToken()
      authMiddleware(next)(request, response)
    })
  })

  describe('with argument as object', () => {
    it('should configure request header with options passed in', () => {
      const next = req => {
        expect(req).toEqual(expect.objectContaining(restOfRequest))
        expect(req).toEqual(
          expect.objectContaining({
            headers: { Authorization: 'Bearer my-optimized-access-token' },
          })
        )
      }
      const request = createRequest()
      const middlewareOptions = createTestMiddlewareOptions()
      const authMiddleware = createAuthMiddlewareForExistingToken(
        middlewareOptions
      )
      authMiddleware(next)(request, response)
    })

    it('should overide authorization if force is true', () => {
      const next = req => {
        expect(req).toEqual(expect.objectContaining(restOfRequest))
        expect(req).toEqual(
          expect.objectContaining({
            headers: { Authorization: 'Bearer my-optimized-access-token' },
          })
        )
      }
      const request = createRequest({
        headers: { Authorization: 'Basic old-access-token' },
      })
      const middlewareOptions = createTestMiddlewareOptions()
      const authMiddleware = createAuthMiddlewareForExistingToken(
        middlewareOptions
      )
      authMiddleware(next)(request, response)
    })

    it('should not overide authorization if force is false', () => {
      const next = req => {
        expect(req).toEqual(expect.objectContaining(restOfRequest))
        expect(req).toEqual(
          expect.objectContaining({
            headers: { Authorization: 'Basic old-access-token' },
          })
        )
      }
      const request = createRequest({
        headers: { Authorization: 'Basic old-access-token' },
      })
      const middlewareOptions = createTestMiddlewareOptions({ force: false })
      const authMiddleware = createAuthMiddlewareForExistingToken(
        middlewareOptions
      )
      authMiddleware(next)(request, response)
    })
  })

  describe('with argument as string', () => {
    it('should configure request header with default options and token', () => {
      const next = req => {
        expect(req).toEqual(expect.objectContaining(restOfRequest))
        expect(req).toEqual(
          expect.objectContaining({
            headers: { Authorization: 'Bearer my-token' },
          })
        )
      }
      const request = createRequest()
      const authMiddleware = createAuthMiddlewareForExistingToken('my-token')
      authMiddleware(next)(request, response)
    })
  })
})
