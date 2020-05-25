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
  BaseResource,
  CreatedBy,
  LastModifiedBy,
  LocalizedString,
} from 'models/common'
import { CustomerReference, CustomerResourceIdentifier } from 'models/customer'
import { ProductVariant } from 'models/product'
import { ProductTypeReference } from 'models/product-type'
import {
  CustomFields,
  CustomFieldsDraft,
  FieldContainer,
  TypeResourceIdentifier,
} from 'models/type'

export interface MyShoppingList extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly custom?: CustomFields
  readonly customer?: CustomerReference
  readonly deleteDaysAfterLastModification?: number
  readonly description?: LocalizedString
  readonly key?: string
  readonly lineItems?: ShoppingListLineItem[]
  readonly name: LocalizedString
  readonly slug?: LocalizedString
  readonly textLineItems?: TextLineItem[]
  readonly anonymousId?: string
}
export interface ShoppingList extends BaseResource {
  /**
   *	The unique ID of the shopping list.
   */
  readonly id: string
  /**
   *	The current version of the shopping list.
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
  readonly custom?: CustomFields
  readonly customer?: CustomerReference
  /**
   *	The shopping list will be deleted automatically if it hasn't been modified for the specified amount of days.
   */
  readonly deleteDaysAfterLastModification?: number
  readonly description?: LocalizedString
  /**
   *	User-specific unique identifier for the shopping list.
   */
  readonly key?: string
  readonly lineItems?: ShoppingListLineItem[]
  readonly name: LocalizedString
  /**
   *	Human-readable identifiers usually used as deep-link URL to the related shopping list.
   *	Each slug is unique across a project, but a shopping list can have the same slug for different languages.
   *	The slug must match the pattern [a-zA-Z0-9_-]{2,256}.
   */
  readonly slug?: LocalizedString
  readonly textLineItems?: TextLineItem[]
  /**
   *	Identifies shopping lists belonging to an anonymous session (the customer has not signed up/in yet).
   */
  readonly anonymousId?: string
}
export interface ShoppingListDraft {
  /**
   *	The custom fields.
   */
  readonly custom?: CustomFieldsDraft
  readonly customer?: CustomerResourceIdentifier
  /**
   *	The shopping list will be deleted automatically if it hasn't been modified for the specified amount of days.
   */
  readonly deleteDaysAfterLastModification?: number
  readonly description?: LocalizedString
  /**
   *	User-specific unique identifier for the shopping list.
   */
  readonly key?: string
  readonly lineItems?: ShoppingListLineItemDraft[]
  readonly name: LocalizedString
  /**
   *	Human-readable identifiers usually used as deep-link URL to the related shopping list.
   *	Each slug is unique across a project, but a shopping list can have the same slug for different languages.
   *	The slug must match the pattern [a-zA-Z0-9_-]{2,256}.
   */
  readonly slug?: LocalizedString
  readonly textLineItems?: TextLineItemDraft[]
  /**
   *	Identifies shopping lists belonging to an anonymous session (the customer has not signed up/in yet).
   */
  readonly anonymousId?: string
}
export interface ShoppingListLineItem {
  readonly addedAt: string
  readonly custom?: CustomFields
  readonly deactivatedAt?: string
  readonly id: string
  readonly name: LocalizedString
  readonly productId: string
  readonly productSlug?: LocalizedString
  readonly productType: ProductTypeReference
  readonly quantity: number
  readonly variant?: ProductVariant
  readonly variantId?: number
}
export interface ShoppingListLineItemDraft {
  readonly addedAt?: string
  readonly custom?: CustomFieldsDraft
  readonly sku?: string
  readonly productId?: string
  readonly quantity?: number
  readonly variantId?: number
}
export interface ShoppingListPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: ShoppingList[]
}
export interface ShoppingListReference {
  readonly typeId: 'shopping-list'
  readonly id: string
  readonly obj?: ShoppingList
}
export interface ShoppingListResourceIdentifier {
  readonly typeId: 'shopping-list'
  readonly id?: string
  readonly key?: string
}
export interface ShoppingListUpdate {
  readonly version: number
  readonly actions: ShoppingListUpdateAction[]
}
export type ShoppingListUpdateAction =
  | ShoppingListAddLineItemAction
  | ShoppingListAddTextLineItemAction
  | ShoppingListChangeLineItemQuantityAction
  | ShoppingListChangeLineItemsOrderAction
  | ShoppingListChangeNameAction
  | ShoppingListChangeTextLineItemNameAction
  | ShoppingListChangeTextLineItemQuantityAction
  | ShoppingListChangeTextLineItemsOrderAction
  | ShoppingListRemoveLineItemAction
  | ShoppingListRemoveTextLineItemAction
  | ShoppingListSetAnonymousIdAction
  | ShoppingListSetCustomFieldAction
  | ShoppingListSetCustomTypeAction
  | ShoppingListSetCustomerAction
  | ShoppingListSetDeleteDaysAfterLastModificationAction
  | ShoppingListSetDescriptionAction
  | ShoppingListSetKeyAction
  | ShoppingListSetLineItemCustomFieldAction
  | ShoppingListSetLineItemCustomTypeAction
  | ShoppingListSetSlugAction
  | ShoppingListSetTextLineItemCustomFieldAction
  | ShoppingListSetTextLineItemCustomTypeAction
  | ShoppingListSetTextLineItemDescriptionAction
