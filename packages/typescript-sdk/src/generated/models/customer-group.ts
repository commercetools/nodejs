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
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
} from 'models/common'
import {
  CustomFields,
  FieldContainer,
  TypeResourceIdentifier,
} from 'models/type'

export interface CustomerGroup extends BaseResource {
  /**
   *	The unique ID of the customer group.
   */
  readonly id: string
  /**
   *	The current version of the customer group.
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
   *	User-specific unique identifier for the customer group.
   */
  readonly key?: string
  readonly name: string
  readonly custom?: CustomFields
}
export interface CustomerGroupDraft {
  /**
   *	User-specific unique identifier for the customer group.
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
  readonly value?: any
}
export interface CustomerGroupSetCustomTypeAction {
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
export interface CustomerGroupSetKeyAction {
  readonly action: 'setKey'
  /**
   *	User-specific unique identifier for the customer group.
   */
  readonly key?: string
}
