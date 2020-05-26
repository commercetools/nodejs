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
  LocalizedString,
} from 'models/common'

export interface Store extends BaseResource {
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
  readonly languages?: string[]
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
  readonly languages?: string[]
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
export type StoreUpdateAction = StoreSetLanguagesAction | StoreSetNameAction
export interface StoreSetLanguagesAction {
  readonly action: 'setLanguages'
  readonly languages?: string[]
}
export interface StoreSetNameAction {
  readonly action: 'setName'
  /**
   *	The updated name of the store
   */
  readonly name?: LocalizedString
}
