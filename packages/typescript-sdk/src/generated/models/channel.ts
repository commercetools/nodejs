//Generated file, please do not change

import {
  Address,
  CreatedBy,
  GeoJson,
  GeoJsonPoint,
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
  readonly key: string

  readonly roles: ChannelRoleEnum[]

  readonly name?: LocalizedString

  readonly description?: LocalizedString

  readonly address?: Address

  readonly reviewRatingStatistics?: ReviewRatingStatistics

  readonly custom?: CustomFields

  readonly geoLocation?: GeoJsonPoint | GeoJson
}

export interface ChannelDraft {
  readonly key: string

  readonly roles?: ChannelRoleEnum[]

  readonly name?: LocalizedString

  readonly description?: LocalizedString

  readonly address?: Address

  readonly custom?: CustomFieldsDraft

  readonly geoLocation?: GeoJsonPoint | GeoJson
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

  readonly geoLocation?: GeoJsonPoint | GeoJson
}

export interface ChannelSetRolesAction {
  readonly action: 'setRoles'

  readonly roles: ChannelRoleEnum[]
}
