/* @flow */

/* States */
type StateType =
  | 'OrderState'
  | 'LineItemState'
  | 'ProductState'
  | 'ReviewState'
  | 'PaymentState'

type StateRole = 'ReviewIncludedInStatistics' | 'Return'

type StateReference = {
  typeId: 'state',
  id: string,
}

export type StateData = {
  id?: string,
  version?: number,
  createdAt?: string,
  lastModifiedAt?: string,
  key: string,
  type: StateType,
  name?: Object,
  description?: Object,
  initial?: boolean,
  builtIn?: boolean,
  roles?: Array<StateRole>,
  transitions?: Array<StateReference>,
}

export type StateWithStringTransitions = {
  key: string,
  type: StateType,
  name?: Object,
  description?: Object,
  initial?: boolean,
  builtIn?: boolean,
  roles?: Array<StateRole>,
  transitions?: string,
}

export type StateWithUnresolvedTransitions = {
  key: string,
  type: StateType,
  name?: Object,
  description?: Object,
  initial?: boolean,
  builtIn?: boolean,
  roles?: Array<StateRole>,
  transitions: Array<string>,
}

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
  apiUrl: string,
}

export type CsvOptions = {
  delimiter: string,
  multiValueDelimiter: string,
}

export type ConstructorOptions = {
  apiConfig: ApiConfigOptions,
  accessToken: string,
  continueOnProblems: boolean,
  csvConfig?: CsvOptions,
}

export type Summary = {
  created: number,
  updated: number,
  unchanged: number,
  errors: {
    create: Array<any>,
    update: Array<any>,
  },
}
