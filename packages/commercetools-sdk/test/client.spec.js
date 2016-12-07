import {
  createAuthMiddlewareForClientCredentialsFlow,
} from '../../commercetools-sdk-middleware-auth/src'
// import httpMiddleware from '../../commercetools-sdk-middlware-http/src'
// import authMiddleware from '@commercetools/sdk-middleware-auth'
// import httpMiddleware from '@commercetools/sdk-middleware-http'
import {
  createClient,
} from '../src/client'

const request = {
  url: 'https://api.sphere.io/test/products',
  method: 'GET',
  body: null,
  headers: {},
}

const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
  projectKey: 'test',
  credentials: {
    clientId: '123',
    clientSecret: 'secret',
  },
})

const client = createClient({
  middlewares: [
    authMiddleware,
    // httpMiddleware,
  ],
})

describe('middlewares', () => {
  it('should work', () =>
    client.execute(request)
    .then((body) => {
      expect(body).toEqual({ foo: 'bar' })
    }),
  )
})
