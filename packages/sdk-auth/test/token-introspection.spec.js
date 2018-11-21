import nock from 'nock'
import Auth from '../src/auth'
import config from './resources/sample-config'

describe('Token Introspection', () => {
  const response = {
    active: true,
    scope: `manage_project:${config.projectKey}`,
    expires_in: 12345,
  }
  const auth = new Auth(config)
  jest.spyOn(Auth, '_calculateExpirationTime').mockImplementation(() => 123)

  beforeEach(() => nock.cleanAll())

  test('should introspect token', async () => {
    const scope = nock(config.host)
      .post('/oauth/introspect', {
        token: 'tokenValue',
      })
      .reply(200, JSON.stringify(response))

    expect(scope.isDone()).toBe(false)
    const res = await auth.introspectToken('tokenValue')
    expect(scope.isDone()).toBe(true)
    expect(res).toEqual({
      ...response,
      expires_at: 123,
    })
  })

  test('should throw an error when token is not provided', () => {
    expect(() => auth.introspectToken()).toThrow('Missing required token value')
  })
})
