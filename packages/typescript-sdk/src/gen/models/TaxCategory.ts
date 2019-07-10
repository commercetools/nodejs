/* tslint:disable */
//Generated file, please do not change

import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { LoggedResource } from './Common'
import { ReferenceTypeId } from './Common'
import { Reference } from './Common'
import { ResourceIdentifier } from './Common'


export interface SubRate {
  
  readonly name: string;
  
  readonly amount: number
}

export interface TaxCategory extends LoggedResource {
  
  readonly name: string;
  
  readonly description?: string;
  
  readonly rates: TaxRate[];
  
  readonly key?: string
}

export interface TaxCategoryDraft {
  
  readonly name: string;
  
  readonly description?: string;
  
  readonly rates: TaxRateDraft[];
  
  readonly key?: string
}

export interface TaxCategoryPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: TaxCategory[]
}

export interface TaxCategoryReference {
  readonly typeId: "tax-category";
  
  readonly id: string;
  
  readonly obj?: TaxCategory
}

export interface TaxCategoryResourceIdentifier {
  readonly typeId: "tax-category";
  
  readonly id?: string;
  
  readonly key?: string
}

export interface TaxCategoryUpdate {
  
  readonly version: number;
  
  readonly actions: TaxCategoryUpdateAction[]
}

export type TaxCategoryUpdateAction =
  TaxCategoryAddTaxRateAction |
  TaxCategoryChangeNameAction |
  TaxCategoryRemoveTaxRateAction |
  TaxCategoryReplaceTaxRateAction |
  TaxCategorySetDescriptionAction |
  TaxCategorySetKeyAction
;

export interface TaxRate {
  
  readonly id?: string;
  
  readonly name: string;
  
  readonly amount: number;
  
  readonly includedInPrice: boolean;
  /**
  	<p>A two-digit country code as per <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 alpha-2</a>.</p>
  */
  readonly country: string;
  
  readonly state?: string;
  
  readonly subRates?: SubRate[]
}

export interface TaxRateDraft {
  
  readonly name: string;
  
  readonly amount?: number;
  
  readonly includedInPrice: boolean;
  /**
  	<p>A two-digit country code as per <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 alpha-2</a>.</p>
  */
  readonly country: string;
  
  readonly state?: string;
  
  readonly subRates?: SubRate[]
}

export interface TaxCategoryAddTaxRateAction {
  readonly action: "addTaxRate";
  
  readonly taxRate: TaxRateDraft
}

export interface TaxCategoryChangeNameAction {
  readonly action: "changeName";
  
  readonly name: string
}

export interface TaxCategoryRemoveTaxRateAction {
  readonly action: "removeTaxRate";
  
  readonly taxRateId: string
}

export interface TaxCategoryReplaceTaxRateAction {
  readonly action: "replaceTaxRate";
  
  readonly taxRate: TaxRateDraft;
  
  readonly taxRateId: string
}

export interface TaxCategorySetDescriptionAction {
  readonly action: "setDescription";
  
  readonly description?: string
}

export interface TaxCategorySetKeyAction {
  readonly action: "setKey";
  
  readonly key?: string
}