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
  Asset,
  AssetDraft,
  AssetSource,
  CreatedBy,
  LastModifiedBy,
  LocalizedString,
  LoggedResource,
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

export interface Category extends LoggedResource {
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
  readonly name: LocalizedString
  /**
   *	human-readable identifiers usually used as deep-link URL to the related category.
   *	Each slug is unique across a project, but a category can have the same slug for different languages.
   */
  readonly slug: LocalizedString
  readonly description?: LocalizedString
  /**
   *	Contains the parent path towards the root category.
   */
  readonly ancestors: CategoryReference[]
  /**
   *	A category that is the parent of this category in the category tree.
   */
  readonly parent?: CategoryReference
  /**
   *	An attribute as base for a custom category order in one level.
   */
  readonly orderHint: string
  readonly externalId?: string
  readonly metaTitle?: LocalizedString
  readonly metaDescription?: LocalizedString
  readonly metaKeywords?: LocalizedString
  readonly custom?: CustomFields
  /**
   *	Can be used to store images, icons or movies related to this category.
   */
  readonly assets?: Asset[]
  /**
   *	User-specific unique identifier for the category.
   */
  readonly key?: string
}
export interface CategoryDraft {
  readonly name: LocalizedString
  /**
   *	human-readable identifier usually used as deep-link URL to the related category.
   *	Allowed are alphabetic, numeric, underscore (`_`) and hyphen (`-`) characters.
   *	Maximum size is 256.
   *	**Must be unique across a project!** The same category can have the same slug for different languages.
   */
  readonly slug: LocalizedString
  readonly description?: LocalizedString
  /**
   *	A category that is the parent of this category in the category tree.
   *	The parent can be set by its ID or by its key.
   */
  readonly parent?: CategoryResourceIdentifier
  /**
   *	An attribute as base for a custom category order in one level.
   *	A random value will be assigned by API if not set.
   */
  readonly orderHint?: string
  readonly externalId?: string
  readonly metaTitle?: LocalizedString
  readonly metaDescription?: LocalizedString
  readonly metaKeywords?: LocalizedString
  /**
   *	The custom fields.
   */
  readonly custom?: CustomFieldsDraft
  readonly assets?: AssetDraft[]
  /**
   *	User-defined unique identifier for the category.
   *	Keys can only contain alphanumeric characters (`a-Z, 0-9`), underscores and hyphens (`-, _`) and be between 2 and 256 characters.
   */
  readonly key?: string
}
export interface CategoryPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Category[]
}
export interface CategoryReference {
  readonly typeId: 'category'
  readonly id: string
  readonly obj?: Category
}
export interface CategoryResourceIdentifier {
  readonly typeId: 'category'
  readonly id?: string
  readonly key?: string
}
export interface CategoryUpdate {
  readonly version: number
  readonly actions: CategoryUpdateAction[]
}
export type CategoryUpdateAction =
  | CategoryAddAssetAction
  | CategoryChangeAssetNameAction
  | CategoryChangeAssetOrderAction
  | CategoryChangeNameAction
  | CategoryChangeOrderHintAction
  | CategoryChangeParentAction
  | CategoryChangeSlugAction
  | CategoryRemoveAssetAction
  | CategorySetAssetCustomFieldAction
  | CategorySetAssetCustomTypeAction
  | CategorySetAssetDescriptionAction
  | CategorySetAssetKeyAction
  | CategorySetAssetSourcesAction
  | CategorySetAssetTagsAction
  | CategorySetCustomFieldAction
  | CategorySetCustomTypeAction
  | CategorySetDescriptionAction
  | CategorySetExternalIdAction
  | CategorySetKeyAction
  | CategorySetMetaDescriptionAction
  | CategorySetMetaKeywordsAction
  | CategorySetMetaTitleAction
