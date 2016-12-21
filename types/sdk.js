/* @flow */

/* Client */
export type ClientRequest = {
  uri: string;
  method: MethodType;
  body?: string | Object;
  headers?: {
    [key: string]: string;
  }
}
export type HttpErrorType = {
  name: string;
  message: string;
  code: number;
  status: number;
  statusCode: number;
  body: Object;
  originalRequest: ClientRequest;
  headers?: {
    [key: string]: string;
  }
}
export type ClientResponse = {
  resolve(): void;
  reject(): void;
  body?: Object;
  error?: HttpErrorType;
  statusCode: number;
}

// eslint-disable-next-line max-len
export type Dispatch = (request: ClientRequest, response: ClientResponse) => any;
export type Middleware = (next: Dispatch) => Dispatch;

export type ClientOptions = {
  middlewares?: Array<Middleware>;
}
export type ClientResult = {
  body: ?Object;
  statusCode: number;
} | HttpErrorType
export type Client = {
  execute: (request: ClientRequest) => Promise<ClientResult>;
}


/* Middlewares */
export type AuthMiddlewareOptions = {
  host?: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
  };
  // TODO: list all supported scopes
  scopes: Array<string>;
}
export type HttpMiddlewareOptions = {
  host?: string;
}
export type QueueMiddlewareOptions = {
  concurrency?: number;
}
