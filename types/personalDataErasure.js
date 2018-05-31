/* @flow */

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
  logger: LoggerOptions,
}

/* From API */

export type Customer = {
  id: string,
  version: number,
  customerNumber?: string,
  key?: string,
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
  middleName?: string,
  title?: string,
  salutation?: string,
  dateOfBirth?: string,
  companyName?: string,
  vatId?: string,
  addresses: Array<Object>,
  defaultShippingAddressId?: string,
  shippingAddressIds?: Array<string>,
  billingAddressIds?: Array<string>,
  defaultBillingAddressId?: string,
  isEmailVerified: boolean,
  createdAt: string,
  lastModifiedAt: string,
  lastMessageSequenceNumber?: number,
  externalId?: string,
  customerGroup?: Object,
  custom?: Object,
  locale?: string,
}

export type Order = {
  id: string,
  version: number,
  createdAt: string,
  lastModifiedAt: string,
  completedAt?: string,
  orderNumber?: string,
  customerId?: string,
  customerEmail?: string,
  anonymousId?: string,
  lineItemsId?: string,
  totalPrice: Object,
  taxedPrice?: Object,
  shippingAddress?: Object,
  billingAddress?: Object,
  taxMode: Object,
  taxRoundingMode: Object,
  taxCalculationMode: Object,
  customerGroup?: Object,
  country?: string,
  orderState: Object,
  state?: Object,
  shipmentState?: Object,
  paymentState?: Object,
  shippingInfo?: Object,
  syncInfo: Set<Object>,
  returnInfo: Set<Object>,
  discountCodes: Array<Object>,
  lastMessageSequenceNumber: number,
  cart?: Object,
  custom?: Object,
  paymentInfo?: Object,
  locale?: string,
  inventoryMode: Object,
  shippingRateInput?: Object,
  origin: Object,
  itemShippingAddresses: Array<Object>,
}

export type Cart = {
  id: string,
  version: number,
  customerId?: string,
  customerEmail?: string,
  anonymousId?: string,
  lineItemsId?: string,
  totalPrice: Object,
  taxedPrice?: Object,
  cartState: Object,
  shippingAddress?: Object,
  billingAddress?: Object,
  inventoryMode: Object,
  taxMode: Object,
  taxRoundingMode: Object,
  taxCalculationMode: Object,
  customerGroup?: Object,
  country?: string,
  shippingInfo?: Object,
  discountCodes: Array<Object>,
  refusedGifts: Array<Object>,
  custom?: Object,
  paymentInfo?: Object,
  locale?: string,
  deleteDaysAfterLastModification?: number,
  shippingRateInput?: Object,
  origin: Object,
  createdAt: string,
  lastModifiedAt: string,
  itemShippingAddresses: Array<Object>,
}

export type Payment = {
  id: string,
  version: number,
  key?: string,
  customer?: Object,
  anonymousId?: string,
  interfaceId?: string,
  amountPlanned: Object,
  paymentMethodInfo: Object,
  paymentStatus: Object,
  transactions: Array<Object>,
  interfaceInteractions: Array<Object>,
  custom?: Object,
  createdAt: string,
  lastModifiedAt: string,
}

export type ShoppingList = {
  id: string,
  key?: string,
  version: number,
  createdAt: string,
  lastModifiedAt: string,
  slug?: string,
  name: string,
  description?: string,
  customer?: Object,
  anonymousId?: string,
  lineItems: Array<Object>,
  textLineItems: Array<Object>,
  custom?: Object,
  deleteDaysAfterLastModification?: number,
}

export type Review = {
  id: string,
  version: number,
  createdAt: string,
  lastModifiedAt: string,
  key?: string,
  uniquenessValue?: string,
  locale?: string,
  authorName?: string,
  title?: string,
  text?: string,
  target?: Object,
  rating?: number,
  state?: Object,
  includedInStatistics: Boolean,
  customer?: Object,
  custom?: Object,
}

export type Messages = Array<{
  id: string,
  version: number,
  sequenceNumber: number,
  resource: Object,
  resourceVersion: number,
  type: string,
  customer?: Customer,
  createdAt: string,
  lastModifiedAt: string,
}>

export type AllData = Array<
  Customer | Order | Cart | Payment | ShoppingList | Review
>
