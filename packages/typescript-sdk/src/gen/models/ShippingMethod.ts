/* tslint:disable */
//Generated file, please do not change

import { TaxCategoryReference } from './TaxCategory'
import { BaseResource } from './Common'
import { TaxCategoryResourceIdentifier } from './TaxCategory'
import { ReferenceTypeId } from './Common'
import { Reference } from './Common'
import { ResourceIdentifier } from './Common'
import { TypedMoney } from './Common'
import { Money } from './Common'
import { ZoneReference } from './Zone'
import { ZoneResourceIdentifier } from './Zone'


export interface PriceFunction {
  /**
  	<p>The currency code compliant to <a href="https://en.wikipedia.org/wiki/ISO_4217">ISO 4217</a>.</p>
  */
  readonly currencyCode: string;
  
  readonly function: string
}

export interface ShippingMethod extends BaseResource {
  
  readonly key?: string;
  
  readonly name: string;
  
  readonly description?: string;
  
  readonly taxCategory: TaxCategoryReference;
  
  readonly zoneRates: ZoneRate[];
  
  readonly isDefault: boolean;
  
  readonly predicate?: string
}

export interface ShippingMethodDraft {
  
  readonly key?: string;
  
  readonly name: string;
  
  readonly description?: string;
  
  readonly taxCategory: TaxCategoryResourceIdentifier;
  
  readonly zoneRates: ZoneRateDraft[];
  
  readonly isDefault: boolean;
  
  readonly predicate?: string
}

export interface ShippingMethodPagedQueryResponse {
  
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
  
  readonly freeAbove?: TypedMoney;
  
  readonly isMatching?: boolean;
  
  readonly tiers: ShippingRatePriceTier[]
}

export interface ShippingRateDraft {
  
  readonly price: Money;
  
  readonly freeAbove?: Money;
  
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
  
  readonly shippingRates: ShippingRate[]
}

export interface ZoneRateDraft {
  
  readonly zone: ZoneResourceIdentifier;
  
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