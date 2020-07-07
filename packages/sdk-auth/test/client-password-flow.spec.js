import nock from 'nock'
import querystring from 'querystring'
import Auth from '../src/auth'
import config from './resources/sample-config'
import response from './resources/sample-response.json'

describe('Client Password flow', () => {
  const auth = new Auth(config)
  jest.spyOn(Auth, '_calculateExpirationTime').mockImplementation(() => 123)

  beforeEach(() => nock.cleanAll())

  test('should authenticate with correct user credentials', async () => {
    const scope = nock(config.host)
      .post(
        `/oauth/token`,
        querystring.encode({
          grant_type: 'password',
          scope: `manage_project:${config.projectKey}`,
          username: 'user123',
          password: 'pass123',
        })
      )
      .reply(200, JSON.stringify(response))

    expect(scope.isDone()).toBe(false)
    const res = await auth.clientPasswordFlow({
      username: 'user123',
      password: 'pass123',
    })
    expect(scope.isDone()).toBe(true)
    expect(res).toEqual({
      ...response,
      expires_at: 123,
    })
  })

  test('should encode username and password', async () => {
    const userCredentials = {
      username: 'user 4^l*aJ@ETso+/\\HdE1!x0u4q5',
      password: 'pass 4^l*aJ@ETso+/\\HdE1!x0u4q5',
    }
    const scope = nock(config.host)
      .post(
        `/oauth/token`,
        // expected body
        querystring.encode({
          grant_type: 'password',
          scope: `manage_project:${config.projectKey}`,
          username: userCredentials.username,
          password: userCredentials.password,
        })
      )
      .reply(200, JSON.stringify(response))

    expect(scope.isDone()).toBe(false)
    const res = await auth.clientPasswordFlow(userCredentials)
    expect(scope.isDone()).toBe(true)
    expect(res).toEqual({
      ...response,
      expires_at: 123,
    })
  })

  test('should disable refresh_token when set in configuration', async () => {
    const userCredentials = {
      username: 'user',
      password: 'pass',
    }
    const scope = nock(config.host)
      .post(
        `/oauth/token`,
        querystring.encode({
          grant_type: 'password',
          refresh_token: false,
          scope: `manage_project:${config.projectKey}`,
          username: 'user',
          password: 'pass',
        })
      )
      .reply(200, JSON.stringify(response))

    expect(scope.isDone()).toBe(false)
    const res = await auth.clientPasswordFlow(userCredentials, {
      disableRefreshToken: true,
    })
    expect(scope.isDone()).toBe(true)
    expect(res).toEqual({
      ...response,
      expires_at: 123,
    })
  })

  test('should throw an error when credentials are not provided', () => {
    expect(() => auth.clientPasswordFlow()).toThrow(
      'Missing required user credentials (username, password)'
    )
    expect(() => auth.clientPasswordFlow({ username: 'user' })).toThrow(
      'Missing required user credentials (username, password)'
    )
    expect(() => auth.clientPasswordFlow({ password: 'password' })).toThrow(
      'Missing required user credentials (username, password)'
    )
  })
})
