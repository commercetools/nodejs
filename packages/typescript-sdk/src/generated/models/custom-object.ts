//Generated file, please do not change

import {
  CreatedBy,
  LastModifiedBy,
  LoggedResource,
  Reference,
  ReferenceTypeId,
} from './common'

export interface CustomObject extends LoggedResource {
  readonly container: string

  readonly key: string

  readonly value: object
}

export interface CustomObjectDraft {
  readonly container: string

  readonly key: string

  readonly value: object

  readonly version?: number
}

export interface CustomObjectPagedQueryResponse {
  readonly limit: number

  readonly count: number

  readonly total?: number

  readonly offset: number

  readonly results: CustomObject[]
}

export interface CustomObjectReference {
  readonly typeId: 'key-value-document'

  readonly id: string

  readonly obj?: CustomObject
}
