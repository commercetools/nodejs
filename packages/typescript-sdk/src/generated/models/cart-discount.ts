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

import { ChannelReference } from 'models/channel'
import {
  CreatedBy,
  LastModifiedBy,
  LocalizedString,
  LoggedResource,
  Money,
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
  TypedMoney,
} from 'models/common'
import { ProductReference } from 'models/product'
import { CustomFields, TypeResourceIdentifier } from 'models/type'

export interface CartDiscount extends LoggedResource {
  /**
   *	The unique ID of the cart discount.
   */
  readonly id: string
  /**
   *	The current version of the cart discount.
   */
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
  readonly name: LocalizedString
  /**
   *	User-specific unique identifier for a cart discount.
   *	Must be unique across a project.
   */
  readonly key?: string
  readonly description?: LocalizedString
  readonly value: CartDiscountValue
  /**
   *	A valid Cart predicate.
   */
  readonly cartPredicate: string
  /**
   *	Empty when the `value` has type `giftLineItem`, otherwise a CartDiscountTarget is set.
   */
  readonly target?: CartDiscountTarget
  /**
   *	The string must contain a number between 0 and 1.
   *	All matching cart discounts are applied to a cart in the order defined by this field.
   *	A discount with greater sort order is prioritized higher than a discount with lower sort order.
   *	The sort order is unambiguous among all cart discounts.
   */
  readonly sortOrder: string
  /**
   *	Only active discount can be applied to the cart.
   */
  readonly isActive: boolean
  readonly validFrom?: string
  readonly validUntil?: string
  /**
   *	States whether the discount can only be used in a connection with a DiscountCode.
   */
  readonly requiresDiscountCode: boolean
  /**
   *	The platform will generate this array from the predicate.
   *	It contains the references of all the resources that are addressed in the predicate.
   */
  readonly references: Reference[]
  /**
   *	Specifies whether the application of this discount causes the following discounts to be ignored.
   *	Defaults to Stacking.
   */
  readonly stackingMode: StackingMode
  readonly custom?: CustomFields
}
export interface CartDiscountDraft {
  readonly name: LocalizedString
  /**
   *	User-specific unique identifier for a cart discount.
   *	Must be unique across a project.
   *	The field can be reset using the Set Key UpdateAction.
   */
  readonly key?: string
  readonly description?: LocalizedString
  readonly value: CartDiscountValueDraft
  /**
   *	A valid Cart predicate.
   */
  readonly cartPredicate: string
  /**
   *	Must not be set when the `value` has type `giftLineItem`, otherwise a CartDiscountTarget must be set.
   */
  readonly target?: CartDiscountTarget
  /**
   *	The string must contain a number between 0 and 1.
   *	A discount with greater sort order is prioritized higher than a discount with lower sort order.
   *	The sort order must be unambiguous among all cart discounts.
   */
  readonly sortOrder: string
  /**
   *	Only active discount can be applied to the cart.
   *	Defaults to `true`.
   */
  readonly isActive?: boolean
  readonly validFrom?: string
  readonly validUntil?: string
  /**
   *	States whether the discount can only be used in a connection with a DiscountCode.
   *	Defaults to `false`.
   */
  readonly requiresDiscountCode: boolean
  /**
   *	Specifies whether the application of this discount causes the following discounts to be ignored.
   *	Defaults to Stacking.
   */
  readonly stackingMode?: StackingMode
  readonly custom?: CustomFields
}
export interface CartDiscountPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: CartDiscount[]
}
export interface CartDiscountReference {
  readonly typeId: 'cart-discount'
  readonly id: string
  readonly obj?: CartDiscount
}
export interface CartDiscountResourceIdentifier {
  readonly typeId: 'cart-discount'
  readonly id?: string
  readonly key?: string
}
export type CartDiscountTarget =
  | MultiBuyCustomLineItemsTarget
  | MultiBuyLineItemsTarget
  | CartDiscountCustomLineItemsTarget
  | CartDiscountLineItemsTarget
  | CartDiscountShippingCostTarget
export interface CartDiscountCustomLineItemsTarget {
  readonly type: 'customLineItems'
  readonly predicate: string
}
export interface CartDiscountLineItemsTarget {
  readonly type: 'lineItems'
  readonly predicate: string
}
export interface CartDiscountShippingCostTarget {
  readonly type: 'shipping'
}
export interface CartDiscountUpdate {
  readonly version: number
  readonly actions: CartDiscountUpdateAction[]
}
export type CartDiscountUpdateAction =
  | CartDiscountChangeCartPredicateAction
  | CartDiscountChangeIsActiveAction
  | CartDiscountChangeNameAction
  | CartDiscountChangeRequiresDiscountCodeAction
  | CartDiscountChangeSortOrderAction
  | CartDiscountChangeStackingModeAction
  | CartDiscountChangeTargetAction
  | CartDiscountChangeValueAction
  | CartDiscountSetCustomFieldAction
  | CartDiscountSetCustomTypeAction
  | CartDiscountSetDescriptionAction
  | CartDiscountSetKeyAction
  | CartDiscountSetValidFromAction
  | CartDiscountSetValidFromAndUntilAction
  | CartDiscountSetValidUntilAction
export type CartDiscountValue =
  | CartDiscountValueAbsolute
  | CartDiscountValueGiftLineItem
  | CartDiscountValueRelative
