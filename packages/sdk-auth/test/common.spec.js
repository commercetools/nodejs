import nock from 'nock'
import { getErrorByCode } from '@commercetools/sdk-middleware-http'
import Auth from '../src/auth'
import config from './resources/sample-config.json'

describe('Common processes', () => {
  const { clientId, clientSecret } = config.credentials
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64'
  )
  const auth = new Auth(config)
  const request = {
    basicAuth,
    uri: 'https://auth.commercetools.com/api-endpoint',
    body: 'grant_type=client_credentials&scope=manage_project:project-key',
  }

  beforeEach(() => nock.cleanAll())

  describe('Error response', () => {
    test('should throw 404 error when accessing invalid URI', async () => {
      const scope = nock(config.host)
        .post('/api-endpoint', () => true)
        .reply(404)

      try {
        expect(scope.isDone()).toBe(false)
        await auth._process(request)
        throw new Error('Test should throw an error')
      } catch (err) {
        expect(scope.isDone()).toBe(true)
        expect(err).toBeInstanceOf(getErrorByCode(404))
        expect(err).toEqual({
          code: 404,
          statusCode: 404,
          status: 404,
          message: 'URI not found: https://auth.commercetools.com/api-endpoint',
          name: 'NotFound',
        })
      }
    })

    test('should throw 401 error when providing invalid credentials', async () => {
      const response = {
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
        originalRequest: {
          uri: 'https://auth.commercetools.com/api-endpoint',
        },
      }
      const scope = nock(config.host)
        .post('/api-endpoint', () => true)
        .reply(401, JSON.stringify(response))

      try {
        expect(scope.isDone()).toBe(false)
        await auth._process(request)
        throw new Error('Test should throw an error')
      } catch (err) {
        expect(scope.isDone()).toBe(true)
        expect(err).toBeInstanceOf(getErrorByCode(401))
        expect(err).toEqual({
          ...response,
          name: 'Unauthorized',
        })
      }
    })

    test('should throw 400 error when sending an invalid request', async () => {
      const response = {
        code: 400,
        statusCode: 400,
        status: 400,
        message:
          "Invalid parameter: grant_type: Invalid grant type: 'invalid_type'",
        errors: [
          {
            code: 'unsupported_grant_type',
            message:
              "Invalid parameter: grant_type: Invalid grant type: 'invalid_type'",
          },
        ],
        error: 'unsupported_grant_type',
        error_description:
          "Invalid parameter: grant_type: Invalid grant type: 'invalid_type'",
      }
      const _request = {
        ...request,
        body: 'grant_type=invalid_type&scope=project-key}',
      }
      const scope = nock(config.host)
        .post('/api-endpoint', () => true)
        .reply(400, JSON.stringify(response))

      try {
        await auth._process(_request)
        throw new Error('Test should throw an error')
      } catch (err) {
        expect(scope.isDone()).toBe(true)
        expect(err).toBeInstanceOf(getErrorByCode(400))
        expect(err).toEqual({
          ...response,
          name: 'BadRequest',
        })
      }
    })

    test('should throw 500 error when API sends internal server error', async () => {
      const response = {
        code: 500,
        statusCode: 500,
        status: 500,
        message: 'Internal Server Error',
      }
      const scope = nock(config.host)
        .post('/api-endpoint', () => true)
        .reply(500, JSON.stringify(response))

      try {
        expect(scope.isDone()).toBe(false)
        await auth._process(request)
        throw new Error('Test should throw an error')
      } catch (err) {
        expect(scope.isDone()).toBe(true)
        expect(err).toBeInstanceOf(getErrorByCode(500))
        expect(err).toEqual({
          ...response,
          name: 'InternalServerError',
        })
      }
    })

    test('should throw a network error when API responds with an unhandled error', async () => {
      const response = {
        message: 'Network error',
        code: 0,
        statusCode: 0,
      }
      const scope = nock(config.host)
        .post('/api-endpoint', () => true)
        .reply(567, JSON.stringify(response))

      try {
        expect(scope.isDone()).toBe(false)
        await auth._process(request)
        throw new Error('Test should throw an error')
      } catch (err) {
        expect(scope.isDone()).toBe(true)
        expect(err).toBeInstanceOf(getErrorByCode(0)) // network error
        expect(err).toEqual({
          ...response,
          status: 0,
          name: 'NetworkError',
        })
      }
    })
  })

  describe('Successful response', () => {
    test('should return a 200 ok response', async () => {
      const response = {
        access_token: 'v-dZ10ZCpvbGfwcFniXqfkAj0vq1yZVI',
        expires_in: 172800,
        scope:
          'view_products:project-key manage_my_orders:project-key manage_my_profile:project-key',
        refresh_token: 'OWStLG0eaeVs7Yx3-mHcn8iAZohBohCiJSDdK1UCJ9U',
        token_type: 'Bearer',
      }
      const scope = nock(config.host, {
        reqheaders: {
          Authorization: value => value === `Basic ${basicAuth}`,
        },
      })
        .post('/api-endpoint', () => true)
        .reply(200, JSON.stringify(response))

      expect(scope.isDone()).toBe(false)
      const res = await auth._process(request)
      expect(scope.isDone()).toBe(true)
      expect(res).toEqual(response)
    })

    test('should use custom scopes when provided', async () => {
      const _config = {
        ...config,
        scopes: [
          `view_products:${config.projectKey}`,
          `manage_types:${config.projectKey}`,
        ],
      }
      const authRequest = Auth._buildRequest(_config, '/api-endpoint')

      expect(authRequest).toEqual({
        basicAuth,
        uri: 'https://auth.commercetools.com/api-endpoint',
        body:
          'grant_type=client_credentials&scope=view_products:sample-project manage_types:sample-project',
      })
    })
  })

  describe('_checkRequiredConfiguration', () => {
    test('should check presence of a configuration object', () => {
      expect(Auth._checkRequiredConfiguration).toThrow(
        'Missing required options'
      )
    })

    test('should validate host property', () => {
      const options = { ...config }
      delete options.host
      expect(() => Auth._checkRequiredConfiguration(options)).toThrow(
        'Missing required option (host)'
      )
    })

    test('should validate projectKey property', () => {
      const options = { ...config }
      delete options.projectKey
      expect(() => Auth._checkRequiredConfiguration(options)).toThrow(
        'Missing required option (projectKey)'
      )
    })

    test('should validate credentials property', () => {
      const options = { ...config }
      delete options.credentials
      expect(() => Auth._checkRequiredConfiguration(options)).toThrow(
        'Missing required option (credentials)'
      )
    })

    test('should validate credentials.clientId property', () => {
      const options = { ...config }
      options.credentials = { clientSecret: '123' } // clientId is missing
      expect(() => Auth._checkRequiredConfiguration(options)).toThrow(
        'Missing required credentials (clientId, clientSecret)'
      )
    })

    test('should validate credentials.clientSecret property', () => {
      const options = { ...config }
      options.credentials = { clientId: '123' } // clientSecret is missing
      expect(() => Auth._checkRequiredConfiguration(options)).toThrow(
        'Missing required credentials (clientId, clientSecret)'
      )
    })
  })

  describe('_getFetcher', () => {
    test('should return a default fetcher', () => {
      const fetcher = auth._process({})
      expect(typeof fetcher).toBe('object')
    })
  })
})
