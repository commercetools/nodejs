/* tslint:disable */
//Generated file, please do not change

import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { Address } from './Common'
import { GeoJsonPoint } from './Common'
import { GeoJson } from './Common'
import { CustomFields } from './Type'
import { LocalizedString } from './Common'
import { ReviewRatingStatistics } from './Review'
import { LoggedResource } from './Common'
import { CustomFieldsDraft } from './Type'
import { ReferenceTypeId } from './Common'
import { Reference } from './Common'
import { ResourceIdentifier } from './Common'
import { FieldContainer } from './Type'
import { TypeResourceIdentifier } from './Type'


export interface Channel extends LoggedResource {
  
  readonly key: string;
  
  readonly roles: ChannelRoleEnum[];
  
  readonly name?: LocalizedString;
  
  readonly description?: LocalizedString;
  
  readonly address?: Address;
  
  readonly reviewRatingStatistics?: ReviewRatingStatistics;
  
  readonly custom?: CustomFields;
  
  readonly geoLocation?: GeoJsonPoint | GeoJson
}

export interface ChannelDraft {
  
  readonly key: string;
  
  readonly roles?: ChannelRoleEnum[];
  
  readonly name?: LocalizedString;
  
  readonly description?: LocalizedString;
  
  readonly address?: Address;
  
  readonly custom?: CustomFieldsDraft;
  
  readonly geoLocation?: GeoJsonPoint | GeoJson
}

export interface ChannelPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: Channel[]
}

export interface ChannelReference {
  readonly typeId: "channel";
  
  readonly id: string;
  
  readonly obj?: Channel
}

export interface ChannelResourceIdentifier {
  readonly typeId: "channel";
  
  readonly id?: string;
  
  readonly key?: string
}

export type ChannelRoleEnum =
   'InventorySupply' |
   'ProductDistribution' |
   'OrderExport' |
   'OrderImport' |
   'Primary';

export interface ChannelUpdate {
  
  readonly version: number;
  
  readonly actions: ChannelUpdateAction[]
}

export type ChannelUpdateAction =
  ChannelAddRolesAction |
  ChannelChangeDescriptionAction |
  ChannelChangeKeyAction |
  ChannelChangeNameAction |
  ChannelRemoveRolesAction |
  ChannelSetAddressAction |
  ChannelSetCustomFieldAction |
  ChannelSetCustomTypeAction |
  ChannelSetGeoLocationAction |
  ChannelSetRolesAction
;

export interface ChannelAddRolesAction {
  readonly action: "addRoles";
  
  readonly roles: ChannelRoleEnum[]
}

export interface ChannelChangeDescriptionAction {
  readonly action: "changeDescription";
  
  readonly description: LocalizedString
}

export interface ChannelChangeKeyAction {
  readonly action: "changeKey";
  
  readonly key: string
}

export interface ChannelChangeNameAction {
  readonly action: "changeName";
  
  readonly name: LocalizedString
}

export interface ChannelRemoveRolesAction {
  readonly action: "removeRoles";
  
  readonly roles: ChannelRoleEnum[]
}

export interface ChannelSetAddressAction {
  readonly action: "setAddress";
  
  readonly address?: Address
}

export interface ChannelSetCustomFieldAction {
  readonly action: "setCustomField";
  
  readonly name: string;
  
  readonly value?: object
}

export interface ChannelSetCustomTypeAction {
  readonly action: "setCustomType";
  
  readonly fields?: FieldContainer;
  
  readonly type?: TypeResourceIdentifier
}

export interface ChannelSetGeoLocationAction {
  readonly action: "setGeoLocation";
  
  readonly geoLocation?: GeoJsonPoint | GeoJson
}

export interface ChannelSetRolesAction {
  readonly action: "setRoles";
  
  readonly roles: ChannelRoleEnum[]
}