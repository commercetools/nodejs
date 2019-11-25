//Generated file, please do not change

import { CreatedBy, LastModifiedBy, LoggedResource, Money, Reference, ReferenceTypeId, ResourceIdentifier, TypedMoney } from './common'
import { TaxCategoryReference, TaxCategoryResourceIdentifier } from './tax-category'
import { ZoneReference, ZoneResourceIdentifier } from './zone'

export interface PriceFunction {
  /**
  *		The currency code compliant to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
  *		
  */
  readonly currencyCode: string;
  readonly function: string
}
export interface ShippingMethod extends LoggedResource {
  /**
  *		The unique ID of the shipping method.
  */
  readonly id: string;
  /**
  *		The current version of the shipping method.
  */
  readonly version: number;
  readonly createdAt: string;
  readonly lastModifiedAt: string;
  readonly lastModifiedBy?: LastModifiedBy;
  readonly createdBy?: CreatedBy;
  /**
  *		User-specific unique identifier for the shipping method.
  */
  readonly key?: string;
  readonly name: string;
  readonly description?: string;
  readonly taxCategory: TaxCategoryReference;
  readonly zoneRates: ZoneRate[];
  /**
  *		One shipping method in a project can be default.
  */
  readonly isDefault: boolean;
  /**
  *		A Cart predicate which can be used to more precisely select a shipping method for a cart.
  */
  readonly predicate?: string
}
export interface ShippingMethodDraft {
  readonly key?: string;
  readonly name: string;
  readonly description?: string;
  readonly taxCategory: TaxCategoryResourceIdentifier;
  readonly zoneRates: ZoneRateDraft[];
  /**
  *		If `true` the shipping method will be the default one in a project.
  */
  readonly isDefault: boolean;
  /**
  *		A Cart predicate which can be used to more precisely select a shipping method for a cart.
  */
  readonly predicate?: string
}
export interface ShippingMethodPagedQueryResponse {
  readonly limit: number;
  readonly count: number;
  readonly total?: number;
  readonly offset: number;
  readonly results: ShippingMethod[]
}
export interface ShippingMethodReference {
  readonly typeId: "shipping-method";
  readonly id: string;
  readonly obj?: ShippingMethod
}
export interface ShippingMethodResourceIdentifier {
  readonly typeId: "shipping-method";
  readonly id?: string;
  readonly key?: string
}
export interface ShippingMethodUpdate {
  readonly version: number;
  readonly actions: ShippingMethodUpdateAction[]
}
export type ShippingMethodUpdateAction =
  ShippingMethodAddShippingRateAction |
  ShippingMethodAddZoneAction |
  ShippingMethodChangeIsDefaultAction |
  ShippingMethodChangeNameAction |
  ShippingMethodChangeTaxCategoryAction |
  ShippingMethodRemoveShippingRateAction |
  ShippingMethodRemoveZoneAction |
  ShippingMethodSetDescriptionAction |
  ShippingMethodSetKeyAction |
  ShippingMethodSetPredicateAction
;
export interface ShippingRate {
  readonly price: TypedMoney;
  /**
  *		The shipping is free if the order total (the sum of line item prices) exceeds the `freeAbove` value.
  *		Note: `freeAbove` applies before any Cart or Product discounts, and can cause discounts to apply in invalid scenarios.
  *		Use a Cart Discount to set the shipping price to 0 to avoid providing free shipping in invalid discount scenarios.
  */
  readonly freeAbove?: TypedMoney;
  /**
  *		Only appears in response to requests for shipping methods by cart or location to mark this shipping rate as one that matches the cart or location.
  */
  readonly isMatching?: boolean;
  /**
  *		A list of shipping rate price tiers.
  */
  readonly tiers: ShippingRatePriceTier[]
}
export interface ShippingRateDraft {
  readonly price: Money;
  /**
  *		The shipping is free if the order total (the sum of line item prices) exceeds the freeAbove value.
  *		Note: `freeAbove` applies before any Cart or Product discounts, and can cause discounts to apply in invalid scenarios.
  *		Use a Cart Discount to set the shipping price to 0 to avoid providing free shipping in invalid discount scenarios.
  */
  readonly freeAbove?: Money;
  /**
  *		A list of shipping rate price tiers.
  */
  readonly tiers?: ShippingRatePriceTier[]
}
export type ShippingRatePriceTier =
  CartClassificationTier |
  CartScoreTier |
  CartValueTier
;
export interface CartClassificationTier {
  readonly type: "CartClassification";
  readonly price: Money;
  readonly isMatching?: boolean;
  readonly value: string
}
export interface CartScoreTier {
  readonly type: "CartScore";
  readonly score: number;
  readonly price?: Money;
  readonly isMatching?: boolean;
  readonly priceFunction?: PriceFunction
}
export interface CartValueTier {
  readonly type: "CartValue";
  readonly minimumCentAmount: number;
  readonly price: Money;
  readonly isMatching?: boolean
}
export type ShippingRateTierType =
   'CartValue' |
   'CartClassification' |
   'CartScore';
export interface ZoneRate {
  readonly zone: ZoneReference;
  /**
  *		The array does not contain two shipping rates with the same currency.
  */
  readonly shippingRates: ShippingRate[]
}
export interface ZoneRateDraft {
  readonly zone: ZoneResourceIdentifier;
  /**
  *		The array must not contain two shipping rates with the same currency.
  */
  readonly shippingRates: ShippingRateDraft[]
}
export interface ShippingMethodAddShippingRateAction {
  readonly action: "addShippingRate";
  readonly shippingRate: ShippingRateDraft;
  readonly zone: ZoneResourceIdentifier
}
export interface ShippingMethodAddZoneAction {
  readonly action: "addZone";
  readonly zone: ZoneResourceIdentifier
}
export interface ShippingMethodChangeIsDefaultAction {
  readonly action: "changeIsDefault";
  readonly isDefault: boolean
}
export interface ShippingMethodChangeNameAction {
  readonly action: "changeName";
  readonly name: string
}
export interface ShippingMethodChangeTaxCategoryAction {
  readonly action: "changeTaxCategory";
  readonly taxCategory: TaxCategoryResourceIdentifier
}
export interface ShippingMethodRemoveShippingRateAction {
  readonly action: "removeShippingRate";
  readonly shippingRate: ShippingRateDraft;
  readonly zone: ZoneResourceIdentifier
}
export interface ShippingMethodRemoveZoneAction {
  readonly action: "removeZone";
  readonly zone: ZoneResourceIdentifier
}
export interface ShippingMethodSetDescriptionAction {
  readonly action: "setDescription";
  readonly description?: string
}
export interface ShippingMethodSetKeyAction {
  readonly action: "setKey";
  readonly key?: string
}
export interface ShippingMethodSetPredicateAction {
  readonly action: "setPredicate";
  readonly predicate?: string
}