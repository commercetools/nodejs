//Generated file, please do not change

import { CreatedBy, LastModifiedBy, LocalizedString, LoggedResource, Reference, ReferenceTypeId, ResourceIdentifier } from './common'
import { CustomerReference, CustomerResourceIdentifier } from './customer'
import { ProductVariant } from './product'
import { ProductTypeReference } from './product-type'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'

export interface MyShoppingList extends LoggedResource {
  readonly id: string;
  readonly version: number;
  readonly createdAt: string;
  readonly lastModifiedAt: string;
  readonly lastModifiedBy?: LastModifiedBy;
  readonly createdBy?: CreatedBy;
  readonly custom?: CustomFields;
  readonly customer?: CustomerReference;
  readonly deleteDaysAfterLastModification?: number;
  readonly description?: LocalizedString;
  readonly key?: string;
  readonly lineItems?: ShoppingListLineItem[];
  readonly name: LocalizedString;
  readonly slug?: LocalizedString;
  readonly textLineItems?: TextLineItem[];
  readonly anonymousId?: string
}
export interface ShoppingList extends LoggedResource {
  /**
  *		The unique ID of the shopping list.
  */
  readonly id: string;
  /**
  *		The current version of the shopping list.
  */
  readonly version: number;
  readonly createdAt: string;
  readonly lastModifiedAt: string;
  /**
  *		Present on resources updated after 1/02/2019 except for events not tracked.
  */
  readonly lastModifiedBy?: LastModifiedBy;
  /**
  *		Present on resources created after 1/02/2019 except for events not tracked.
  */
  readonly createdBy?: CreatedBy;
  readonly custom?: CustomFields;
  readonly customer?: CustomerReference;
  /**
  *		The shopping list will be deleted automatically if it hasn't been modified for the specified amount of days.
  */
  readonly deleteDaysAfterLastModification?: number;
  readonly description?: LocalizedString;
  /**
  *		User-specific unique identifier for the shopping list.
  */
  readonly key?: string;
  readonly lineItems?: ShoppingListLineItem[];
  readonly name: LocalizedString;
  /**
  *		Human-readable identifiers usually used as deep-link URL to the related shopping list.
  *		Each slug is unique across a project, but a shopping list can have the same slug for different languages.
  *		The slug must match the pattern [a-zA-Z0-9_-]{2,256}.
  */
  readonly slug?: LocalizedString;
  readonly textLineItems?: TextLineItem[];
  /**
  *		Identifies shopping lists belonging to an anonymous session (the customer has not signed up/in yet).
  */
  readonly anonymousId?: string
}
export interface ShoppingListDraft {
  /**
  *		The custom fields.
  */
  readonly custom?: CustomFieldsDraft;
  readonly customer?: CustomerResourceIdentifier;
  /**
  *		The shopping list will be deleted automatically if it hasn't been modified for the specified amount of days.
  */
  readonly deleteDaysAfterLastModification?: number;
  readonly description?: LocalizedString;
  /**
  *		User-specific unique identifier for the shopping list.
  */
  readonly key?: string;
  readonly lineItems?: ShoppingListLineItemDraft[];
  readonly name: LocalizedString;
  /**
  *		Human-readable identifiers usually used as deep-link URL to the related shopping list.
  *		Each slug is unique across a project, but a shopping list can have the same slug for different languages.
  *		The slug must match the pattern [a-zA-Z0-9_-]{2,256}.
  */
  readonly slug?: LocalizedString;
  readonly textLineItems?: TextLineItemDraft[];
  /**
  *		Identifies shopping lists belonging to an anonymous session (the customer has not signed up/in yet).
  */
  readonly anonymousId?: string
}
export interface ShoppingListLineItem {
  readonly addedAt: string;
  readonly custom?: CustomFields;
  readonly deactivatedAt?: string;
  readonly id: string;
  readonly name: LocalizedString;
  readonly productId: string;
  readonly productSlug?: LocalizedString;
  readonly productType: ProductTypeReference;
  readonly quantity: number;
  readonly variant?: ProductVariant;
  readonly variantId?: number
}
export interface ShoppingListLineItemDraft {
  readonly addedAt?: string;
  readonly custom?: CustomFieldsDraft;
  readonly sku?: string;
  readonly productId?: string;
  readonly quantity?: number;
  readonly variantId?: number
}
export interface ShoppingListPagedQueryResponse {
  readonly limit: number;
  readonly count: number;
  readonly total?: number;
  readonly offset: number;
  readonly results: ShoppingList[]
}
export interface ShoppingListReference {
  readonly typeId: "shopping-list";
  readonly id: string;
  readonly obj?: ShoppingList
}
export interface ShoppingListResourceIdentifier {
  readonly typeId: "shopping-list";
  readonly id?: string;
  readonly key?: string
}
export interface ShoppingListUpdate {
  readonly version: number;
  readonly actions: ShoppingListUpdateAction[]
}
export type ShoppingListUpdateAction =
  ShoppingListAddLineItemAction |
  ShoppingListAddTextLineItemAction |
  ShoppingListChangeLineItemQuantityAction |
  ShoppingListChangeLineItemsOrderAction |
  ShoppingListChangeNameAction |
  ShoppingListChangeTextLineItemNameAction |
  ShoppingListChangeTextLineItemQuantityAction |
  ShoppingListChangeTextLineItemsOrderAction |
  ShoppingListRemoveLineItemAction |
  ShoppingListRemoveTextLineItemAction |
  ShoppingListSetAnonymousIdAction |
  ShoppingListSetCustomFieldAction |
  ShoppingListSetCustomTypeAction |
  ShoppingListSetCustomerAction |
  ShoppingListSetDeleteDaysAfterLastModificationAction |
  ShoppingListSetDescriptionAction |
  ShoppingListSetKeyAction |
  ShoppingListSetLineItemCustomFieldAction |
  ShoppingListSetLineItemCustomTypeAction |
  ShoppingListSetSlugAction |
  ShoppingListSetTextLineItemCustomFieldAction |
  ShoppingListSetTextLineItemCustomTypeAction |
  ShoppingListSetTextLineItemDescriptionAction
