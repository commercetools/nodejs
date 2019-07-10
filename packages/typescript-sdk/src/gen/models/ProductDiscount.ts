/* tslint:disable */
//Generated file, please do not change

import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { Reference } from './Common'
import { LocalizedString } from './Common'
import { LoggedResource } from './Common'
import { Price } from './Common'
import { ReferenceTypeId } from './Common'
import { ResourceIdentifier } from './Common'
import { Money } from './Common'


export interface ProductDiscount extends LoggedResource {
  
  readonly name: LocalizedString;
  
  readonly key?: string;
  
  readonly description?: LocalizedString;
  
  readonly value: ProductDiscountValue;
  
  readonly predicate: string;
  
  readonly sortOrder: string;
  
  readonly isActive: boolean;
  
  readonly references: Reference[];
  
  readonly validFrom?: string;
  
  readonly validUntil?: string
}

export interface ProductDiscountDraft {
  
  readonly name: LocalizedString;
  
  readonly key?: string;
  
  readonly description?: LocalizedString;
  
  readonly value: ProductDiscountValue;
  
  readonly predicate: string;
  
  readonly sortOrder: string;
  
  readonly isActive: boolean;
  
  readonly validFrom?: string;
  
  readonly validUntil?: string
}

export interface ProductDiscountMatchQuery {
  
  readonly productId: string;
  
  readonly variantId: number;
  
  readonly staged: boolean;
  
  readonly price: Price
}

export interface ProductDiscountPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: ProductDiscount[]
}

export interface ProductDiscountReference {
  readonly typeId: "product-discount";
  
  readonly id: string;
  
  readonly obj?: ProductDiscount
}

export interface ProductDiscountResourceIdentifier {
  readonly typeId: "product-discount";
  
  readonly id?: string;
  
  readonly key?: string
}

export interface ProductDiscountUpdate {
  
  readonly version: number;
  
  readonly actions: ProductDiscountUpdateAction[]
}

export type ProductDiscountUpdateAction =
  ProductDiscountChangeIsActiveAction |
  ProductDiscountChangeNameAction |
  ProductDiscountChangePredicateAction |
  ProductDiscountChangeSortOrderAction |
  ProductDiscountChangeValueAction |
  ProductDiscountSetDescriptionAction |
  ProductDiscountSetKeyAction |
  ProductDiscountSetValidFromAction |
  ProductDiscountSetValidFromAndUntilAction |
  ProductDiscountSetValidUntilAction
;

export type ProductDiscountValue =
  ProductDiscountValueAbsolute |
  ProductDiscountValueExternal |
  ProductDiscountValueRelative
;

export interface ProductDiscountValueAbsolute {
  readonly type: "absolute";
  
  readonly money: Money[]
}

export interface ProductDiscountValueExternal {
  readonly type: "external";
}

export interface ProductDiscountValueRelative {
  readonly type: "relative";
  
  readonly permyriad: number
}

export interface ProductDiscountChangeIsActiveAction {
  readonly action: "changeIsActive";
  
  readonly isActive: boolean
}

export interface ProductDiscountChangeNameAction {
  readonly action: "changeName";
  
  readonly name: LocalizedString
}

export interface ProductDiscountChangePredicateAction {
  readonly action: "changePredicate";
  
  readonly predicate: string
}

export interface ProductDiscountChangeSortOrderAction {
  readonly action: "changeSortOrder";
  
  readonly sortOrder: string
}

export interface ProductDiscountChangeValueAction {
  readonly action: "changeValue";
  
  readonly value: ProductDiscountValue
}

export interface ProductDiscountSetDescriptionAction {
  readonly action: "setDescription";
  
  readonly description?: LocalizedString
}

export interface ProductDiscountSetKeyAction {
  readonly action: "setKey";
  
  readonly key?: string
}

export interface ProductDiscountSetValidFromAction {
  readonly action: "setValidFrom";
  
  readonly validFrom?: string
}

export interface ProductDiscountSetValidFromAndUntilAction {
  readonly action: "setValidFromAndUntil";
  
  readonly validUntil?: string;
  
  readonly validFrom?: string
}

export interface ProductDiscountSetValidUntilAction {
  readonly action: "setValidUntil";
  
  readonly validUntil?: string
}