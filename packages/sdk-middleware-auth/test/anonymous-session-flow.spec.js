import {
  createAuthMiddlewareForAnonymousSessionFlow,
} from '../src'

import authMiddlewareBase from '../src/base-auth-flow'

jest.mock('../src/base-auth-flow')

function createTestRequest (options) {
  return {
    url: '',
    method: 'GET',
    body: null,
    headers: {},
    ...options,
  }
}

function createTestMiddlewareOptions (options) {
  return {
    host: 'https://auth.commercetools.co',
    projectKey: 'foo',
    credentials: {
      clientId: '123',
      clientSecret: 'secret',
      anonymousId: 'secretme',
    },
    ...options,
  }
}

describe('Anonymous Session Flow', () => {
  it('should call the base-auth-flow method with the right params', () =>
    new Promise((resolve, reject) => {
      authMiddlewareBase.mockImplementation((params, next) => {
        next(params) // makes it easy to test what was passed in
      })
      const request = createTestRequest()
      const response = {
        resolve,
        reject,
      }
      const next = (actualParams) => {
        expect(actualParams.request).toEqual(actualParams.request)
        expect(actualParams.response).toEqual(actualParams.response)
        expect(actualParams.pendingTasks).toEqual([])
        expect(actualParams.url).toBe(
          'https://auth.commercetools.co/oauth/foo/anonymous/token',
        )
        expect('MTIzOnNlY3JldA==').toBe(actualParams.basicAuth)
        expect(authMiddlewareBase).toHaveBeenCalledTimes(1)
        jest.unmock('../src/base-auth-flow')
        resolve()
      }
      const middlewareOptions = createTestMiddlewareOptions()
      const authMiddleware = createAuthMiddlewareForAnonymousSessionFlow(
        middlewareOptions,
      )

      authMiddleware(next)(request, response)
    }),
  )
})
