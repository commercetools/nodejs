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
export type ClientResponse = {
  resolve: Function;
  reject: Function;
  body?: Object;
  error?: any;
  statusCode?: number;
}

// eslint-disable-next-line max-len
export type Dispatch = (request: ClientRequest, response: ClientResponse) => any;
export type Middleware = (next: Dispatch) => Dispatch;

export type ClientOptions = {
  middlewares?: Array<Middleware>;
}
// TODO: specify resolve/reject shape
export type ClientResult = Object;
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
