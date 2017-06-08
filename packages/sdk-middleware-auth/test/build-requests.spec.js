import {
  buildRequestForClientCredentialsFlow,
  // buildRequestForPasswordFlow,
  // buildRequestForRefreshTokenFlow,
  // buildRequestForAnonymousSessionFlow,
} from '../src/build-requests'
import { scopes } from '../src'

const allScopes = Object.keys(scopes).map(key => scopes[key])

function createTestOptions (options) {
  return {
    host: 'http://localhost:8080',
    projectKey: 'test',
    credentials: {
      clientId: '123',
      clientSecret: 'secret',
    },
    scopes: allScopes,
    ...options,
  }
}

describe('buildRequestForClientCredentialsFlow', () => {
  it('build request values with all the given options', () => {
    const options = createTestOptions()
    expect(buildRequestForClientCredentialsFlow(options)).toEqual({
      basicAuth: 'MTIzOnNlY3JldA==',
      url: 'http://localhost:8080/oauth/token',
      body: `grant_type=client_credentials&scope=${allScopes.join(' ')}`,
    })
  })

  it('uses custom oauth uri, if given', () => {
    const options = createTestOptions({ oauthUri: '/foo/bar' })
    expect(buildRequestForClientCredentialsFlow(options)).toEqual({
      basicAuth: 'MTIzOnNlY3JldA==',
      url: 'http://localhost:8080/foo/bar',
      body: `grant_type=client_credentials&scope=${allScopes.join(' ')}`,
    })
  })

  it('parses a host that ends with slash', () => {
    const options = createTestOptions({
      host: 'http://localhost:8080/',
    })
    expect(buildRequestForClientCredentialsFlow(options)).toEqual({
      basicAuth: 'MTIzOnNlY3JldA==',
      url: 'http://localhost:8080/oauth/token',
      body: `grant_type=client_credentials&scope=${allScopes.join(' ')}`,
    })
  })

  it('parses a host that ends without slash', () => {
    const options = createTestOptions({
      host: 'http://localhost:8080',
    })
    expect(buildRequestForClientCredentialsFlow(options)).toEqual({
      basicAuth: 'MTIzOnNlY3JldA==',
      url: 'http://localhost:8080/oauth/token',
      body: `grant_type=client_credentials&scope=${allScopes.join(' ')}`,
    })
  })

  it('validate required options', () => {
    expect(
      () => buildRequestForClientCredentialsFlow(),
    ).toThrowError('Missing required options')
  })

  it('validate required option (host)', () => {
    expect(
      () => buildRequestForClientCredentialsFlow({}),
    ).toThrowError('Missing required option (host)')
  })

  it('validate required option (projectKey)', () => {
    const options = createTestOptions({
      projectKey: undefined,
    })
    expect(
      () => buildRequestForClientCredentialsFlow(options),
    ).toThrowError('Missing required option (projectKey)')
  })

  it('validate required option (credentials)', () => {
    const options = createTestOptions({
      credentials: undefined,
    })
    expect(
      () => buildRequestForClientCredentialsFlow(options),
    ).toThrowError('Missing required option (credentials)')
  })

  it('validate required option (clientId, clientSecret)', () => {
    const options = createTestOptions({
      credentials: {},
    })
    expect(
      () => buildRequestForClientCredentialsFlow(options),
    ).toThrowError('Missing required credentials (clientId, clientSecret)')
  })

  it('validate both credentials are required', () => {
    const options = createTestOptions({
      credentials: { clientId: '123' },
    })
    expect(
      () => buildRequestForClientCredentialsFlow(options),
    ).toThrowError('Missing required credentials (clientId, clientSecret)')
  })
})
