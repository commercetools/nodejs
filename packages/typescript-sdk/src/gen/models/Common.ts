/* tslint:disable */
//Generated file, please do not change

import { FacetResults } from './Product'
import { CustomFields } from './Type'
import { CustomFieldsDraft } from './Type'
import { CustomObject } from './CustomObject'
import { Message } from './Message'
import { ProductProjection } from './Product'
import { ShippingMethod } from './ShippingMethod'
import { Store } from './Store'
import { Zone } from './Zone'
import { CustomerReference } from './Customer'
import { ProductDiscountReference } from './ProductDiscount'
import { StoreKeyReference } from './Store'
import { CustomerGroup } from './CustomerGroup'
import { Customer } from './Customer'
import { DiscountCode } from './DiscountCode'
import { Extension } from './Extension'
import { InventoryEntry } from './Inventory'
import { OrderEdit } from './OrderEdit'
import { Order } from './Order'
import { Payment } from './Payment'
import { ProductDiscount } from './ProductDiscount'
import { ProductType } from './ProductType'
import { Product } from './Product'
import { Review } from './Review'
import { ShoppingList } from './ShoppingList'
import { State } from './State'
import { Subscription } from './Subscription'
import { TaxCategory } from './TaxCategory'
import { Type } from './Type'
import { CartDiscount } from './CartDiscount'
import { Cart } from './Cart'
import { Category } from './Category'
import { Channel } from './Channel'
import { CustomerGroupReference } from './CustomerGroup'
import { ChannelReference } from './Channel'
import { CustomerGroupResourceIdentifier } from './CustomerGroup'
import { ChannelResourceIdentifier } from './Channel'
import { CustomObjectReference } from './CustomObject'
import { DiscountCodeReference } from './DiscountCode'
import { InventoryEntryReference } from './Inventory'
import { OrderEditReference } from './OrderEdit'
import { OrderReference } from './Order'
import { PaymentReference } from './Payment'
import { ProductTypeReference } from './ProductType'
import { ProductReference } from './Product'
import { ReviewReference } from './Review'
import { ShippingMethodReference } from './ShippingMethod'
import { ShoppingListReference } from './ShoppingList'
import { StateReference } from './State'
import { StoreReference } from './Store'
import { TaxCategoryReference } from './TaxCategory'
import { TypeReference } from './Type'
import { ZoneReference } from './Zone'
import { CartDiscountReference } from './CartDiscount'
import { CartReference } from './Cart'
import { CategoryReference } from './Category'
import { CustomerResourceIdentifier } from './Customer'
import { DiscountCodeResourceIdentifier } from './DiscountCode'
import { InventoryEntryResourceIdentifier } from './Inventory'
import { OrderEditResourceIdentifier } from './OrderEdit'
import { OrderResourceIdentifier } from './Order'
import { PaymentResourceIdentifier } from './Payment'
import { ProductDiscountResourceIdentifier } from './ProductDiscount'
import { ProductTypeResourceIdentifier } from './ProductType'
import { ProductResourceIdentifier } from './Product'
import { ReviewResourceIdentifier } from './Review'
import { ShippingMethodResourceIdentifier } from './ShippingMethod'
import { ShoppingListResourceIdentifier } from './ShoppingList'
import { StateResourceIdentifier } from './State'
import { StoreResourceIdentifier } from './Store'
import { TaxCategoryResourceIdentifier } from './TaxCategory'
import { TypeResourceIdentifier } from './Type'
import { ZoneResourceIdentifier } from './Zone'
import { CartDiscountResourceIdentifier } from './CartDiscount'
import { CartResourceIdentifier } from './Cart'
import { CategoryResourceIdentifier } from './Category'


export interface PagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: BaseResource[];
  
  readonly facets?: FacetResults;
  
  readonly meta?: object
}

export interface Update {
  
  readonly version: number;
  
  readonly actions: UpdateAction[]
}

export interface UpdateAction {
  
