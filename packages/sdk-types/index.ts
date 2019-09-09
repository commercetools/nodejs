export type JsonObject<T = unknown> = { [key: string]: T }

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
  uri: string
  method: MethodType
  body?: string | JsonObject
  headers?: JsonObject<string>
}
export type HttpErrorType = {
  name: string
  message: string
  code: number
  status: number
  statusCode: number
  originalRequest: ClientRequest
  body?: JsonObject
  headers?: JsonObject<string>
}

/* Middlewares */
export type MiddlewareRequest = ClientRequest
export type MiddlewareResponse = {
  resolve(response: JsonObject): void
  reject(error: JsonObject): void
  body?: JsonObject
  error?: HttpErrorType
  statusCode: number
  headers?: JsonObject<string>
  request?: JsonObject
}
export type Dispatch = (
  request: MiddlewareRequest,
  response: MiddlewareResponse
) => unknown
export type Middleware = (next: Dispatch) => Dispatch
