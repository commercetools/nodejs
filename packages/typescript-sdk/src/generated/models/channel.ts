//Generated file, please do not change

import {
  Address,
  CreatedBy,
  GeoJson,
  LastModifiedBy,
  LocalizedString,
  LoggedResource,
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
} from './common'
import { ReviewRatingStatistics } from './review'
import {
  CustomFields,
  CustomFieldsDraft,
  FieldContainer,
  TypeResourceIdentifier,
} from './type'

export interface Channel extends LoggedResource {
  /**
   *	The unique ID of the channel.
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
  /**
   *	Any arbitrary string key that uniquely identifies this channel within the project.
   */
  readonly key: string
  /**
   *	The roles of this channel.
   *	Each channel must have at least one role.
   */
  readonly roles: ChannelRoleEnum[]
  /**
   *	A human-readable name of the channel.
   */
  readonly name?: LocalizedString
  /**
   *	A human-readable description of the channel.
   */
  readonly description?: LocalizedString
  /**
   *	The address where this channel is located (e.g.
   *	if the channel is a physical store).
   */
  readonly address?: Address
  /**
   *	Statistics about the review ratings taken into account for this channel.
   */
  readonly reviewRatingStatistics?: ReviewRatingStatistics
  readonly custom?: CustomFields
  /**
   *	A GeoJSON geometry object encoding the geo location of the channel.
   */
  readonly geoLocation?: GeoJson
}
export interface ChannelDraft {
  readonly key: string
  /**
   *	If not specified, then channel will get InventorySupply role by default
   */
  readonly roles?: ChannelRoleEnum[]
  readonly name?: LocalizedString
  readonly description?: LocalizedString
  readonly address?: Address
  /**
   *	The custom fields.
   */
  readonly custom?: CustomFieldsDraft
  readonly geoLocation?: GeoJson
}
export interface ChannelPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Channel[]
}
export interface ChannelReference {
  readonly typeId: 'channel'
  readonly id: string
  readonly obj?: Channel
}
export interface ChannelResourceIdentifier {
  readonly typeId: 'channel'
  readonly id?: string
  readonly key?: string
}
export type ChannelRoleEnum =
  | 'InventorySupply'
  | 'ProductDistribution'
  | 'OrderExport'
  | 'OrderImport'
  | 'Primary'
export interface ChannelUpdate {
  readonly version: number
  readonly actions: ChannelUpdateAction[]
}
export type ChannelUpdateAction =
  | ChannelAddRolesAction
  | ChannelChangeDescriptionAction
  | ChannelChangeKeyAction
  | ChannelChangeNameAction
  | ChannelRemoveRolesAction
  | ChannelSetAddressAction
  | ChannelSetCustomFieldAction
  | ChannelSetCustomTypeAction
  | ChannelSetGeoLocationAction
  | ChannelSetRolesAction
export interface ChannelAddRolesAction {
  readonly action: 'addRoles'
  readonly roles: ChannelRoleEnum[]
}
export interface ChannelChangeDescriptionAction {
  readonly action: 'changeDescription'
  readonly description: LocalizedString
}
export interface ChannelChangeKeyAction {
  readonly action: 'changeKey'
  readonly key: string
}
export interface ChannelChangeNameAction {
  readonly action: 'changeName'
  readonly name: LocalizedString
}
export interface ChannelRemoveRolesAction {
  readonly action: 'removeRoles'
  readonly roles: ChannelRoleEnum[]
}
export interface ChannelSetAddressAction {
  readonly action: 'setAddress'
  readonly address?: Address
}
export interface ChannelSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: object
}
export interface ChannelSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly fields?: FieldContainer
  readonly type?: TypeResourceIdentifier
}
export interface ChannelSetGeoLocationAction {
  readonly action: 'setGeoLocation'
  readonly geoLocation?: GeoJson
}
export interface ChannelSetRolesAction {
  readonly action: 'setRoles'
  readonly roles: ChannelRoleEnum[]
}
