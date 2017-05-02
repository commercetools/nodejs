/* @flow */

/* Discount Codes */
export type CodeData = {
  name?: Object;
  description?: Object;
  cartDiscounts: [];
  cartPredicate?: string;
  isActive: boolean;
  maxApplicationsPerCustomer?: number;
  maxApplicationsPerCustomer?: number;
  uri: string;
  code?: string;
}

export type CodeDataArray = Array<CodeData>

export type CodeOptions = {
  quantity: number;
  length?: number;
  prefix?: string;
}
