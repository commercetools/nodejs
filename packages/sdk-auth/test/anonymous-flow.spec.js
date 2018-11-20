import nock from 'nock'
import Auth from '../src/auth'
import config from './resources/sample-config'
import response from './resources/sample-response.json'

describe('Anonymous flow', () => {
  const auth = new Auth(config)
  jest.spyOn(Auth, '_calculateExpirationTime').mockImplementation(() => 123)

  beforeEach(() => nock.cleanAll())

  test('should authenticate without anonymousId', async () => {
    const scope = nock(config.host)
      .post(`/oauth/${config.projectKey}/anonymous/token`, {
        grant_type: 'client_credentials',
        scope: `manage_project:${config.projectKey}`,
        // no anonymousId
      })
      .reply(200, JSON.stringify(response))

    expect(scope.isDone()).toBe(false)
    const res = await auth.anonymousFlow()

    expect(scope.isDone()).toBe(true)
    expect(res).toEqual({
      ...response,
      expires_at: 123,
    })
  })

  test('should authenticate with anonymousId', async () => {
    const scope = nock(config.host)
      .post(`/oauth/${config.projectKey}/anonymous/token`, {
        grant_type: 'client_credentials',
        scope: `manage_project:${config.projectKey}`,
        anonymous_id: '123',
      })
      .reply(200, JSON.stringify(response))

    expect(scope.isDone()).toBe(false)
    const res = await auth.anonymousFlow(123)

    expect(scope.isDone()).toBe(true)
    expect(res).toEqual({
      ...response,
      expires_at: 123,
    })
  })
})
