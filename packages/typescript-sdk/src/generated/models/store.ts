//Generated file, please do not change

import {
  CreatedBy,
  KeyReference,
  LastModifiedBy,
  LocalizedString,
  LoggedResource,
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
} from './common'

export interface Store extends LoggedResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  /**
   *	User-specific unique identifier for the store.
   *	The `key` is mandatory and immutable.
   *	It is used to reference the store.
   */
  readonly key: string
  /**
   *	The name of the store
   */
  readonly name?: LocalizedString
}
export interface StoreDraft {
  /**
   *	User-specific unique identifier for the store.
   *	The `key` is mandatory and immutable.
   *	It is used to reference the store.
   */
  readonly key: string
  /**
   *	The name of the store
   */
  readonly name: LocalizedString
}
export interface StoreKeyReference {
  readonly typeId: 'store'
  readonly key: string
}
export interface StorePagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Store[]
}
export interface StoreReference {
  readonly typeId: 'store'
  readonly id: string
  readonly obj?: Store
}
export interface StoreResourceIdentifier {
  readonly typeId: 'store'
  readonly id?: string
  readonly key?: string
}
export interface StoreUpdate {
  readonly version: number
  readonly actions: StoreUpdateAction[]
}
export type StoreUpdateAction = StoreSetNameAction
export interface StoreSetNameAction {
  readonly action: 'setName'
  readonly name?: LocalizedString
}
