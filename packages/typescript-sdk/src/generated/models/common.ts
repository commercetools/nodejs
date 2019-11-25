//Generated file, please do not change

import { Cart, CartReference, CartResourceIdentifier } from './cart'
import {
  CartDiscount,
  CartDiscountReference,
  CartDiscountResourceIdentifier,
} from './cart-discount'
import {
  Category,
  CategoryReference,
  CategoryResourceIdentifier,
} from './category'
import { Channel, ChannelReference, ChannelResourceIdentifier } from './channel'
import { CustomObject, CustomObjectReference } from './custom-object'
import {
  Customer,
  CustomerReference,
  CustomerResourceIdentifier,
} from './customer'
import {
  CustomerGroup,
  CustomerGroupReference,
  CustomerGroupResourceIdentifier,
} from './customer-group'
import {
  DiscountCode,
  DiscountCodeReference,
  DiscountCodeResourceIdentifier,
} from './discount-code'
import { Extension } from './extension'
import {
  InventoryEntry,
  InventoryEntryReference,
  InventoryEntryResourceIdentifier,
} from './inventory'
import { MyCart, MyCustomer, MyOrder } from './me'
import { Message } from './message'
import { Order, OrderReference, OrderResourceIdentifier } from './order'
import {
  OrderEdit,
  OrderEditReference,
  OrderEditResourceIdentifier,
} from './order-edit'
import { Payment, PaymentReference, PaymentResourceIdentifier } from './payment'
import {
  FacetResults,
  Product,
  ProductProjection,
  ProductReference,
  ProductResourceIdentifier,
} from './product'
import {
  ProductDiscount,
  ProductDiscountReference,
  ProductDiscountResourceIdentifier,
} from './product-discount'
import {
  ProductType,
  ProductTypeReference,
  ProductTypeResourceIdentifier,
} from './product-type'
import { Review, ReviewReference, ReviewResourceIdentifier } from './review'
import {
  ShippingMethod,
  ShippingMethodReference,
  ShippingMethodResourceIdentifier,
} from './shipping-method'
import {
  MyShoppingList,
  ShoppingList,
  ShoppingListReference,
  ShoppingListResourceIdentifier,
} from './shopping-list'
import { State, StateReference, StateResourceIdentifier } from './state'
import {
  Store,
  StoreKeyReference,
  StoreReference,
  StoreResourceIdentifier,
} from './store'
import { Subscription } from './subscription'
import {
  TaxCategory,
  TaxCategoryReference,
  TaxCategoryResourceIdentifier,
} from './tax-category'
import {
  CustomFields,
  CustomFieldsDraft,
  Type,
  TypeReference,
  TypeResourceIdentifier,
} from './type'
import { Zone, ZoneReference, ZoneResourceIdentifier } from './zone'

export interface PagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: BaseResource[]
  readonly facets?: FacetResults
  readonly meta?: object
}
export interface Update {
  readonly version: number
  readonly actions: UpdateAction[]
}
export interface UpdateAction {
  readonly action: string
}
export interface Address {
  readonly id?: string
  readonly key?: string
  readonly title?: string
  readonly salutation?: string
  readonly firstName?: string
  readonly lastName?: string
  readonly streetName?: string
  readonly streetNumber?: string
  readonly additionalStreetInfo?: string
  readonly postalCode?: string
  readonly city?: string
  readonly region?: string
  readonly state?: string
  /**
   *		A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   *
   */
  readonly country: string
  readonly company?: string
  readonly department?: string
  readonly building?: string
  readonly apartment?: string
  readonly pOBox?: string
  readonly phone?: string
  readonly mobile?: string
  readonly email?: string
  readonly fax?: string
  readonly additionalAddressInfo?: string
  readonly externalId?: string
}
export interface Asset {
  readonly id: string
  readonly sources: AssetSource[]
  readonly name: LocalizedString
  readonly description?: LocalizedString
  readonly tags?: string[]
  readonly custom?: CustomFields
  readonly key?: string
}
export interface AssetDimensions {
  readonly w: number
  readonly h: number
}
export interface AssetDraft {
  readonly sources: AssetSource[]
  readonly name: LocalizedString
  readonly description?: LocalizedString
  readonly tags?: string[]
  readonly custom?: CustomFieldsDraft
  readonly key?: string
}
export interface AssetSource {
  readonly uri: string
  readonly key?: string
  readonly dimensions?: AssetDimensions
  readonly contentType?: string
}
export interface BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
}
export interface ClientLogging {
  readonly clientId?: string
  readonly externalUserId?: string
  readonly customer?: CustomerReference
  readonly anonymousId?: string
}
export interface CreatedBy extends ClientLogging {}
export interface DiscountedPrice {
  readonly value: Money
  readonly discount: ProductDiscountReference
}
export type GeoJson = GeoJsonPoint
export interface GeoJsonPoint {
  readonly type: 'Point'
  readonly coordinates: number[]
}
export interface Image {
  readonly url: string
  readonly dimensions: ImageDimensions
  readonly label?: string
}
export interface ImageDimensions {
  readonly w: number
  readonly h: number
}
export type KeyReference = StoreKeyReference
export interface LastModifiedBy extends ClientLogging {}
export interface LocalizedString {
  [key: string]: string
}
export interface LoggedResource extends BaseResource {
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
}
export interface Money {
  readonly centAmount: number
  /**
   *		The currency code compliant to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
   *
   */
  readonly currencyCode: string
}
export type MoneyType = 'centPrecision' | 'highPrecision'
export interface Price {
  readonly id: string
  readonly value: TypedMoney
  /**
   *		A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   *
   */
  readonly country?: string
  readonly customerGroup?: CustomerGroupReference
  readonly channel?: ChannelReference
  readonly validFrom?: string
  readonly validUntil?: string
  readonly discounted?: DiscountedPrice
  readonly custom?: CustomFields
  readonly tiers?: PriceTier[]
}
export interface PriceDraft {
  readonly value: Money
  /**
   *		A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   *
   */
  readonly country?: string
  readonly customerGroup?: CustomerGroupResourceIdentifier
  readonly channel?: ChannelResourceIdentifier
  readonly validFrom?: string
  readonly validUntil?: string
  readonly custom?: CustomFieldsDraft
  readonly tiers?: PriceTierDraft[]
  readonly discounted?: DiscountedPrice
}
export interface PriceTier {
  readonly minimumQuantity: number
  readonly value: TypedMoney
}
export interface PriceTierDraft {
  readonly minimumQuantity: number
  readonly value: Money
}
export interface QueryPrice {
  readonly id: string
  readonly value: Money
  /**
   *		A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   *
   */
  readonly country?: string
  readonly customerGroup?: CustomerGroupReference
  readonly channel?: ChannelReference
  readonly validFrom?: string
  readonly validUntil?: string
  readonly discounted?: DiscountedPrice
  readonly custom?: CustomFields
  readonly tiers?: PriceTierDraft[]
}
export type Reference =
  | CustomObjectReference
  | CustomerGroupReference
  | CustomerReference
  | DiscountCodeReference
  | InventoryEntryReference
  | OrderEditReference
  | OrderReference
  | PaymentReference
  | ProductDiscountReference
  | ProductTypeReference
  | ProductReference
  | ReviewReference
  | ShippingMethodReference
  | ShoppingListReference
  | StateReference
  | StoreReference
  | TaxCategoryReference
  | TypeReference
  | ZoneReference
  | CartDiscountReference
  | CartReference
  | CategoryReference
  | ChannelReference