  readonly action: string
}

export interface Address {
  
  readonly id?: string;
  
  readonly key?: string;
  
  readonly title?: string;
  
  readonly salutation?: string;
  
  readonly firstName?: string;
  
  readonly lastName?: string;
  
  readonly streetName?: string;
  
  readonly streetNumber?: string;
  
  readonly additionalStreetInfo?: string;
  
  readonly postalCode?: string;
  
  readonly city?: string;
  
  readonly region?: string;
  
  readonly state?: string;
  /**
  	<p>A two-digit country code as per <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 alpha-2</a>.</p>
  */
  readonly country: string;
  
  readonly company?: string;
  
  readonly department?: string;
  
  readonly building?: string;
  
  readonly apartment?: string;
  
  readonly pOBox?: string;
  
  readonly phone?: string;
  
  readonly mobile?: string;
  
  readonly email?: string;
  
  readonly fax?: string;
  
  readonly additionalAddressInfo?: string;
  
  readonly externalId?: string
}

export interface Asset {
  
  readonly id: string;
  
  readonly sources: AssetSource[];
  
  readonly name: LocalizedString;
  
  readonly description?: LocalizedString;
  
  readonly tags?: string[];
  
  readonly custom?: CustomFields;
  
  readonly key?: string
}

export interface AssetDimensions {
  
  readonly w: number;
  
  readonly h: number
}

export interface AssetDraft {
  
  readonly sources: AssetSource[];
  
  readonly name: LocalizedString;
  
  readonly description?: LocalizedString;
  
  readonly tags?: string[];
  
  readonly custom?: CustomFieldsDraft;
  
  readonly key?: string
}

export interface AssetSource {
  
  readonly uri: string;
  
  readonly key?: string;
  
  readonly dimensions?: AssetDimensions;
  
  readonly contentType?: string
}

export interface BaseResource {
  
  readonly id: string;
  
  readonly version: number;
  
  readonly createdAt: string;
  
  readonly lastModifiedAt: string
}

export interface ClientLogging {
  
  readonly clientId?: string;
  
  readonly externalUserId?: string;
  
  readonly customer?: CustomerReference;
  
  readonly anonymousId?: string
}

export interface CreatedBy extends ClientLogging {
}

export interface DiscountedPrice {
  
  readonly value: Money;
  
  readonly discount: ProductDiscountReference
}

export type GeoJson =
  GeoJsonPoint
;

export interface GeoJsonPoint {
  readonly type: "Point";
  
  readonly coordinates: number[]
}

export interface Image {
  
  readonly url: string;
  
  readonly dimensions: ImageDimensions;
  
  readonly label?: string
}

export interface ImageDimensions {
  
  readonly w: number;
  
  readonly h: number
}

export type KeyReference =
  StoreKeyReference
;

export interface LastModifiedBy extends ClientLogging {
}

export interface LocalizedString {
  [key:string]: string
}

export interface LoggedResource extends BaseResource {
  
  readonly lastModifiedBy?: LastModifiedBy;
  
  readonly createdBy?: CreatedBy
}

export interface Money {
  
  readonly centAmount: number;
  /**
  	<p>The currency code compliant to <a href="https://en.wikipedia.org/wiki/ISO_4217">ISO 4217</a>.</p>
  */
  readonly currencyCode: string
}

export type MoneyType =
   'centPrecision' |
   'highPrecision';

export interface Price {
  
  readonly id?: string;
  
  readonly value: Money;
  /**
  	<p>A two-digit country code as per <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 alpha-2</a>.</p>
  */
  readonly country?: string;
  
  readonly customerGroup?: CustomerGroupReference;
  
  readonly channel?: ChannelReference;
  
  readonly validFrom?: string;
  
  readonly validUntil?: string;
  
  readonly discounted?: DiscountedPrice;
  
  readonly custom?: CustomFields;
  
  readonly tiers?: PriceTier[]
}

export interface PriceDraft {
  
