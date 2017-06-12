/* @flow */
import type { AuthMiddlewareOptions } from 'types/sdk'

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
  code?: string;
  id?: string;
  version?: number;
}

export type CodeDataArray = Array<CodeData>

export type CodeOptions = {
  quantity: number;
  length?: number;
  prefix?: string;
}

export type Summary = {
  created: number;
  updated: number;
  unchanged: number;
  createErrorCount: number;
  updateErrorCount: number;
  errors: Array<any>;
}

/* Logger */
export type LoggerOptions = {
  error: Function;
  info: Function;
  warn: Function;
  verbose: Function;
}

/* Config */
export type ConstructorOptions = {
  apiConfig: AuthMiddlewareOptions;
  batchSize: number;
  continueOnProblems?: boolean;
}

export type ChunkOptions = Array<Object>
