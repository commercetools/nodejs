/* @flow */

/* Discount Codes */
export type CodeData = {
  name?: Object;
  description?: Object;
  cartDiscounts: Array<string>;
  cartPredicate?: string;
  isActive: boolean;
  maxApplications?: number;
  maxApplicationsPerCustomer?: number;
  uri: string;
  code?: string;
}

export type CodeDataArray = Array<CodeData>

export type CodeOptions = {
  quantity: number;
  length?: number;
  prefix?: string;
}

/* Logger */
export type LoggerOptions = {
  error: Function;
  info: Function;
  warn: Function;
  verbose: Function;
}

export type ParseOptions = {
  continueOnProblems?: boolean;
  delimiter?: string;
  multiValueDelimiter?: string;
  maxErrors?: number;
}

export type ParserSummary = {
  total: number;
  parsed: number;
  notParsed: number;
  errors: Array<string>;
}
