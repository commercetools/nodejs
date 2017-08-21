import { createClient } from '@commercetools/sdk-client'
import { getCredentials } from '@commercetools/get-credentials'
import {
  createAuthMiddlewareForPasswordFlow,
} from '@commercetools/sdk-middleware-auth'
import {
  createHttpMiddleware,
} from '@commercetools/sdk-middleware-http'
import { clearData, createData } from './../cli/helpers/utils'

let projectKey
if (process.env.CI === 'true')
  projectKey = 'customers-login-integration-test'
else
  projectKey = process.env.npm_config_projectkey

describe('Customer Login', () => {
  const httpMiddleware = createHttpMiddleware({
    host: 'https://api.sphere.io',
  })
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
    .then(() => createData(apiConfig, 'customers', [{
      email: userEmail,
      password: userPassword,
    }])),
  )
  afterAll(() => clearData(apiConfig, 'customers'))
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
