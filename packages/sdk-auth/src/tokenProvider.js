/* @flow */
import type { TokenInfo } from 'types/sdk'
import { EXPIRATION_OFFSET } from './constants'
import SdkAuth from './auth'

export default class TokenProvider {
  // Set flowtype annotations
  tokenInfo: ?TokenInfo
  sdkAuth: SdkAuth
  onTokenInfoChanged: (tokenInfo: TokenInfo) => void
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
  }

  static _validateTokenInfo(tokenInfo: TokenInfo) {
    if (!tokenInfo.access_token && !tokenInfo.refresh_token)
      throw new Error(
        'At least one of "access_token" or "refresh_token" properties has to be provided'
      )
  }

  static _isTokenExpired(tokenInfo: TokenInfo): boolean {
    if (!tokenInfo.access_token || !tokenInfo.expires_at) return true

    // token is expired if current time is bigger than expiration time minus some offset
    // NOTE: all timezones use same place of unix timestamp origin
    return Date.now() >= (tokenInfo.expires_at || 0) - EXPIRATION_OFFSET
  }

  _performFetchTokenInfo(): Promise<TokenInfo> {
    if (!this.fetchTokenInfo)
      throw new Error('Method "fetchTokenInfo" was not provided')

    return Promise.resolve(this.fetchTokenInfo(this.sdkAuth))
  }

  _performRefreshTokenFlow(refreshToken: string): Promise<TokenInfo> {
    return this.sdkAuth.refreshTokenFlow(refreshToken)
  }

  _refreshToken(oldTokenInfo: TokenInfo): Promise<TokenInfo> {
    let newTokenInfo

    if (!oldTokenInfo.refresh_token && !this.fetchTokenInfo)
      throw new Error(
        'Property "refresh_token" and "fetchTokenInfo" method are missing'
      )

    // perform refreshTokenFlow if we have refresh token otherwise call getTokenInfo method
    const newTokenPromise = oldTokenInfo.refresh_token
      ? this._performRefreshTokenFlow(oldTokenInfo.refresh_token)
      : this._performFetchTokenInfo()

    return newTokenPromise
      .then(
        (tokenInfo: TokenInfo): void => {
          newTokenInfo = tokenInfo
          newTokenInfo.refresh_token = oldTokenInfo.refresh_token
          // $FlowFixMe
          return this.onTokenInfoRefreshed?.(newTokenInfo, oldTokenInfo)
        }
      )
      .then((): Promise<TokenInfo> => this.setTokenInfo(newTokenInfo))
  }

  /**
   * Method will return tokenInfo or if it is not provided it will call fetchTokenInfo() method
   * for retrieving the first tokenInfo
   * @returns {Promise.<TokenInfo>}
   */
  getTokenInfo(): Promise<TokenInfo> {
    if (this.tokenInfo) return Promise.resolve(this.tokenInfo)

    if (!this.fetchTokenInfo)
      throw new Error(
        'Neither "tokenInfo" property nor "fetchTokenInfo" method was provided'
      )

    return this._performFetchTokenInfo().then((tokenInfo: TokenInfo) =>
      this.setTokenInfo(tokenInfo)
    )
  }

  setTokenInfo(tokenInfo: TokenInfo): Promise<TokenInfo> {
    TokenProvider._validateTokenInfo(tokenInfo)

    this.tokenInfo = tokenInfo
    // $FlowFixMe
    return Promise.resolve(this.onTokenInfoChanged?.(tokenInfo)).then(
      (): TokenInfo => tokenInfo
    )
  }

  getToken(): Promise<string> {
    return this.getTokenInfo()
      .then(
        (oldTokenInfo: TokenInfo): ?Promise<TokenInfo> =>
          TokenProvider._isTokenExpired(oldTokenInfo)
            ? this._refreshToken(oldTokenInfo)
            : undefined
      )
      .then((): Promise<TokenInfo> => this.getTokenInfo())
      .then((tokenInfo: TokenInfo): string => tokenInfo.access_token)
  }
}
