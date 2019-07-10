/* tslint:disable */
//Generated file, please do not change

import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { CustomFields } from './Type'
import { ChannelResourceIdentifier } from './Channel'
import { LoggedResource } from './Common'
import { CustomFieldsDraft } from './Type'
import { ReferenceTypeId } from './Common'
import { Reference } from './Common'
import { ResourceIdentifier } from './Common'
import { FieldContainer } from './Type'
import { TypeResourceIdentifier } from './Type'


export interface InventoryEntry extends LoggedResource {
  
  readonly sku: string;
  
  readonly supplyChannel?: ChannelResourceIdentifier;
  
  readonly quantityOnStock: number;
  
  readonly availableQuantity: number;
  
  readonly restockableInDays?: number;
  
  readonly expectedDelivery?: string;
  
  readonly custom?: CustomFields
}

export interface InventoryEntryDraft {
  
  readonly sku: string;
  
  readonly supplyChannel?: ChannelResourceIdentifier;
  
  readonly quantityOnStock: number;
  
  readonly restockableInDays?: number;
  
  readonly expectedDelivery?: string;
  
  readonly custom?: CustomFieldsDraft
}

export interface InventoryEntryReference {
  readonly typeId: "inventory-entry";
  
  readonly id: string;
  
  readonly obj?: InventoryEntry
}

export interface InventoryEntryResourceIdentifier {
  readonly typeId: "inventory-entry";
  
  readonly id?: string;
  
  readonly key?: string
}

export interface InventoryPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: InventoryEntry[]
}

export interface InventoryUpdate {
  
  readonly version: number;
  
  readonly actions: InventoryUpdateAction[]
}

export type InventoryUpdateAction =
  InventoryAddQuantityAction |
  InventoryChangeQuantityAction |
  InventoryRemoveQuantityAction |
  InventorySetCustomFieldAction |
  InventorySetCustomTypeAction |
  InventorySetExpectedDeliveryAction |
  InventorySetRestockableInDaysAction |
  InventorySetSupplyChannelAction
;

export interface InventoryAddQuantityAction {
  readonly action: "addQuantity";
  
  readonly quantity: number
}

export interface InventoryChangeQuantityAction {
  readonly action: "changeQuantity";
  
  readonly quantity: number
}

export interface InventoryRemoveQuantityAction {
  readonly action: "removeQuantity";
  
  readonly quantity: number
}

export interface InventorySetCustomFieldAction {
  readonly action: "setCustomField";
  
  readonly name: string;
  
  readonly value?: object
}

export interface InventorySetCustomTypeAction {
  readonly action: "setCustomType";
  
  readonly fields?: FieldContainer;
  
  readonly type?: TypeResourceIdentifier
}

export interface InventorySetExpectedDeliveryAction {
  readonly action: "setExpectedDelivery";
  
  readonly expectedDelivery?: string
}

export interface InventorySetRestockableInDaysAction {
  readonly action: "setRestockableInDays";
  
  readonly restockableInDays?: number
}

export interface InventorySetSupplyChannelAction {
  readonly action: "setSupplyChannel";
  
  readonly supplyChannel?: ChannelResourceIdentifier
}