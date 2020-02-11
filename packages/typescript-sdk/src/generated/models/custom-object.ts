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
  Reference,
  ReferenceTypeId,
} from 'models/common'

export interface CustomObject extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  /**
   *	A namespace to group custom objects.
   */
  readonly container: string
  readonly key: string
  readonly value: any
}
export interface CustomObjectDraft {
  /**
   *	A namespace to group custom objects.
   */
  readonly container: string
  /**
   *	A user-defined key that is unique within the given container.
   */
  readonly key: string
  readonly value: any
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
