/* @flow */

/* Logger */
export type LoggerOptions = {
  error: Function,
  info: Function,
  warn: Function,
  debug: Function,
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

export type CategoryExporterOptions = {
  apiConfig: ApiConfigOptions,
  accessToken?: string,
  predicate?: string,
  logger?: LoggerOptions,
}
