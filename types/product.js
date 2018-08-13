/* @flow */

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

/* Logger */
export type LoggerOptions = {
  error: Function,
  info: Function,
  warn: Function,
  debug: Function,
}

export type ParserConfigOptions = {
  categoryBy: string,
  categoryOrderHintBy: string,
  delimiter: string,
  fillAllRows: boolean,
  headerFields?: Array<string>,
  language: string,
  multiValueDelimiter: string,
}

export type ExportConfigOptions = {
  batch: number,
  expand: Array<string>,
  exportType: 'json' | 'chunk',
  predicate: string,
  staged: boolean,
  total: number,
}

/* From API */

export type TypeReference = {
  typeId: string,
  id: string,
  key?: string,
  name?: string,
}

type CustomField = {
  type: TypeReference,
  fields: Object,
}

type AssetDimensions = {
  w: number,
  h: number,
}

export type Image = {
  url: string,
  dimensions: AssetDimensions,
  label?: string,
}

export type Attribute = {
  name: string,
  value: any,
}

type AssetSource = {
  uri: string,
  key?: string,
  dimensions?: AssetDimensions,
  contentType?: string,
}

type Asset = {
  id: string,
  sources: Array<AssetSource>,
  name: Object,
  description?: Object,
  tags?: Array<string>,
  custom: CustomField,
}

type Money = {
  currencyCode: string,
  centAmount: number,
}

type DiscountedPrice = {
  value: Money,
  discount: TypeReference,
}

type PriceTier = {
  minimumQuantity: number,
  value: Money,
}

export type Price = {
  id: string,
  value: Money,
  country?: string,
  customerGroup?: TypeReference,
  channel?: TypeReference,
  validFrom?: string,
  validUntil?: string,
  tiers?: Array<PriceTier>,
  discounted?: DiscountedPrice,
  custom?: CustomField,
}

export type Channel = {
  id: string,
  version?: number,
  key: string,
  name: Object,
  description: Object
}

type ScopedPrice = {
  id: string,
  value: Money,
  currentValue: Money,
  country?: string,
  customerGroup?: TypeReference,
  channel?: TypeReference,
  validFrom?: string,
  validUntil?: string,
  discounted?: DiscountedPrice,
  custom?: CustomField,
}

type ProductVariantAvailability = {
  isOnStock?: boolean,
  restockableInDays?: number,
  availableQuantity?: number,
  channels?: Array<Object>,
}

export type Variant = {
  id: number,
  sku?: string,
  key?: string,
  prices: Array<Price>,
  images: Array<Image>,
  attributes: Array<?Attribute>,
  assets: Array<?Asset>,
  availability?: ProductVariantAvailability,
  isMatchingVariant?: boolean,
  scopedPrice?: ScopedPrice,
  scopedPriceDiscounted?: boolean,
}

type SubRate = {
  name: string,
  amount: number,
}

type TaxRate = {
  id: string,
  name: string,
  amount: number,
  country: string,
  state: string,
  subRates: Array<SubRate>,
}

type AttributeType = {
  name: string,
  values?: Array<*>,
  elementType?: AttributeType,
  referenceTypeId?: string,
}

type AttributeDefinition = {
  type: AttributeType,
  name: string,
  label: Object,
  isRequired: boolean,
  attributeConstraint: 'None' | 'Unique' | 'CombinationUnique' | 'SameForAll',
  inputTip: Object,
  inputHint: 'SingleLine' | 'MultiLine',
  isSearchable: boolean,
}

export type TaxCategory = {
  id: string,
  key?: string,
  version: number,
  createdAt: string,
  lastModifiedAt: string,
  name: string,
  description?: string,
  rates: Array<TaxRate>,
}

export type ProductType = {
  id: string,
  version: number,
  createdAt: string,
  lastModifiedAt: string,
  key?: string,
  name: string,
  description: string,
  attributes: Array<AttributeDefinition>,
}

export type Category = {
  id: string,
  key?: string,
  version: number,
  createdAt: string,
  lastModifiedAt: string,
  name: Object,
  slug?: Object,
  description?: Object,
  ancestors?: Array<?Category> | Array<?TypeReference>,
  parent?: Category | TypeReference,
  orderHint?: string,
  externalId?: string,
  metaTitle?: Object,
  metaDescription?: Object,
  metaKeywords?: Object,
  custom?: CustomField,
  assets?: Array<Asset>,
}

export type State = {
  id: string,
  version: number,
  key: string,
  createdAt: string,
  lastModifiedAt: string,
  type: string,

  name: Object,
  description: Object,
  initial: boolean,
  builtin: boolean,
  roles: Array<?string>,
  transitions?: Array<TypeReference>,
}

export type ProductProjection = {
  id: string,
  key?: string,
  version: number,
  createdAt: string,
  lastModifiedAt: string,
  productType: TypeReference,
  name: Object,
  description?: Object,
  slug: Object,
  categories: Array<TypeReference>,
  categoryOrderHints: Object,
  masterVariant: Variant,
  variants: Array<Variant>,
  hasStagedChanges: boolean,
  published: boolean,
  taxCategory: TypeReference,
  state: TypeReference,
  reviewRatingStatistics?: Object,
}

export type ResolvedProductProjection = {
  id: string,
  key?: string,
  version: number,
  createdAt: string,
  lastModifiedAt: string,
  productType: ProductType,
  name: Object,
  description?: Object,
  slug: Object,
  categories: Array<Category>,
  categoryOrderHints: Object,
  masterVariant: Variant,
  variants: Array<Variant>,
  hasStagedChanges: boolean,
  published: boolean,
  taxCategory: TaxCategory,
  state: State,
  reviewRatingStatistics?: Object,
}

export type ProdWithMergedVariants = {
  id: string,
  key?: string,
  version: number,
  createdAt: string,
  lastModifiedAt: string,
  productType: ProductType,
  name: Object,
  description?: Object,
  slug: Object,
  categories: Array<Category>,
  categoryOrderHints: Object,
  variant: Array<Variant>,
  hasStagedChanges: boolean,
  published: boolean,
  taxCategory: TaxCategory,
  reviewRatingStatistics?: Object,
}

export type SingleVarPerProduct = {
  id?: string,
  key?: string,
  version?: number,
  createdAt?: string,
  lastModifiedAt?: string,
  productType?: ProductType,
  name?: Object,
  description?: Object,
  slug?: Object,
  categories?: Array<Category>,
  categoryOrderHints?: Object,
  variant: Variant,
  hasStagedChanges?: boolean,
  published?: boolean,
  taxCategory?: TaxCategory,
  reviewRatingStatistics?: Object,
}

export type MappedProduct = {
  id?: string,
  key?: string,
  version?: number,
  createdAt?: string,
  lastModifiedAt?: string,
  productType?: string,
  name?: Object,
  description?: Object,
  slug?: Object,
  categories?: string,
  categoryOrderHints?: string,
  variant: Variant,
  hasStagedChanges?: boolean,
  published?: string,
  state?: string,
  taxCategory?: string,
  reviewRatingStatistics?: Object,
  prices?: string,
}

type ProcessFnResponseBody = {
  offset: number,
  count: number,
  results: Array<ProductProjection>,
}

export type ProcessFnResponse = {
  body: ProcessFnResponseBody,
  statusCode: number,
}
