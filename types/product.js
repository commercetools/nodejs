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
  debug: Function;
}

export type ParserConfigOptions = {
  delimiter: string;
  multiValueDelimiter: string;
  continueOnProblems: boolean;
  categoryOrderHintBy: string;
}

export type ExportConfigOptions = {
  batch: number;
  expand: Array<string>;
  exportType: 'json' | 'chunk';
  predicate: string;
  staged: boolean;
  total: number;
}

/* From API */

export type TypeReference = {
  typeId: string;
  id: string;
}

type CustomField = {
  type: TypeReference;
  fields: Object;
}

type AssetDimensions = {
  w: number;
  h: number;
}

type Image = {
  url: string;
  dimensions: AssetDimensions;
  label: string;
}

type Attribute = {
  name: string;
  value: Object;
}

type AssetSource = {
  uri: string;
  key?: string;
  dimensions?: AssetDimensions;
  contentType?: string;
}

type Asset = {
  id: string;
  sources: Array<AssetSource>;
  name: Object;
  description?: Object;
  tags?: Array<string>;
  custom: CustomField;
}

type Money = {
  currencyCode: string;
  centAmount: number;
}

type DiscountedPrice = {
  value: Money;
  discount: TypeReference;
}

type PriceTier = {
  minimumQuantity: number;
  value: Money;
}

type Price = {
  id: string;
  value: Money;
  country?: string;
  customerGroup?: TypeReference;
  channel?: TypeReference;
  validFrom?: string;
  validUntil?: string;
  tiers?: Array<PriceTier>;
  discounted?: DiscountedPrice;
  custom?: CustomField;
}

type ScopedPrice = {
  id: string;
  value: Money;
  currentValue: Money;
  country?: string;
  customerGroup?: TypeReference;
  channel?: TypeReference;
  validFrom?: string;
  validUntil?: string;
  discounted?: DiscountedPrice;
  custom?: CustomField;
}

type ProductVariantAvailability = {
  isOnStock?: boolean;
  restockableInDays?: number;
  availableQuantity?: number;
  channels?: Array<Object>;
}

type Variant = {
  id: number;
  sku?: string;
  key?: string;
  prices: Array<?Price>;
  images: Array<?Image>;
  attributes: Array<?Attribute>;
  assets: Array<?Asset>;
  price?: Price;
  availability?: ProductVariantAvailability;
  isMatchingVariant?: boolean;
  scopedPrice?: ScopedPrice;
  scopedPriceDiscounted?: boolean;


}

export type ProductProjection = {
  id: string;
  key?: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  productType: TypeReference;
  name: Object;
  description?: Object;
  slug: Object;
  categories: Array<TypeReference>;
  categoryOrderHints: Object;
  masterVariant: Variant;
  variants: Array<Variant>;
  hasStagedChanges: boolean;
  published: boolean;
  taxCategory: TypeReference;
  state: TypeReference;
  reviewRatingStatistics?: Object;
}

export type ResolvedProductProjection = {
  id: string;
  key?: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  productType: TypeReference;
  name: Object;
  description?: Object;
  slug: Object;
  categories: Array<string>;
  categoryOrderHints: Object;
  masterVariant: Variant;
  variants: Array<Variant>;
  hasStagedChanges: boolean;
  published: boolean;
  taxCategory: string;
  state: string;
  reviewRatingStatistics?: Object;
}

type ProcessFnResponseBody = {
  offset: number;
  count: number;
  results: Array<ProductProjection>;
}

export type ProcessFnResponse = {
  body: ProcessFnResponseBody;
  statusCode: number;
}
