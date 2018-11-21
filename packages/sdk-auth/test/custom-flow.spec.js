import nock from 'nock'
import Auth from '../src/auth'
import config from './resources/sample-config'
import response from './resources/sample-response.json'

describe('Custom flow', () => {
  const customHost = 'http://custom.uri'
  const auth = new Auth(config)
  jest.spyOn(Auth, '_calculateExpirationTime').mockImplementation(() => 123)

  beforeEach(() => nock.cleanAll())

  test('should authenticate with a custom flow', async () => {
    const scope = nock(customHost)
      .post('/custom-endpoint', {
        user: 'user',
        password: 'pass',
      })
      .reply(200, JSON.stringify(response))

    expect(scope.isDone()).toBe(false)
    const res = await auth.customFlow({
      uri: '/custom-endpoint',
      host: customHost,
      body: 'user=user&password=pass',
    })

    expect(scope.isDone()).toBe(true)
    expect(res).toEqual({
      ...response,
      expires_at: 123,
    })
  })

  test('should authenticate with a custom flow and user credentials', async () => {
    const scope = nock(customHost, {
      reqheaders: {
        Authorization: 'Bearer 123',
      },
    })
      .post('/custom-endpoint', {
        username: 'user',
        password: 'pass',
      })
      .reply(200, JSON.stringify(response))

    expect(scope.isDone()).toBe(false)
    const res = await auth.customFlow({
      authType: 'Bearer',
      token: '123',
      uri: '/custom-endpoint',
      host: customHost,
      credentials: {
        username: 'user',
        password: 'pass',
      },
    })

    expect(scope.isDone()).toBe(true)
    expect(res).toEqual({
      ...response,
      expires_at: 123,
    })
  })

  test('should set custom headers', async () => {
    const scope = nock(customHost, {
      reqheaders: {
        'Content-Type': 'application/json',
      },
    })
      .post(
        '/custom-endpoint',
        JSON.stringify({
          a: 'b',
        })
      )
      .reply(200, JSON.stringify(response))

    expect(scope.isDone()).toBe(false)
    const res = await auth.customFlow({
      headers: {
        'Content-Type': 'application/json',
      },
      uri: '/custom-endpoint',
      host: customHost,
      body: JSON.stringify({
        a: 'b',
      }),
    })

    expect(scope.isDone()).toBe(true)
    expect(res).toEqual({
      ...response,
      expires_at: 123,
    })
  })
})
