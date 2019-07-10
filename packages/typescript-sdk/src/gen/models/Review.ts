/* tslint:disable */
//Generated file, please do not change

import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { CustomFields } from './Type'
import { StateReference } from './State'
import { CustomerReference } from './Customer'
import { ProductReference } from './Product'
import { ChannelReference } from './Channel'
import { LoggedResource } from './Common'
import { CustomFieldsDraft } from './Type'
import { StateResourceIdentifier } from './State'
import { CustomerResourceIdentifier } from './Customer'
import { ProductResourceIdentifier } from './Product'
import { ChannelResourceIdentifier } from './Channel'
import { ReferenceTypeId } from './Common'
import { Reference } from './Common'
import { ResourceIdentifier } from './Common'
import { FieldContainer } from './Type'
import { TypeResourceIdentifier } from './Type'


export interface Review extends LoggedResource {
  
  readonly key?: string;
  
  readonly uniquenessValue?: string;
  
  readonly locale?: string;
  
  readonly authorName?: string;
  
  readonly title?: string;
  
  readonly text?: string;
  
  readonly target?: ProductReference | ChannelReference;
  
  readonly includedInStatistics: boolean;
  
  readonly rating?: number;
  
  readonly state?: StateReference;
  
  readonly customer?: CustomerReference;
  
  readonly custom?: CustomFields
}

export interface ReviewDraft {
  
  readonly key?: string;
  
  readonly uniquenessValue?: string;
  
  readonly locale?: string;
  
  readonly authorName?: string;
  
  readonly title?: string;
  
  readonly text?: string;
  
  readonly target?: ProductResourceIdentifier | ChannelResourceIdentifier;
  
  readonly state?: StateResourceIdentifier;
  
  readonly rating?: number;
  
  readonly customer?: CustomerResourceIdentifier;
  
  readonly custom?: CustomFieldsDraft
}

export interface ReviewPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: Review[]
}

export interface ReviewRatingStatistics {
  
  readonly averageRating: number;
  
  readonly highestRating: number;
  
  readonly lowestRating: number;
  
  readonly count: number;
  
  readonly ratingsDistribution: object
}

export interface ReviewReference {
  readonly typeId: "review";
  
  readonly id: string;
  
  readonly obj?: Review
}

export interface ReviewResourceIdentifier {
  readonly typeId: "review";
  
  readonly id?: string;
  
  readonly key?: string
}

export interface ReviewUpdate {
  
  readonly version: number;
  
  readonly actions: ReviewUpdateAction[]
}

export type ReviewUpdateAction =
  ReviewSetAuthorNameAction |
  ReviewSetCustomFieldAction |
  ReviewSetCustomTypeAction |
  ReviewSetCustomerAction |
  ReviewSetKeyAction |
  ReviewSetLocaleAction |
  ReviewSetRatingAction |
  ReviewSetTargetAction |
  ReviewSetTextAction |
  ReviewSetTitleAction |
  ReviewTransitionStateAction
;

export interface ReviewSetAuthorNameAction {
  readonly action: "setAuthorName";
  
  readonly authorName?: string
}

export interface ReviewSetCustomFieldAction {
  readonly action: "setCustomField";
  
  readonly name: string;
  
  readonly value?: object
}

export interface ReviewSetCustomTypeAction {
  readonly action: "setCustomType";
  
  readonly fields?: FieldContainer;
  
  readonly type?: TypeResourceIdentifier
}

export interface ReviewSetCustomerAction {
  readonly action: "setCustomer";
  
  readonly customer?: CustomerResourceIdentifier
}

export interface ReviewSetKeyAction {
  readonly action: "setKey";
  
  readonly key?: string
}

export interface ReviewSetLocaleAction {
  readonly action: "setLocale";
  
  readonly locale?: string
}

export interface ReviewSetRatingAction {
  readonly action: "setRating";
  
  readonly rating?: number
}

export interface ReviewSetTargetAction {
  readonly action: "setTarget";
  
  readonly target: ProductResourceIdentifier | ChannelResourceIdentifier
}

export interface ReviewSetTextAction {
  readonly action: "setText";
  
  readonly text?: string
}

export interface ReviewSetTitleAction {
  readonly action: "setTitle";
  
  readonly title?: string
}

export interface ReviewTransitionStateAction {
  readonly action: "transitionState";
  
  readonly force?: boolean;
  
  readonly state: StateResourceIdentifier
}