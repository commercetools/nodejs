/* @flow */
import type { TokenInfo } from 'types/sdk'
import { EXPIRATION_OFFSET } from './constants'
import SdkAuth from './auth'

export default class TokenProvider {
  // Set flowtype annotations
  tokenInfo: ?TokenInfo
  sdkAuth: SdkAuth
  onTokenInfoChanged: (tokenInfo: TokenInfo) => void
  fetchTokenInfoPromise: ?Promise<TokenInfo>
  refreshTokenFlowPromise: ?Promise<TokenInfo>
  fetchTokenInfo: (sdkAuth: SdkAuth) => Promise<TokenInfo>
  onTokenInfoRefreshed: (
    newTokenInfo: TokenInfo,
    oldTokenInfo: TokenInfo
  ) => void

  constructor(
    {
      sdkAuth,
      fetchTokenInfo,
      onTokenInfoChanged,
      onTokenInfoRefreshed,
    }: {
      sdkAuth: Object,
      onTokenInfoChanged: (tokenInfo: TokenInfo) => void,
      fetchTokenInfo: (sdkAuth: SdkAuth) => Promise<TokenInfo>,
      onTokenInfoRefreshed: (
        newTokenInfo: TokenInfo,
        oldTokenInfo: TokenInfo
      ) => void,
    },
    tokenInfo: ?TokenInfo = null
  ) {
    if (!sdkAuth) throw new Error('Property "sdkAuth" was not provided')

    if (tokenInfo) TokenProvider._validateTokenInfo(tokenInfo)
    this.onTokenInfoChanged = onTokenInfoChanged
    this.onTokenInfoRefreshed = onTokenInfoRefreshed
    this.fetchTokenInfo = fetchTokenInfo

    this.sdkAuth = sdkAuth
    this.tokenInfo = tokenInfo

    this.fetchTokenInfoPromise = null
    this.refreshTokenFlowPromise = null
  }

  static _validateTokenInfo(tokenInfo: TokenInfo) {
    if (!tokenInfo.access_token && !tokenInfo.refresh_token)
      throw new Error(
        'At least one of "access_token" or "refresh_token" properties has to be provided'
      )
  }

  static _isTokenExpired(tokenInfo: TokenInfo): boolean {
    if (!tokenInfo || !tokenInfo.access_token || !tokenInfo.expires_at)
      return true

    // token is expired if current time is bigger than expiration time minus some offset
    // NOTE: all timezones use same place of unix timestamp origin
    return Date.now() >= (tokenInfo.expires_at || 0) - EXPIRATION_OFFSET
  }

  _performFetchTokenInfo(): Promise<TokenInfo> {
    if (!this.fetchTokenInfo)
      return Promise.reject(
        new Error('Method "fetchTokenInfo" was not provided')
      )

    // do not run fetchTokenInfo more than once at any given time and cache the result
    if (this.fetchTokenInfoPromise) return this.fetchTokenInfoPromise

    this.fetchTokenInfoPromise = Promise.resolve(
      this.fetchTokenInfo(this.sdkAuth)
    )

    return this.fetchTokenInfoPromise.then((tokenInfo) => {
      this.fetchTokenInfoPromise = null
      return tokenInfo
    }).catch((error) => {
        this.fetchTokenInfoPromise = null
        throw error
    })
  }

  _performRefreshTokenFlow(refreshToken: string): Promise<TokenInfo> {
    // run refreshTokenFlow only once when multiple requests comes at the same time
    if (this.refreshTokenFlowPromise) return this.refreshTokenFlowPromise

    this.refreshTokenFlowPromise = this.sdkAuth.refreshTokenFlow(refreshToken)

    return this.refreshTokenFlowPromise.then((refreshTokenInfo) => {
      this.refreshTokenFlowPromise = null
      return refreshTokenInfo
    }).catch((error) => {
        this.refreshTokenFlowPromise = null;
        throw error
    })
  }

  _refreshToken(oldTokenInfo: TokenInfo): Promise<TokenInfo> {
    let newTokenInfo

    if (!oldTokenInfo?.['refresh_token'] && !this.fetchTokenInfo)
      return Promise.reject(
        new Error(
          'Property "refresh_token" and "fetchTokenInfo" method are missing'
        )
      )

    // perform refreshTokenFlow if we have refresh token otherwise call getTokenInfo method
    const newTokenPromise = oldTokenInfo?.['refresh_token']
      ? this._performRefreshTokenFlow(oldTokenInfo.refresh_token)
      : this._performFetchTokenInfo()

    return newTokenPromise
      .then((tokenInfo: TokenInfo): void => {
        newTokenInfo = tokenInfo
        if (oldTokenInfo?.['refresh_token'])
          newTokenInfo.refresh_token = oldTokenInfo.refresh_token
        return this.onTokenInfoRefreshed?.(newTokenInfo, oldTokenInfo)
      })
      .then((): Promise<TokenInfo> => this.setTokenInfo(newTokenInfo))
  }

  /**
   * Set current token info to null
   */
  invalidateTokenInfo(): void {
    this.tokenInfo = null
  }

  /**
   * Method will return tokenInfo or if it is not provided it will call fetchTokenInfo() method
   * for retrieving the first tokenInfo
   * @returns {Promise.<TokenInfo>}
   */
  getTokenInfo(): Promise<TokenInfo> {
    if (this.tokenInfo && !TokenProvider._isTokenExpired(this.tokenInfo))
      return Promise.resolve(this.tokenInfo)

    // $FlowFixMe - _refreshToken method will fetch new tokenInfo if not provided
    return this._refreshToken(this.tokenInfo)
  }

  setTokenInfo(tokenInfo: TokenInfo): Promise<TokenInfo> {
    TokenProvider._validateTokenInfo(tokenInfo)

    this.tokenInfo = tokenInfo
    return Promise.resolve(this.onTokenInfoChanged?.(tokenInfo)).then(
      (): TokenInfo => tokenInfo
    )
  }

  getAccessToken(): Promise<string> {
    return this.getTokenInfo().then(
      (tokenInfo: TokenInfo): string => tokenInfo.access_token
    )
  }
}
