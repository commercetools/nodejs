// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock'
import {
  createAuthMiddlewareForClientCredentialsFlow,
} from '../../commercetools-sdk-middleware-auth/src'
import {
  createHttpMiddleware,
} from '../../commercetools-sdk-middleware-http/src'
// import authMiddleware from '@commercetools/sdk-middleware-auth'
// import httpMiddleware from '@commercetools/sdk-middleware-http'
import {
  createClient,
} from '../src'

const request = {
  url: '/test/products',
  method: 'GET',
  body: null,
  headers: {},
}

const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
  host: 'https://auth.sphere.io',
  projectKey: 'test',
  credentials: {
    clientId: '123',
    clientSecret: 'secret',
  },
})
const httpMiddleware = createHttpMiddleware({
  host: 'https://api.sphere.io',
})

const client = createClient({
  middlewares: [
    authMiddleware,
    httpMiddleware,
  ],
})

describe('Client integration', () => {
  // Mock auth
  nock('https://auth.sphere.io')
    .persist() // <-- use the same interceptor for all requests
    .filteringRequestBody(() => '*')
    .post('/oauth/token', '*')
    .reply(200, {
      access_token: 'xxx',
      expires_in: (Date.now() + (60 * 60 * 24)),
    })
  const url1 = '/test/products/1'
  const url2 = '/test/products/2'
  // Mock http
  nock('https://api.sphere.io')
    .get(url1)
    .reply(200, {
      id: '123',
      version: 1,
    })
    .get(url2)
    .reply(400, {
      message: 'Invalid password',
    })

  it('execute and resolve a simple request', () =>
    client.execute({ ...request, url: url1 })
    .then((response) => {
      expect(response).toEqual({
        body: {
          id: '123',
          version: 1,
        },
        statusCode: 200,
      })
    }),
  )

  it('execute and reject a request', () =>
    client.execute({ ...request, url: url2 })
    .then(() =>
      Promise.reject(
        'This function should never be called, the response was rejected',
      ),
    )
    .catch((error) => {
      expect(error.message).toEqual('Invalid password')
      return Promise.resolve()
    }),
  )
})
