import nock from 'nock'
import Auth, { TokenProvider } from '../src'
import config from './resources/sample-config'

describe('Token Provider', () => {
  const sdkAuth = new Auth(config)
  const tokenInfo = {
    access_token: 'old-access-token',
    expires_in: 123,
    expires_at: 123456,
    token_type: 'Bearer',
    refresh_token: 'refresh_token',
  }

  afterEach(() => jest.restoreAllMocks())
  beforeEach(() => nock.cleanAll())

  describe('Validation', () => {
    test('should throw an error when refresh_token and access_token is not provided', () => {
      const _tokenInfo = {
        // missing tokens
      }
      expect(() => new TokenProvider({ sdkAuth }, _tokenInfo)).toThrow(
        'At least one of "access_token" or "refresh_token" properties has to be provided'
      )
    })

    test('should throw an error when using undefined token info', () => {
      const _tokenProvider = new TokenProvider({ sdkAuth })
      expect(() => _tokenProvider.getToken()).toThrow(
        'Neither "tokenInfo" property nor "fetchTokenInfo" method was provided'
      )
    })

    test('should throw an error when calling an undefined fetchTokenInfo method', () => {
      const _tokenProvider = new TokenProvider({ sdkAuth })
      expect(() => _tokenProvider._performFetchTokenInfo()).toThrow(
        'Method "fetchTokenInfo" was not provided'
      )
    })

    test('should throw an error when refreshing without "refresh_token" property', async () => {
      const _tokenProvider = new TokenProvider(
        { sdkAuth },
        {
          access_token: 'old-access-token',
          expires_at: 123,
        }
      )
      jest
        .spyOn(TokenProvider, '_isTokenExpired')
        .mockImplementation(() => true)

      const getTokenPromise = _tokenProvider.getToken()
      expect(getTokenPromise).rejects.toEqual(
        new Error(
          'Property "refresh_token" and "fetchTokenInfo" method are missing'
        )
      )
    })
  })

  describe('Event methods', () => {
    test('should call onTokenInfoChanged method', async () => {
      const onTokenInfoChanged = jest.fn()
      const _tokenProvider = new TokenProvider({ sdkAuth, onTokenInfoChanged })

      await _tokenProvider.setTokenInfo({
        access_token: 'abcd',
      })

      expect(onTokenInfoChanged).toHaveBeenCalled()
      expect(onTokenInfoChanged).toHaveBeenCalledWith({
        access_token: 'abcd',
      })
    })

    test('should call onTokenInfoRefreshed method', async () => {
      const onTokenInfoRefreshed = jest.fn()
      const oldTokenInfo = {
        refresh_token: 'refresh-token',
        access_token: 'old-access-token',
        expires_at: 123,
      }
      const _tokenProvider = new TokenProvider({
        sdkAuth,
        onTokenInfoRefreshed,
      })

      jest
        .spyOn(_tokenProvider, '_performRefreshTokenFlow')
        .mockImplementation(() =>
          Promise.resolve({
            access_token: 'new-access-token',
          })
        )

      await _tokenProvider._refreshToken(oldTokenInfo)

      expect(onTokenInfoRefreshed).toHaveBeenCalled()
      expect(onTokenInfoRefreshed).toHaveBeenCalledWith(
        {
          // new tokenInfo
          access_token: 'new-access-token',
          refresh_token: 'refresh-token',
        },
        {
          // old tokenInfo
          access_token: 'old-access-token',
          expires_at: 123,
          refresh_token: 'refresh-token',
        }
      )
    })
  })

  describe('Expired token', () => {
    test('should recognize a valid token expiration', () => {
      const res = TokenProvider._isTokenExpired({
        access_token: 'token',
        expires_at: Date.now() + 10 * 60 * 60 * 1000, // Now + 10 hours
      })
      expect(res).toEqual(false)
    })

    test('should recognize an invalid token expiration', () => {
      const res = TokenProvider._isTokenExpired({
        access_token: 'token',
        expires_at: Date.now() - 10 * 60 * 60 * 1000, // Now - 10 hours
      })
      expect(res).toEqual(true)
    })

    test('should refresh token when expired', async () => {
      const _tokenProvider = new TokenProvider(
        { sdkAuth },
        {
          access_token: 'old-access-token',
          expires_at: 123,
          refresh_token: 'refresh-token',
        }
      )
      jest
        .spyOn(TokenProvider, '_isTokenExpired')
        .mockImplementation(() => true)
      jest
        .spyOn(_tokenProvider, '_performRefreshTokenFlow')
        .mockImplementation(() =>
          Promise.resolve({
            access_token: 'new-access-token',
            expires_in: 123,
            token_type: 'Bearer',
          })
        )

      const resToken = await _tokenProvider.getToken()
      expect(resToken).toEqual('new-access-token')
    })

    test('should call fetchTokenInfo method when refresh_token is not provided', async () => {
      const _tokenProvider = new TokenProvider(
        {
          sdkAuth,
          fetchTokenInfo: () => ({
            access_token: 'new-access-token',
            expires_in: 123,
          }),
        },
        {
          access_token: 'old-access-token',
          expires_at: 123,
          // missing refresh token
        }
      )
      jest
        .spyOn(TokenProvider, '_isTokenExpired')
        .mockImplementation(() => true)

      const resToken = await _tokenProvider.getToken()
      expect(resToken).toEqual('new-access-token')
    })
  })

  describe('Valid token', () => {
    test('should provide a valid access_token', async () => {
      const _tokenProvider = new TokenProvider({ sdkAuth }, tokenInfo)
      jest
        .spyOn(TokenProvider, '_isTokenExpired')
        .mockImplementation(() => false)

      const resToken = await _tokenProvider.getToken()
      expect(resToken).toEqual('old-access-token')
    })

    test('should provide a valid access_token when refresh_token is missing', async () => {
      const _tokenProvider = new TokenProvider(
        { sdkAuth },
        {
          access_token: 'old-access-token',
          expires_at: 123,
        }
      )
      jest
        .spyOn(TokenProvider, '_isTokenExpired')
        .mockImplementation(() => false)

      const resToken = await _tokenProvider.getToken()
      expect(resToken).toEqual('old-access-token')
    })

    test('should retrieve tokenInfo from fetchTokenInfo method', async () => {
      const _sdkAuth = new Auth(config)
      jest.spyOn(_sdkAuth, 'clientCredentialsFlow').mockImplementation(() =>
        Promise.resolve({
          access_token: 'old-access-token',
          expires_at: 123,
        })
      )

      const _tokenProvider = new TokenProvider({
        sdkAuth: _sdkAuth,
        fetchTokenInfo: __sdkAuth => __sdkAuth.clientCredentialsFlow(),
      })
      jest
        .spyOn(TokenProvider, '_isTokenExpired')
        .mockImplementation(() => false)

      const resToken = await _tokenProvider.getToken()
      expect(resToken).toEqual('old-access-token')
    })
  })

  describe('_performRefreshTokenFlow', () => {
    test('should call sdkAuth refreshToken auth flow', async () => {
      const _tokenProvider = new TokenProvider({ sdkAuth }, tokenInfo)
      _tokenProvider.sdkAuth.refreshTokenFlow = jest
        .fn()
        .mockImplementation(() => Promise.resolve('refreshedInfo'))

      const refreshedInfo = await _tokenProvider._performRefreshTokenFlow(
        'refreshToken'
      )
      expect(_tokenProvider.sdkAuth.refreshTokenFlow).toHaveBeenCalledWith(
        'refreshToken'
      )
      expect(refreshedInfo).toEqual('refreshedInfo')
    })
  })
})
