/* tslint:disable */
//Generated file, please do not change

import { BaseResource } from './Common'
import { ReferenceTypeId } from './Common'
import { Reference } from './Common'


export interface CustomObject extends BaseResource {
  
  readonly container: string;
  
  readonly key: string;
  
  readonly value: object
}

export interface CustomObjectDraft {
  
  readonly container: string;
  
  readonly key: string;
  
  readonly value: object;
  
  readonly version?: number
}

export interface CustomObjectPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: CustomObject[]
}

export interface CustomObjectReference {
  readonly typeId: "key-value-document";
  
  readonly id: string;
  
  readonly obj?: CustomObject
}