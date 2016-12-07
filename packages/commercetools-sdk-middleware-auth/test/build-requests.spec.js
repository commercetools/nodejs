import {
  buildRequestForClientCredentialsFlow,
  // buildRequestForPasswordFlow,
  // buildRequestForRefreshTokenFlow,
  // buildRequestForAnonymousSessionFlow,
  getBasicAuth,
} from '../src/build-requests'
import * as scopes from '../src/scopes'

const allScopes = Object.values(scopes)

describe('buildRequestForClientCredentialsFlow', () => {
  it('build request values with all the given options', () => {
    const options = {
      host: 'http://localhost:8080',
      projectKey: 'test',
      credentials: {
        clientId: '123',
        clientSecret: 'secret',
      },
      scopes: allScopes,
    }
    expect(buildRequestForClientCredentialsFlow(options)).toEqual({
      basicAuth: 'MTIzOnNlY3JldA==',
      url: 'http://localhost:8080/oauth/token',
      body: `grant_type=client_credentials&scope=${allScopes.join(' ')}`,
    })
  })

  it('build request values with default options', () => {
    const options = {
      projectKey: 'test',
      credentials: {
        clientId: '123',
        clientSecret: 'secret',
      },
    }
    expect(buildRequestForClientCredentialsFlow(options)).toEqual({
      basicAuth: 'MTIzOnNlY3JldA==',
      url: 'https://auth.sphere.io/oauth/token',
      body: 'grant_type=client_credentials&scope=manage_project:test',
    })
  })

  it('validate required option (projectKey)', () => {
    const options = {
      credentials: {
        clientId: '123',
        clientSecret: 'secret',
      },
    }
    expect(
      () => buildRequestForClientCredentialsFlow(options),
    ).toThrowError('Missing required option (projectKey)')
  })

  it('validate required option (credentials)', () => {
    const options = {
      projectKey: 'test',
    }
    expect(
      () => buildRequestForClientCredentialsFlow(options),
    ).toThrowError('Missing required option (credentials)')
  })

  it('validate required option (clientId, clientSecret)', () => {
    const options = {
      projectKey: 'test',
      credentials: {},
    }
    expect(
      () => buildRequestForClientCredentialsFlow(options),
    ).toThrowError('Missing required credentials (clientId, clientSecret)')

    it('both credentials are required', () => {
      const options2 = {
        projectKey: 'test',
        credentials: { clientId: '123' },
      }
      expect(
        () => buildRequestForClientCredentialsFlow(options2),
      ).toThrowError('Missing required credentials (clientId, clientSecret)')
    })
  })
})

describe('getBasicAuth', () => {
  it('return encoded base64 value', () => {
    expect(getBasicAuth('foo', 'bar', {})).toBe('Zm9vOmJhcg==')
  })

  it('simulate encoding in browser environment', () => {
    const spy = jest.fn((value) => {
      expect(value).toBe('foo:bar')
      return new Buffer(value).toString('base64')
    })
    expect(getBasicAuth('foo', 'bar', { btoa: spy })).toBe('Zm9vOmJhcg==')
  })
})
