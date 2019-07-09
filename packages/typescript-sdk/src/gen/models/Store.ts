/* tslint:disable */
//Generated file, please do not change

import { LocalizedString } from './Common'
import { BaseResource } from './Common'
import { ReferenceTypeId } from './Common'
import { KeyReference } from './Common'
import { Reference } from './Common'
import { ResourceIdentifier } from './Common'


export interface Store extends BaseResource {
  
  readonly key: string;
  
  readonly name?: LocalizedString
}

export interface StoreDraft {
  
  readonly key: string;
  
  readonly name: LocalizedString
}

export interface StoreKeyReference {
  readonly typeId: "store";
  
  readonly key: string
}

export interface StorePagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: Store[]
}

export interface StoreReference {
  readonly typeId: "store";
  
  readonly id: string;
  
  readonly obj?: Store
}

export interface StoreResourceIdentifier {
  readonly typeId: "store";
  
  readonly id?: string;
  
  readonly key?: string
}

export interface StoreUpdate {
  
  readonly version: number;
  
  readonly actions: StoreUpdateAction[]
}

export type StoreUpdateAction =
  StoreSetNameAction
;

export interface StoreSetNameAction {
  readonly action: "setName";
  
  readonly name?: LocalizedString
}