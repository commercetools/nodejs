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

import {
  BaseResource,
  CreatedBy,
  LastModifiedBy,
  LocalizedString,
  Money,
  QueryPrice,
  Reference,
  TypedMoney,
} from 'models/common'

export interface ProductDiscount extends BaseResource {
  /**
   *	The unique ID of the product discount
   */
  readonly id: string
  /**
   *	The current version of the product discount.
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
   *	User-specific unique identifier for a product discount.
   *	Must be unique across a project.
   */
  readonly key?: string
  readonly description?: LocalizedString
  readonly value: ProductDiscountValue
  /**
   *	A valid ProductDiscount Predicate.
   */
  readonly predicate: string
  /**
   *	The string contains a number between 0 and 1.
   *	A discount with greater sortOrder is prioritized higher than a discount with lower sortOrder.
   *	A sortOrder must be unambiguous.
   */
  readonly sortOrder: string
  /**
   *	Only active discount will be applied to product prices.
   */
  readonly isActive: boolean
  /**
   *	The platform will generate this array from the predicate.
   *	It contains the references of all the resources that are addressed in the predicate.
   */
  readonly references: Reference[]
  /**
   *	The time from which the discount should be effective.
   *	Please take Eventual Consistency into account for calculated product discount values.
   */
  readonly validFrom?: string
  /**
   *	The time from which the discount should be ineffective.
   *	Please take Eventual Consistency into account for calculated undiscounted values.
   */
  readonly validUntil?: string
}
export interface ProductDiscountDraft {
  readonly name: LocalizedString
  /**
   *	User-specific unique identifier for a product discount.
   *	Must be unique across a project.
   *	The field can be reset using the Set Key UpdateAction
   */
  readonly key?: string
  readonly description?: LocalizedString
  readonly value: ProductDiscountValueDraft
  /**
   *	A valid ProductDiscount Predicate.
   */
  readonly predicate: string
  /**
   *	The string must contain a decimal number between 0 and 1.
   *	A discount with greater sortOrder is prioritized higher than a discount with lower sortOrder.
   */
  readonly sortOrder: string
  /**
   *	If set to `true` the discount will be applied to product prices.
   */
  readonly isActive: boolean
  /**
   *	The time from which the discount should be effective.
   *	Please take Eventual Consistency into account for calculated product discount values.
   */
  readonly validFrom?: string
  /**
   *	The time from which the discount should be effective.
   *	Please take Eventual Consistency into account for calculated undiscounted values.
   */
  readonly validUntil?: string
}
export interface ProductDiscountMatchQuery {
  readonly productId: string
  readonly variantId: number
  readonly staged: boolean
  readonly price: QueryPrice
}
export interface ProductDiscountPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: ProductDiscount[]
}
export interface ProductDiscountReference {
  readonly typeId: 'product-discount'
  readonly id: string
  readonly obj?: ProductDiscount
}
export interface ProductDiscountResourceIdentifier {
  readonly typeId: 'product-discount'
  readonly id?: string
  readonly key?: string
}
export interface ProductDiscountUpdate {
  readonly version: number
  readonly actions: ProductDiscountUpdateAction[]
}
export type ProductDiscountUpdateAction =
  | ProductDiscountChangeIsActiveAction
  | ProductDiscountChangeNameAction
  | ProductDiscountChangePredicateAction
  | ProductDiscountChangeSortOrderAction
  | ProductDiscountChangeValueAction
  | ProductDiscountSetDescriptionAction
  | ProductDiscountSetKeyAction
  | ProductDiscountSetValidFromAction
  | ProductDiscountSetValidFromAndUntilAction
  | ProductDiscountSetValidUntilAction
export type ProductDiscountValue =
  | ProductDiscountValueAbsolute
  | ProductDiscountValueExternal
  | ProductDiscountValueRelative
export interface ProductDiscountValueAbsolute {
  readonly type: 'absolute'
  readonly money: TypedMoney[]
}
export type ProductDiscountValueDraft =
  | ProductDiscountValueExternalDraft
  | ProductDiscountValueRelativeDraft
  | ProductDiscountValueAbsoluteDraft
export interface ProductDiscountValueAbsoluteDraft {
  readonly type: 'absolute'
  readonly money: Money[]
}
export interface ProductDiscountValueExternal {
  readonly type: 'external'
}
export interface ProductDiscountValueExternalDraft {
  readonly type: 'external'
}
export interface ProductDiscountValueRelative {
  readonly type: 'relative'
  readonly permyriad: number
}
export interface ProductDiscountValueRelativeDraft {
  readonly type: 'relative'
  readonly permyriad: number
}
export interface ProductDiscountChangeIsActiveAction {
  readonly action: 'changeIsActive'
  readonly isActive: boolean
}
export interface ProductDiscountChangeNameAction {
  readonly action: 'changeName'
  readonly name: LocalizedString
}
export interface ProductDiscountChangePredicateAction {
  readonly action: 'changePredicate'
  /**
   *	A valid ProductDiscount Predicate.
   */
  readonly predicate: string
}
export interface ProductDiscountChangeSortOrderAction {
  readonly action: 'changeSortOrder'
  /**
   *	The string must contain a number between 0 and 1.
   *	A discount with greater sortOrder is prioritized higher than a discount with lower sortOrder.
   */
  readonly sortOrder: string
}
export interface ProductDiscountChangeValueAction {
  readonly action: 'changeValue'
  readonly value: ProductDiscountValueDraft
}
export interface ProductDiscountSetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: LocalizedString
}
export interface ProductDiscountSetKeyAction {
  readonly action: 'setKey'
  /**
   *	The key to set.
   *	If you provide a `null` value or do not set this field at all, the existing `key` field is removed.
   */
  readonly key?: string
}
export interface ProductDiscountSetValidFromAction {
  readonly action: 'setValidFrom'
  /**
   *	The time from which the discount should be effective.
   *	Please take Eventual Consistency into account for calculated product discount values.
   */
  readonly validFrom?: string
}
export interface ProductDiscountSetValidFromAndUntilAction {
  readonly action: 'setValidFromAndUntil'
  readonly validFrom?: string
  /**
   *	The timeframe for which the discount should be effective.
   *	Please take Eventual Consistency into account for calculated undiscounted values.
   */
  readonly validUntil?: string
}
export interface ProductDiscountSetValidUntilAction {
  readonly action: 'setValidUntil'
  /**
   *	The time from which the discount should be ineffective.
   *	Please take Eventual Consistency into account for calculated undiscounted values.
   */
  readonly validUntil?: string
}
