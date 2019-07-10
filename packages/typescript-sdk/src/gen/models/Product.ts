/* tslint:disable */
//Generated file, please do not change

import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { StateReference } from './State'
import { ReviewRatingStatistics } from './Review'
import { ProductTypeReference } from './ProductType'
import { TaxCategoryReference } from './TaxCategory'
import { LoggedResource } from './Common'
import { LocalizedString } from './Common'
import { CategoryReference } from './Category'
import { TaxCategoryResourceIdentifier } from './TaxCategory'
import { StateResourceIdentifier } from './State'
import { CategoryResourceIdentifier } from './Category'
import { ProductTypeResourceIdentifier } from './ProductType'
import { BaseResource } from './Common'
import { ReferenceTypeId } from './Common'
import { Reference } from './Common'
import { ResourceIdentifier } from './Common'
import { ScopedPrice } from './Common'
import { Image } from './Common'
import { Asset } from './Common'
import { Price } from './Common'
import { AssetDraft } from './Common'
import { PriceDraft } from './Common'
import { ProductPublishScope } from './Cart'
import { TypeResourceIdentifier } from './Type'
import { AssetSource } from './Common'
import { DiscountedPrice } from './Common'
import { FieldContainer } from './Type'


export interface Attribute {
  
  readonly name: string;
  
  readonly value: object
}

export interface CategoryOrderHints {
  [key:string]: string
}

export type FacetResult =
  FilteredFacetResult |
  RangeFacetResult |
  TermFacetResult
;

export interface FacetResultRange {
  
  readonly from: number;
  
  readonly fromStr: string;
  
  readonly to: number;
  
  readonly toStr: string;
  
  readonly count: number;
  
  readonly productCount?: number;
  
  readonly total: number;
  
  readonly min: number;
  
  readonly max: number;
  
  readonly mean: number
}

export interface FacetResultTerm {
  
  readonly term: object;
  
  readonly count: number;
  
  readonly productCount?: number
}

export interface FacetResults {
  [key:string]: FacetResult | FilteredFacetResult | RangeFacetResult | TermFacetResult
}

export type FacetTypes =
   'terms' |
   'range' |
   'filter';

export interface FilteredFacetResult {
  readonly type: "filter";
  
  readonly count: number;
  
  readonly productCount?: number
}

export interface Product extends LoggedResource {
  
  readonly key?: string;
  
  readonly productType: ProductTypeReference;
  
  readonly masterData: ProductCatalogData;
  
  readonly taxCategory?: TaxCategoryReference;
  
  readonly state?: StateReference;
  
  readonly reviewRatingStatistics?: ReviewRatingStatistics
}

export interface ProductCatalogData {
  
  readonly published: boolean;
  
  readonly current: ProductData;
  
  readonly staged: ProductData;
  
  readonly hasStagedChanges: boolean
}

export interface ProductData {
  
  readonly name: LocalizedString;
  
  readonly categories: CategoryReference[];
  
  readonly categoryOrderHints?: CategoryOrderHints;
  
  readonly description?: LocalizedString;
  
  readonly slug: LocalizedString;
  
  readonly metaTitle?: LocalizedString;
  
  readonly metaDescription?: LocalizedString;
  
  readonly metaKeywords?: LocalizedString;
  
  readonly masterVariant: ProductVariant;
  
  readonly variants: ProductVariant[];
  
  readonly searchKeywords: SearchKeywords
}

export interface ProductDraft {
  
  readonly productType: ProductTypeResourceIdentifier;
  
  readonly name: LocalizedString;
  
  readonly slug: LocalizedString;
  
  readonly key?: string;
  
  readonly description?: LocalizedString;
  
  readonly categories?: CategoryResourceIdentifier[];
  
  readonly categoryOrderHints?: CategoryOrderHints;
  
  readonly metaTitle?: LocalizedString;
  
  readonly metaDescription?: LocalizedString;
  
  readonly metaKeywords?: LocalizedString;
  
  readonly masterVariant?: ProductVariantDraft;
  
  readonly variants?: ProductVariantDraft[];
  
  readonly taxCategory?: TaxCategoryResourceIdentifier;
  
  readonly searchKeywords?: SearchKeywords;
  
  readonly state?: StateResourceIdentifier;
  
  readonly publish?: boolean
}

export interface ProductPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: Product[]
}

export interface ProductProjection extends BaseResource {
  
  readonly key?: string;
  
  readonly productType: ProductTypeReference;
  
  readonly name: LocalizedString;
  
  readonly description?: LocalizedString;
  
  readonly slug: LocalizedString;
  
  readonly categories: CategoryReference[];
  
  readonly categoryOrderHints?: CategoryOrderHints;
  
