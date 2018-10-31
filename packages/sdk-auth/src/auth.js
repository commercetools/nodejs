/* @flow */
/* global fetch Request Headers */

import type {
  AuthOptions,
  CustomAuthOptions,
  ClientAuthOptions,
  ConfigFetch,
  HttpErrorType,
  AuthRequest,
  UserAuthOptions,
} from 'types/sdk'
import defaultsDeep from 'lodash.defaultsdeep'
import { getErrorByCode } from '@commercetools/sdk-middleware-http'
import * as constants from './constants'

export default class SdkAuth {
  // Set flowtype annotations
  config: AuthOptions
  fetcher: ConfigFetch
  ANONYMOUS_FLOW_URI: string
  BASE_AUTH_FLOW_URI: string
  CUSTOMER_PASSWORD_FLOW_URI: string
  INTROSPECT_URI: string

  /**
   * Sample configuration object:
   * {
   *   "host": "https://auth.commercetools.com",
   *   "projectKey": "sample-project",
   *   "disableRefreshToken": false,
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
  constructor(config: AuthOptions) {
    // validate config properties
    SdkAuth._checkRequiredConfiguration(config)
    this.config = config
    this.fetcher = SdkAuth._getFetcher(config.fetch)

    // auth endpoints
    this.ANONYMOUS_FLOW_URI = `/oauth/--projectKey--/anonymous/token`
    this.CUSTOMER_PASSWORD_FLOW_URI = `/oauth/--projectKey--/customers/token`
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

  static _checkRequiredConfiguration(config: AuthOptions) {
    if (!config) throw new Error('Missing required options')

    if (!config.host) throw new Error('Missing required option (host)')

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

  static _getScopes(scopes: ?Array<string>, projectKey: ?string) {
    return scopes
      ? scopes.join(' ')
      : [constants.MANAGE_PROJECT, projectKey].filter(Boolean).join(':') // generate a default scope manage_project:projectKey
  }

  static _buildRequest(
    config: AuthOptions,
    oauthUri: string,
    grantType: string = 'client_credentials'
  ): AuthRequest {
    const {
      projectKey,
      credentials,
      host,
      disableRefreshToken,
      scopes,
    } = config
    const scope = SdkAuth._getScopes(scopes, projectKey)
    const uri = host.replace(/\/$/, '') + oauthUri
    const basicAuth =
      config.token || SdkAuth._encodeClientCredentials(credentials)
    const authType = config.authType || constants.DEFAULT_AUTH_TYPE

    let body = `grant_type=${grantType}`
    if (grantType !== 'refresh_token') body += `&scope=${scope}`
    if (disableRefreshToken === true) body += '&refresh_token=false'

    return { basicAuth, authType, uri, body }
  }

  _process(request: AuthRequest) {
    return this._performRequest(request).then(response =>
      SdkAuth._handleResponse(request.uri, response)
    )
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

  static _parseResponseJson(response: Object): Object {
    return response.json().catch(() => ({ statusCode: response.status }))
  }

  static _isErrorResponse(response: Object): boolean {
    return !response.status || response.status >= 400
  }

  static _handleResponse(uri: string, response: Object) {
    return SdkAuth._parseResponseJson(response).then(jsonResponse => {
      if (SdkAuth._isErrorResponse(response))
        throw SdkAuth._createResponseError(jsonResponse, uri, response.status)
      return jsonResponse
    })
  }

  static _appendUserCredentialsToBody(
    body: string,
    username: string,
    password: string
  ): string {
    if (!(username && password))
      throw new Error('Missing required user credentials (username, password)')

    return [
      body,
      `username=${encodeURIComponent(username)}`,
      `password=${encodeURIComponent(password)}`,
    ]
      .filter(Boolean)
      .join('&')
  }

  static _enrichUriWithProjectKey(uri: string, projectKey: ?string): string {
    if (!projectKey) throw new Error('Missing required option (projectKey)')
    return uri.replace('--projectKey--', projectKey)
  }

  _performRequest(request: AuthRequest) {
    const { uri, body, basicAuth, authType } = request
    const authHeader = `${authType || constants.DEFAULT_AUTH_TYPE} ${basicAuth}`
    // use .call as a workaround for `TypeError: Failed to execute 'fetch' on 'Window': Illegal invocation`
    // error which occures in browser when using this class loaded by webpack and installed by yarn
    return this.fetcher.call(null, uri, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Length': Buffer.byteLength(body).toString(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })
  }

  _getRequestConfig(config: CustomAuthOptions = {}): AuthOptions {
    const mergedConfig = defaultsDeep({}, config, this.config)

    // handle scopes array - defaultsDeep would merge arrays together
    // instead of taking its first occurrence
    if (config.scopes) mergedConfig.scopes = config.scopes

    return mergedConfig
  }

  anonymousFlow(anonymousId: string = '', config: CustomAuthOptions = {}) {
    const _config = this._getRequestConfig(config)
    const request = SdkAuth._buildRequest(
      _config,
      SdkAuth._enrichUriWithProjectKey(
        this.ANONYMOUS_FLOW_URI,
        _config.projectKey
      )
    )

    if (anonymousId) request.body += `&anonymous_id=${anonymousId}`
    return this._process(request)
  }

  clientCredentialsFlow(config: CustomAuthOptions = {}) {
    const _config = this._getRequestConfig(config)
    const request = SdkAuth._buildRequest(_config, this.BASE_AUTH_FLOW_URI)
    return this._process(request)
  }

  _passwordFlow(
    credentials: UserAuthOptions,
    config: AuthOptions,
    url: string
  ) {
    const { username, password } = credentials || {}
    const request = SdkAuth._buildRequest(config, url, 'password')

    request.body = SdkAuth._appendUserCredentialsToBody(
      request.body,
      username,
      password
    )

    return this._process(request)
  }

  customerPasswordFlow(
    credentials: UserAuthOptions,
    config: CustomAuthOptions = {}
  ) {
    const _config = this._getRequestConfig(config)
    const url = SdkAuth._enrichUriWithProjectKey(
      this.CUSTOMER_PASSWORD_FLOW_URI,
      _config.projectKey
    )

    return this._passwordFlow(credentials, _config, url)
  }

  clientPasswordFlow(
    credentials: UserAuthOptions,
    config: CustomAuthOptions = {}
  ) {
    const _config = this._getRequestConfig(config)
    return this._passwordFlow(credentials, _config, this.BASE_AUTH_FLOW_URI)
  }

  refreshTokenFlow(token: string, config: CustomAuthOptions = {}) {
    if (!token) throw new Error('Missing required token value')
    const _config = this._getRequestConfig(config)

    const request = SdkAuth._buildRequest(
      _config,
      this.BASE_AUTH_FLOW_URI,
      'refresh_token'
    )
    request.body += `&refresh_token=${token}`

    return this._process(request)
  }

  introspectToken(token: string, config: CustomAuthOptions = {}) {
    const _config = this._getRequestConfig(config)
    if (!token) throw new Error('Missing required token value')

    const request = SdkAuth._buildRequest(_config, this.INTROSPECT_URI)
    request.body = `token=${token}`

    return this._process(request)
  }

  customFlow(requestConfig: Object) {
    const { credentials, host, uri, body, token, authType } = requestConfig
    const _config = this._getRequestConfig({
      host,
      token,
      authType,
    })

    const request = SdkAuth._buildRequest(_config, uri)
    request.body = body || '' // let user to build their own body

    if (credentials)
      request.body = SdkAuth._appendUserCredentialsToBody(
        request.body,
        credentials.username,
        credentials.password
      )

    return this._process(request)
  }
}