export interface TextLineItem {
  /**
   *	When the text line item was added to the shopping list.
   */
  readonly addedAt: string
  readonly custom?: CustomFields
  readonly description?: LocalizedString
  /**
   *	The unique ID of this TextLineItem.
   */
  readonly id: string
  readonly name: LocalizedString
  readonly quantity: number
}
export interface TextLineItemDraft {
  /**
   *	Defaults to the current date and time.
   */
  readonly addedAt?: string
  /**
   *	The custom fields.
   */
  readonly custom?: CustomFieldsDraft
  readonly description?: LocalizedString
  readonly name: LocalizedString
  /**
   *	Defaults to `1`.
   */
  readonly quantity?: number
}
export interface ShoppingListAddLineItemAction {
  readonly action: 'addLineItem'
  readonly sku?: string
  readonly productId?: string
  readonly variantId?: number
  readonly quantity?: number
  readonly addedAt?: string
  readonly custom?: CustomFieldsDraft
}
export interface ShoppingListAddTextLineItemAction {
  readonly action: 'addTextLineItem'
  readonly name: LocalizedString
  readonly description?: LocalizedString
  readonly quantity?: number
  readonly addedAt?: string
  readonly custom?: CustomFieldsDraft
}
export interface ShoppingListChangeLineItemQuantityAction {
  readonly action: 'changeLineItemQuantity'
  readonly lineItemId: string
  readonly quantity: number
}
export interface ShoppingListChangeLineItemsOrderAction {
  readonly action: 'changeLineItemsOrder'
  readonly lineItemOrder: string[]
}
export interface ShoppingListChangeNameAction {
  readonly action: 'changeName'
  readonly name: LocalizedString
}
export interface ShoppingListChangeTextLineItemNameAction {
  readonly action: 'changeTextLineItemName'
  readonly textLineItemId: string
  readonly name: LocalizedString
}
export interface ShoppingListChangeTextLineItemQuantityAction {
  readonly action: 'changeTextLineItemQuantity'
  readonly textLineItemId: string
  readonly quantity: number
}
export interface ShoppingListChangeTextLineItemsOrderAction {
  readonly action: 'changeTextLineItemsOrder'
  readonly textLineItemOrder: string[]
}
export interface ShoppingListRemoveLineItemAction {
  readonly action: 'removeLineItem'
  readonly lineItemId: string
  readonly quantity?: number
}
export interface ShoppingListRemoveTextLineItemAction {
  readonly action: 'removeTextLineItem'
  readonly textLineItemId: string
  readonly quantity?: number
}
export interface ShoppingListSetAnonymousIdAction {
  readonly action: 'setAnonymousId'
  /**
   *	Anonymous ID of the anonymous customer that this shopping list belongs to.
   *	If this field is not set any existing `anonymousId` is removed.
   */
  readonly anonymousId?: string
}
export interface ShoppingListSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface ShoppingListSetCustomTypeAction {
  readonly action: 'setCustomType'
  /**
   *	If set, the custom type is set to this new value.
   *	If absent, the custom type and any existing custom fields are removed.
   */
  readonly type?: TypeResourceIdentifier
  /**
   *	If set, the custom fields are set to this new value.
   */
  readonly fields?: FieldContainer
}
export interface ShoppingListSetCustomerAction {
  readonly action: 'setCustomer'
  readonly customer?: CustomerResourceIdentifier
}
export interface ShoppingListSetDeleteDaysAfterLastModificationAction {
  readonly action: 'setDeleteDaysAfterLastModification'
  readonly deleteDaysAfterLastModification?: number
}
export interface ShoppingListSetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: LocalizedString
}
export interface ShoppingListSetKeyAction {
  readonly action: 'setKey'
  /**
   *	User-specific unique identifier for the shopping list.
   */
  readonly key?: string
}
export interface ShoppingListSetLineItemCustomFieldAction {
  readonly action: 'setLineItemCustomField'
  readonly lineItemId: string
  readonly name: string
  readonly value?: any
}
export interface ShoppingListSetLineItemCustomTypeAction {
  readonly action: 'setLineItemCustomType'
  readonly lineItemId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface ShoppingListSetSlugAction {
  readonly action: 'setSlug'
  readonly slug?: LocalizedString
}
export interface ShoppingListSetTextLineItemCustomFieldAction {
  readonly action: 'setTextLineItemCustomField'
  readonly textLineItemId: string
  readonly name: string
  readonly value?: any
}
export interface ShoppingListSetTextLineItemCustomTypeAction {
  readonly action: 'setTextLineItemCustomType'
  readonly textLineItemId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface ShoppingListSetTextLineItemDescriptionAction {
  readonly action: 'setTextLineItemDescription'
  readonly textLineItemId: string
  readonly description?: LocalizedString
}
