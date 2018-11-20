import nock from 'nock'
import Auth from '../src/auth'
import config from './resources/sample-config'
import response from './resources/sample-response.json'

describe('Client Credentials flow', () => {
  const auth = new Auth(config)
  jest.spyOn(Auth, '_calculateExpirationTime').mockImplementation(() => 123)

  beforeEach(() => nock.cleanAll())

  test('should authenticate with correct credentials', async () => {
    const scope = nock(config.host)
      .post(`/oauth/token`, {
        grant_type: 'client_credentials',
        scope: `manage_project:${config.projectKey}`,
      })
      .reply(200, JSON.stringify(response))

    expect(scope.isDone()).toBe(false)
    const res = await auth.clientCredentialsFlow()
    expect(scope.isDone()).toBe(true)
    expect(res).toEqual({
      ...response,
      expires_at: 123,
    })
  })
})
