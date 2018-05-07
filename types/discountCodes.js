/* @flow */

/* Discount Codes */
export type CodeData = {
  name?: Object,
  description?: Object,
  cartDiscounts: Array<Object>,
  cartPredicate?: string,
  isActive: boolean,
  maxApplications?: number,
  maxApplicationsPerCustomer?: number,
  uri: string,
  code?: string,
  code?: string,
  id?: string,
  version?: number,
  references?: Array<Object>,
  attributeTypes?: Object,
  cartFieldTypes?: Object,
  lineItemFieldTypes?: Object,
  customLineItemFieldTypes?: Object,
  createdAt?: string,
  lastModifiedAt?: string,
  groups: Array<string>,
}

export type CodeDataArray = Array<CodeData>

export type CodeOptions = {
  quantity: number,
  length?: number,
  prefix?: string,
}

export type Summary = {
  created: number,
  updated: number,
  unchanged: number,
  createErrorCount: number,
  updateErrorCount: number,
  errors: Array<any>,
}

/* Logger */
export type LoggerOptions = {
  error: Function,
  info: Function,
  warn: Function,
  verbose: Function,
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

export type ConstructorOptions = {
  apiConfig: ApiConfigOptions,
  batchSize: number,
  accessToken: string,
  continueOnProblems?: boolean,
}

export type ImporterOptions = {
  apiConfig: ApiConfigOptions,
  accessToken?: string,
  batchSize: number,
  delimiter: string,
  exportFormat: string,
  predicate: string,
  multiValueDelimiter: string,
  language?: string,
  headerFields?: Array<string> | null,
}

export type ExporterOptions = ImporterOptions

export type ChunkOptions = Array<Object>

export type ParseOptions = {
  continueOnProblems?: boolean,
  delimiter?: string,
  multiValueDelimiter?: string,
}

export type ParserSummary = {
  total: number,
  parsed: number,
  notParsed: number,
  errors: Array<string>,
}
