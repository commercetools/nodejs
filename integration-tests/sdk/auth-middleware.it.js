import { createClient } from '@commercetools/sdk-client'
import { getCredentials } from '@commercetools/get-credentials'
import {
  createAuthMiddlewareForPasswordFlow,
  createAuthMiddlewareForRefreshTokenFlow,
  createAuthMiddlewareForAnonymousSessionFlow,
} from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import fetch from 'node-fetch'
import { clearData, createData } from '../cli/helpers/utils'

let projectKey
if (process.env.CI === 'true') projectKey = 'auth-integration-test'
else projectKey = process.env.npm_config_projectkey

describe('Auth Middleware Flows', () => {
  let apiConfig
  const userEmail = `user+date_is/\\${Date.now()}@commercetooler.com`
  const userPassword = '4^lks*aJ@ETso+/\\HdE1!x0u4q5'
  const customerPredicate = `email="${encodeURIComponent(userEmail)}"`
  beforeAll(
    () =>
      getCredentials(projectKey)
        .then((credentials) => {
          apiConfig = {
            host: 'https://auth.europe-west1.gcp.commercetools.com',
            apiUrl: 'https://api.europe-west1.gcp.commercetools.com',
            projectKey,
            credentials: {
              clientId: credentials.clientId,
              clientSecret: credentials.clientSecret,
            },
          }
        })
        .then(() => clearData(apiConfig, 'customers', customerPredicate))
        .then(() => clearData(apiConfig, 'carts'))
        .then(() =>
          createData(apiConfig, 'customers', [
            {
              email: userEmail,
              password: userPassword,
            },
          ])
        ),
    10000
  )

  afterAll(async () => {
    await clearData(apiConfig, 'customers', customerPredicate)
    await clearData(apiConfig, 'carts')
  })

  describe('Password Session Flow', () => {
    const httpMiddleware = createHttpMiddleware({
      host: 'https://api.europe-west1.gcp.commercetools.com',
      fetch,
    })

    it('should log customer and fetch customer profile', () => {
      const userConfig = {
        ...apiConfig,
        ...{ scopes: [`manage_project:${projectKey}`] },
        ...{
          credentials: {
            clientId: apiConfig.credentials.clientId,
            clientSecret: apiConfig.credentials.clientSecret,
            user: {
              username: userEmail,
              password: userPassword,
            },
          },
        },
        fetch,
      }
      const client = createClient({
        middlewares: [
          createAuthMiddlewareForPasswordFlow(userConfig),
          httpMiddleware,
        ],
      })
      return client
        .execute({
          uri: `/${projectKey}/me`,
          method: 'GET',
        })
        .then((response) => {
          const user = response.body
          expect(user).toHaveProperty('email', userEmail)
        })
    })
  })

  describe('Anonymous Session Flow', () => {
    const httpMiddleware = createHttpMiddleware({
      host: 'https://api.europe-west1.gcp.commercetools.com',
      fetch,
    })

    it('create an anonymous session and a cart tied to the session', () => {
      const anonymousId = `${Date.now()}-bar`
      const userConfig = {
        ...apiConfig,
        ...{ scopes: [`manage_project:${projectKey}`] },
        ...{
          credentials: {
            clientId: apiConfig.credentials.clientId,
            clientSecret: apiConfig.credentials.clientSecret,
            anonymousId,
          },
        },
        fetch,
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
      return client
        .execute({
          // creates a cart that is tied to the logged in anonymous token
          uri: `/${projectKey}/me/carts`,
          method: 'POST',
          body: cartMock,
        })
        .then(({ body: cart }) => {
          expect(cart).toHaveProperty('anonymousId', anonymousId)
          return client.execute({
            // fetch all carts tied to the anonymous token, if cart is present,
            // then the cart was tied to the token
            uri: `/${projectKey}/me/carts`,
            method: 'GET',
          })
        })
        .then(({ body: { results: carts } }) => {
          expect(carts).toHaveLength(1)
          expect(carts[0]).toHaveProperty('anonymousId', anonymousId)
        })
    }, 7000)
  })

  describe('Refresh Token Flow', () => {
    it('uses the refresh token', () => {
      const httpMiddleware = createHttpMiddleware({
        host: 'https://api.europe-west1.gcp.commercetools.com',
        includeOriginalRequest: true,
        fetch,
      })
      const anonymousId = `${Date.now()}-fooo`
      const cred = apiConfig.credentials
      const url = `${apiConfig.host}/oauth/${projectKey}/anonymous/token`
      const basicAuth = Buffer.from(
        `${cred.clientId}:${cred.clientSecret}`
      ).toString('base64')
      const body = `grant_type=client_credentials&anonymous_id=${anonymousId}`

      let tokenObject
      // manually fetch a token outside the scope of the sdk-client
      // this returns a refresh_token and we can use in the
      // createAuthMiddlewareForRefreshTokenFlow to fetch a new token.
      return fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Length': Buffer.byteLength(body).toString(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      })
        .then((res) => res.json())
        .then((jsonResponse) => {
          tokenObject = { ...jsonResponse }

          const client = createClient({
            middlewares: [httpMiddleware],
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
            fetch,
          }
          const client = createClient({
            middlewares: [
              createAuthMiddlewareForRefreshTokenFlow(userConfig),
              httpMiddleware,
            ],
          })
          return client.execute({
            // fetch all carts tied to the anonymous token, if cart is present,
            // then the cart belongs to the same anonymousId
            uri: `/${projectKey}/me/carts`,
            method: 'GET',
          })
        })
        .then(
          ({
            body: { results: carts },
            request: {
              headers: {
                Authorization: [token],
              },
            },
          }) => {
            // Assert that a different token was used to fetch the carts
            expect(token).toMatch(/Bearer .*/)
            expect(token).not.toEqual(
              expect.stringContaining(tokenObject.access_token)
            )
            // Assert that cart belongs to the same anonymousId
            expect(carts).toHaveLength(1)
            expect(carts[0]).toHaveProperty('anonymousId', anonymousId)
          }
        )
    }, 7000)
  })
})
