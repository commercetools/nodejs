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
  readonly key: string

  readonly name?: LocalizedString
}

export interface StoreDraft {
  readonly key: string

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
