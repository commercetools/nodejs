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

import { ChannelResourceIdentifier } from 'models/channel'
import {
  BaseResource,
  CreatedBy,
  LastModifiedBy,
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
} from 'models/common'
import {
  CustomFields,
  CustomFieldsDraft,
  FieldContainer,
  TypeResourceIdentifier,
} from 'models/type'

export interface InventoryEntry extends BaseResource {
  /**
   *	The unique ID of the inventory entry.
   */
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  /**
   *	Present on resources updated after 1/02/2019 except for events not tracked.
   */
  readonly lastModifiedBy?: LastModifiedBy
  /**
   *	Present on resources created after 1/02/2019 except for events not tracked.
   */
  readonly createdBy?: CreatedBy
  readonly sku: string
  /**
   *	Optional connection to a particular supplier.
   */
  readonly supplyChannel?: ChannelResourceIdentifier
  /**
   *	Overall amount of stock.
   *	(available + reserved)
   */
  readonly quantityOnStock: number
  /**
   *	Available amount of stock.
   *	(available means: `quantityOnStock` - reserved quantity)
   */
  readonly availableQuantity: number
  /**
   *	The time period in days, that tells how often this inventory entry is restocked.
   */
  readonly restockableInDays?: number
  /**
   *	The date and time of the next restock.
   */
  readonly expectedDelivery?: string
  readonly custom?: CustomFields
}
export interface InventoryEntryDraft {
  readonly sku: string
  readonly supplyChannel?: ChannelResourceIdentifier
  readonly quantityOnStock: number
  readonly restockableInDays?: number
  readonly expectedDelivery?: string
  /**
   *	The custom fields.
   */
  readonly custom?: CustomFieldsDraft
}
export interface InventoryEntryReference {
  readonly typeId: 'inventory-entry'
  readonly id: string
  readonly obj?: InventoryEntry
}
export interface InventoryEntryResourceIdentifier {
  readonly typeId: 'inventory-entry'
  readonly id?: string
  readonly key?: string
}
export interface InventoryEntryUpdate {
  readonly version: number
  readonly actions: InventoryEntryUpdateAction[]
}
export type InventoryEntryUpdateAction =
  | InventoryEntryAddQuantityAction
  | InventoryEntryChangeQuantityAction
  | InventoryEntryRemoveQuantityAction
  | InventoryEntrySetCustomFieldAction
  | InventoryEntrySetCustomTypeAction
  | InventoryEntrySetExpectedDeliveryAction
  | InventoryEntrySetRestockableInDaysAction
  | InventoryEntrySetSupplyChannelAction
export interface InventoryPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: InventoryEntry[]
}
export interface InventoryEntryAddQuantityAction {
  readonly action: 'addQuantity'
  readonly quantity: number
}
export interface InventoryEntryChangeQuantityAction {
  readonly action: 'changeQuantity'
  readonly quantity: number
}
export interface InventoryEntryRemoveQuantityAction {
  readonly action: 'removeQuantity'
  readonly quantity: number
}
export interface InventoryEntrySetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface InventoryEntrySetCustomTypeAction {
  readonly action: 'setCustomType'
  /**
   *	If absent, the custom type and any existing CustomFields are removed.
   */
  readonly type?: TypeResourceIdentifier
  /**
   *	A valid JSON object, based on the FieldDefinitions of the Type.
   *	Sets the custom fields to this value.
   */
  readonly fields?: FieldContainer
}
export interface InventoryEntrySetExpectedDeliveryAction {
  readonly action: 'setExpectedDelivery'
  readonly expectedDelivery?: string
}
export interface InventoryEntrySetRestockableInDaysAction {
  readonly action: 'setRestockableInDays'
  readonly restockableInDays?: number
}
export interface InventoryEntrySetSupplyChannelAction {
  readonly action: 'setSupplyChannel'
  /**
   *	If absent, the supply channel is removed.
   *	This action will fail if an entry with the combination of sku and supplyChannel already exists.
   */
  readonly supplyChannel?: ChannelResourceIdentifier
}
