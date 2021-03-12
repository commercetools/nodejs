/* @flow */
/* eslint-disable no-use-before-define */

export type MethodType =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'PUT'
  | 'PATCH'
  | 'TRACE'

export type HttpHeaders = {
  [key: string]: string,
}

/* Client */
export type ClientRequest = {
  uri: string,
  method: MethodType,
  body?: string | Object,
  headers?: HttpHeaders,
}
export type AuthRequest = {
  uri: string,
  body: string,
  basicAuth: string,
  authType: string,
  headers?: HttpHeaders,
}
export type HttpErrorType = {
  name: string,
  message: string,
  code: number,
  status: number,
  statusCode: number,
  originalRequest: ClientRequest,
  body?: Object,
  headers?: HttpHeaders,
}
export type ClientResponse = {
  body?: Object,
  error?: HttpErrorType,
  statusCode: number,
  headers?: HttpHeaders,
  request?: Object,
}

export type SuccessResult = {
  body: Object,
  statusCode: number,
  headers?: HttpHeaders,
}
export type ClientResult = SuccessResult | HttpErrorType
export type Client = {
  execute: (request: ClientRequest) => Promise<ClientResult>,
  process: (
    request: ClientRequest,
    processFn: Function,
    Object
  ) => Promise<any>,
}
export type ProcessFn = (result: SuccessResult) => Promise<any>
export type ProcessOptions = {
  accumulate?: boolean,
  total?: number,
  disableSort?: boolean,
}

/* Middlewares */
export type MiddlewareRequest = ClientRequest
export type MiddlewareResponse = {
  resolve(response: Object): void,
  reject(error: Object): void,
  body?: Object,
  error?: HttpErrorType,
  statusCode: number,
  headers?: HttpHeaders,
  request?: Object,
}
// eslint-disable-next-line max-len
export type Dispatch = (
  request: MiddlewareRequest,
  response: MiddlewareResponse
) => any
export type Middleware = (next: Dispatch) => Dispatch
export type ClientOptions = {
  middlewares: Array<Middleware>,
}

export type AuthMiddlewareOptions = {
  host: string,
  projectKey: string,
  credentials: {
    clientId: string,
    clientSecret: string,
    anonymousId?: string,
  },
  scopes: Array<string>,
  // For internal usage only
  oauthUri: string,
  fetch?: typeof fetch,
  tokenCache?: TokenCache,
}

export type AuthOptions = {
  host: string,
  token?: string,
  authType?: string,
  projectKey?: string,
  disableRefreshToken?: boolean,
  credentials: {
    clientId: string,
    clientSecret: string,
  },
  headers?: HttpHeaders,
  scopes?: Array<string>,
  fetch?: typeof fetch,
}

export type CustomAuthOptions = {
  host?: string,
  token?: string,
  authType?: string,
  projectKey?: string,
  disableRefreshToken?: boolean,
  credentials?: {
    clientId: string,
    clientSecret: string,
  },
  headers?: HttpHeaders,
  scopes?: Array<string>,
  fetch?: typeof fetch,
}

export type TokenInfo = {
  refresh_token: string,
  access_token: string,
  expires_at: number,
  expires_in?: number,
  scope?: string,
  token_type?: string,
}

export type RefreshAuthMiddlewareOptions = {
  host: string,
  projectKey: string,
  credentials: {
    clientId: string,
    clientSecret: string,
  },
  refreshToken: string,
  // For internal usage only
  oauthUri: string,
  fetch?: typeof fetch,
}

export type Task = {
  request: MiddlewareRequest,
  response: MiddlewareResponse,
  next: Next,
}

export type RequestState = boolean
export type TokenStore = {
  token: string,
  expirationTime: number,
  refreshToken?: string,
}

export type TokenCacheOptions = {
  clientId: string,
  projectKey: string,
  host: string,
}

export type TokenCache = {
  get: (tokenCacheOptions?: TokenCacheOptions) => TokenStore,
  set: (cache: TokenStore, tokenCacheOptions?: TokenCacheOptions) => void,
}

/* Request */

type requestBaseOptions = {
  response: MiddlewareResponse,
  url: string,
  body: string,
  basicAuth: string,
  pendingTasks: Array<Task>,
  requestState: {
    get: () => RequestState,
    set: (requestState: RequestState) => void,
  },
  tokenCache: TokenCache,
  tokenCacheKey?: TokenCacheOptions,
}
export type executeRequestOptions = requestBaseOptions & {
  fetcher: typeof fetch,
}

export type AuthMiddlewareBaseOptions = requestBaseOptions & {
  request: MiddlewareRequest,
  fetch?: typeof fetch,
}

export type UserAuthOptions = {
  username: string,
  password: string,
}

export type ClientAuthOptions = {
  clientId: string,
  clientSecret: string,
}

export type PasswordAuthMiddlewareOptions = {
  host: string,
  projectKey: string,
  credentials: {
    clientId: string,
    clientSecret: string,
    user: UserAuthOptions,
  },
  scopes: Array<string>,
  // For internal usage only
  oauthUri: string,
  fetch?: typeof fetch,
}

