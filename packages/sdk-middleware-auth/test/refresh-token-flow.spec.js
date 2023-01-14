import { createAuthMiddlewareForRefreshTokenFlow } from '../src'
import authMiddlewareBase from '../src/base-auth-flow'

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
    },
    refreshToken: 'foobar123@#%=',
    ...options,
  }
}

describe('Refresh Token Flow', () => {
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
      const authMiddleware = createAuthMiddlewareForRefreshTokenFlow(
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
          url: 'https://auth.europe-west1.gcp.commercetools.com/oauth/token',
          basicAuth: 'MTIzOnNlY3JldA==',
          body: 'grant_type=refresh_token&refresh_token=foobar123%40%23%25%3D',
        })
        expect(authMiddlewareBase).toHaveBeenCalledTimes(1)
        resolve()
        jest.unmock('../src/base-auth-flow')
      }
      const middlewareOptions = createTestMiddlewareOptions()
      const authMiddleware = createAuthMiddlewareForRefreshTokenFlow(
        middlewareOptions
      )

      authMiddleware(next)(request, response)
    }))
})
