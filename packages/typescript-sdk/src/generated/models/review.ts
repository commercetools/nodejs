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

import { ChannelReference, ChannelResourceIdentifier } from 'models/channel'
import {
  BaseResource,
  CreatedBy,
  LastModifiedBy,
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
} from 'models/common'
import { CustomerReference, CustomerResourceIdentifier } from 'models/customer'
import { ProductReference, ProductResourceIdentifier } from 'models/product'
import { StateReference, StateResourceIdentifier } from 'models/state'
import {
  CustomFields,
  CustomFieldsDraft,
  FieldContainer,
  TypeResourceIdentifier,
} from 'models/type'

export interface Review extends BaseResource {
  /**
   *	The unique ID of the review.
   */
  readonly id: string
  /**
   *	The current version of the review.
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
  /**
   *	User-specific unique identifier for the review.
   */
  readonly key?: string
  readonly uniquenessValue?: string
  readonly locale?: string
  readonly authorName?: string
  readonly title?: string
  readonly text?: string
  /**
   *	Identifies the target of the review.
   *	Can be a Product or a Channel
   */
  readonly target?: ProductReference | ChannelReference
  /**
   *	Indicates if this review is taken into account in the ratings statistics of the target.
   *	A review is per default used in the statistics, unless the review is in a state that does not have the role `ReviewIncludedInStatistics`.
   *	If the role of a State is modified after the calculation of this field, the calculation is not updated.
   */
  readonly includedInStatistics: boolean
  /**
   *	Number between -100 and 100 included.
   */
  readonly rating?: number
  readonly state?: StateReference
  /**
   *	The customer who created the review.
   */
  readonly customer?: CustomerReference
  readonly custom?: CustomFields
}
export interface ReviewDraft {
  /**
   *	User-specific unique identifier for the review.
   */
  readonly key?: string
  /**
   *	If set, this value must be unique among reviews.
   *	For example, if you want to have only one review per customer and per product, you can set the value to `customer's id` + `product's id`.
   */
  readonly uniquenessValue?: string
  readonly locale?: string
  readonly authorName?: string
  readonly title?: string
  readonly text?: string
  /**
   *	Identifies the target of the review.
   *	Can be a Product or a Channel
   */
  readonly target?: ProductResourceIdentifier | ChannelResourceIdentifier
  readonly state?: StateResourceIdentifier
  /**
   *	Number between -100 and 100 included.
   *	Rating of the targeted object, like a product.
   *	This rating can represent the number of stars, or a percentage, or a like (+1)/dislike (-1)
   *	A rating is used in the ratings statistics of the targeted object, unless the review is in a state that does not have the role `ReviewIncludedInStatistics`.
   */
  readonly rating?: number
  /**
   *	The customer who created the review.
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
   *	Average rating of one target
   *	This number is rounded with 5 decimals.
   */
  readonly averageRating: number
  /**
   *	Highest rating of one target
   */
  readonly highestRating: number
  /**
   *	Lowest rating of one target
   */
  readonly lowestRating: number
  /**
   *	Number of ratings taken into account
   */
  readonly count: number
  /**
   *	The full distribution of the ratings.
   *	The keys are the different ratings and the values are the count of reviews having this rating.
   *	Only the used ratings appear in this object.
   */
  readonly ratingsDistribution: any
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
  /**
   *	If `authorName` is absent or `null`, this field will be removed if it exists.
   */
  readonly authorName?: string
}
export interface ReviewSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface ReviewSetCustomTypeAction {
  readonly action: 'setCustomType'
  /**
   *	A valid JSON object, based on the FieldDefinitions of the Type.
   *	Sets the CustomFields to this value.
   */
  readonly fields?: FieldContainer
  /**
   *	If absent, the custom type and any existing custom fields are removed.
   */
  readonly type?: TypeResourceIdentifier
}
export interface ReviewSetCustomerAction {
  readonly action: 'setCustomer'
  /**
   *	The customer who created the review.
   *	If `customer` is absent or `null`, this field will be removed if it exists.
   */
  readonly customer?: CustomerResourceIdentifier
}
export interface ReviewSetKeyAction {
  readonly action: 'setKey'
  /**
   *	If `key` is absent or `null`, this field will be removed if it exists.
   */
  readonly key?: string
}
export interface ReviewSetLocaleAction {
  readonly action: 'setLocale'
  /**
   *	If `locale` is absent or `null`, this field will be removed if it exists.
   */
  readonly locale?: string
}
export interface ReviewSetRatingAction {
  readonly action: 'setRating'
  /**
   *	Number between -100 and 100 included.
   *	If `rating` is absent or `null`, this field will be removed if it exists.
   */
  readonly rating?: number
}
export interface ReviewSetTargetAction {
  readonly action: 'setTarget'
  /**
   *	Identifies the target of the review.
   *	Can be a Product or a Channel.
   *	If `target` is absent or `null`, this field will be removed if it exists.
   */
  readonly target: ProductResourceIdentifier | ChannelResourceIdentifier
}
export interface ReviewSetTextAction {
  readonly action: 'setText'
  /**
   *	If `text` is absent or `null`, this field will be removed if it exists.
   */
  readonly text?: string
}
export interface ReviewSetTitleAction {
  readonly action: 'setTitle'
  /**
   *	If `title` is absent or `null`, this field will be removed if it exists.
   */
  readonly title?: string
}
export interface ReviewTransitionStateAction {
  readonly action: 'transitionState'
  readonly force?: boolean
  readonly state: StateResourceIdentifier
}
