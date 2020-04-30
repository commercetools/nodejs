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

import { ProductPublishScope } from 'models/cart'
import { CategoryReference, CategoryResourceIdentifier } from 'models/category'
import {
  Asset,
  AssetDraft,
  AssetSource,
  BaseResource,
  CreatedBy,
  DiscountedPrice,
  Image,
  LastModifiedBy,
  LocalizedString,
  Price,
  PriceDraft,
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
  ScopedPrice,
} from 'models/common'
import {
  ProductTypeReference,
  ProductTypeResourceIdentifier,
} from 'models/product-type'
import { ReviewRatingStatistics } from 'models/review'
import { StateReference, StateResourceIdentifier } from 'models/state'
import {
  TaxCategoryReference,
  TaxCategoryResourceIdentifier,
} from 'models/tax-category'
import { FieldContainer, TypeResourceIdentifier } from 'models/type'

export interface Attribute {
  readonly name: string
  /**
   *	A valid JSON value, based on an AttributeDefinition.
   */
  readonly value: any
}
export interface CategoryOrderHints {
  [key: string]: string
}
export type FacetResult =
  | FilteredFacetResult
  | RangeFacetResult
  | TermFacetResult
export interface FacetResultRange {
  readonly from: number
  readonly fromStr: string
  readonly to: number
  readonly toStr: string
  readonly count: number
  readonly productCount?: number
  readonly total: number
  readonly min: number
  readonly max: number
  readonly mean: number
}
export interface FacetResultTerm {
  readonly term: any
  readonly count: number
  readonly productCount?: number
}
export interface FacetResults {
  [key: string]:
    | FacetResult
    | FilteredFacetResult
    | RangeFacetResult
    | TermFacetResult
}
export type FacetTypes = 'terms' | 'range' | 'filter'
export interface FilteredFacetResult {
  readonly type: 'filter'
  readonly count: number
  readonly productCount?: number
}
export interface Product extends BaseResource {
  /**
   *	The unique ID of the product.
   */
  readonly id: string
  /**
   *	The current version of the product.
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
  /**
   *	User-specific unique identifier for the product.
   *	*Product keys are different from product variant keys.*
   */
  readonly key?: string
  readonly productType: ProductTypeReference
  /**
   *	The product data in the master catalog.
   */
  readonly masterData: ProductCatalogData
  readonly taxCategory?: TaxCategoryReference
  readonly state?: StateReference
  /**
   *	Statistics about the review ratings taken into account for this product.
   */
  readonly reviewRatingStatistics?: ReviewRatingStatistics
}
export interface ProductCatalogData {
  readonly published: boolean
  readonly current: ProductData
  readonly staged: ProductData
  readonly hasStagedChanges: boolean
}
export interface ProductData {
  readonly name: LocalizedString
  readonly categories: CategoryReference[]
  readonly categoryOrderHints?: CategoryOrderHints
  readonly description?: LocalizedString
  readonly slug: LocalizedString
  readonly metaTitle?: LocalizedString
  readonly metaDescription?: LocalizedString
  readonly metaKeywords?: LocalizedString
  readonly masterVariant: ProductVariant
  readonly variants: ProductVariant[]
  readonly searchKeywords: SearchKeywords
}
export interface ProductDraft {
  /**
   *	A predefined product type assigned to the product.
   *	All products must have a product type.
   */
  readonly productType: ProductTypeResourceIdentifier
  readonly name: LocalizedString
  /**
   *	Human-readable identifiers usually used as deep-link URLs for the product.
   *	A slug must be unique across a project, but a product can have the same slug for different languages.
   *	Slugs have a maximum size of 256.
   *	Valid characters are: alphabetic characters (`A-Z, a-z`), numeric characters (`0-9`), underscores (`_`) and hyphens (`-`).
   */
  readonly slug: LocalizedString
  /**
   *	User-specific unique identifier for the product.
   */
  readonly key?: string
  readonly description?: LocalizedString
  /**
   *	Categories assigned to the product.
   */
  readonly categories?: CategoryResourceIdentifier[]
  readonly categoryOrderHints?: CategoryOrderHints
  readonly metaTitle?: LocalizedString
  readonly metaDescription?: LocalizedString
  readonly metaKeywords?: LocalizedString
  /**
   *	The master product variant.
   *	Required if the `variants` array has product variants.
   */
  readonly masterVariant?: ProductVariantDraft
  /**
   *	An array of related product variants.
   */
  readonly variants?: ProductVariantDraft[]
  readonly taxCategory?: TaxCategoryResourceIdentifier
  readonly searchKeywords?: SearchKeywords
  readonly state?: StateResourceIdentifier
  /**
   *	If `true`, the product is published immediately.
   */
  readonly publish?: boolean
}
export interface ProductPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Product[]
}
export interface ProductProjection extends BaseResource {
  /**
   *	The unique ID of the Product.
   */
  readonly id: string
  /**
   *	The current version of the Product.
   */
  readonly version: number
  /**
   *	User-specific unique identifier of the Product.
   */
  readonly key?: string
  readonly productType: ProductTypeReference
  readonly name: LocalizedString
  readonly description?: LocalizedString
  readonly slug: LocalizedString
  /**
   *	References to categories the product is in.
   */
  readonly categories: CategoryReference[]
  readonly categoryOrderHints?: CategoryOrderHints
  readonly metaTitle?: LocalizedString
  readonly metaDescription?: LocalizedString
  readonly metaKeywords?: LocalizedString
  readonly searchKeywords?: SearchKeywords
  readonly hasStagedChanges?: boolean
  readonly published?: boolean
  readonly masterVariant: ProductVariant
  readonly variants: ProductVariant[]
  readonly taxCategory?: TaxCategoryReference
  readonly state?: StateReference
  /**
   *	Statistics about the review ratings taken into account for this product.
   */
  readonly reviewRatingStatistics?: ReviewRatingStatistics
}
export interface ProductProjectionPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: ProductProjection[]
}
export interface ProductProjectionPagedSearchResponse {
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: ProductProjection[]
  readonly facets: FacetResults
}
export interface ProductReference {
  readonly typeId: 'product'
  readonly id: string
  readonly obj?: Product
}
export interface ProductResourceIdentifier {
  readonly typeId: 'product'
  readonly id?: string
  readonly key?: string
}
export interface ProductUpdate {
  readonly version: number
  readonly actions: ProductUpdateAction[]
}
export type ProductUpdateAction =
  | ProductAddAssetAction
  | ProductAddExternalImageAction
  | ProductAddPriceAction
  | ProductAddToCategoryAction
  | ProductAddVariantAction
  | ProductChangeAssetNameAction
  | ProductChangeAssetOrderAction
  | ProductChangeMasterVariantAction
  | ProductChangeNameAction
  | ProductChangePriceAction
  | ProductChangeSlugAction
  | ProductLegacySetSkuAction
  | ProductMoveImageToPositionAction
  | ProductPublishAction
  | ProductRemoveAssetAction
  | ProductRemoveFromCategoryAction
  | ProductRemoveImageAction
  | ProductRemovePriceAction
  | ProductRemoveVariantAction
  | ProductRevertStagedChangesAction
  | ProductRevertStagedVariantChangesAction
  | ProductSetAssetCustomFieldAction
  | ProductSetAssetCustomTypeAction
  | ProductSetAssetDescriptionAction
  | ProductSetAssetKeyAction
  | ProductSetAssetSourcesAction
  | ProductSetAssetTagsAction
  | ProductSetAttributeAction
  | ProductSetAttributeInAllVariantsAction
  | ProductSetCategoryOrderHintAction
  | ProductSetDescriptionAction
  | ProductSetDiscountedPriceAction
  | ProductSetImageLabelAction
  | ProductSetKeyAction
  | ProductSetMetaDescriptionAction
  | ProductSetMetaKeywordsAction
  | ProductSetMetaTitleAction
  | ProductSetPricesAction
  | ProductSetProductPriceCustomFieldAction
  | ProductSetProductPriceCustomTypeAction
  | ProductSetProductVariantKeyAction
  | ProductSetSearchKeywordsAction
  | ProductSetSkuAction
  | ProductSetTaxCategoryAction
  | ProductTransitionStateAction
  | ProductUnpublishAction
