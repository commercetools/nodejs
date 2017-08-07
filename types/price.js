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

export type Configuration = {
  accessToken: string;
  delimiter: string;
  exportFormat: string;
  predicate: string;
  staged: boolean;
  csvHeaders: Array<string>;
}

export type ExporterOptions = {
  apiConfig: ApiConfigOptions;
  accessToken?: string;
  delimiter: string;
  exportFormat: string;
  predicate: string;
  staged: boolean;
  csvHeaders?: Array<string>;
}

/* Logger */
export type LoggerOptions = {
  error: Function;
  info: Function;
  warn: Function;
  verbose: Function;
}

/* Price */
export type currencyValue = {
  currencyCode: string;
  centAmount: number;
}

export type customerGroup = {
  groupName: string;
}

export type channel = {
  key: string;
}

export type ProcessedPriceObject = {
  value: currencyValue;
  country?: string;
  id?: string;
  customerGroup?: customerGroup;
  'variant-sku'?: string;
  customType?: string;
  customField: Object;
  channel?: channel;
}

export type reference = {
  typeId: string;
  id: string;
}

export type customReference = {
  type: reference;
  fields: Object;
}

export type UnprocessedPriceObject = {
  value: currencyValue;
  country?: string;
  id?: string;
  customerGroup?: reference;
  channel?: reference;
  custom?: customReference;
  'variant-sku'?: string;
}

