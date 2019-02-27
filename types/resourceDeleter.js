/* @flow */

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
// eslint-disable-next-line max-len
export type MethodType =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'PUT'
  | 'PATCH'
  | 'TRACE'

export type ClientRequest = {
  uri: string,
  method: MethodType,
  body?: string | Object,
  headers?: {
    [key: string]: string,
  },
}

export type HttpErrorType = {
  name: string,
  message: string,
  code: number,
  status: number,
  statusCode: number,
  originalRequest: ClientRequest,
  body?: Object,
  headers?: {
    [key: string]: string,
  },
}

export type SuccessResult = {
  body: Object,
  statusCode: number,
  headers?: Object,
}

export type ClientResult = SuccessResult | HttpErrorType

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
