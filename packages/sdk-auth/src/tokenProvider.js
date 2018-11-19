/* @flow */
import type { TokenInfo } from 'types/sdk'
import { EXPIRATION_OFFSET } from './constants'
import SdkAuth from './auth'

export default class TokenProvider {
  // Set flowtype annotations
  tokenInfo: ?TokenInfo
  sdkAuth: SdkAuth
  onTokenInfoChanged: (tokenInfo: TokenInfo) => void
  onTokenInfoRefreshed: (
    newTokenInfo: TokenInfo,
    oldTokenInfo: TokenInfo
  ) => void

  constructor(
    {
      sdkAuth,
      onTokenInfoChanged,
      onTokenInfoRefreshed,
    }: {
      sdkAuth: Object,
      onTokenInfoChanged: (tokenInfo: TokenInfo) => void,
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

  _performRefreshTokenFlow(refreshToken: string): Promise<TokenInfo> {
    return this.sdkAuth.refreshTokenFlow(refreshToken)
  }

  _refreshToken(oldTokenInfo: TokenInfo): Promise<TokenInfo> {
    if (!oldTokenInfo.refresh_token)
      throw new Error('Property "refresh_token" is missing')

    let newTokenInfo
    return this._performRefreshTokenFlow(oldTokenInfo.refresh_token)
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

  getTokenInfo(): TokenInfo {
    if (!this.tokenInfo) throw new Error('Property "tokenInfo" was not set')
    return this.tokenInfo
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
    return Promise.resolve(this.getTokenInfo())
      .then(
        (oldTokenInfo: TokenInfo): ?Promise<TokenInfo> =>
          TokenProvider._isTokenExpired(oldTokenInfo)
            ? this._refreshToken(oldTokenInfo)
            : undefined
      )
      .then((): string => this.getTokenInfo().access_token)
  }
}
