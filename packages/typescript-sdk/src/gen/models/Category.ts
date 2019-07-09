/* tslint:disable */
//Generated file, please do not change

import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { Asset } from './Common'
import { LocalizedString } from './Common'
import { CustomFields } from './Type'
import { LoggedResource } from './Common'
import { AssetDraft } from './Common'
import { CustomFieldsDraft } from './Type'
import { ReferenceTypeId } from './Common'
import { Reference } from './Common'
import { ResourceIdentifier } from './Common'
import { TypeResourceIdentifier } from './Type'
import { AssetSource } from './Common'
import { FieldContainer } from './Type'


export interface Category extends LoggedResource {
  
  readonly name: LocalizedString;
  
  readonly slug: LocalizedString;
  
  readonly description?: LocalizedString;
  
  readonly ancestors: CategoryReference[];
  
  readonly parent?: CategoryReference;
  
  readonly orderHint: string;
  
  readonly externalId?: string;
  
  readonly metaTitle?: LocalizedString;
  
  readonly metaDescription?: LocalizedString;
  
  readonly metaKeywords?: LocalizedString;
  
  readonly custom?: CustomFields;
  
  readonly assets?: Asset[];
  
  readonly key?: string
}

export interface CategoryDraft {
  
  readonly name: LocalizedString;
  
  readonly slug: LocalizedString;
  
  readonly description?: LocalizedString;
  
  readonly parent?: CategoryResourceIdentifier;
  
  readonly orderHint?: string;
  
  readonly externalId?: string;
  
  readonly metaTitle?: LocalizedString;
  
  readonly metaDescription?: LocalizedString;
  
  readonly metaKeywords?: LocalizedString;
  
  readonly custom?: CustomFieldsDraft;
  
  readonly assets?: AssetDraft[];
  
  readonly key?: string
}

export interface CategoryPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: Category[]
}

export interface CategoryReference {
  readonly typeId: "category";
  
  readonly id: string;
  
  readonly obj?: Category
}

export interface CategoryResourceIdentifier {
  readonly typeId: "category";
  
  readonly id?: string;
  
  readonly key?: string
}

export interface CategoryUpdate {
  
  readonly version: number;
  
  readonly actions: CategoryUpdateAction[]
}

export type CategoryUpdateAction =
  CategoryAddAssetAction |
  CategoryChangeAssetNameAction |
  CategoryChangeAssetOrderAction |
  CategoryChangeNameAction |
  CategoryChangeOrderHintAction |
  CategoryChangeParentAction |
  CategoryChangeSlugAction |
  CategoryRemoveAssetAction |
  CategorySetAssetCustomFieldAction |
  CategorySetAssetCustomTypeAction |
  CategorySetAssetDescriptionAction |
  CategorySetAssetKeyAction |
  CategorySetAssetSourcesAction |
  CategorySetAssetTagsAction |
  CategorySetCustomFieldAction |
  CategorySetCustomTypeAction |
  CategorySetDescriptionAction |
  CategorySetExternalIdAction |
  CategorySetKeyAction |
  CategorySetMetaDescriptionAction |
  CategorySetMetaKeywordsAction |
  CategorySetMetaTitleAction
;

export interface CategoryAddAssetAction {
  readonly action: "addAsset";
  
  readonly position?: number;
  
  readonly asset: AssetDraft
}

export interface CategoryChangeAssetNameAction {
  readonly action: "changeAssetName";
  
  readonly assetId?: string;
  
  readonly name: LocalizedString;
  
  readonly assetKey?: string
}

export interface CategoryChangeAssetOrderAction {
  readonly action: "changeAssetOrder";
  
  readonly assetOrder: string[]
}

export interface CategoryChangeNameAction {
  readonly action: "changeName";
  
  readonly name: LocalizedString
}

export interface CategoryChangeOrderHintAction {
  readonly action: "changeOrderHint";
  
  readonly orderHint: string
}

export interface CategoryChangeParentAction {
  readonly action: "changeParent";
  
  readonly parent: CategoryResourceIdentifier
}

export interface CategoryChangeSlugAction {
  readonly action: "changeSlug";
  
  readonly slug: LocalizedString
}

export interface CategoryRemoveAssetAction {
  readonly action: "removeAsset";
  
  readonly assetId?: string;
  
  readonly assetKey?: string
}

export interface CategorySetAssetCustomFieldAction {
  readonly action: "setAssetCustomField";
  
  readonly assetId?: string;
  
  readonly name: string;
  
  readonly value?: object;
  
  readonly assetKey?: string
}

export interface CategorySetAssetCustomTypeAction {
  readonly action: "setAssetCustomType";
  
  readonly assetId?: string;
  
  readonly fields?: object;
  
  readonly type?: TypeResourceIdentifier;
  
  readonly assetKey?: string
}

export interface CategorySetAssetDescriptionAction {
  readonly action: "setAssetDescription";
  
  readonly assetId?: string;
  
  readonly description?: LocalizedString;
  
  readonly assetKey?: string
}

export interface CategorySetAssetKeyAction {
  readonly action: "setAssetKey";
  
  readonly assetId: string;
  
  readonly assetKey?: string
}

export interface CategorySetAssetSourcesAction {
  readonly action: "setAssetSources";
  
  readonly sources: AssetSource[];
  
  readonly assetId?: string;
  
  readonly assetKey?: string
}

export interface CategorySetAssetTagsAction {
  readonly action: "setAssetTags";
  
  readonly assetId?: string;
  
  readonly assetKey?: string;
  
  readonly tags?: string[]
}

export interface CategorySetCustomFieldAction {
  readonly action: "setCustomField";
  
  readonly name: string;
  
  readonly value?: object
}

export interface CategorySetCustomTypeAction {
  readonly action: "setCustomType";
  
  readonly fields?: FieldContainer;
  
  readonly type?: TypeResourceIdentifier
}

export interface CategorySetDescriptionAction {
  readonly action: "setDescription";
  
  readonly description?: LocalizedString
}

export interface CategorySetExternalIdAction {
  readonly action: "setExternalId";
  
  readonly externalId?: string
}

export interface CategorySetKeyAction {
  readonly action: "setKey";
  
  readonly key?: string
}

export interface CategorySetMetaDescriptionAction {
  readonly action: "setMetaDescription";
  
  readonly metaDescription?: LocalizedString
}

export interface CategorySetMetaKeywordsAction {
  readonly action: "setMetaKeywords";
  
  readonly metaKeywords?: LocalizedString
}

export interface CategorySetMetaTitleAction {
  readonly action: "setMetaTitle";
  
  readonly metaTitle?: LocalizedString
}