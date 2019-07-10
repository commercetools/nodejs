/* tslint:disable */
//Generated file, please do not change

import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { CartDiscountReference } from './CartDiscount'
import { Reference } from './Common'
import { CustomFields } from './Type'
import { LocalizedString } from './Common'
import { LoggedResource } from './Common'
import { CartDiscountResourceIdentifier } from './CartDiscount'
import { CustomFieldsDraft } from './Type'
import { ReferenceTypeId } from './Common'
import { ResourceIdentifier } from './Common'
import { FieldContainer } from './Type'
import { TypeResourceIdentifier } from './Type'


export interface DiscountCode extends LoggedResource {
  
  readonly name?: LocalizedString;
  
  readonly description?: LocalizedString;
  
  readonly code: string;
  
  readonly cartDiscounts: CartDiscountReference[];
  
  readonly cartPredicate?: string;
  
  readonly isActive: boolean;
  
  readonly references: Reference[];
  
  readonly maxApplications?: number;
  
  readonly maxApplicationsPerCustomer?: number;
  
  readonly custom?: CustomFields;
  
  readonly groups: string[];
  
  readonly validFrom?: string;
  
  readonly validUntil?: string
}

export interface DiscountCodeDraft {
  
  readonly name?: LocalizedString;
  
  readonly description?: LocalizedString;
  
  readonly code: string;
  
  readonly cartDiscounts: CartDiscountResourceIdentifier[];
  
  readonly cartPredicate?: string;
  
  readonly isActive?: boolean;
  
  readonly maxApplications?: number;
  
  readonly maxApplicationsPerCustomer?: number;
  
  readonly custom?: CustomFieldsDraft;
  
  readonly groups?: string[];
  
  readonly validFrom?: string;
  
  readonly validUntil?: string
}

export interface DiscountCodePagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: DiscountCode[]
}

export interface DiscountCodeReference {
  readonly typeId: "discount-code";
  
  readonly id: string;
  
  readonly obj?: DiscountCode
}

export interface DiscountCodeResourceIdentifier {
  readonly typeId: "discount-code";
  
  readonly id?: string;
  
  readonly key?: string
}

export interface DiscountCodeUpdate {
  
  readonly version: number;
  
  readonly actions: DiscountCodeUpdateAction[]
}

export type DiscountCodeUpdateAction =
  DiscountCodeChangeCartDiscountsAction |
  DiscountCodeChangeGroupsAction |
  DiscountCodeChangeIsActiveAction |
  DiscountCodeSetCartPredicateAction |
  DiscountCodeSetCustomFieldAction |
  DiscountCodeSetCustomTypeAction |
  DiscountCodeSetDescriptionAction |
  DiscountCodeSetMaxApplicationsAction |
  DiscountCodeSetMaxApplicationsPerCustomerAction |
  DiscountCodeSetNameAction |
  DiscountCodeSetValidFromAction |
  DiscountCodeSetValidFromAndUntilAction |
  DiscountCodeSetValidUntilAction
;

export interface DiscountCodeChangeCartDiscountsAction {
  readonly action: "changeCartDiscounts";
  
  readonly cartDiscounts: CartDiscountResourceIdentifier[]
}

export interface DiscountCodeChangeGroupsAction {
  readonly action: "changeGroups";
  
  readonly groups: string[]
}

export interface DiscountCodeChangeIsActiveAction {
  readonly action: "changeIsActive";
  
  readonly isActive: boolean
}

export interface DiscountCodeSetCartPredicateAction {
  readonly action: "setCartPredicate";
  
  readonly cartPredicate?: string
}

export interface DiscountCodeSetCustomFieldAction {
  readonly action: "setCustomField";
  
  readonly name: string;
  
  readonly value?: object
}

export interface DiscountCodeSetCustomTypeAction {
  readonly action: "setCustomType";
  
  readonly fields?: FieldContainer;
  
  readonly type?: TypeResourceIdentifier
}

export interface DiscountCodeSetDescriptionAction {
  readonly action: "setDescription";
  
  readonly description?: LocalizedString
}

export interface DiscountCodeSetMaxApplicationsAction {
  readonly action: "setMaxApplications";
  
  readonly maxApplications?: number
}

export interface DiscountCodeSetMaxApplicationsPerCustomerAction {
  readonly action: "setMaxApplicationsPerCustomer";
  
  readonly maxApplicationsPerCustomer?: number
}

export interface DiscountCodeSetNameAction {
  readonly action: "setName";
  
  readonly name?: LocalizedString
}

export interface DiscountCodeSetValidFromAction {
  readonly action: "setValidFrom";
  
  readonly validFrom?: string
}

export interface DiscountCodeSetValidFromAndUntilAction {
  readonly action: "setValidFromAndUntil";
  
  readonly validUntil?: string;
  
  readonly validFrom?: string
}

export interface DiscountCodeSetValidUntilAction {
  readonly action: "setValidUntil";
  
  readonly validUntil?: string
}