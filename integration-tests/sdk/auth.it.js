import { createClient } from '@commercetools/sdk-client'
import { getCredentials } from '@commercetools/get-credentials'
import {
  createAuthMiddlewareForPasswordFlow,
  createAuthMiddlewareForRefreshTokenFlow,
  createAuthMiddlewareForAnonymousSessionFlow,
} from '@commercetools/sdk-middleware-auth'
import {
  createHttpMiddleware,
} from '@commercetools/sdk-middleware-http'
/* global fetch */
import 'isomorphic-fetch'
import { clearData, createData } from './../cli/helpers/utils'

let projectKey
if (process.env.CI === 'true')
  projectKey = 'auth-integration-test'
else
  projectKey = process.env.npm_config_projectkey


describe('Auth Flows', () => {
  let apiConfig
  const userEmail = `abi${Date.now()}@commercetooler.com`
  const userPassword = 'asdifficultaspossible'
  beforeAll(() => getCredentials(projectKey)
    .then((credentials) => {
      apiConfig = {
        host: 'https://auth.sphere.io',
        apiUrl: 'https://api.sphere.io',
        projectKey,
        credentials: {
          clientId: credentials.clientId,
          clientSecret: credentials.clientSecret,
        },
      }
    })
    .then(() => clearData(apiConfig, 'customers'))
    .then(() => clearData(apiConfig, 'carts'))
    .then(() => createData(apiConfig, 'customers', [{
      email: userEmail,
      password: userPassword,
    }]))
  , 10000)
  afterAll(() => {
    clearData(apiConfig, 'customers')
    .then(() => clearData(apiConfig, 'carts'))
  })
  describe('Password Session Flow', () => {
    const httpMiddleware = createHttpMiddleware({
      host: 'https://api.sphere.io',
    })

    it('should log customer and fetch customer profile', () => {
      const userConfig = {
        ...apiConfig,
        ...{ scopes: [ `manage_project:${projectKey}` ] },
        ...{ credentials: {
          clientId: apiConfig.credentials.clientId,
          clientSecret: apiConfig.credentials.clientSecret,
          user: {
            username: userEmail,
            password: userPassword,
          },
        } },
      }
      const client = createClient({
        middlewares: [
          createAuthMiddlewareForPasswordFlow(userConfig),
          httpMiddleware,
        ],
      })
      return client.execute({
        uri: `/${projectKey}/me`,
        method: 'GET',
      }).then((response) => {
        const user = response.body
        expect(user).toHaveProperty('email', userEmail)
      })
    })
  })

  describe('Anonymous Session Flow', () => {
    const httpMiddleware = createHttpMiddleware({
      host: 'https://api.sphere.io',
    })

    it('create an anonymous session and a cart tied to the session', () => {
      const anonymousId = `${Date.now()}-bar`
      const userConfig = {
        ...apiConfig,
        ...{ scopes: [ `manage_project:${projectKey}` ] },
        ...{ credentials: {
          clientId: apiConfig.credentials.clientId,
          clientSecret: apiConfig.credentials.clientSecret,
          anonymousId,
        } },
      }
      const client = createClient({
        middlewares: [
          createAuthMiddlewareForAnonymousSessionFlow(userConfig),
          httpMiddleware,
        ],
      })
      const cartMock = {
        currency: 'EUR',
      }
      return client.execute({
        // creates a cart that is tied to the logged in anonymous token
        uri: `/${projectKey}/me/carts`,
        method: 'POST',
        body: cartMock,
      }).then(({ body: cart }) => {
        expect(cart).toHaveProperty('anonymousId', anonymousId)
        return client.execute({
          // fetch all carts tied to the anonymous token, if cart is present,
          // then the cart was tied to the token
          uri: `/${projectKey}/me/carts`,
          method: 'GET',
        })
      }).then(({ body: { results: carts } }) => {
        expect(carts).toHaveLength(1)
        expect(carts[0]).toHaveProperty('anonymousId', anonymousId)
      })
    }, 7000)
  })

  describe('Refresh Token Flow', () => {
    it('uses the refresh token', () => {
      const httpMiddleware = createHttpMiddleware({
        host: 'https://api.sphere.io',
        includeOriginalRequest: true,
      })
      const anonymousId = `${Date.now()}-fooo`
      const cred = apiConfig.credentials
      const url = `${apiConfig.host}/oauth/${projectKey}/anonymous/token`
      const basicAuth = new Buffer(`${cred.clientId}:${cred.clientSecret}`)
        .toString('base64')
      const body = `grant_type=client_credentials&anonymous_id=${anonymousId}`

      let tokenObject

      return fetch(
        url,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Length': Buffer.byteLength(body).toString(),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        },
      )
      .then(res => res.json())
      .then((jsonResponse) => {
        tokenObject = jsonResponse

        const client = createClient({
          middlewares: [ httpMiddleware ],
        })
        const cartMock = {
          currency: 'EUR',
        }

        return client.execute({
          // creates a cart that is tied to the logged in anonymous token
          uri: `/${projectKey}/me/carts`,
          method: 'POST',
          body: cartMock,
          headers: {
            Authorization: `Bearer ${tokenObject.access_token}`,
          },
        })
      })
      .then(({ body: cart }) => {
        expect(cart).toHaveProperty('anonymousId', anonymousId)

        // fetch another token with the refresh token flow
        const userConfig = {
          ...apiConfig,
          refreshToken: tokenObject.refresh_token,
        }
        const client = createClient({
          middlewares: [
            createAuthMiddlewareForRefreshTokenFlow(userConfig),
            httpMiddleware,
          ],
        })
        return client.execute({
          // fetch all carts tied to the anonymous token, if cart is present,
          // then the cart was tied to the token
          uri: `/${projectKey}/me/carts`,
          method: 'GET',
        })
      })
      .then(({
        body: { results: carts },
        request: { headers: { authorization: [token] } },
      }) => {
        // Assert that a different token was used to fetch the carts
        expect(token)
          .toMatch(/Bearer .*/)
        expect(token)
          .not.toEqual(expect.stringContaining(tokenObject.access_token))
        // Assert that cart belongs to the same anonymousId
        expect(carts).toHaveLength(1)
        expect(carts[0]).toHaveProperty('anonymousId', anonymousId)
      })
    }, 7000)
  })
})
