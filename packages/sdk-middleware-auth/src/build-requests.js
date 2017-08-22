/* @flow */
import type {
  AuthMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
} from 'types/sdk'
import * as authScopes from './scopes'

type BuiltRequestParams = {
  basicAuth: string;
  url: string;
  body: string;
}

// POST https://{host}/oauth/token?grant_type=client_credentials&scope={scope}
// Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
export function buildRequestForClientCredentialsFlow (
  options: AuthMiddlewareOptions,
): BuiltRequestParams {
  if (!options)
    throw new Error('Missing required options')

  if (!options.host)
    throw new Error('Missing required option (host)')

  if (!options.projectKey)
    throw new Error('Missing required option (projectKey)')

  if (!options.credentials)
    throw new Error('Missing required option (credentials)')

  const { clientId, clientSecret } = options.credentials

  if (!(clientId && clientSecret))
    throw new Error('Missing required credentials (clientId, clientSecret)')

  const defaultScope = `${authScopes.MANAGE_PROJECT}:${options.projectKey}`
  const scope = (options.scopes || [defaultScope]).join(' ')

  const basicAuth = new Buffer(`${clientId}:${clientSecret}`).toString('base64')
  // This is mostly useful for internal testing purposes to be able to check
  // other oauth endpoints.
  const oauthUri = options.oauthUri || '/oauth/token'
  const url = options.host.replace(/\/$/, '') + oauthUri
  const body = `grant_type=client_credentials&scope=${scope}`

  return { basicAuth, url, body }
}

export function buildRequestForPasswordFlow (
  options: PasswordAuthMiddlewareOptions,
): BuiltRequestParams {
  if (!options)
    throw new Error('Missing required options')

  if (!options.host)
    throw new Error('Missing required option (host)')

  if (!options.projectKey)
    throw new Error('Missing required option (projectKey)')

  if (!options.credentials)
    throw new Error('Missing required option (credentials)')

  const {
    clientId,
    clientSecret,
    user,
  } = options.credentials
  const pKey = options.projectKey
  if (!(clientId && clientSecret && user))
    throw new Error(
      'Missing required credentials (clientId, clientSecret, user)',
    )
  const { username, password } = user
  if (!(username && password))
    throw new Error('Missing required user credentials (username, password)')

  const scope = (options.scopes || []).join(' ')
  const scopeStr = scope ? `&scope=${scope}` : ''


  const basicAuth = new Buffer(`${clientId}:${clientSecret}`).toString('base64')
  // This is mostly useful for internal testing purposes to be able to check
  // other oauth endpoints.
  const oauthUri = options.oauthUri || `/oauth/${pKey}/customers/token`
  const url = options.host.replace(/\/$/, '') + oauthUri
  // eslint-disable-next-line max-len
  const body = `grant_type=password&username=${username}&password=${password}${scopeStr}`

  return { basicAuth, url, body }
}

export function buildRequestForRefreshTokenFlow () {
  // TODO
}

export function buildRequestForAnonymousSessionFlow () {
  // TODO
}
