import nock from 'nock'
import Auth from '../src/auth'
import config from './resources/sample-config'
import response from './resources/sample-response.json'

describe('Custom flow', () => {
  const customHost = 'http://custom.uri'
  const auth = new Auth(config)

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
    expect(res).toEqual(response)
  })
})
