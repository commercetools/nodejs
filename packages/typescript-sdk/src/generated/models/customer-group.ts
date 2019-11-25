//Generated file, please do not change

import {
  CreatedBy,
  LastModifiedBy,
  LoggedResource,
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
} from './common'
import { CustomFields, FieldContainer, TypeResourceIdentifier } from './type'

export interface CustomerGroup extends LoggedResource {
  /**
   *		The unique ID of the customer group.
   */
  readonly id: string
  /**
   *		The current version of the customer group.
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
   *		User-specific unique identifier for the customer group.
   */
  readonly key?: string
  readonly name: string
  readonly custom?: CustomFields
}
export interface CustomerGroupDraft {
  /**
   *		User-specific unique identifier for the customer group.
   */
  readonly key?: string
  readonly groupName: string
  readonly custom?: CustomFields
}
export interface CustomerGroupPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: CustomerGroup[]
}
export interface CustomerGroupReference {
  readonly typeId: 'customer-group'
  readonly id: string
  readonly obj?: CustomerGroup
}
export interface CustomerGroupResourceIdentifier {
  readonly typeId: 'customer-group'
  readonly id?: string
  readonly key?: string
}
export interface CustomerGroupUpdate {
  readonly version: number
  readonly actions: CustomerGroupUpdateAction[]
}
export type CustomerGroupUpdateAction =
  | CustomerGroupChangeNameAction
  | CustomerGroupSetCustomFieldAction
  | CustomerGroupSetCustomTypeAction
  | CustomerGroupSetKeyAction
export interface CustomerGroupChangeNameAction {
  readonly action: 'changeName'
  readonly name: string
}
export interface CustomerGroupSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: object
}
export interface CustomerGroupSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly fields?: FieldContainer
  readonly type?: TypeResourceIdentifier
}
export interface CustomerGroupSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
