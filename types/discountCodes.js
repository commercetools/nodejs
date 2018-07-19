/* @flow */

/* CustomField */
type TypeReference = {
  typeId: string,
  id: string,
}
type CustomField = {
  type: TypeReference,
  fields: Object,
}

/* CartDiscountDraft */
export type CartDiscountDraft = {
  name: Object,
  description?: Object,
  value: mixed,
  cartPredicate: string,
  target?: Object,
  sortOrder: string,
  isActive?: boolean,
  validFrom?: string,
  validUntil?: string,
  requiresDiscountCode: boolean,
  stackingMode?: Object,
  custom?: CustomField,
}

/* CartDiscount */
export type CartDiscount = CartDiscountDraft & {
  id: string,
  version: number,
  createdAt: string,
  lastModifiedAt: string,
  isActive: boolean,
  requiresDiscountCode: boolean,
  references: Array<Object>,
  stackingMode: Object,
}

/* DiscountCodeDraft */
export type DiscountCodeDraft = {
  name?: Object,
  description?: Object,
  code: string,
  cartDiscounts: Array<Object>,
  cartPredicate?: string,
  groups?: Array<string>,
  isActive: boolean,
  validFrom?: string,
  validUntil?: string,
  maxApplications?: number,
  maxApplicationsPerCustomer?: number,
  custom?: CustomField,
}

/* DiscountCode */
export type DiscountCode = DiscountCodeDraft & {
  id: string,
  version: number,
  createdAt: string,
  lastModifiedAt: string,
  groups: Array<string>,
  references: Array<Object>,
}

export type CodeDataArray = Array<DiscountCode>

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
  fields?: Array<string> | null,
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
