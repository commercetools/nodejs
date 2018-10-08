import nock from 'nock'
import Auth from '../src/auth'
import config from './resources/sample-config.json'

describe('Client Credentials flow', () => {
  const auth = new Auth(config)

  beforeEach(() => nock.cleanAll())

  test('should authenticate with correct credentials', async () => {
    const response = {
      access_token: 'wohdwohfowpjf-XNe-i784rh9Zij-B',
      expires_in: 172800,
      scope: `manage_project:${config.projectKey}`,
      refresh_token: 'owhdiwdiwuIhnIjW-bLnJkmFzTTUluM6iq-SVfGjkQzI',
      token_type: 'Bearer',
    }
    const scope = nock(config.host)
      .post(`/oauth/token`, {
        grant_type: 'client_credentials',
        scope: `manage_project:${config.projectKey}`,
      })
      .reply(200, JSON.stringify(response))

    expect(scope.isDone()).toBe(false)
    const res = await auth.clientCredentialsFlow()
    expect(scope.isDone()).toBe(true)
    expect(res).toEqual(response)
  })
})
