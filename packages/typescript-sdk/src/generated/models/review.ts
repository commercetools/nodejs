//Generated file, please do not change

import { ChannelReference, ChannelResourceIdentifier } from './channel'
import {
  CreatedBy,
  LastModifiedBy,
  LoggedResource,
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
} from './common'
import { CustomerReference, CustomerResourceIdentifier } from './customer'
import { ProductReference, ProductResourceIdentifier } from './product'
import { StateReference, StateResourceIdentifier } from './state'
import {
  CustomFields,
  CustomFieldsDraft,
  FieldContainer,
  TypeResourceIdentifier,
} from './type'

export interface Review extends LoggedResource {
  /**
   *		The unique ID of the review.
   */
  readonly id: string
  /**
   *		The current version of the review.
   */
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  /**
   *		Present on resources updated after 1/02/2019 except for events not tracked.
   */
  readonly lastModifiedBy?: LastModifiedBy
  /**
   *		Present on resources created after 1/02/2019 except for events not tracked.
   */
  readonly createdBy?: CreatedBy
  /**
   *		User-specific unique identifier for the review.
   */
  readonly key?: string
  readonly uniquenessValue?: string
  readonly locale?: string
  readonly authorName?: string
  readonly title?: string
  readonly text?: string
  /**
   *		Identifies the target of the review.
   *		Can be a Product or a Channel
   */
  readonly target?: ProductReference | ChannelReference
  /**
   *		Indicates if this review is taken into account in the ratings statistics of the target.
   *		A review is per default used in the statistics, unless the review is in a state that does not have the role `ReviewIncludedInStatistics`.
   *		If the role of a State is modified after the calculation of this field, the calculation is not updated.
   */
  readonly includedInStatistics: boolean
  /**
   *		Number between -100 and 100 included.
   */
  readonly rating?: number
  readonly state?: StateReference
  /**
   *		The customer who created the review.
   */
  readonly customer?: CustomerReference
  readonly custom?: CustomFields
}
export interface ReviewDraft {
  /**
   *		User-specific unique identifier for the review.
   */
  readonly key?: string
  /**
   *		If set, this value must be unique among reviews.
   *		For example, if you want to have only one review per customer and per product, you can set the value to `customer's id` + `product's id`.
   */
  readonly uniquenessValue?: string
  readonly locale?: string
  readonly authorName?: string
  readonly title?: string
  readonly text?: string
  /**
   *		Identifies the target of the review.
   *		Can be a Product or a Channel
   */
  readonly target?: ProductResourceIdentifier | ChannelResourceIdentifier
  readonly state?: StateResourceIdentifier
  /**
   *		Number between -100 and 100 included.
   *		Rating of the targeted object, like a product.
   *		This rating can represent the number of stars, or a percentage, or a like (+1)/dislike (-1)
   *		A rating is used in the ratings statistics of the targeted object, unless the review is in a state that does not have the role `ReviewIncludedInStatistics`.
   */
  readonly rating?: number
  /**
   *		The customer who created the review.
   */
  readonly customer?: CustomerResourceIdentifier
  readonly custom?: CustomFieldsDraft
}
export interface ReviewPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Review[]
}
export interface ReviewRatingStatistics {
  /**
   *		Average rating of one target
   *		This number is rounded with 5 decimals.
   */
  readonly averageRating: number
  /**
   *		Highest rating of one target
   */
  readonly highestRating: number
  /**
   *		Lowest rating of one target
   */
  readonly lowestRating: number
  /**
   *		Number of ratings taken into account
   */
  readonly count: number
  /**
   *		The full distribution of the ratings.
   *		The keys are the different ratings and the values are the count of reviews having this rating.
   *		Only the used ratings appear in this object.
   */
  readonly ratingsDistribution: object
}
export interface ReviewReference {
  readonly typeId: 'review'
  readonly id: string
  readonly obj?: Review
}
export interface ReviewResourceIdentifier {
  readonly typeId: 'review'
  readonly id?: string
  readonly key?: string
}
export interface ReviewUpdate {
  readonly version: number
  readonly actions: ReviewUpdateAction[]
}
export type ReviewUpdateAction =
  | ReviewSetAuthorNameAction
  | ReviewSetCustomFieldAction
  | ReviewSetCustomTypeAction
  | ReviewSetCustomerAction
  | ReviewSetKeyAction
  | ReviewSetLocaleAction
  | ReviewSetRatingAction
  | ReviewSetTargetAction
  | ReviewSetTextAction
  | ReviewSetTitleAction
  | ReviewTransitionStateAction
export interface ReviewSetAuthorNameAction {
  readonly action: 'setAuthorName'
  readonly authorName?: string
}
export interface ReviewSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: object
}
export interface ReviewSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly fields?: FieldContainer
  readonly type?: TypeResourceIdentifier
}
export interface ReviewSetCustomerAction {
  readonly action: 'setCustomer'
  readonly customer?: CustomerResourceIdentifier
}
export interface ReviewSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
export interface ReviewSetLocaleAction {
  readonly action: 'setLocale'
  readonly locale?: string
}
export interface ReviewSetRatingAction {
  readonly action: 'setRating'
  readonly rating?: number
}
export interface ReviewSetTargetAction {
  readonly action: 'setTarget'
  readonly target: ProductResourceIdentifier | ChannelResourceIdentifier
}
export interface ReviewSetTextAction {
  readonly action: 'setText'
  readonly text?: string
}
export interface ReviewSetTitleAction {
  readonly action: 'setTitle'
  readonly title?: string
}
export interface ReviewTransitionStateAction {
  readonly action: 'transitionState'
  readonly force?: boolean
  readonly state: StateResourceIdentifier
}
