import * as constants from './constants'

export default class TokenProvider {
  constructor(
    { sdkAuth, onTokenInfoChanged, onTokenRefreshed },
    tokenInfo = null
  ) {
    if (!sdkAuth) throw new Error('Property "sdkAuth" was not provided')

    if (tokenInfo) TokenProvider._validateTokenInfo(tokenInfo)
    this.onTokenInfoChanged = onTokenInfoChanged || (() => {})
    this.onTokenRefreshed = onTokenRefreshed || (() => {})

    this.sdkAuth = sdkAuth
    this.tokenInfo = tokenInfo
  }

  static _validateTokenInfo(tokenInfo) {
    if (!tokenInfo.access_token && !tokenInfo.refresh_token)
      throw new Error(
        'At least one of "access_token" or "refresh_token" properties has to be provided'
      )
  }

  static _isTokenExpired(tokenInfo) {
    if (!tokenInfo.access_token || !tokenInfo.expires_at) return true

    // token is expired if current time is bigger than expiration time minus some offset
    // NOTE: all timezones use same place of unix timestamp origin
    return Date.now() >= tokenInfo.expires_at - constants.EXPIRATION_OFFSET
  }

  getTokenInfo() {
    if (!this.tokenInfo) throw new Error('Property "tokenInfo" was not set')
    return this.tokenInfo
  }

  setTokenInfo(tokenInfo) {
    TokenProvider._validateTokenInfo(tokenInfo)

    this.tokenInfo = tokenInfo
    return Promise.resolve(this.onTokenInfoChanged(tokenInfo)).then(
      () => tokenInfo
    )
  }

  _performRefreshedTokenFlow(refreshToken) {
    return this.sdkAuth.refreshTokenFlow(refreshToken)
  }

  _refreshToken(oldTokenInfo) {
    if (!oldTokenInfo.refresh_token)
      throw new Error('Property "refresh_token" is missing')

    let newTokenInfo
    return Promise.resolve()
      .then(() => this._performRefreshedTokenFlow(oldTokenInfo.refresh_token))
      .then(tokenInfo => {
        newTokenInfo = tokenInfo
        newTokenInfo.refresh_token = oldTokenInfo.refresh_token

        return this.onTokenRefreshed(newTokenInfo, oldTokenInfo)
      })
      .then(() => this.setTokenInfo(newTokenInfo))
  }

  async getToken() {
    const oldTokenInfo = this.getTokenInfo()

    if (TokenProvider._isTokenExpired(oldTokenInfo))
      await this._refreshToken(oldTokenInfo)
    return this.getTokenInfo().access_token
  }
}
