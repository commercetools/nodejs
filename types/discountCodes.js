/* @flow */

export type loggerOptions = {
  error: () => mixed;
  info: () => mixed;
  warn: () => mixed;
  verbose: () => mixed;
}

export type apiConfigOptions = {
  oauthUri: string;
  projectKey: string;
  credentials?: {
    clientId: string;
    clientSecret: string;
  };
  scopes?: Array<string>;
  apiUrl: string;
}

export type chunkOptions = Array<Object>