  readonly value: Money;
  /**
  	<p>A two-digit country code as per <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 alpha-2</a>.</p>
  */
  readonly country?: string;
  
  readonly customerGroup?: CustomerGroupResourceIdentifier;
  
  readonly channel?: ChannelResourceIdentifier;
  
  readonly validFrom?: string;
  
  readonly validUntil?: string;
  
  readonly custom?: CustomFieldsDraft;
  
  readonly tiers?: PriceTier[]
}

export interface PriceTier {
  
  readonly minimumQuantity: number;
  
  readonly value: Money
}

export type Reference =
  CustomObjectReference |
  CustomerGroupReference |
  CustomerReference |
  DiscountCodeReference |
  InventoryEntryReference |
  OrderEditReference |
  OrderReference |
  PaymentReference |
  ProductDiscountReference |
  ProductTypeReference |
  ProductReference |
  ReviewReference |
  ShippingMethodReference |
  ShoppingListReference |
  StateReference |
  StoreReference |
  TaxCategoryReference |
  TypeReference |
  ZoneReference |
  CartDiscountReference |
  CartReference |
  CategoryReference |
  ChannelReference
;

export type ReferenceTypeId =
   'cart' |
   'cart-discount' |
   'category' |
   'channel' |
   'customer' |
   'customer-group' |
   'discount-code' |
   'key-value-document' |
   'payment' |
   'product' |
   'product-type' |
   'product-discount' |
   'order' |
   'review' |
   'shopping-list' |
   'shipping-method' |
   'state' |
   'store' |
   'tax-category' |
   'type' |
   'zone' |
   'inventory-entry' |
   'order-edit';

export type ResourceIdentifier =
  CustomerGroupResourceIdentifier |
  CustomerResourceIdentifier |
  DiscountCodeResourceIdentifier |
  InventoryEntryResourceIdentifier |
  OrderEditResourceIdentifier |
  OrderResourceIdentifier |
  PaymentResourceIdentifier |
  ProductDiscountResourceIdentifier |
  ProductTypeResourceIdentifier |
  ProductResourceIdentifier |
  ReviewResourceIdentifier |
  ShippingMethodResourceIdentifier |
  ShoppingListResourceIdentifier |
  StateResourceIdentifier |
  StoreResourceIdentifier |
  TaxCategoryResourceIdentifier |
  TypeResourceIdentifier |
  ZoneResourceIdentifier |
  CartDiscountResourceIdentifier |
  CartResourceIdentifier |
  CategoryResourceIdentifier |
  ChannelResourceIdentifier
;

export interface ScopedPrice {
  
  readonly id: string;
  
  readonly value: TypedMoney;
  
  readonly currentValue: TypedMoney;
  /**
  	<p>A two-digit country code as per <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 alpha-2</a>.</p>
  */
  readonly country?: string;
  
  readonly customerGroup?: CustomerGroupReference;
  
  readonly channel?: ChannelReference;
  
  readonly validFrom?: string;
  
  readonly validUntil?: string;
  
  readonly discounted?: DiscountedPrice;
  
  readonly custom?: CustomFields
}

export type TypedMoney =
  CentPrecisionMoney |
  HighPrecisionMoney
;

export interface CentPrecisionMoney {
  readonly type: "centPrecision";
  
  readonly centAmount: number;
  /**
  	<p>The currency code compliant to <a href="https://en.wikipedia.org/wiki/ISO_4217">ISO 4217</a>.</p>
  */
  readonly currencyCode: string;
  
  readonly fractionDigits: number
}

export interface HighPrecisionMoney {
  readonly type: "highPrecision";
  
  readonly centAmount: number;
  /**
  	<p>The currency code compliant to <a href="https://en.wikipedia.org/wiki/ISO_4217">ISO 4217</a>.</p>
  */
  readonly currencyCode: string;
  
  readonly fractionDigits: number;
  
  readonly preciseAmount: number
}