  readonly metaTitle?: LocalizedString;
  
  readonly metaDescription?: LocalizedString;
  
  readonly metaKeywords?: LocalizedString;
  
  readonly searchKeywords?: SearchKeywords;
  
  readonly hasStagedChanges?: boolean;
  
  readonly published?: boolean;
  
  readonly masterVariant: ProductVariant;
  
  readonly variants: ProductVariant[];
  
  readonly taxCategory?: TaxCategoryReference;
  
  readonly state?: StateReference;
  
  readonly reviewRatingStatistics?: ReviewRatingStatistics
}

export interface ProductProjectionPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: ProductProjection[]
}

export interface ProductProjectionPagedSearchResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: ProductProjection[];
  
  readonly facets: FacetResults
}

export interface ProductReference {
  readonly typeId: "product";
  
  readonly id: string;
  
  readonly obj?: Product
}

export interface ProductResourceIdentifier {
  readonly typeId: "product";
  
  readonly id?: string;
  
  readonly key?: string
}

export interface ProductUpdate {
  
  readonly version: number;
  
  readonly actions: ProductUpdateAction[]
}

export type ProductUpdateAction =
  ProductAddAssetAction |
  ProductAddExternalImageAction |
  ProductAddPriceAction |
  ProductAddToCategoryAction |
  ProductAddVariantAction |
  ProductChangeAssetNameAction |
  ProductChangeAssetOrderAction |
  ProductChangeMasterVariantAction |
  ProductChangeNameAction |
  ProductChangePriceAction |
  ProductChangeSlugAction |
  ProductLegacySetSkuAction |
  ProductMoveImageToPositionAction |
  ProductPublishAction |
  ProductRemoveAssetAction |
  ProductRemoveFromCategoryAction |
  ProductRemoveImageAction |
  ProductRemovePriceAction |
  ProductRemoveVariantAction |
  ProductRevertStagedChangesAction |
  ProductRevertStagedVariantChangesAction |
  ProductSetAssetCustomFieldAction |
  ProductSetAssetCustomTypeAction |
  ProductSetAssetDescriptionAction |
  ProductSetAssetKeyAction |
  ProductSetAssetSourcesAction |
  ProductSetAssetTagsAction |
  ProductSetAttributeAction |
  ProductSetAttributeInAllVariantsAction |
  ProductSetCategoryOrderHintAction |
  ProductSetDescriptionAction |
  ProductSetDiscountedPriceAction |
  ProductSetImageLabelAction |
  ProductSetKeyAction |
  ProductSetMetaDescriptionAction |
  ProductSetMetaKeywordsAction |
  ProductSetMetaTitleAction |
  ProductSetPricesAction |
  ProductSetProductPriceCustomFieldAction |
  ProductSetProductPriceCustomTypeAction |
  ProductSetProductVariantKeyAction |
  ProductSetSearchKeywordsAction |
  ProductSetSkuAction |
  ProductSetTaxCategoryAction |
  ProductTransitionStateAction |
  ProductUnpublishAction
;

export interface ProductVariant {
  
  readonly id: number;
  
  readonly sku?: string;
  
  readonly key?: string;
  
  readonly prices?: Price[];
  
  readonly attributes?: Attribute[];
  
  readonly price?: Price;
  
  readonly images?: Image[];
  
  readonly assets?: Asset[];
  
  readonly availability?: ProductVariantAvailability;
  
  readonly isMatchingVariant?: boolean;
  
  readonly scopedPrice?: ScopedPrice;
  
  readonly scopedPriceDiscounted?: boolean
}

export interface ProductVariantAvailability {
  
  readonly isOnStock?: boolean;
  
  readonly restockableInDays?: number;
  
  readonly availableQuantity?: number;
  
  readonly channels?: ProductVariantChannelAvailabilityMap
}

export interface ProductVariantChannelAvailability {
  
  readonly isOnStock?: boolean;
  
  readonly restockableInDays?: number;
  
  readonly availableQuantity?: number
}

export interface ProductVariantChannelAvailabilityMap {
  [key:string]: ProductVariantChannelAvailability
}

export interface ProductVariantDraft {
  
  readonly sku?: string;
  
  readonly key?: string;
  
  readonly prices?: PriceDraft[];
  
  readonly attributes?: Attribute[];
  
  readonly images?: Image[];
  
  readonly assets?: AssetDraft[]
}

export interface RangeFacetResult {
  readonly type: "range";
  
  readonly ranges: FacetResultRange[]
}

export interface SearchKeyword {
  
  readonly text: string;
  
  readonly suggestTokenizer?: SuggestTokenizer | WhitespaceTokenizer | CustomTokenizer
}

