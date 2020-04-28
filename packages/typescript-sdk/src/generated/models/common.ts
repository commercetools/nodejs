/**
 *
 *    Generated file, please do not change!!!
 *    From http://www.vrap.io/ with love
 *
 *                ,d88b.d88b,
 *                88888888888
 *                `Y8888888Y'
 *                  `Y888Y'
 *                    `Y'
 *
 */

import { Cart, CartReference, CartResourceIdentifier } from 'models/cart'
import {
  CartDiscount,
  CartDiscountReference,
  CartDiscountResourceIdentifier,
} from 'models/cart-discount'
import {
  Category,
  CategoryReference,
  CategoryResourceIdentifier,
} from 'models/category'
import {
  Channel,
  ChannelReference,
  ChannelResourceIdentifier,
} from 'models/channel'
import { CustomObject, CustomObjectReference } from 'models/custom-object'
import {
  Customer,
  CustomerReference,
  CustomerResourceIdentifier,
} from 'models/customer'
import {
  CustomerGroup,
  CustomerGroupReference,
  CustomerGroupResourceIdentifier,
} from 'models/customer-group'
import {
  DiscountCode,
  DiscountCodeReference,
  DiscountCodeResourceIdentifier,
} from 'models/discount-code'
import { Extension } from 'models/extension'
import {
  InventoryEntry,
  InventoryEntryReference,
  InventoryEntryResourceIdentifier,
} from 'models/inventory'
import { MyCart, MyCustomer, MyOrder } from 'models/me'
import { Message } from 'models/message'
import { Order, OrderReference, OrderResourceIdentifier } from 'models/order'
import {
  OrderEdit,
  OrderEditReference,
  OrderEditResourceIdentifier,
} from 'models/order-edit'
import {
  Payment,
  PaymentReference,
  PaymentResourceIdentifier,
} from 'models/payment'
import {
  FacetResults,
  Product,
  ProductProjection,
  ProductReference,
  ProductResourceIdentifier,
} from 'models/product'
import {
  ProductDiscount,
  ProductDiscountReference,
  ProductDiscountResourceIdentifier,
} from 'models/product-discount'
import {
  ProductType,
  ProductTypeReference,
  ProductTypeResourceIdentifier,
} from 'models/product-type'
import {
  Review,
  ReviewReference,
  ReviewResourceIdentifier,
} from 'models/review'
import {
  ShippingMethod,
  ShippingMethodReference,
  ShippingMethodResourceIdentifier,
} from 'models/shipping-method'
import {
  MyShoppingList,
  ShoppingList,
  ShoppingListReference,
  ShoppingListResourceIdentifier,
} from 'models/shopping-list'
import { State, StateReference, StateResourceIdentifier } from 'models/state'
import {
  Store,
  StoreKeyReference,
  StoreReference,
  StoreResourceIdentifier,
} from 'models/store'
import { Subscription } from 'models/subscription'
import {
  TaxCategory,
  TaxCategoryReference,
  TaxCategoryResourceIdentifier,
} from 'models/tax-category'
import {
  CustomFields,
  CustomFieldsDraft,
  Type,
  TypeReference,
  TypeResourceIdentifier,
} from 'models/type'
import { Zone, ZoneReference, ZoneResourceIdentifier } from 'models/zone'

export interface PagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: BaseResource[]
  readonly facets?: FacetResults
  readonly meta?: any
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
   *	A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
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
export interface Money {
  readonly centAmount: number
  /**
   *	The currency code compliant to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
   *
   */
  readonly currencyCode: string
}
export type MoneyType = 'centPrecision' | 'highPrecision'
export interface Price {
  readonly id: string
  readonly value: TypedMoney
  /**
   *	A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
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
   *	A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
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
   *	A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
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
  | CategoryReference
  | CartReference
  | ChannelReference
  | CartDiscountReference
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
  | ChannelResourceIdentifier
  | CategoryResourceIdentifier
  | CartDiscountResourceIdentifier
  | CartResourceIdentifier
export interface ScopedPrice {
  readonly id: string
  readonly value: TypedMoney
  readonly currentValue: TypedMoney
  /**
   *	A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
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
export type TypedMoney = HighPrecisionMoney | CentPrecisionMoney
export interface CentPrecisionMoney {
  readonly type: 'centPrecision'
  readonly fractionDigits: number
  readonly centAmount: number
  /**
   *	The currency code compliant to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
   *
   */
  readonly currencyCode: string
}
export interface HighPrecisionMoney {
  readonly type: 'highPrecision'
  readonly fractionDigits: number
  readonly centAmount: number
  /**
   *	The currency code compliant to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
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
   *	The currency code compliant to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
   *
   */
  readonly currencyCode: string
}
export interface HighPrecisionMoneyDraft {
  readonly type: 'highPrecision'
  readonly centAmount: number
  /**
   *	The currency code compliant to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
   *
   */
  readonly currencyCode: string
  readonly preciseAmount: number
}
