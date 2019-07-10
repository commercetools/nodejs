export type MethodType =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE";

export type VariableMap =  { [key: string]: string | number | boolean | undefined }

export type MiddlewareArg = {
  request: ClientRequest;
  response?: ClientResponse<any>;
  error?: Error;
  next: Middleware;
};

export type ClientRequest = {
  uri: string,
  method: MethodType,
  body?: any,
  headers?: VariableMap,
}

export type ClientResponse<T> = {
  body: T,
  statusCode?: number,
  headers?: Object
}

export type Middleware = (arg: MiddlewareArg) => Promise<MiddlewareArg>;