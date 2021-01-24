/* @flow */

import type {
  AuthOptions,
  CustomAuthOptions,
  ClientAuthOptions,
  HttpErrorType,
  AuthRequest,
  UserAuthOptions,
} from 'types/sdk'
import { decode, encode } from 'qss'
import defaultsDeep from 'lodash.defaultsdeep'
import { getErrorByCode } from '@commercetools/sdk-middleware-http'
import * as constants from './constants'

export default class SdkAuth {
  // Set flowtype annotations
  config: AuthOptions
  fetcher: typeof fetch
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

  static _getFetcher(fetcher: ?typeof fetch): typeof fetch {
    if (!fetcher && typeof fetch === 'undefined')
      throw new Error(
        '`fetch` is not available. Please pass in `fetch` as an option or have it globally available.'
      )
    let fetchFunction: typeof fetch
    if (fetcher) {
      fetchFunction = fetcher
    } else {
      // `fetcher` is set here rather than the destructuring to ensure fetch is
      // declared before referencing it otherwise it would cause a `ReferenceError`.
      // For reference of this pattern: https://github.com/apollographql/apollo-link/blob/498b413a5b5199b0758ce898b3bb55451f57a2fa/packages/apollo-link-http/src/httpLink.ts#L49
      fetchFunction = fetch
    }
    return fetchFunction
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
  }: ClientAuthOptions): string {
    return Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  }

  static _getScopes(scopes: ?Array<string>, projectKey: ?string): string {
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
      headers,
    } = config
    const scope = SdkAuth._getScopes(scopes, projectKey)
    const uri = host.replace(/\/$/, '') + oauthUri
    const basicAuth =
      config.token || SdkAuth._encodeClientCredentials(credentials)
    const authType = config.authType || constants.DEFAULT_AUTH_TYPE

    const isNotRefreshTokenGrantType = grantType !== 'refresh_token'
    const queryParams: {
      grant_type: string,
      refresh_token?: boolean,
      scope?: string,
    } = {
      grant_type: grantType,
    }
    if (disableRefreshToken) {
      queryParams.refresh_token = false
    }
    if (isNotRefreshTokenGrantType) {
      queryParams.scope = scope
    }
    const initialBody = encode(queryParams)

    return { basicAuth, authType, uri, body: initialBody, headers }
  }

  static _appendToRequestBody(
    request: AuthRequest,
    toAppend: Object
  ): AuthRequest {
    const previousDecodedRequestBody = request.body ? decode(request.body) : {}
    const nextEncodedRequestBody = encode({
      ...previousDecodedRequestBody,
      ...toAppend,
    })
    request.body = nextEncodedRequestBody

    return request
  }

  _process(request: AuthRequest): Promise<Object> {
    return this._performRequest(request).then((response) =>
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

  static _calculateExpirationTime(expiresIn: number): number {
    return Date.now() + expiresIn * 1000
  }

  static _enrichTokenResponse(response: Object): Object {
    if (response.expires_in) {
      return {
        ...response,
        // add a new property with expiration time in unixTimestamp format
        expires_at: SdkAuth._calculateExpirationTime(response.expires_in),
      }
    }
    return response
  }

  static _handleResponse(uri: string, response: Response): Promise<Object> {
    return SdkAuth._parseResponseJson(response).then((jsonResponse) => {
      if (SdkAuth._isErrorResponse(response))
        throw SdkAuth._createResponseError(jsonResponse, uri, response.status)

      return SdkAuth._enrichTokenResponse(jsonResponse)
    })
  }

  static _appendUserCredentialsToBody(
    request: AuthRequest,
    username: string,
    password: string
  ): AuthRequest {
    if (!(username && password))
      throw new Error('Missing required user credentials (username, password)')

    return SdkAuth._appendToRequestBody(request, { username, password })
  }

  static _enrichUriWithProjectKey(uri: string, projectKey: ?string): string {
    if (!projectKey) throw new Error('Missing required option (projectKey)')

    return uri.replace('--projectKey--', projectKey)
  }

  _performRequest(request: AuthRequest): Promise<Response> {
    const { uri, body, basicAuth, authType, headers } = request
    const fetchHeaders = headers || {
      Authorization: `${authType || constants.DEFAULT_AUTH_TYPE} ${basicAuth}`,
      'Content-Length': body.length,  // do we really need Buffer.byteLength(body).toString() here that takes the ENTIRE 50kb Buffer polyfill to the browser?
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    const fetchRequest = {
      method: 'POST',
      headers: fetchHeaders,
      body,
    }

    // use .call as a workaround for `TypeError: Failed to execute 'fetch' on 'Window': Illegal invocation`
    // error which occures in browser when using this class loaded by webpack and installed by yarn
    return this.fetcher.call(null, uri, fetchRequest)
  }

  _getRequestConfig(config: CustomAuthOptions = {}): AuthOptions {
    const mergedConfig = defaultsDeep({}, config, this.config)

    // handle scopes array - defaultsDeep would merge arrays together
    // instead of taking its first occurrence
    if (config.scopes) mergedConfig.scopes = config.scopes

    return mergedConfig
  }

  anonymousFlow(
    anonymousId: string = '',
    config: CustomAuthOptions = {}
  ): Promise<Object> {
    const _config = this._getRequestConfig(config)
    let request = SdkAuth._buildRequest(
      _config,
      SdkAuth._enrichUriWithProjectKey(
        this.ANONYMOUS_FLOW_URI,
        _config.projectKey
      )
    )

    if (anonymousId)
      request = SdkAuth._appendToRequestBody(request, {
        anonymous_id: anonymousId,
      })

    return this._process(request)
  }

  clientCredentialsFlow(config: CustomAuthOptions = {}): Promise<Object> {
    const _config = this._getRequestConfig(config)
    const request = SdkAuth._buildRequest(_config, this.BASE_AUTH_FLOW_URI)

    return this._process(request)
  }

  _passwordFlow(
    credentials: UserAuthOptions,
    config: AuthOptions,
    url: string
  ): Promise<Object> {
    const { username, password } = credentials || {}
    let request = SdkAuth._buildRequest(config, url, 'password')

    request = SdkAuth._appendUserCredentialsToBody(request, username, password)

    return this._process(request)
  }

  customerPasswordFlow(
    credentials: UserAuthOptions,
    config: CustomAuthOptions = {}
  ): Promise<Object> {
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
  ): Promise<Object> {
    const _config = this._getRequestConfig(config)

    return this._passwordFlow(credentials, _config, this.BASE_AUTH_FLOW_URI)
  }

  refreshTokenFlow(
    token: string,
    config: CustomAuthOptions = {}
  ): Promise<Object> {
    if (!token) throw new Error('Missing required token value')

    const _config = this._getRequestConfig(config)
    const request = SdkAuth._appendToRequestBody(
      SdkAuth._buildRequest(_config, this.BASE_AUTH_FLOW_URI, 'refresh_token'),
      { refresh_token: token }
    )

    return this._process(request)
  }

  introspectToken(
    token: string,
    config: CustomAuthOptions = {}
  ): Promise<Object> {
    if (!token) throw new Error('Missing required token value')

    const _config = this._getRequestConfig(config)
    const request = SdkAuth._appendToRequestBody(
      SdkAuth._buildRequest(_config, this.INTROSPECT_URI),
      { token }
    )

    return this._process(request)
  }

  customFlow(requestConfig: Object): Promise<Object> {
    const {
      credentials,
      host,
      uri,
      body,
      token,
      authType,
      headers,
    } = requestConfig
    const _config = this._getRequestConfig({
      host,
      token,
      authType,
      headers,
    })

    let request = SdkAuth._buildRequest(_config, uri)
    request.body = body || '' // let user to build their own body

    if (credentials)
      request = SdkAuth._appendUserCredentialsToBody(
        request,
        credentials.username,
        credentials.password
      )

    return this._process(request)
  }
}
