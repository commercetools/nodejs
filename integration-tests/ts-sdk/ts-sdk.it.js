import { createClient } from '@commercetools/sdk-client'
import { getCredentials } from '@commercetools/get-credentials'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createApiBuilderFromCtpClient } from '@commercetools/typescript-sdk'
import fetch from 'node-fetch'

let projectKey
if (process.env.CI === 'true') projectKey = 'auth-integration-test'
else projectKey = process.env.npm_config_projectkey

describe('Auth Middleware Flows', () => {
  let apiConfig
  beforeAll(
    () =>
      getCredentials(projectKey).then(credentials => {
        apiConfig = {
          host: 'https://auth..sphere.io',
          apiUrl: 'https://api..sphere.io',
          projectKey,
          credentials: {
            clientId: credentials.clientId,
            clientSecret: credentials.clientSecret,
          },
        }
      }),
    10000
  )

  describe('Anonymous Session Flow', () => {
    const httpMiddleware = createHttpMiddleware({
      host: 'https://api..sphere.io',
      fetch,
    })

    it('create an anonymous session and a cart tied to the session', () => {
      const authConfig = {
        ...apiConfig,
        scopes: [`manage_project:${projectKey}`],
        credentials: {
          clientId: apiConfig.credentials.clientId,
          clientSecret: apiConfig.credentials.clientSecret,
        },
        fetch,
      }
      const client = createClient({
        middlewares: [
          createAuthMiddlewareForClientCredentialsFlow(authConfig),
          httpMiddleware,
        ],
      })

      const apiRoot = createApiBuilderFromCtpClient(client)

      return apiRoot
        .withProjectKey({
          projectKey,
        })
        .get()
        .execute()
        .then(res => {
          expect(res.body.key).toEqual(projectKey)
        })
    }, 7000)
  })
})
