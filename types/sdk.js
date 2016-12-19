/* @flow */

/* Client */
export type Request = {
  uri: string;
  method: MethodType;
  body?: string | Object;
  headers?: {
    [key: string]: string;
  };
}
export type Response = {
  resolve: Function;
  reject: Function;
  body?: Object;
  error?: any;
  statusCode?: number;
}

export type Dispatch = (request: Request, response: Response) => any;
export type Middleware = (next: Dispatch) => Dispatch;

export type ClientOptions = {
  middlewares?: Array<Middleware>;
}
// TODO: specify resolve/reject shape
export type Result = Object
export type Client = {
  execute: (request: Request) => Promise<Result>
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