;
export interface TextLineItem {
  /**
  *		When the text line item was added to the shopping list.
  */
  readonly addedAt: string;
  readonly custom?: CustomFields;
  readonly description?: LocalizedString;
  /**
  *		The unique ID of this TextLineItem.
  */
  readonly id: string;
  readonly name: LocalizedString;
  readonly quantity: number
}
export interface TextLineItemDraft {
  /**
  *		Defaults to the current date and time.
  */
  readonly addedAt?: string;
  /**
  *		The custom fields.
  */
  readonly custom?: CustomFieldsDraft;
  readonly description?: LocalizedString;
  readonly name: LocalizedString;
  /**
  *		Defaults to `1`.
  */
  readonly quantity?: number
}
export interface ShoppingListAddLineItemAction {
  readonly action: "addLineItem";
  readonly addedAt?: string;
  readonly quantity?: number;
  readonly productId?: string;
  readonly custom?: CustomFieldsDraft;
  readonly variantId?: number;
  readonly sku?: string
}
export interface ShoppingListAddTextLineItemAction {
  readonly action: "addTextLineItem";
  readonly addedAt?: string;
  readonly quantity?: number;
  readonly custom?: CustomFieldsDraft;
  readonly name: LocalizedString;
  readonly description?: LocalizedString
}
export interface ShoppingListChangeLineItemQuantityAction {
  readonly action: "changeLineItemQuantity";
  readonly quantity: number;
  readonly lineItemId: string
}
export interface ShoppingListChangeLineItemsOrderAction {
  readonly action: "changeLineItemsOrder";
  readonly lineItemOrder: string[]
}
export interface ShoppingListChangeNameAction {
  readonly action: "changeName";
  readonly name: LocalizedString
}
export interface ShoppingListChangeTextLineItemNameAction {
  readonly action: "changeTextLineItemName";
  readonly name: LocalizedString;
  readonly textLineItemId: string
}
export interface ShoppingListChangeTextLineItemQuantityAction {
  readonly action: "changeTextLineItemQuantity";
  readonly quantity: number;
  readonly textLineItemId: string
}
export interface ShoppingListChangeTextLineItemsOrderAction {
  readonly action: "changeTextLineItemsOrder";
  readonly textLineItemOrder: string[]
}
export interface ShoppingListRemoveLineItemAction {
  readonly action: "removeLineItem";
  readonly quantity?: number;
  readonly lineItemId: string
}
export interface ShoppingListRemoveTextLineItemAction {
  readonly action: "removeTextLineItem";
  readonly quantity?: number;
  readonly textLineItemId: string
}
export interface ShoppingListSetAnonymousIdAction {
  readonly action: "setAnonymousId";
  readonly anonymousId?: string
}
export interface ShoppingListSetCustomFieldAction {
  readonly action: "setCustomField";
  readonly name: string;
  readonly value?: object
}
export interface ShoppingListSetCustomTypeAction {
  readonly action: "setCustomType";
  readonly fields?: FieldContainer;
  readonly type?: TypeResourceIdentifier
}
export interface ShoppingListSetCustomerAction {
  readonly action: "setCustomer";
  readonly customer?: CustomerResourceIdentifier
}
export interface ShoppingListSetDeleteDaysAfterLastModificationAction {
  readonly action: "setDeleteDaysAfterLastModification";
  readonly deleteDaysAfterLastModification?: number
}
export interface ShoppingListSetDescriptionAction {
  readonly action: "setDescription";
  readonly description?: LocalizedString
}
export interface ShoppingListSetKeyAction {
  readonly action: "setKey";
  readonly key?: string
}
export interface ShoppingListSetLineItemCustomFieldAction {
  readonly action: "setLineItemCustomField";
  readonly lineItemId: string;
  readonly name: string;
  readonly value?: object
}
export interface ShoppingListSetLineItemCustomTypeAction {
  readonly action: "setLineItemCustomType";
  readonly lineItemId: string;
  readonly fields?: FieldContainer;
  readonly type?: TypeResourceIdentifier
}
export interface ShoppingListSetSlugAction {
  readonly action: "setSlug";
  readonly slug?: LocalizedString
}
export interface ShoppingListSetTextLineItemCustomFieldAction {
  readonly action: "setTextLineItemCustomField";
  readonly name: string;
  readonly value?: object;
  readonly textLineItemId: string
}
export interface ShoppingListSetTextLineItemCustomTypeAction {
  readonly action: "setTextLineItemCustomType";
  readonly fields?: FieldContainer;
  readonly type?: TypeResourceIdentifier;
  readonly textLineItemId: string
}
export interface ShoppingListSetTextLineItemDescriptionAction {
  readonly action: "setTextLineItemDescription";
  readonly description?: LocalizedString;
  readonly textLineItemId: string
}