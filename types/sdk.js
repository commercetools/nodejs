/* @flow */

// eslint-disable-next-line max-len
export type MethodType = 'GET' | 'POST' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PUT' | 'PATCH' | 'TRACE';

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
  originalRequest: ClientRequest;
  body?: Object;
  headers?: {
    [key: string]: string;
  }
}
export type ClientResponse = {
  body?: Object;
  error?: HttpErrorType;
  statusCode: number;
  headers?: Object;
  request?: Object;
}

export type SuccessResult = {
  body: Object;
  statusCode: number;
  headers?: Object;
}
export type ClientResult = SuccessResult | HttpErrorType
export type Client = {
  execute: (request: ClientRequest) => Promise<ClientResult>;
  process: (
    request: ClientRequest, processFn: Function, Object
  ) => Promise<any>;
}
export type ProcessFn = (result: SuccessResult) => Promise<any>;
export type ProcessOptions = {
  accumulate?: boolean;
}

/* Middlewares */
export type MiddlewareRequest = ClientRequest;
export type MiddlewareResponse = {
  resolve(response: Object): void;
  reject(error: Object): void;
  body?: Object;
  error?: HttpErrorType;
  statusCode: number;
  headers?: Object;
  request?: Object;
}
// eslint-disable-next-line max-len
export type Dispatch = (request: MiddlewareRequest, response: MiddlewareResponse) => any;
export type Middleware = (next: Dispatch) => Dispatch;
export type ClientOptions = {
  middlewares: Array<Middleware>;
}
export type AuthMiddlewareOptions = {
  host: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
  };
  scopes: Array<string>;
  // For internal usage only
  oauthUri: string;
}
export type HttpMiddlewareOptions = {
  host: string;
  includeHeaders?: boolean;
  includeResponseHeaders?: boolean;
  includeOriginalRequest?: boolean;
}
export type QueueMiddlewareOptions = {
  concurrency: number;
}
export type UserAgentMiddlewareOptions = {
  libraryName?: string;
  libraryVersion?: string;
  contactUrl?: string;
  contactEmail?: string;
}


/* API Request Builder */
export type ServiceBuilderDefaultParams = {
  expand: Array<string>;
  searchKeywords: Array<{lang: string; value: string;}>;
  pagination: {
    page: ?number;
    perPage: ?number;
    sort: Array<string>;
  };
  id?: ?string;
  staged?: boolean;
  priceCurrency?: string;
  priceCountry?: string;
  priceCustomerGroup?: string;
  priceChannel?: string;
  query?: {
    operator: 'and' | 'or';
    where: Array<string>;
  };
  search?: {
    facet: Array<string>;
    filter: Array<string>;
    filterByQuery: Array<string>;
    filterByFacets: Array<string>;
    fuzzy: boolean;
    fuzzyLevel: number;
    markMatchingVariants: boolean;
    text: ?{
      lang: string;
      value: string;
    };
  };
}
export type ServiceBuilder = {
  type: string;
  features: Array<string>;
  params: ServiceBuilderDefaultParams;
  build(): string;
}
export type ServiceBuilderDefinition = {
  type: string;
  endpoint: string;
  features: Array<string>;
}
export type ApiRequestBuilder = {
  [key: string]: ServiceBuilder;
}


/* HTTP User Agent */
export type HttpUserAgentOptions = {
  name: string;
  version?: string;
  libraryName?: string;
  libraryVersion?: string;
  contactUrl?: string;
  contactEmail?: string;
}


/* Sync Actions */
export type UpdateAction = {
  action: string;
  [key: string]: any;
}
export type SyncAction = {
  buildActions: (before: Object, now: Object) => Array<UpdateAction>;
}
export type ActionGroup = {
  type: string;
  group: 'black' | 'white';
}
