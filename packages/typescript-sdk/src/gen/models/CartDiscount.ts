/* tslint:disable */
//Generated file, please do not change

import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { Reference } from './Common'
import { CustomFields } from './Type'
import { LocalizedString } from './Common'
import { LoggedResource } from './Common'
import { ReferenceTypeId } from './Common'
import { ResourceIdentifier } from './Common'
import { Money } from './Common'
import { ProductReference } from './Product'
import { ChannelReference } from './Channel'
import { TypeResourceIdentifier } from './Type'


export interface CartDiscount extends LoggedResource {
  
  readonly name: LocalizedString;
  
  readonly key?: string;
  
  readonly description?: LocalizedString;
  
  readonly value: CartDiscountValue;
  
  readonly cartPredicate: string;
  
  readonly target?: CartDiscountTarget;
  
  readonly sortOrder: string;
  
  readonly isActive: boolean;
  
  readonly validFrom?: string;
  
  readonly validUntil?: string;
  
  readonly requiresDiscountCode: boolean;
  
  readonly references: Reference[];
  /**
  	<p>Specifies whether the application of this discount causes the following discounts to be ignored.
  	Defaults to Stacking.</p>
  */
  readonly stackingMode: StackingMode;
  
  readonly custom?: CustomFields
}

export interface CartDiscountDraft {
  
  readonly name: LocalizedString;
  
  readonly key?: string;
  
  readonly description?: LocalizedString;
  
  readonly value: CartDiscountValue;
  
  readonly cartPredicate: string;
  
  readonly target?: CartDiscountTarget;
  
  readonly sortOrder: string;
  
  readonly isActive?: boolean;
  
  readonly validFrom?: string;
  
  readonly validUntil?: string;
  
  readonly requiresDiscountCode: boolean;
  /**
  	<p>Specifies whether the application of this discount causes the following discounts to be ignored.
  	Defaults to Stacking.</p>
  */
  readonly stackingMode?: StackingMode;
  
  readonly custom?: CustomFields
}

export interface CartDiscountPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: CartDiscount[]
}

export interface CartDiscountReference {
  readonly typeId: "cart-discount";
  
  readonly id: string;
  
  readonly obj?: CartDiscount
}

export interface CartDiscountResourceIdentifier {
  readonly typeId: "cart-discount";
  
  readonly id?: string;
  
  readonly key?: string
}

export type CartDiscountTarget =
  MultiBuyCustomLineItemsTarget |
  MultiBuyLineItemsTarget |
  CartDiscountCustomLineItemsTarget |
  CartDiscountLineItemsTarget |
  CartDiscountShippingCostTarget
;

export interface CartDiscountCustomLineItemsTarget {
  readonly type: "customLineItems";
  
  readonly predicate: string
}

export interface CartDiscountLineItemsTarget {
  readonly type: "lineItems";
  
  readonly predicate: string
}

export interface CartDiscountShippingCostTarget {
  readonly type: "shipping";
}

export interface CartDiscountUpdate {
  
  readonly version: number;
  
  readonly actions: CartDiscountUpdateAction[]
}

export type CartDiscountUpdateAction =
  CartDiscountChangeCartPredicateAction |
  CartDiscountChangeIsActiveAction |
  CartDiscountChangeNameAction |
  CartDiscountChangeRequiresDiscountCodeAction |
  CartDiscountChangeSortOrderAction |
  CartDiscountChangeStackingModeAction |
  CartDiscountChangeTargetAction |
  CartDiscountChangeValueAction |
  CartDiscountSetCustomFieldAction |
  CartDiscountSetCustomTypeAction |
  CartDiscountSetDescriptionAction |
  CartDiscountSetKeyAction |
  CartDiscountSetValidFromAction |
  CartDiscountSetValidFromAndUntilAction |
  CartDiscountSetValidUntilAction
;

export type CartDiscountValue =
  CartDiscountValueAbsolute |
  CartDiscountValueGiftLineItem |
  CartDiscountValueRelative
;

export interface CartDiscountValueAbsolute {
  readonly type: "absolute";
  
