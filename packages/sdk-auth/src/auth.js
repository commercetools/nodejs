/* @flow */
import type {
  AuthMiddlewareOptions,
  ClientAuthOptions,
  ConfigFetch,
  HttpErrorType,
  AuthRequest,
  UserAuthOptions,
} from 'types/sdk'
import nodeFetch from 'node-fetch'
import { getErrorByCode } from '@commercetools/sdk-middleware-http'
import * as authScopes from './scopes'

export default class SdkAuth {
  // Set flowtype annotations
  config: AuthMiddlewareOptions
  fetcher: ConfigFetch
  ANONYMOUS_FLOW_URI: string
  BASE_AUTH_FLOW_URI: string
  PASSWORD_FLOW_URI: string

  /**
   * Sample configuration object:
   * {
   *   "host": "https://auth.commercetools.com",
   *   "projectKey": "sample-project",
   *   "credentials": {
   *     "clientId": "sampleClient",
   *     "clientSecret": "sampleSecret"
   *   },
   *   "scopes": [
   *     "view_products:{project-key}"
   *   ]
   * }
   * @param config
   */
  constructor(config: AuthMiddlewareOptions) {
    // validate config properties
    SdkAuth._checkRequiredConfiguration(config)
    this.config = config
    this.fetcher = SdkAuth._getFetcher(config.fetch)

    const { projectKey } = config
    this.ANONYMOUS_FLOW_URI = `/oauth/${projectKey}/anonymous/token`
    this.PASSWORD_FLOW_URI = `/oauth/${projectKey}/customers/token`
    this.BASE_AUTH_FLOW_URI = '/oauth/token'
  }

  static _getFetcher(configFetch: ?ConfigFetch): ConfigFetch {
    return configFetch || global.fetch || nodeFetch
  }

  static _checkRequiredConfiguration(config: AuthMiddlewareOptions) {
    if (!config) throw new Error('Missing required options')

    if (!config.host) throw new Error('Missing required option (host)')

    if (!config.projectKey)
      throw new Error('Missing required option (projectKey)')

    if (!config.credentials)
      throw new Error('Missing required option (credentials)')

    const { clientId, clientSecret } = config.credentials

    if (!(clientId && clientSecret))
      throw new Error('Missing required credentials (clientId, clientSecret)')
  }

  static _encodeClientCredentials({
    clientId,
    clientSecret,
  }: ClientAuthOptions) {
    return Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  }

  static _buildRequest(
    config: AuthMiddlewareOptions,
    oauthUri: string = '/oauth/token',
    grantType: string = 'client_credentials'
  ): AuthRequest {
    const { projectKey, credentials, host } = config
    const defaultScope = `${authScopes.MANAGE_PROJECT}:${projectKey}`
    const scope = (config.scopes || [defaultScope]).join(' ')
    const basicAuth = SdkAuth._encodeClientCredentials(credentials)

    const uri = host.replace(/\/$/, '') + oauthUri
    const body = `grant_type=${grantType}&scope=${scope}`

    return { basicAuth, uri, body }
  }

  async _process(request: AuthRequest) {
    const response = await this._performRequest(request)
    return SdkAuth._handleResponse(request.uri, response)
  }

  static _createResponseError(
    { message, ...rest }: Object,
    uri: string,
    statusCode: number
  ): HttpErrorType {
    let errorMessage = message || 'Unexpected non-JSON error response'
    if (statusCode === 404) errorMessage = `URI not found: ${uri}`

    let ResponseError = getErrorByCode(statusCode)
    if (!ResponseError) ResponseError = getErrorByCode(0)

    return new ResponseError(errorMessage, rest)
  }

  static async _parseResponseJson(response: Object): Object {
    try {
      return await response.json()
    } catch (err) {
      return { statusCode: response.status }
    }
  }

  static _isErrorResponse(response: Object): boolean {
    return !response.status || response.status >= 400
  }

  static async _handleResponse(uri: string, response: Object) {
    const jsonResponse = await SdkAuth._parseResponseJson(response)

    if (SdkAuth._isErrorResponse(response))
      throw SdkAuth._createResponseError(jsonResponse, uri, response.status)
    return jsonResponse
  }

  static _appendUserCredentialsToBody(
    body: string,
    username: string,
    password: string
  ) {
    return [
      body,
      `username=${encodeURIComponent(username)}`,
      `password=${encodeURIComponent(password)}`,
    ].join('&')
  }

  async _performRequest(request: AuthRequest) {
    const { uri, body, basicAuth } = request
    return this.fetcher(uri, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Length': Buffer.byteLength(body).toString(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })
  }

  async anonymousFlow(anonymousId: string = '') {
    const request = SdkAuth._buildRequest(this.config, this.ANONYMOUS_FLOW_URI)

    if (anonymousId) request.body += `&anonymous_id=${anonymousId}`
    return this._process(request)
  }

  async clientCredentialsFlow() {
    const request = SdkAuth._buildRequest(this.config, this.BASE_AUTH_FLOW_URI)
    return this._process(request)
  }

  async passwordFlow({ username, password }: UserAuthOptions) {
    if (!(username && password))
      throw new Error('Missing required user credentials (username, password)')

    const request = SdkAuth._buildRequest(
      this.config,
      this.PASSWORD_FLOW_URI,
      'password'
    )

    request.body = SdkAuth._appendUserCredentialsToBody(
      request.body,
      username,
      password
    )

    return this._process(request)
  }

  // async refreshTokenFlow(token) {
  // }
  //
  // async introspectToken(token) {
  // }
}