export interface SearchKeywords {
  [key:string]: SearchKeyword[]
}

export type SuggestTokenizer =
  WhitespaceTokenizer |
  CustomTokenizer
;

export interface CustomTokenizer {
  readonly type: "custom";
  
  readonly inputs: string[]
}

export interface Suggestion {
  
  readonly text: string
}

export interface SuggestionResult {
  [key:string]: Suggestion[]
}

export interface TermFacetResult {
  readonly type: "terms";
  
  readonly other: number;
  
  readonly total: number;
  
  readonly terms: FacetResultTerm[];
  
  readonly dataType: TermFacetResultType;
  
  readonly missing: number
}

export type TermFacetResultType =
   'text' |
   'date' |
   'time' |
   'datetime' |
   'boolean' |
   'number';

export interface WhitespaceTokenizer {
  readonly type: "whitespace";
}

export interface ProductAddAssetAction {
  readonly action: "addAsset";
  
  readonly position?: number;
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly asset: AssetDraft;
  
  readonly sku?: string
}

export interface ProductAddExternalImageAction {
  readonly action: "addExternalImage";
  
  readonly image: Image;
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly sku?: string
}

export interface ProductAddPriceAction {
  readonly action: "addPrice";
  
  readonly price: PriceDraft;
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly sku?: string
}

export interface ProductAddToCategoryAction {
  readonly action: "addToCategory";
  
  readonly orderHint?: string;
  
  readonly staged?: boolean;
  
  readonly category: CategoryResourceIdentifier
}

export interface ProductAddVariantAction {
  readonly action: "addVariant";
  
  readonly images?: Image[];
  
  readonly assets?: Asset[];
  
  readonly attributes?: Attribute[];
  
  readonly staged?: boolean;
  
  readonly prices?: PriceDraft[];
  
  readonly sku?: string;
  
  readonly key?: string
}

export interface ProductChangeAssetNameAction {
  readonly action: "changeAssetName";
  
  readonly assetId?: string;
  
  readonly name: LocalizedString;
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly sku?: string;
  
  readonly assetKey?: string
}

export interface ProductChangeAssetOrderAction {
  readonly action: "changeAssetOrder";
  
  readonly assetOrder: string[];
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly sku?: string
}

export interface ProductChangeMasterVariantAction {
  readonly action: "changeMasterVariant";
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly sku?: string
}

export interface ProductChangeNameAction {
  readonly action: "changeName";
  
  readonly name: LocalizedString;
  
  readonly staged?: boolean
}

export interface ProductChangePriceAction {
  readonly action: "changePrice";
  
  readonly price: PriceDraft;
  
  readonly staged?: boolean;
  
  readonly priceId: string
}

export interface ProductChangeSlugAction {
  readonly action: "changeSlug";
  
  readonly staged?: boolean;
  
  readonly slug: LocalizedString
}

export interface ProductLegacySetSkuAction {
  readonly action: "legacySetSku";
  
  readonly variantId: number;
  
  readonly sku?: string
}

export interface ProductMoveImageToPositionAction {
  readonly action: "moveImageToPosition";
  
  readonly imageUrl: string;
  
  readonly staged?: boolean;
  
  readonly position: number;
  
  readonly variantId?: number;
  
  readonly sku?: string
}

export interface ProductPublishAction {
  readonly action: "publish";
  
  readonly scope?: ProductPublishScope
}

export interface ProductRemoveAssetAction {
  readonly action: "removeAsset";
  
  readonly assetId?: string;
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly sku?: string;
  
  readonly assetKey?: string
}

export interface ProductRemoveFromCategoryAction {
  readonly action: "removeFromCategory";
  
  readonly staged?: boolean;
  
  readonly category: CategoryResourceIdentifier
}

export interface ProductRemoveImageAction {
  readonly action: "removeImage";
  
  readonly imageUrl: string;
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly sku?: string
}

export interface ProductRemovePriceAction {
  readonly action: "removePrice";
  
  readonly staged?: boolean;
  
  readonly priceId: string
}

export interface ProductRemoveVariantAction {
  readonly action: "removeVariant";
  
  readonly staged?: boolean;
  
  readonly id?: number;
  
  readonly sku?: string
}

export interface ProductRevertStagedChangesAction {
  readonly action: "revertStagedChanges";
}

export interface ProductRevertStagedVariantChangesAction {
  readonly action: "revertStagedVariantChanges";
  
  readonly variantId: number
}

export interface ProductSetAssetCustomFieldAction {
  readonly action: "setAssetCustomField";
  
  readonly assetId?: string;
  
  readonly name: string;
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly sku?: string;
  
  readonly value?: object;
  
  readonly assetKey?: string
}

