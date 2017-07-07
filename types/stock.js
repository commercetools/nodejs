/* @flow */

export type Stock = {
  id: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  sku: string;
  supplyChannel: Object;
  quantityOnStock: number;
  availableQuantity: number;
  restockableInDays: number;
  expectedDelivery: string;
  custom: {
    type: Object;
    fields: Object;
  }
}
