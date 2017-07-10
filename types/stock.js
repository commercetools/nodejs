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

export type ExportConfig = {
  format: string;
  delimiter: string;
  channelKey?: string;
  queryString?: string;
}

export type CsvStockMapping = {
  sku: string;
  supplyChannel?: Object;
  quantityOnStock: number;
  availableQuantity?: number;
  restockableInDays?: number;
  expectedDelivery?: string;
  customType?: string;
  custom?: {
    type: Object;
    fields: Object;
  }
}