export type HttpMiddlewareOptions = {
  host: string,
  credentialsMode?: 'omit' | 'same-origin' | 'include',
  includeHeaders?: boolean,
  includeResponseHeaders?: boolean,
  includeOriginalRequest?: boolean,
  maskSensitiveHeaderData?: boolean,
  timeout?: number,
  enableRetry?: boolean,
  retryConfig?: {
    maxRetries?: number,
    retryDelay?: number,
    backoff?: boolean,
    maxDelay?: number,
  },
  fetch?: typeof fetch,
  abortController?: AbortController, // deprecated
  getAbortController: () => AbortController,
}
export type QueueMiddlewareOptions = {
  concurrency: number,
}
export type UserAgentMiddlewareOptions = {
  libraryName?: string,
  libraryVersion?: string,
  contactUrl?: string,
  contactEmail?: string,
}

export type Next = (
  request: MiddlewareRequest,
  response: MiddlewareResponse
) => mixed

/* API Request Builder */
export type ServiceBuilderDefaultParams = {
  expand: Array<string>,
  searchKeywords: Array<{ lang: string, value: string }>,
  pagination: {
    page: ?number,
    perPage: ?number,
    sort: Array<string>,
    withTotal: ?boolean,
  },
  id?: ?string,
  staged?: boolean,
  priceCurrency?: string,
  priceCountry?: string,
  priceCustomerGroup?: string,
  priceChannel?: string,
  query?: {
    operator: 'and' | 'or',
    where: Array<string>,
  },
  location?: {
    country?: string,
    currency?: string,
    state?: string,
  },
  search?: {
    facet: Array<string>,
    filter: Array<string>,
    filterByQuery: Array<string>,
    filterByFacets: Array<string>,
    fuzzy: boolean,
    fuzzyLevel: number,
    markMatchingVariants: boolean,
    text: ?{
      lang: string,
      value: string,
    },
  },
  version?: number,
  customerId?: string,
  cartId?: string,
  dataErasure?: string,
  applyOrderEditTo?: string,
}
export type ServiceBuilderParams = {
  // query-expand
  expand?: Array<string>,

  // query-id
  id?: ?string,
  key?: ?string,
  customerId?: ?string,
  cartId?: ?string,

  // query-page
  sort: Array<{ by: string, direction: 'asc' | 'desc' }>,
  page: ?number,
  perPage: ?number,
  withTotal: ?boolean,

  // query-projection
  staged?: boolean,
  priceCurrency?: string,
  priceCountry?: string,
  priceCustomerGroup?: string,
  priceChannel?: string,

  // query-search
  text?: ?{
    language?: string,
    value?: string,
  },
  fuzzy?: boolean,
  fuzzyLevel?: number,
  markMatchingVariants?: boolean,
  facet?: Array<string>,
  filter?: Array<string>,
  filterByQuery?: Array<string>,
  filterByFacets?: Array<string>,

  // query-suggest
  searchKeywords?: Array<{ language: string, value: string }>,

  // query
  where?: Array<string>,
  whereOperator?: 'and' | 'or',

  // query-location
  country?: string,
  currency?: string,
  state?: string,

  // version
  version?: string,

  // data-erasure
  dataErasure?: string,

  // applyOrderEditTo
  applyOrderEditTo?: boolean,

  // container
  container?: ?string,

  // params
  orderNumber?: number,
}
export type ServiceBuilder = {
  type: string,
  features: Array<string>,
  params: ServiceBuilderDefaultParams,
  build(): string,
}
export type ServiceBuilderDefinition = {
  type: string,
  endpoint: string,
  features: Array<string>,
}
export type ServiceBuilderInstance = {
  withVersion: (version: number) => Object,
  withFullDataErasure(): Object,
  where: (predicate: string) => Object,
  whereOperator: (option: string) => Object,
  sort: (option: string) => Object,
  page: (page: number) => Object,
  perPage: (amount: number) => Object,
  withTotal(value: boolean): Object,
  byId: (id: string) => Object,
  byKey: (key: string) => Object,
  byCustomerId: (id: string) => Object,
  byCartId: (id: string) => Object,
  expand: (string: string) => Object,
  build(): string,
  parse(): string,
}
export type ApiRequestBuilder = {
  [key: string]: ServiceBuilder,
}

/* HTTP User Agent */
export type HttpUserAgentOptions = {
  name: string,
  version?: string,
  libraryName?: string,
  libraryVersion?: string,
  contactUrl?: string,
  contactEmail?: string,
}

/* Sync Actions */
export type UpdateAction = {
  action: string,
  [key: string]: any,
}
export type SyncAction = {
  buildActions: (now: Object, before: Object) => Array<UpdateAction>,
}
export type SyncActionConfig = {
  shouldOmitEmptyString: boolean,
}
export type ActionGroup = {
  type: string,
  group: 'ignore' | 'allow',
}

export type ExistingTokenMiddlewareOptions = {
  force?: boolean,
}

export type CorrelationIdMiddlewareOptions = {
  generate: () => string,
}
