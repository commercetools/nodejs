import { createAuthMiddlewareForPasswordFlow } from '../src'

import authMiddlewareBase from '../src/base-auth-flow'

// required to be at the root because Jest hoists it above all requires,
// if in any method like `beforeAll`,
// it will be hoisted within the scope of that method
jest.mock('../src/base-auth-flow')

function createTestRequest(options) {
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
    host: 'https://auth.europe-west1.gcp.commercetools.com',
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
  afterAll(() => {
    jest.unmock('../src/base-auth-flow')
  })
  test('should call next if auth is present in the headers', () =>
    new Promise((resolve, reject) => {
      authMiddlewareBase.mockImplementation((params, next) => {
        next(params)
      })
      const request = createTestRequest({
        headers: {
          Authorization: 'bearer xxxx'
        }
      })
      const response = {
        resolve,
        reject,
      }
      const next = jest.fn().mockImplementation((actualParams) => {
        expect(actualParams)
          .toEqual({
            url: '',
            method: 'GET',
            body: null,
            headers: {
              Authorization: 'bearer xxxx'
            }
          })
        expect(next).toHaveBeenCalledTimes(1)
        expect(authMiddlewareBase).toHaveBeenCalledTimes(0)
        resolve()
        jest.unmock('../src/base-auth-flow')
      })
      const middlewareOptions = createTestMiddlewareOptions()
      const authMiddleware = createAuthMiddlewareForPasswordFlow(
        middlewareOptions
      )

      authMiddleware(next)(request, response)
    })
  )
  test('should call the base-auth-flow method with the right params', () =>
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
          url:
            'https://auth.europe-west1.gcp.commercetools.com/oauth/foo/customers/token',
          basicAuth: 'MTIzOnNlY3JldA==',
        })
        expect(authMiddlewareBase).toHaveBeenCalledTimes(1)
        jest.unmock('../src/base-auth-flow')
        resolve()
      }
      const middlewareOptions = createTestMiddlewareOptions()
      const authMiddleware = createAuthMiddlewareForPasswordFlow(
        middlewareOptions
      )

      authMiddleware(next)(request, response)
    }))
})