export interface ProductVariant {
  readonly id: number
  readonly sku?: string
  readonly key?: string
  readonly prices?: Price[]
  readonly attributes?: Attribute[]
  readonly price?: Price
  readonly images?: Image[]
  readonly assets?: Asset[]
  readonly availability?: ProductVariantAvailability
  readonly isMatchingVariant?: boolean
  readonly scopedPrice?: ScopedPrice
  readonly scopedPriceDiscounted?: boolean
}
export interface ProductVariantAvailability {
  readonly isOnStock?: boolean
  readonly restockableInDays?: number
  readonly availableQuantity?: number
  readonly channels?: ProductVariantChannelAvailabilityMap
}
export interface ProductVariantChannelAvailability {
  readonly isOnStock?: boolean
  readonly restockableInDays?: number
  readonly availableQuantity?: number
}
export interface ProductVariantChannelAvailabilityMap {
  [key: string]: ProductVariantChannelAvailability
}
export interface ProductVariantDraft {
  readonly sku?: string
  readonly key?: string
  readonly prices?: PriceDraft[]
  readonly attributes?: Attribute[]
  readonly images?: Image[]
  readonly assets?: AssetDraft[]
}
export interface RangeFacetResult {
  readonly type: 'range'
  readonly ranges: FacetResultRange[]
}
export interface SearchKeyword {
  readonly text: string
  readonly suggestTokenizer?:
    | SuggestTokenizer
    | WhitespaceTokenizer
    | CustomTokenizer
}
export interface SearchKeywords {
  [key: string]: SearchKeyword[]
}
export type SuggestTokenizer = WhitespaceTokenizer | CustomTokenizer
export interface CustomTokenizer {
  readonly type: 'custom'
  readonly inputs: string[]
}
export interface Suggestion {
  /**
   *	The suggested text.
   */
  readonly text: string
}
export interface SuggestionResult {
  [key: string]: Suggestion[]
}
export interface TermFacetResult {
  readonly type: 'terms'
  readonly dataType: TermFacetResultType
  readonly missing: number
  readonly total: number
  readonly other: number
  readonly terms: FacetResultTerm[]
}
export type TermFacetResultType =
  | 'text'
  | 'date'
  | 'time'
  | 'datetime'
  | 'boolean'
  | 'number'
