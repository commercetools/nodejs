/* @flow */
/* global fetch Request Headers */

import type {
  AuthMiddlewareOptions,
  ClientAuthOptions,
  ConfigFetch,
  HttpErrorType,
  AuthRequest,
  UserAuthOptions,
} from 'types/sdk'
import { getErrorByCode } from '@commercetools/sdk-middleware-http'
import * as constants from './constants'

export default class SdkAuth {
  // Set flowtype annotations
  config: AuthMiddlewareOptions
  fetcher: ConfigFetch
  ANONYMOUS_FLOW_URI: string
  BASE_AUTH_FLOW_URI: string
  PASSWORD_FLOW_URI: string
  INTROSPECT_URI: string

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
   *   ],
   *   "fetch": function // implementation of a fetch method
   * }
   * @param config
   */
  constructor(config: AuthMiddlewareOptions) {
    // validate config properties
    SdkAuth._checkRequiredConfiguration(config)
    this.config = config
    this.fetcher = SdkAuth._getFetcher(config.fetch)

    this.ANONYMOUS_FLOW_URI = `/oauth/${config.projectKey}/anonymous/token`
    this.PASSWORD_FLOW_URI = `/oauth/${config.projectKey}/customers/token`
    this.BASE_AUTH_FLOW_URI = '/oauth/token'
    this.INTROSPECT_URI = '/oauth/introspect'
  }

  static _getFetcher(configFetch: ?ConfigFetch): ConfigFetch {
    if (!configFetch && typeof fetch === 'undefined')
      throw new Error(
        '`fetch` is not available. Please pass in `fetch` as an option or have it globally available.'
      )
    return configFetch || fetch
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
    oauthUri: string,
    grantType: string = 'client_credentials'
  ): AuthRequest {
    const { projectKey, credentials, host } = config
    const defaultScope = `${constants.MANAGE_PROJECT}:${projectKey}`
    const scope = (config.scopes || [defaultScope]).join(' ')
    const basicAuth = SdkAuth._encodeClientCredentials(credentials)

    const uri = host.replace(/\/$/, '') + oauthUri
    let body = `grant_type=${grantType}`
    if (grantType !== 'refresh_token') body += `&scope=${scope}`

    return { basicAuth, uri, body }
  }

  async _process(request: AuthRequest) {
    const response = await this._performRequest(request)
    return SdkAuth._handleResponse(request.uri, response)
  }

  static _createResponseError(
    { message = 'Unexpected non-JSON error response', ...rest }: Object,
    uri: string,
    statusCode: number
  ): HttpErrorType {
    const errorMessage = statusCode === 404 ? `URI not found: ${uri}` : message

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

  async passwordFlow(credentials: ?UserAuthOptions) {
    const { username, password } = credentials || {}
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

  async refreshTokenFlow(token: string) {
    if (!token) throw new Error('Missing required token value')

    const request = SdkAuth._buildRequest(
      this.config,
      this.BASE_AUTH_FLOW_URI,
      'refresh_token'
    )
    request.body += `&refresh_token=${token}`

    return this._process(request)
  }

  async introspectToken(token: string) {
    if (!token) throw new Error('Missing required token value')

    const request = SdkAuth._buildRequest(this.config, this.INTROSPECT_URI)
    request.body = `token=${token}`

    return this._process(request)
  }
}
