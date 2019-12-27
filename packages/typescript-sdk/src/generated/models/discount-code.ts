//Generated file, please do not change

import {
  CartDiscountReference,
  CartDiscountResourceIdentifier,
} from './cart-discount'
import {
  CreatedBy,
  LastModifiedBy,
  LocalizedString,
  LoggedResource,
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
} from './common'
import {
  CustomFields,
  CustomFieldsDraft,
  FieldContainer,
  TypeResourceIdentifier,
} from './type'

export interface DiscountCode extends LoggedResource {
  /**
   *	The unique ID of the discount code.
   */
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  /**
   *	Present on resources updated after 1/02/2019 except for events not tracked.
   */
  readonly lastModifiedBy?: LastModifiedBy
  /**
   *	Present on resources created after 1/02/2019 except for events not tracked.
   */
  readonly createdBy?: CreatedBy
  readonly name?: LocalizedString
  readonly description?: LocalizedString
  /**
   *	Unique identifier of this discount code.
   *	This value is added to the cart
   *	to enable the related cart discounts in the cart.
   */
  readonly code: string
  /**
   *	The referenced matching cart discounts can be applied to the cart once the DiscountCode is added.
   */
  readonly cartDiscounts: CartDiscountReference[]
  /**
   *	The discount code can only be applied to carts that match this predicate.
   */
  readonly cartPredicate?: string
  readonly isActive: boolean
  /**
   *	The platform will generate this array from the cart predicate.
   *	It contains the references of all the resources that are addressed in the predicate.
   */
  readonly references: Reference[]
  /**
   *	The discount code can only be applied `maxApplications` times.
   */
  readonly maxApplications?: number
  /**
   *	The discount code can only be applied `maxApplicationsPerCustomer` times per customer.
   */
  readonly maxApplicationsPerCustomer?: number
  readonly custom?: CustomFields
  /**
   *	The groups to which this discount code belong.
   */
  readonly groups: string[]
  /**
   *	The time from which the discount can be applied on a cart.
   *	Before that time the code is invalid.
   */
  readonly validFrom?: string
  /**
   *	The time until the discount can be applied on a cart.
   *	After that time the code is invalid.
   */
  readonly validUntil?: string
}
export interface DiscountCodeDraft {
  readonly name?: LocalizedString
  readonly description?: LocalizedString
  /**
   *	Unique identifier of this discount code.
   *	This value is added to the cart
   *	to enable the related cart discounts in the cart.
   */
  readonly code: string
  /**
   *	The referenced matching cart discounts can be applied to the cart once the discount code is added.
   *	The number of cart discounts in a discount code is limited to **10**.
   */
  readonly cartDiscounts: CartDiscountResourceIdentifier[]
  /**
   *	The discount code can only be applied to carts that match this predicate.
   */
  readonly cartPredicate?: string
  readonly isActive?: boolean
  readonly maxApplications?: number
  readonly maxApplicationsPerCustomer?: number
  readonly custom?: CustomFieldsDraft
  /**
   *	The groups to which this discount code shall belong to.
   */
  readonly groups?: string[]
  /**
   *	The time from which the discount can be applied on a cart.
   *	Before that time the code is invalid.
   */
  readonly validFrom?: string
  /**
   *	The time until the discount can be applied on a cart.
   *	After that time the code is invalid.
   */
  readonly validUntil?: string
}
export interface DiscountCodePagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: DiscountCode[]
}
export interface DiscountCodeReference {
  readonly typeId: 'discount-code'
  readonly id: string
  readonly obj?: DiscountCode
}
export interface DiscountCodeResourceIdentifier {
  readonly typeId: 'discount-code'
  readonly id?: string
  readonly key?: string
}
export interface DiscountCodeUpdate {
  readonly version: number
  readonly actions: DiscountCodeUpdateAction[]
}
export type DiscountCodeUpdateAction =
  | DiscountCodeChangeCartDiscountsAction
  | DiscountCodeChangeGroupsAction
  | DiscountCodeChangeIsActiveAction
  | DiscountCodeSetCartPredicateAction
  | DiscountCodeSetCustomFieldAction
  | DiscountCodeSetCustomTypeAction
  | DiscountCodeSetDescriptionAction
  | DiscountCodeSetMaxApplicationsAction
  | DiscountCodeSetMaxApplicationsPerCustomerAction
  | DiscountCodeSetNameAction
  | DiscountCodeSetValidFromAction
  | DiscountCodeSetValidFromAndUntilAction
  | DiscountCodeSetValidUntilAction
export interface DiscountCodeChangeCartDiscountsAction {
  readonly action: 'changeCartDiscounts'
  readonly cartDiscounts: CartDiscountResourceIdentifier[]
}
export interface DiscountCodeChangeGroupsAction {
  readonly action: 'changeGroups'
  /**
   *	The groups to which this discount code shall belong to.
   *	Use empty array to remove the code from all groups.
   */
  readonly groups: string[]
}
export interface DiscountCodeChangeIsActiveAction {
  readonly action: 'changeIsActive'
  readonly isActive: boolean
}
export interface DiscountCodeSetCartPredicateAction {
  readonly action: 'setCartPredicate'
  /**
   *	If the `cartPredicate` parameter is not included, the field will be emptied.
   */
  readonly cartPredicate?: string
}
export interface DiscountCodeSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface DiscountCodeSetCustomTypeAction {
  readonly action: 'setCustomType'
  /**
   *	A valid JSON object, based on the FieldDefinitions of the Type.
   *	Sets the custom fields to this value.
   */
  readonly fields?: FieldContainer
  /**
   *	If absent, the custom type and any existing CustomFields are removed.
   */
  readonly type?: TypeResourceIdentifier
}
export interface DiscountCodeSetDescriptionAction {
  readonly action: 'setDescription'
  /**
   *	If the `description` parameter is not included, the field will be emptied.
   */
  readonly description?: LocalizedString
}
export interface DiscountCodeSetMaxApplicationsAction {
  readonly action: 'setMaxApplications'
  /**
   *	If the `maxApplications` parameter is not included, the field will be emptied.
   */
  readonly maxApplications?: number
}
export interface DiscountCodeSetMaxApplicationsPerCustomerAction {
  readonly action: 'setMaxApplicationsPerCustomer'
  /**
   *	If the `maxApplicationsPerCustomer` parameter is not included, the field will be emptied.
   */
  readonly maxApplicationsPerCustomer?: number
}
export interface DiscountCodeSetNameAction {
  readonly action: 'setName'
  /**
   *	If the `name` parameter is not included, the field will be emptied.
   */
  readonly name?: LocalizedString
}
export interface DiscountCodeSetValidFromAction {
  readonly action: 'setValidFrom'
  /**
   *	If absent, the field with the value is removed in case a value was set before.
   */
  readonly validFrom?: string
}
export interface DiscountCodeSetValidFromAndUntilAction {
  readonly action: 'setValidFromAndUntil'
  /**
   *	If absent, the field with the value is removed in case a value was set before.
   */
  readonly validUntil?: string
  /**
   *	If absent, the field with the value is removed in case a value was set before.
   */
  readonly validFrom?: string
}
export interface DiscountCodeSetValidUntilAction {
  readonly action: 'setValidUntil'
  /**
   *	If absent, the field with the value is removed in case a value was set before.
   */
  readonly validUntil?: string
}