export interface WhitespaceTokenizer {
  readonly type: 'whitespace'
}
export interface ProductAddAssetAction {
  readonly action: 'addAsset'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly asset: AssetDraft
  /**
   *	Position of the new asset inside the existing list (from `0` to the size of the list)
   */
  readonly position?: number
}
export interface ProductAddExternalImageAction {
  readonly action: 'addExternalImage'
  readonly variantId?: number
  readonly sku?: string
  readonly image: Image
  readonly staged?: boolean
}
export interface ProductAddPriceAction {
  readonly action: 'addPrice'
  readonly variantId?: number
  readonly sku?: string
  readonly price: PriceDraft
  readonly staged?: boolean
}
export interface ProductAddToCategoryAction {
  readonly action: 'addToCategory'
  readonly category: CategoryResourceIdentifier
  readonly orderHint?: string
  readonly staged?: boolean
}
export interface ProductAddVariantAction {
  readonly action: 'addVariant'
  readonly sku?: string
  readonly key?: string
  readonly prices?: PriceDraft[]
  readonly images?: Image[]
  readonly attributes?: Attribute[]
  readonly staged?: boolean
  readonly assets?: Asset[]
}
export interface ProductChangeAssetNameAction {
  readonly action: 'changeAssetName'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetId?: string
  readonly assetKey?: string
  readonly name: LocalizedString
}
export interface ProductChangeAssetOrderAction {
  readonly action: 'changeAssetOrder'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetOrder: string[]
}
export interface ProductChangeMasterVariantAction {
  readonly action: 'changeMasterVariant'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
}
export interface ProductChangeNameAction {
  readonly action: 'changeName'
  readonly name: LocalizedString
  readonly staged?: boolean
}
export interface ProductChangePriceAction {
  readonly action: 'changePrice'
  /**
   *	ID of the [Price](#price)
   */
  readonly priceId: string
  readonly price: PriceDraft
  readonly staged?: boolean
}
export interface ProductChangeSlugAction {
  readonly action: 'changeSlug'
  /**
   *	Every slug must be unique across a project, but a product can have the same slug for different languages.
   *	Allowed are alphabetic, numeric, underscore (`_`) and hyphen (`-`) characters.
   *	Maximum size is `256`.
   */
  readonly slug: LocalizedString
  readonly staged?: boolean
}
export interface ProductLegacySetSkuAction {
  readonly action: 'legacySetSku'
  readonly sku?: string
  readonly variantId: number
}
export interface ProductMoveImageToPositionAction {
  readonly action: 'moveImageToPosition'
  readonly variantId?: number
  readonly sku?: string
  /**
   *	The URL of the image
   */
  readonly imageUrl: string
  readonly position: number
  readonly staged?: boolean
}
export interface ProductPublishAction {
  readonly action: 'publish'
  readonly scope?: ProductPublishScope
}
export interface ProductRemoveAssetAction {
  readonly action: 'removeAsset'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetId?: string
  readonly assetKey?: string
}
export interface ProductRemoveFromCategoryAction {
  readonly action: 'removeFromCategory'
  readonly category: CategoryResourceIdentifier
  readonly staged?: boolean
}
export interface ProductRemoveImageAction {
  readonly action: 'removeImage'
  readonly variantId?: number
  readonly sku?: string
  /**
   *	The URL of the image.
   */
  readonly imageUrl: string
  readonly staged?: boolean
}
export interface ProductRemovePriceAction {
  readonly action: 'removePrice'
  /**
   *	ID of the [Price](#price)
   */
  readonly priceId: string
  readonly staged?: boolean
}
export interface ProductRemoveVariantAction {
  readonly action: 'removeVariant'
  readonly id?: number
  readonly sku?: string
  readonly staged?: boolean
}
export interface ProductRevertStagedChangesAction {
  readonly action: 'revertStagedChanges'
}
export interface ProductRevertStagedVariantChangesAction {
  readonly action: 'revertStagedVariantChanges'
  readonly variantId: number
}
export interface ProductSetAssetCustomFieldAction {
  readonly action: 'setAssetCustomField'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetId?: string
  readonly assetKey?: string
  readonly name: string
  readonly value?: any
}
export interface ProductSetAssetCustomTypeAction {
  readonly action: 'setAssetCustomType'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetId?: string
  readonly assetKey?: string
  /**
   *	If set, the custom type is set to this new value.
   *	If absent, the custom type and any existing custom fields are removed.
   */
  readonly type?: TypeResourceIdentifier
  /**
   *	If set, the custom fields are set to this new value.
   */
  readonly fields?: any
}
export interface ProductSetAssetDescriptionAction {
  readonly action: 'setAssetDescription'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetId?: string
  readonly assetKey?: string
  readonly description?: LocalizedString
}
export interface ProductSetAssetKeyAction {
  readonly action: 'setAssetKey'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetId: string
  /**
   *	User-defined identifier for the asset.
   *	If left blank or set to `null`, the asset key is unset/removed.
   */
  readonly assetKey?: string
}
export interface ProductSetAssetSourcesAction {
  readonly action: 'setAssetSources'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetId?: string
  readonly assetKey?: string
  readonly sources: AssetSource[]
}
export interface ProductSetAssetTagsAction {
  readonly action: 'setAssetTags'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetId?: string
  readonly assetKey?: string
  readonly tags?: string[]
}
export interface ProductSetAttributeAction {
  readonly action: 'setAttribute'
  readonly variantId?: number
  readonly sku?: string
  readonly name: string
  /**
   *	If the attribute exists and the value is omitted or set to `null`, the attribute is removed.
   *	If the attribute exists and a value is provided, the new value is applied.
   *	If the attribute does not exist and a value is provided, it is added as a new attribute.
   */
  readonly value?: any
  readonly staged?: boolean
}
export interface ProductSetAttributeInAllVariantsAction {
  readonly action: 'setAttributeInAllVariants'
  readonly name: string
  /**
   *	The same update behavior as for Set Attribute applies.
   */
  readonly value?: any
  readonly staged?: boolean
}
export interface ProductSetCategoryOrderHintAction {
  readonly action: 'setCategoryOrderHint'
  readonly categoryId: string
  readonly orderHint?: string
  readonly staged?: boolean
}
export interface ProductSetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: LocalizedString
  readonly staged?: boolean
}
export interface ProductSetDiscountedPriceAction {
  readonly action: 'setDiscountedPrice'
  readonly priceId: string
  readonly staged?: boolean
  readonly discounted?: DiscountedPrice
}
export interface ProductSetImageLabelAction {
  readonly action: 'setImageLabel'
  readonly sku?: string
  readonly variantId?: number
  /**
   *	The URL of the image.
   */
  readonly imageUrl: string
  /**
   *	The new image label.
   *	If left blank or set to null, the label is removed.
   */
  readonly label?: string
  readonly staged?: boolean
}
export interface ProductSetKeyAction {
  readonly action: 'setKey'
  /**
   *	User-specific unique identifier for the product.
   *	If left blank or set to `null`, the product key is unset/removed.
   */
  readonly key?: string
}
export interface ProductSetMetaDescriptionAction {
  readonly action: 'setMetaDescription'
  readonly metaDescription?: LocalizedString
  readonly staged?: boolean
}
export interface ProductSetMetaKeywordsAction {
  readonly action: 'setMetaKeywords'
  readonly metaKeywords?: LocalizedString
  readonly staged?: boolean
}
export interface ProductSetMetaTitleAction {
  readonly action: 'setMetaTitle'
  readonly metaTitle?: LocalizedString
  readonly staged?: boolean
}
export interface ProductSetPricesAction {
  readonly action: 'setPrices'
  readonly variantId?: number
  readonly sku?: string
  readonly prices: PriceDraft[]
  readonly staged?: boolean
}
export interface ProductSetProductPriceCustomFieldAction {
  readonly action: 'setProductPriceCustomField'
  readonly priceId: string
  readonly staged?: boolean
  readonly name: string
  readonly value?: any
}
export interface ProductSetProductPriceCustomTypeAction {
  readonly action: 'setProductPriceCustomType'
  readonly priceId: string
  readonly staged?: boolean
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface ProductSetProductVariantKeyAction {
  readonly action: 'setProductVariantKey'
  readonly variantId?: number
  readonly sku?: string
  /**
   *	If left blank or set to `null`, the key is unset/removed.
   */
  readonly key?: string
  readonly staged?: boolean
}
export interface ProductSetSearchKeywordsAction {
  readonly action: 'setSearchKeywords'
  readonly searchKeywords: SearchKeywords
  readonly staged?: boolean
}
export interface ProductSetSkuAction {
  readonly action: 'setSku'
  readonly variantId: number
  /**
   *	SKU must be unique.
   *	If left blank or set to `null`, the sku is unset/removed.
   */
  readonly sku?: string
  readonly staged?: boolean
}
export interface ProductSetTaxCategoryAction {
  readonly action: 'setTaxCategory'
  /**
   *	If left blank or set to `null`, the tax category is unset/removed.
   */
  readonly taxCategory?: TaxCategoryResourceIdentifier
}
export interface ProductTransitionStateAction {
  readonly action: 'transitionState'
  readonly state?: StateResourceIdentifier
  readonly force?: boolean
}
export interface ProductUnpublishAction {
  readonly action: 'unpublish'
}