  readonly money: Money[]
}

export interface CartDiscountValueGiftLineItem {
  readonly type: "giftLineItem";
  
  readonly product: ProductReference;
  
  readonly supplyChannel?: ChannelReference;
  
  readonly variantId: number;
  
  readonly distributionChannel?: ChannelReference
}

export interface CartDiscountValueRelative {
  readonly type: "relative";
  
  readonly permyriad: number
}

export interface MultiBuyCustomLineItemsTarget {
  readonly type: "multiBuyCustomLineItems";
  /**
  	<p>A valid custom line item target predicate. The discount will be applied to custom line items that are
  	matched by the predicate.</p>
  */
  readonly predicate: string;
  /**
  	<p>Quantity of line items that need to be present in order to trigger an application of this discount.</p>
  */
  readonly triggerQuantity: number;
  /**
  	<p>Quantity of line items that are discounted per application of this discount.</p>
  */
  readonly discountedQuantity: number;
  /**
  	<p>Maximum number of applications of this discount.</p>
  */
  readonly maxOccurrence?: number;
  
  readonly selectionMode: SelectionMode
}

export interface MultiBuyLineItemsTarget {
  readonly type: "multiBuyLineItems";
  /**
  	<p>A valid line item target predicate. The discount will be applied to line items that are matched by the predicate.</p>
  */
  readonly predicate: string;
  /**
  	<p>Quantity of line items that need to be present in order to trigger an application of this discount.</p>
  */
  readonly triggerQuantity: number;
  /**
  	<p>Quantity of line items that are discounted per application of this discount.</p>
  */
  readonly discountedQuantity: number;
  /**
  	<p>Maximum number of applications of this discount.</p>
  */
  readonly maxOccurrence?: number;
  
  readonly selectionMode: SelectionMode
}

export type SelectionMode =
   'Cheapest' |
   'MostExpensive';

export type StackingMode =
   'Stacking' |
   'StopAfterThisDiscount';

export interface CartDiscountChangeCartPredicateAction {
  readonly action: "changeCartPredicate";
  
  readonly cartPredicate: string
}

export interface CartDiscountChangeIsActiveAction {
  readonly action: "changeIsActive";
  
  readonly isActive: boolean
}

export interface CartDiscountChangeNameAction {
  readonly action: "changeName";
  
  readonly name: LocalizedString
}

export interface CartDiscountChangeRequiresDiscountCodeAction {
  readonly action: "changeRequiresDiscountCode";
  
  readonly requiresDiscountCode: boolean
}

export interface CartDiscountChangeSortOrderAction {
  readonly action: "changeSortOrder";
  
  readonly sortOrder: string
}

export interface CartDiscountChangeStackingModeAction {
  readonly action: "changeStackingMode";
  
  readonly stackingMode: StackingMode
}

export interface CartDiscountChangeTargetAction {
  readonly action: "changeTarget";
  
  readonly target: CartDiscountTarget
}

export interface CartDiscountChangeValueAction {
  readonly action: "changeValue";
  
  readonly value: CartDiscountValue
}

export interface CartDiscountSetCustomFieldAction {
  readonly action: "setCustomField";
  
  readonly name: string;
  
  readonly value?: object
}

export interface CartDiscountSetCustomTypeAction {
  readonly action: "setCustomType";
  
  readonly fields?: object;
  
  readonly type?: TypeResourceIdentifier
}

export interface CartDiscountSetDescriptionAction {
  readonly action: "setDescription";
  
  readonly description?: LocalizedString
}

export interface CartDiscountSetKeyAction {
  readonly action: "setKey";
  
  readonly key?: string
}

export interface CartDiscountSetValidFromAction {
  readonly action: "setValidFrom";
  
  readonly validFrom?: string
}

export interface CartDiscountSetValidFromAndUntilAction {
  readonly action: "setValidFromAndUntil";
  
  readonly validUntil?: string;
  
  readonly validFrom?: string
}

export interface CartDiscountSetValidUntilAction {
  readonly action: "setValidUntil";
  
  readonly validUntil?: string
}