export type ReferenceTypeId =
  | 'cart'
  | 'cart-discount'
  | 'category'
  | 'channel'
  | 'customer'
  | 'customer-group'
  | 'discount-code'
  | 'key-value-document'
  | 'payment'
  | 'product'
  | 'product-type'
  | 'product-discount'
  | 'order'
  | 'review'
  | 'shopping-list'
  | 'shipping-method'
  | 'state'
  | 'store'
  | 'tax-category'
  | 'type'
  | 'zone'
  | 'inventory-entry'
  | 'order-edit'
export type ResourceIdentifier =
  | CustomerGroupResourceIdentifier
  | CustomerResourceIdentifier
  | DiscountCodeResourceIdentifier
  | InventoryEntryResourceIdentifier
  | OrderEditResourceIdentifier
  | OrderResourceIdentifier
  | PaymentResourceIdentifier
  | ProductDiscountResourceIdentifier
  | ProductTypeResourceIdentifier
  | ProductResourceIdentifier
  | ReviewResourceIdentifier
  | ShippingMethodResourceIdentifier
  | ShoppingListResourceIdentifier
  | StateResourceIdentifier
  | StoreResourceIdentifier
  | TaxCategoryResourceIdentifier
  | TypeResourceIdentifier
  | ZoneResourceIdentifier
  | CartDiscountResourceIdentifier
  | CartResourceIdentifier
  | CategoryResourceIdentifier
  | ChannelResourceIdentifier
export interface ScopedPrice {
  readonly id: string
  readonly value: TypedMoney
  readonly currentValue: TypedMoney
  /**
   *		A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   *
   */
  readonly country?: string
  readonly customerGroup?: CustomerGroupReference
  readonly channel?: ChannelReference
  readonly validFrom?: string
  readonly validUntil?: string
  readonly discounted?: DiscountedPrice
  readonly custom?: CustomFields
}
export type TypedMoney = CentPrecisionMoney | HighPrecisionMoney
export interface CentPrecisionMoney {
  readonly type: 'centPrecision'
  readonly centAmount: number
  readonly fractionDigits: number
  /**
   *		The currency code compliant to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
   *
   */
  readonly currencyCode: string
}
export interface HighPrecisionMoney {
  readonly type: 'highPrecision'
  readonly centAmount: number
  readonly fractionDigits: number
  /**
   *		The currency code compliant to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
   *
   */
  readonly currencyCode: string
  readonly preciseAmount: number
}
export type TypedMoneyDraft = CentPrecisionMoneyDraft | HighPrecisionMoneyDraft
export interface CentPrecisionMoneyDraft {
  readonly type: 'centPrecision'
  readonly centAmount: number
  /**
   *		The currency code compliant to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
   *
   */
  readonly currencyCode: string
}
export interface HighPrecisionMoneyDraft {
  readonly type: 'highPrecision'
  readonly centAmount: number
  /**
   *		The currency code compliant to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
   *
   */
  readonly currencyCode: string
  readonly preciseAmount: number
}
