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
        expect(actualParams).toMatchObject({
          request,
          response,
          pendingTasks: [],
          url: 'https://auth.commercetools.co/oauth/foo/customers/token',
          basicAuth: 'MTIzOnNlY3JldA==',
        })
        expect(authMiddlewareBase).toHaveBeenCalledTimes(1)
        jest.unmock('../src/base-auth-flow')
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
