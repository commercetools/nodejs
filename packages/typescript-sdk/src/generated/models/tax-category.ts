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

import { BaseResource, CreatedBy, LastModifiedBy } from 'models/common'

export interface SubRate {
  readonly name: string
  readonly amount: number
}
export interface TaxCategory extends BaseResource {
  /**
   *	The unique ID of the category.
   */
  readonly id: string
  /**
   *	The current version of the category.
   */
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
  readonly name: string
  readonly description?: string
  /**
   *	The tax rates have unique IDs in the rates list
   */
  readonly rates: TaxRate[]
  /**
   *	User-specific unique identifier for the category.
   */
  readonly key?: string
}
export interface TaxCategoryDraft {
  readonly name: string
  readonly description?: string
  readonly rates: TaxRateDraft[]
  readonly key?: string
}
export interface TaxCategoryPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: TaxCategory[]
}
export interface TaxCategoryReference {
  readonly typeId: 'tax-category'
  readonly id: string
  readonly obj?: TaxCategory
}
export interface TaxCategoryResourceIdentifier {
  readonly typeId: 'tax-category'
  readonly id?: string
  readonly key?: string
}
export interface TaxCategoryUpdate {
  readonly version: number
  readonly actions: TaxCategoryUpdateAction[]
}
export type TaxCategoryUpdateAction =
  | TaxCategoryAddTaxRateAction
  | TaxCategoryChangeNameAction
  | TaxCategoryRemoveTaxRateAction
  | TaxCategoryReplaceTaxRateAction
  | TaxCategorySetDescriptionAction
  | TaxCategorySetKeyAction
export interface TaxRate {
  /**
   *	The ID is always set if the tax rate is part of a TaxCategory.
   *	The external tax rates in a
   *	Cart do not contain an `id`.
   */
  readonly id?: string
  readonly name: string
  /**
   *	Percentage in the range of [0..1].
   *	The sum of the amounts of all `subRates`, if there are any.
   */
  readonly amount: number
  readonly includedInPrice: boolean
  /**
   *	A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   */
  readonly country: string
  /**
   *	The state in the country
   */
  readonly state?: string
  /**
   *	For countries (e.g.
   *	the US) where the total tax is a combination of multiple taxes (e.g.
   *	state and local taxes).
   */
  readonly subRates?: SubRate[]
}
export interface TaxRateDraft {
  readonly name: string
  /**
   *	Percentage in the range of [0..1].
   *	Must be supplied if no `subRates` are specified.
   *	If `subRates` are specified
   *	then the `amount` can be omitted or it must be the sum of the amounts of all `subRates`.
   */
  readonly amount?: number
  readonly includedInPrice: boolean
  /**
   *	A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   */
  readonly country: string
  /**
   *	The state in the country
   */
  readonly state?: string
  /**
   *	For countries (e.g.
   *	the US) where the total tax is a combination of multiple taxes (e.g.
   *	state and local taxes).
   */
  readonly subRates?: SubRate[]
}
export interface TaxCategoryAddTaxRateAction {
  readonly action: 'addTaxRate'
  readonly taxRate: TaxRateDraft
}
export interface TaxCategoryChangeNameAction {
  readonly action: 'changeName'
  readonly name: string
}
export interface TaxCategoryRemoveTaxRateAction {
  readonly action: 'removeTaxRate'
  readonly taxRateId: string
}
export interface TaxCategoryReplaceTaxRateAction {
  readonly action: 'replaceTaxRate'
  readonly taxRateId: string
  readonly taxRate: TaxRateDraft
}
export interface TaxCategorySetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: string
}
export interface TaxCategorySetKeyAction {
  readonly action: 'setKey'
  /**
   *	If `key` is absent or `null`, it is removed if it exists.
   */
  readonly key?: string
}
