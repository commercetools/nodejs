/* @flow */
import type {
  AuthMiddlewareOptions,
} from 'types/sdk'

/* global window */
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

  const basicAuth = getBasicAuth(clientId, clientSecret)
  const url = `${options.host}/oauth/token`
  const body = `grant_type=client_credentials&scope=${scope}`

  return { basicAuth, url, body }
}

export function buildRequestForPasswordFlow () {
  // TODO
}

export function buildRequestForRefreshTokenFlow () {
  // TODO
}

export function buildRequestForAnonymousSessionFlow () {
  // TODO
}

export function getBasicAuth (
  username: string,
  password: string,
  windowObject: Object = window,
): string {
  const basicAuth = `${username}:${password}`
  if (
    windowObject &&
    windowObject.btoa &&
    typeof windowObject.btoa === 'function'
  )
    return windowObject.btoa(basicAuth)

  return new Buffer(basicAuth).toString('base64')
}
