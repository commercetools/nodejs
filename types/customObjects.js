/* @flow */

/* Custom Objects */

type Values = number | string | boolean | Array<Values> | Object

export type CustomObjectDraft = {
  container: string,
  key: string,
  value: number | string | boolean | Array<Values> | Object,
  version?: number,
}

export type CustomObject = {
  id: String,
  createdAt: number,
  lastModifiedAt: number,
  container: string,
  key: string,
  value: number | string | boolean | Array<Values> | Object,
  version: number,
}

export type ExecutionResult = Promise<Error | void>

/* Summary */

export type Summary = {
  created: number,
  updated: number,
  unchanged: number,
  createErrorCount: number,
  updateErrorCount: number,
  errors: Array<any>,
}

export type SummaryReport = {
  reportMessage: string,
  detailedSummary: Summary,
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
  apiUrl?: string,
}

export type ExporterOptions = {
  apiConfig: ApiConfigOptions,
  accessToken?: string,
  predicate?: string,
  logger?: LoggerOptions,
  batchSize?: number,
  continueOnProblems?: boolean,
}
