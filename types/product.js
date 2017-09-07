/* @flow */

/* Config */
export type ApiConfigOptions = {
  host: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
  };
  scopes: Array<string>;
  apiUrl?: string;
}

/* Logger */
export type LoggerOptions = {
  error: Function;
  info: Function;
  warn: Function;
  verbose: Function;
}

export type ExportConfigOptions = {
  batch: number;
  expand: string;
  json: boolean;
  predicate: string;
  staged: boolean;
  total: number;
}
