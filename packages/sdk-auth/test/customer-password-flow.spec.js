import nock from 'nock'
import { encode } from 'qss'
import Auth from '../src/auth'
import config from './resources/sample-config'
import response from './resources/sample-response.json'

describe('Customer Password flow', () => {
  const auth = new Auth(config)
  jest.spyOn(Auth, '_calculateExpirationTime').mockImplementation(() => 123)

  beforeEach(() => nock.cleanAll())

  test('should authenticate with correct user credentials', async () => {
    const scope = nock(config.host)
      .post(
        `/oauth/${config.projectKey}/customers/token`,
        encode({
          grant_type: 'password',
          scope: `manage_project:${config.projectKey}`,
          username: 'user123',
          password: 'pass123',
        })
      )
      .reply(200, JSON.stringify(response))

    expect(scope.isDone()).toBe(false)
    const res = await auth.customerPasswordFlow({
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
        `/oauth/${config.projectKey}/customers/token`,
        encode({
          grant_type: 'password',
          scope: `manage_project:${config.projectKey}`,
          username: userCredentials.username,
          password: userCredentials.password,
        })
      )
      .reply(200, JSON.stringify(response))

    expect(scope.isDone()).toBe(false)
    const res = await auth.customerPasswordFlow(userCredentials)
    expect(scope.isDone()).toBe(true)
    expect(res).toEqual({
      ...response,
      expires_at: 123,
    })
  })

  test('should throw an error when credentials are not provided', () => {
    expect(() => auth.customerPasswordFlow()).toThrow(
      'Missing required user credentials (username, password)'
    )
    expect(() => auth.customerPasswordFlow({ username: 'user' })).toThrow(
      'Missing required user credentials (username, password)'
    )
    expect(() => auth.customerPasswordFlow({ password: 'password' })).toThrow(
      'Missing required user credentials (username, password)'
    )
  })
})