export interface CategoryAddAssetAction {
  readonly action: 'addAsset'
  /**
   *	When specified, the value might be `0` and should be lower than the total of the assets list.
   */
  readonly position?: number
  readonly asset: AssetDraft
}
export interface CategoryChangeAssetNameAction {
  readonly action: 'changeAssetName'
  readonly assetId?: string
  readonly name: LocalizedString
  readonly assetKey?: string
}
export interface CategoryChangeAssetOrderAction {
  readonly action: 'changeAssetOrder'
  readonly assetOrder: string[]
}
export interface CategoryChangeNameAction {
  readonly action: 'changeName'
  readonly name: LocalizedString
}
export interface CategoryChangeOrderHintAction {
  readonly action: 'changeOrderHint'
  readonly orderHint: string
}
export interface CategoryChangeParentAction {
  readonly action: 'changeParent'
  readonly parent: CategoryResourceIdentifier
}
export interface CategoryChangeSlugAction {
  readonly action: 'changeSlug'
  /**
   *	Allowed are alphabetic, numeric, underscore (&#95;) and hyphen (&#45;) characters.
   *	Maximum size is {{ site.data.api-limits.slugLength }}.
   */
  readonly slug: LocalizedString
}
export interface CategoryRemoveAssetAction {
  readonly action: 'removeAsset'
  readonly assetId?: string
  readonly assetKey?: string
}
export interface CategorySetAssetCustomFieldAction {
  readonly action: 'setAssetCustomField'
  readonly assetId?: string
  readonly name: string
  readonly value?: any
  readonly assetKey?: string
}
export interface CategorySetAssetCustomTypeAction {
  readonly action: 'setAssetCustomType'
  readonly assetId?: string
  /**
   *	If set, the custom fields are set to this new value.
   */
  readonly fields?: any
  /**
   *	If set, the custom type is set to this new value.
   *	If absent, the custom type and any existing custom fields are removed.
   */
  readonly type?: TypeResourceIdentifier
  readonly assetKey?: string
}
export interface CategorySetAssetDescriptionAction {
  readonly action: 'setAssetDescription'
  readonly assetId?: string
  readonly description?: LocalizedString
  readonly assetKey?: string
}
export interface CategorySetAssetKeyAction {
  readonly action: 'setAssetKey'
  readonly assetId: string
  /**
   *	User-defined identifier for the asset.
   *	If left blank or set to `null`, the asset key is unset/removed.
   */
  readonly assetKey?: string
}
export interface CategorySetAssetSourcesAction {
  readonly action: 'setAssetSources'
  readonly sources: AssetSource[]
  readonly assetId?: string
  readonly assetKey?: string
}
export interface CategorySetAssetTagsAction {
  readonly action: 'setAssetTags'
  readonly assetId?: string
  readonly assetKey?: string
  readonly tags?: string[]
}
export interface CategorySetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface CategorySetCustomTypeAction {
  readonly action: 'setCustomType'
  /**
   *	A valid JSON object, based on the FieldDefinitions of the Type. Sets the custom fields to this value.
   */
  readonly fields?: FieldContainer
  /**
   *	If absent, the custom type and any existing CustomFields are removed.
   */
  readonly type?: TypeResourceIdentifier
}
export interface CategorySetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: LocalizedString
}
export interface CategorySetExternalIdAction {
  readonly action: 'setExternalId'
  /**
   *	If not defined, the external ID is unset.
   */
  readonly externalId?: string
}
export interface CategorySetKeyAction {
  readonly action: 'setKey'
  /**
   *	User-defined unique identifier for the category.
   *	Keys can only contain alphanumeric characters (`a-Z, 0-9`), underscores and hyphens (`-, _`) and be between 2 and 256 characters.
   *	If `key` is absent or `null`, this field will be removed if it exists.
   */
  readonly key?: string
}
export interface CategorySetMetaDescriptionAction {
  readonly action: 'setMetaDescription'
  readonly metaDescription?: LocalizedString
}
export interface CategorySetMetaKeywordsAction {
  readonly action: 'setMetaKeywords'
  readonly metaKeywords?: LocalizedString
}
export interface CategorySetMetaTitleAction {
  readonly action: 'setMetaTitle'
  readonly metaTitle?: LocalizedString
}
