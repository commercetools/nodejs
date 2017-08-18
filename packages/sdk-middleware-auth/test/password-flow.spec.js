import {
  createAuthMiddlewareForPasswordFlow,
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
      user: {
        username: 'foobar',
        password: 'verysecurepassword',
      },
    },
    ...options,
  }
}

describe('Password Flow', () => {
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
        expect(request).toEqual(actualParams.request)
        expect(response).toEqual(actualParams.response)
        expect(response).toEqual(actualParams.response)
        expect([]).toEqual(actualParams.pendingTasks)
        expect(
          'https://auth.commercetools.co/oauth/foo/token/customers/token',
        ).toBe(actualParams.url)
        expect('MTIzOnNlY3JldA==').toBe(actualParams.basicAuth)
        expect(authMiddlewareBase).toHaveBeenCalledTimes(1)
        resolve()
      }
      const middlewareOptions = createTestMiddlewareOptions()
      const authMiddleware = createAuthMiddlewareForPasswordFlow(
        middlewareOptions,
      )

      authMiddleware(next)(request, response)
    }),
  )
})
