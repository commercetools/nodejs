//Generated file, please do not change

import { CreatedBy, LastModifiedBy, LoggedResource, Reference, ReferenceTypeId, ResourceIdentifier } from './common'

export interface Location {
  /**
  *		A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
  */
  readonly country: string;
  readonly state?: string
}
export interface Zone extends LoggedResource {
  /**
  *		The unique ID of the zone.
  */
  readonly id: string;
  /**
  *		The current version of the zone.
  */
  readonly version: number;
  readonly createdAt: string;
  readonly lastModifiedAt: string;
  readonly lastModifiedBy?: LastModifiedBy;
  readonly createdBy?: CreatedBy;
  /**
  *		User-specific unique identifier for a zone.
  *		Must be unique across a project.
  *		The field can be reset using the Set Key UpdateAction.
  */
  readonly key?: string;
  readonly name: string;
  readonly description?: string;
  readonly locations: Location[]
}
export interface ZoneDraft {
  /**
  *		User-specific unique identifier for a zone.
  *		Must be unique across a project.
  *		The field can be reset using the Set Key UpdateAction.
  */
  readonly key?: string;
  readonly name: string;
  readonly description?: string;
  readonly locations: Location[]
}
export interface ZonePagedQueryResponse {
  readonly limit: number;
  readonly count: number;
  readonly total?: number;
  readonly offset: number;
  readonly results: Zone[]
}
export interface ZoneReference {
  readonly typeId: "zone";
  readonly id: string;
  readonly obj?: Zone
}
export interface ZoneResourceIdentifier {
  readonly typeId: "zone";
  readonly id?: string;
  readonly key?: string
}
export interface ZoneUpdate {
  readonly version: number;
  readonly actions: ZoneUpdateAction[]
}
export type ZoneUpdateAction =
  ZoneAddLocationAction |
  ZoneChangeNameAction |
  ZoneRemoveLocationAction |
  ZoneSetDescriptionAction |
  ZoneSetKeyAction
;
export interface ZoneAddLocationAction {
  readonly action: "addLocation";
  readonly location: Location
}
export interface ZoneChangeNameAction {
  readonly action: "changeName";
  readonly name: string
}
export interface ZoneRemoveLocationAction {
  readonly action: "removeLocation";
  readonly location: Location
}
export interface ZoneSetDescriptionAction {
  readonly action: "setDescription";
  readonly description?: string
}
export interface ZoneSetKeyAction {
  readonly action: "setKey";
  readonly key?: string
}