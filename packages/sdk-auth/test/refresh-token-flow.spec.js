import nock from 'nock'
import Auth from '../src/auth'
import config from './resources/sample-config'
import response from './resources/sample-response.json'

describe('Refresh Token flow', () => {
  const auth = new Auth(config)

  beforeEach(() => nock.cleanAll())

  test('should send a refresh token request', async () => {
    const scope = nock(config.host)
      .post(`/oauth/token`, {
        grant_type: 'refresh_token',
        refresh_token: 'refreshTokenValue',
      })
      .reply(200, JSON.stringify(response))

    expect(scope.isDone()).toBe(false)
    const res = await auth.refreshTokenFlow('refreshTokenValue')
    expect(scope.isDone()).toBe(true)
    expect(res).toEqual(response)
  })

  test('should throw an error when token is not provided', async () => {
    expect(() => auth.refreshTokenFlow()).toThrow(
      'Missing required token value'
    )
  })
})
