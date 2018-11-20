import fetch from 'node-fetch'
import { getCredentials } from '@commercetools/get-credentials'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createAuthMiddlewareWithExistingToken } from '@commercetools/sdk-middleware-auth'
import { createClient } from '@commercetools/sdk-client'
import SdkAuth, { TokenProvider } from '@commercetools/sdk-auth'
import { clearData, createData } from '../cli/helpers/utils'

let projectKey
if (process.env.CI === 'true') projectKey = 'auth-integration-test'
else projectKey = process.env.npm_config_projectkey

function getApiClient(token) {
  return createClient({
    middlewares: [
      createAuthMiddlewareWithExistingToken(token),
      createHttpMiddleware({
        host: 'https://api.sphere.io',
        fetch,
      }),
    ],
  })
}

describe('Auth Flows', () => {
  const userEmail = `user+date_is/${Date.now()}@commercetooler.com`
  const userPassword = 'testing4^lks*aJ@ETso+/\\HdE1!x0u4q5'
  const customerPredicate = `email="${userEmail}"`
  const customerUrl = createRequestBuilder({ projectKey })
    .customers.where(customerPredicate)
    .build()
  let apiConfig
  let authClient

  beforeAll(async () => {
    const credentials = await getCredentials(projectKey)
    apiConfig = {
      host: 'https://auth.sphere.io',
      apiUrl: 'https://api.sphere.io',
      projectKey,
      credentials: {
        clientId: credentials.clientId,
        clientSecret: credentials.clientSecret,
      },
      fetch,
    }

    await clearData(apiConfig, 'customers', customerPredicate)
    await createData(apiConfig, 'customers', [
      {
        email: userEmail,
        password: userPassword,
      },
    ])
  }, 5000)

  afterAll(async () => {
    await clearData(apiConfig, 'customers', customerPredicate)
  })

  beforeEach(() => {
    authClient = new SdkAuth(apiConfig)
  })

  describe('Anonymous Flow', () => {
    it('should authenticate and do a test request', async () => {
      // get access token with an anonymous flow
      const tokenInfo = await authClient.anonymousFlow()

      // check returned properties
      expect(tokenInfo).toHaveProperty('access_token')
      expect(tokenInfo).toHaveProperty('scope', `manage_project:${projectKey}`)
      expect(tokenInfo).toHaveProperty('expires_in')
      expect(tokenInfo).toHaveProperty('expires_at')
      expect(tokenInfo).toHaveProperty('refresh_token')
      expect(tokenInfo).toHaveProperty('token_type', 'Bearer')

      // use client to do a test request
      const client = getApiClient(
        `${tokenInfo.token_type} ${tokenInfo.access_token}`
      )
      const response = await client.execute({
        uri: customerUrl,
        method: 'GET',
      })

      expect(response).toHaveProperty('body.count', 1)
    })
  })

  describe('Customer Password Flow', () => {
    it('should authorize with customer credentials', async () => {
      // get access token with a password flow
      const tokenInfo = await authClient.customerPasswordFlow({
        username: userEmail,
        password: userPassword,
      }, {
        disableRefreshToken: true
      })

      // check returned properties
      expect(tokenInfo).toHaveProperty('access_token')
      expect(tokenInfo).toHaveProperty('scope', `manage_project:${projectKey}`)
      expect(tokenInfo).toHaveProperty('expires_in')
      expect(tokenInfo).not.toHaveProperty('refresh_token')
      expect(tokenInfo).toHaveProperty('token_type', 'Bearer')

      // use client to do a test request
      const client = getApiClient(
        `${tokenInfo.token_type} ${tokenInfo.access_token}`
      )
      const response = await client.execute({
        uri: `/${projectKey}/me`,
        method: 'GET',
      })

      expect(response).toHaveProperty('body.email', userEmail)
    })
  })

  describe('Client Credentials Flow', () => {
    it('should authorize with client credentials', async () => {
      const tokenInfo = await authClient.clientCredentialsFlow()

      // check returned properties
      expect(tokenInfo).toHaveProperty('access_token')
      expect(tokenInfo).toHaveProperty('scope', `manage_project:${projectKey}`)
      expect(tokenInfo).toHaveProperty('expires_in')
      expect(tokenInfo).toHaveProperty('token_type', 'Bearer')

      // use client to do a test request
      const client = getApiClient(
        `${tokenInfo.token_type} ${tokenInfo.access_token}`
      )
      const response = await client.execute({
        uri: customerUrl,
        method: 'GET',
      })

      expect(response).toHaveProperty('body.count', 1)
    })
  })

  describe('Refresh Token Flow', () => {
    it('should refresh token', async () => {
      const tokenInfo = await authClient.customerPasswordFlow({
        username: userEmail,
        password: userPassword,
      })

      expect(tokenInfo).toHaveProperty('refresh_token')

      const refreshTokenInfo = await authClient.refreshTokenFlow(
        tokenInfo.refresh_token
      )
      expect(tokenInfo.scope).toEqual(refreshTokenInfo.scope)

      // use client to do a test request
      const client = getApiClient(
        `${refreshTokenInfo.token_type} ${refreshTokenInfo.access_token}`
      )
      const response = await client.execute({
        uri: `/${projectKey}/me`,
        method: 'GET',
      })

      expect(response).toHaveProperty('body.email', userEmail)
    })
  })

  describe('Token Introspection', () => {
    it('should introspect a valid token', async () => {
      // get access token with anonymous flow
      const tokenInfo = await authClient.clientCredentialsFlow()
      const introspection = await authClient.introspectToken(
        tokenInfo.access_token
      )

      expect(introspection).toHaveProperty('exp')
      expect(introspection).toHaveProperty('active', true)
      expect(introspection).toHaveProperty(
        'scope',
        `manage_project:${projectKey}`
      )
    })

    it('should introspect an invalid token', async () => {
      const introspection = await authClient.introspectToken('invalid_token')
      expect(introspection).toHaveProperty('active', false)
    })
  })

  describe('Token Provider', () => {
    it('should return access_token from provided tokenInfo', async () => {
      const tokenInfo = await authClient.anonymousFlow()
      const tokenProvider = new TokenProvider({ sdkAuth: authClient }, tokenInfo)

      const accessToken = await tokenProvider.getToken()
      expect(accessToken).toEqual(tokenInfo.access_token)
    })

    it('should refresh expired access_token', async () => {
      const onTokenInfoRefreshedMock = jest.fn()
      const tokenInfo = await authClient.anonymousFlow()
      tokenInfo.expires_at = 0 // emulate expired access_token

      const tokenProvider = new TokenProvider({
        sdkAuth: authClient,
        onTokenInfoRefreshed: onTokenInfoRefreshedMock
      }, tokenInfo)

      const accessToken = await tokenProvider.getToken()
      expect(accessToken).not.toEqual(tokenInfo.access_token)
      expect(onTokenInfoRefreshedMock).toHaveBeenCalledTimes(1)
      expect(accessToken).not.toEqual(onTokenInfoRefreshedMock.mock.calls[0][0].refresh_token)

      const newTokenInfo = await tokenProvider.getTokenInfo()
      expect(newTokenInfo.expires_at).not.toEqual(0)
      expect(newTokenInfo.access_token).not.toEqual(tokenInfo.access_token)
      expect(newTokenInfo.refresh_token).toEqual(tokenInfo.refresh_token)
    })

    it('should automatically retrieve tokenInfo', async () => {
      const tokenProvider = new TokenProvider({
        sdkAuth: authClient,
        fetchTokenInfo: sdkAuth => sdkAuth.clientCredentialsFlow()
      })

      const tokenInfo = await tokenProvider.getTokenInfo()
      // check returned properties
      expect(tokenInfo).toHaveProperty('access_token')
      expect(tokenInfo).toHaveProperty('scope', `manage_project:${projectKey}`)
      expect(tokenInfo).toHaveProperty('expires_in')
      expect(tokenInfo).toHaveProperty('token_type', 'Bearer')

      // use client to do a test request
      const client = getApiClient(
        `${tokenInfo.token_type} ${tokenInfo.access_token}`
      )
      const response = await client.execute({
        uri: customerUrl,
        method: 'GET',
      })

      expect(response).toHaveProperty('body.count', 1)
    })

    it('should throw an error when refresh token flow fails', async () => {
      const onTokenInfoRefreshedMock = jest.fn()
      const tokenInfo = await authClient.anonymousFlow()
      tokenInfo.expires_at = 0 // emulate expired access_token
      tokenInfo.refresh_token = 'invalid' // emulate broken refresh_token

      const tokenProvider = new TokenProvider({
        sdkAuth: authClient,
        onTokenInfoRefreshed: onTokenInfoRefreshedMock
      }, tokenInfo)

      try {
        await tokenProvider.getToken()
        throw new Error('Should throw an error')
      } catch (err) {
        expect(err.toString()).toEqual(expect.stringContaining(
          'BadRequest: The refresh token was not found. It may have expired.'
        ))
      }
    })
  })

  describe('Error cases', () => {
    it('should throw invalid customer account credentials error', async () => {
      try {
        await authClient.customerPasswordFlow({
          username: 'invalidUsername',
          password: 'invalidPassword',
        })
        throw new Error('Should throw an error')
      } catch (err) {
        expect(err).toEqual({
          code: 400,
          statusCode: 400,
          status: 400,
          message: 'Customer account with the given credentials not found.',
          errors: [
            {
              code: 'invalid_customer_account_credentials',
              message: 'Customer account with the given credentials not found.',
            },
          ],
          error: 'invalid_customer_account_credentials',
          error_description:
            'Customer account with the given credentials not found.',
          name: 'BadRequest',
        })
      }
    })

    it('should throw invalid client credentials error', async () => {
      const _apiConfig = {
        ...apiConfig,
        credentials: {
          clientId: 'invalidClientId',
          clientSecret: 'invalidClientSecret',
        },
      }
      const _authClient = new SdkAuth(_apiConfig)

      try {
        await _authClient.clientCredentialsFlow()
        throw new Error('Should throw an error')
      } catch (err) {
        expect(err).toEqual({
          code: 401,
          statusCode: 401,
          status: 401,
          message:
            'Please provide valid client credentials using HTTP Basic Authentication.',
          errors: [
            {
              code: 'invalid_client',
              message:
                'Please provide valid client credentials using HTTP Basic Authentication.',
            },
          ],
          error: 'invalid_client',
          error_description:
            'Please provide valid client credentials using HTTP Basic Authentication.',
          name: 'Unauthorized',
        })
      }
    })

    it('should throw invalid scope error', async () => {
      const _apiConfig = {
        ...apiConfig,
        scopes: ['invalid_scope'],
      }
      const _authClient = new SdkAuth(_apiConfig)

      try {
        await _authClient.clientCredentialsFlow()
        throw new Error('Should throw an error')
      } catch (err) {
        expect(err).toEqual({
          code: 400,
          statusCode: 400,
          status: 400,
          message: 'Malformed parameter: scope: Invalid scope.',
          errors: [
            {
              code: 'invalid_scope',
              message: 'Malformed parameter: scope: Invalid scope.',
            },
          ],
          error: 'invalid_scope',
          error_description: 'Malformed parameter: scope: Invalid scope.',
          name: 'BadRequest',
        })
      }
    })
  })
})
