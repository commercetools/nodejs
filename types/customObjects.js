/* @flow */

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

export type ExporterOptions = {
  apiConfig: ApiConfigOptions,
  accessToken?: string,
  predicate?: string,
}

/* Logger */
export type LoggerOptions = {
  error: Function,
  info: Function,
  warn: Function,
  verbose: Function,
}