export interface CartDiscountValueAbsolute {
  readonly type: 'absolute'
  readonly money: TypedMoney[]
}
export type CartDiscountValueDraft =
  | CartDiscountValueGiftLineItemDraft
  | CartDiscountValueRelativeDraft
  | CartDiscountValueAbsoluteDraft
export interface CartDiscountValueAbsoluteDraft {
  readonly type: 'absolute'
  readonly money: Money[]
}
export interface CartDiscountValueGiftLineItem {
  readonly type: 'giftLineItem'
  readonly product: ProductReference
  readonly supplyChannel?: ChannelReference
  readonly variantId: number
  readonly distributionChannel?: ChannelReference
}
export interface CartDiscountValueGiftLineItemDraft {
  readonly type: 'giftLineItem'
  readonly product: ProductReference
  readonly supplyChannel?: ChannelReference
  readonly variantId: number
  readonly distributionChannel?: ChannelReference
}
export interface CartDiscountValueRelative {
  readonly type: 'relative'
  readonly permyriad: number
}
export interface CartDiscountValueRelativeDraft {
  readonly type: 'relative'
  readonly permyriad: number
}
export interface MultiBuyCustomLineItemsTarget {
  readonly type: 'multiBuyCustomLineItems'
  /**
   *	A valid custom line item target predicate. The discount will be applied to custom line items that are
   *	matched by the predicate.
   *
   */
  readonly predicate: string
  /**
   *	Quantity of line items that need to be present in order to trigger an application of this discount.
   */
  readonly triggerQuantity: number
  /**
   *	Quantity of line items that are discounted per application of this discount.
   */
  readonly discountedQuantity: number
  /**
   *	Maximum number of applications of this discount.
   */
  readonly maxOccurrence?: number
  readonly selectionMode: SelectionMode
}
export interface MultiBuyLineItemsTarget {
  readonly type: 'multiBuyLineItems'
  /**
   *	A valid line item target predicate. The discount will be applied to line items that are matched by the predicate.
   *
   */
  readonly predicate: string
  /**
   *	Quantity of line items that need to be present in order to trigger an application of this discount.
   */
  readonly triggerQuantity: number
  /**
   *	Quantity of line items that are discounted per application of this discount.
   */
  readonly discountedQuantity: number
  /**
   *	Maximum number of applications of this discount.
   */
  readonly maxOccurrence?: number
  readonly selectionMode: SelectionMode
}
export type SelectionMode = 'Cheapest' | 'MostExpensive'
export type StackingMode = 'Stacking' | 'StopAfterThisDiscount'
export interface CartDiscountChangeCartPredicateAction {
  readonly action: 'changeCartPredicate'
  /**
   *	A valid Cart predicate.
   */
  readonly cartPredicate: string
}
export interface CartDiscountChangeIsActiveAction {
  readonly action: 'changeIsActive'
  readonly isActive: boolean
}
export interface CartDiscountChangeNameAction {
  readonly action: 'changeName'
  readonly name: LocalizedString
}
export interface CartDiscountChangeRequiresDiscountCodeAction {
  readonly action: 'changeRequiresDiscountCode'
  readonly requiresDiscountCode: boolean
}
export interface CartDiscountChangeSortOrderAction {
  readonly action: 'changeSortOrder'
  /**
   *	The string must contain a number between 0 and 1.
   *	A discount with greater sortOrder is prioritized higher than a discount with lower sortOrder.
   */
  readonly sortOrder: string
}
export interface CartDiscountChangeStackingModeAction {
  readonly action: 'changeStackingMode'
  readonly stackingMode: StackingMode
}
export interface CartDiscountChangeTargetAction {
  readonly action: 'changeTarget'
  readonly target: CartDiscountTarget
}
export interface CartDiscountChangeValueAction {
  readonly action: 'changeValue'
  readonly value: CartDiscountValueDraft
}
export interface CartDiscountSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  /**
   *	If `value` is absent or `null`, this field will be removed if it exists.
   *	Trying to remove a field that does not exist will fail with an `InvalidOperation` error.
   *	If `value` is provided, set the `value` of the field defined by the `name`.
   *	The FieldDefinition determines the format for the `value` to be provided.
   */
  readonly value?: any
}
export interface CartDiscountSetCustomTypeAction {
  readonly action: 'setCustomType'
  /**
   *	A valid JSON object, based on the FieldDefinitions of the Type.
   *	Sets the custom fields to this value.
   */
  readonly fields?: any
  /**
   *	If absent, the custom type and any existing CustomFields are removed.
   */
  readonly type?: TypeResourceIdentifier
}
export interface CartDiscountSetDescriptionAction {
  readonly action: 'setDescription'
  /**
   *	If the `description` parameter is not included, the field will be emptied.
   */
  readonly description?: LocalizedString
}
export interface CartDiscountSetKeyAction {
  readonly action: 'setKey'
  /**
   *	If `key` is absent or `null`, this field will be removed if it exists.
   */
  readonly key?: string
}
export interface CartDiscountSetValidFromAction {
  readonly action: 'setValidFrom'
  /**
   *	If absent, the field with the value is removed in case a value was set before.
   */
  readonly validFrom?: string
}
export interface CartDiscountSetValidFromAndUntilAction {
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
export interface CartDiscountSetValidUntilAction {
  readonly action: 'setValidUntil'
  /**
   *	If absent, the field with the value is removed in case a value was set before.
   */
  readonly validUntil?: string
}
