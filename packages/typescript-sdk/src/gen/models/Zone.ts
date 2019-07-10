/* tslint:disable */
//Generated file, please do not change

import { BaseResource } from './Common'
import { ReferenceTypeId } from './Common'
import { Reference } from './Common'
import { ResourceIdentifier } from './Common'


export interface Location {
  /**
  	<p>A two-digit country code as per <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 alpha-2</a>.</p>
  */
  readonly country: string;
  
  readonly state?: string
}

export interface Zone extends BaseResource {
  
  readonly key?: string;
  
  readonly name: string;
  
  readonly description?: string;
  
  readonly locations: Location[]
}

export interface ZoneDraft {
  
  readonly key?: string;
  
  readonly name: string;
  
  readonly description?: string;
  
  readonly locations: Location[]
}

export interface ZonePagedQueryResponse {
  
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