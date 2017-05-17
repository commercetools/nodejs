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
  error: () => mixed;
  info: () => mixed;
  warn: () => mixed;
  verbose: () => mixed;
}

/* Config */
export type ApiConfigOptions = {
  oauthUri: string;
  projectKey: string;
  credentials?: {
    clientId: string;
    clientSecret: string;
  };
  scopes?: Array<string>;
  apiUrl: string;
}

export type ChunkOptions = Array<Object>
