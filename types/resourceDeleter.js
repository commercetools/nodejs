/* @flow */
import type { ClientResult } from 'types/sdk'

/* Logger */
export type LoggerOptions = {
  error: (...args: Array<any>) => void,
  info: (...args: Array<any>) => void,
  warn: (...args: Array<any>) => void,
  debug: (...args: Array<any>) => void,
}

/* Config */
export type ApiConfigOptions = {
  host: string,
  projectKey: string,
  credentials: {
    clientId: string,
    clientSecret: string,
  },
  scopes: Array<string>,
  apiUrl?: string,
}

/* Client */
export type CustomClientResult = ClientResult & {
  id?: string,
  version?: number,
}

/* ResourceDeleter Objects */
export type resourceDeleterOptions = {
  apiConfig: ApiConfigOptions,
  accessToken?: string,
  predicate?: string,
  logger?: LoggerOptions,
  resource: string,
  fetchedResource: CustomClientResult,
}