export interface ProductSetAssetCustomTypeAction {
  readonly action: "setAssetCustomType";
  
  readonly assetId?: string;
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly fields?: object;
  
  readonly type?: TypeResourceIdentifier;
  
  readonly sku?: string;
  
  readonly assetKey?: string
}

export interface ProductSetAssetDescriptionAction {
  readonly action: "setAssetDescription";
  
  readonly assetId?: string;
  
  readonly description?: LocalizedString;
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly sku?: string;
  
  readonly assetKey?: string
}

export interface ProductSetAssetKeyAction {
  readonly action: "setAssetKey";
  
  readonly assetId: string;
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly sku?: string;
  
  readonly assetKey?: string
}

export interface ProductSetAssetSourcesAction {
  readonly action: "setAssetSources";
  
  readonly sources: AssetSource[];
  
  readonly assetId?: string;
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly sku?: string;
  
  readonly assetKey?: string
}

export interface ProductSetAssetTagsAction {
  readonly action: "setAssetTags";
  
  readonly assetId?: string;
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly sku?: string;
  
  readonly assetKey?: string;
  
  readonly tags?: string[]
}

export interface ProductSetAttributeAction {
  readonly action: "setAttribute";
  
  readonly name: string;
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly sku?: string;
  
  readonly value?: object
}

export interface ProductSetAttributeInAllVariantsAction {
  readonly action: "setAttributeInAllVariants";
  
  readonly name: string;
  
  readonly staged?: boolean;
  
  readonly value?: object
}

export interface ProductSetCategoryOrderHintAction {
  readonly action: "setCategoryOrderHint";
  
  readonly orderHint?: string;
  
  readonly staged?: boolean;
  
  readonly categoryId: string
}

export interface ProductSetDescriptionAction {
  readonly action: "setDescription";
  
  readonly description?: LocalizedString;
  
  readonly staged?: boolean
}

export interface ProductSetDiscountedPriceAction {
  readonly action: "setDiscountedPrice";
  
  readonly discounted?: DiscountedPrice;
  
  readonly staged?: boolean;
  
  readonly priceId: string
}

export interface ProductSetImageLabelAction {
  readonly action: "setImageLabel";
  
  readonly imageUrl: string;
  
  readonly staged?: boolean;
  
  readonly label?: string;
  
  readonly variantId?: number;
  
  readonly sku?: string
}

export interface ProductSetKeyAction {
  readonly action: "setKey";
  
  readonly key?: string
}

export interface ProductSetMetaDescriptionAction {
  readonly action: "setMetaDescription";
  
  readonly staged?: boolean;
  
  readonly metaDescription?: LocalizedString
}

export interface ProductSetMetaKeywordsAction {
  readonly action: "setMetaKeywords";
  
  readonly metaKeywords?: LocalizedString;
  
  readonly staged?: boolean
}

export interface ProductSetMetaTitleAction {
  readonly action: "setMetaTitle";
  
  readonly metaTitle?: LocalizedString;
  
  readonly staged?: boolean
}

export interface ProductSetPricesAction {
  readonly action: "setPrices";
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly prices: PriceDraft[];
  
  readonly sku?: string
}

export interface ProductSetProductPriceCustomFieldAction {
  readonly action: "setProductPriceCustomField";
  
  readonly name: string;
  
  readonly staged?: boolean;
  
  readonly priceId: string;
  
  readonly value?: object
}

export interface ProductSetProductPriceCustomTypeAction {
  readonly action: "setProductPriceCustomType";
  
  readonly staged?: boolean;
  
  readonly fields?: FieldContainer;
  
  readonly type?: TypeResourceIdentifier;
  
  readonly priceId: string
}

export interface ProductSetProductVariantKeyAction {
  readonly action: "setProductVariantKey";
  
  readonly staged?: boolean;
  
  readonly variantId?: number;
  
  readonly sku?: string;
  
  readonly key?: string
}

export interface ProductSetSearchKeywordsAction {
  readonly action: "setSearchKeywords";
  
  readonly searchKeywords: SearchKeywords;
  
  readonly staged?: boolean
}

export interface ProductSetSkuAction {
  readonly action: "setSku";
  
  readonly staged?: boolean;
  
  readonly variantId: number;
  
  readonly sku?: string
}

export interface ProductSetTaxCategoryAction {
  readonly action: "setTaxCategory";
  
  readonly taxCategory?: TaxCategoryResourceIdentifier
}

export interface ProductTransitionStateAction {
  readonly action: "transitionState";
  
  readonly force?: boolean;
  
  readonly state?: StateResourceIdentifier
}

export interface ProductUnpublishAction {
  readonly action: "unpublish";
}