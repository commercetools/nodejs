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
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
} from 'models/common'

export type AttributeConstraintEnum =
  | 'None'
  | 'Unique'
  | 'CombinationUnique'
  | 'SameForAll'
export type AttributeConstraintEnumDraft = 'None'
export interface AttributeDefinition {
  /**
   *	Describes the type of the attribute.
   */
  readonly type: AttributeType
  /**
   *	The unique name of the attribute used in the API.
   *	The name must be between two and 256 characters long and can contain the ASCII letters A to Z in lowercase or uppercase, digits, underscores (`_`) and the hyphen-minus (`-`).
   *	When using the same `name` for an attribute in two or more product types all fields of the AttributeDefinition of this attribute need to be the same across the product types, otherwise an AttributeDefinitionAlreadyExists error code will be returned.
   *	An exception to this are the values of an `enum` or `lenum` type and sets thereof.
   */
  readonly name: string
  /**
   *	A human-readable label for the attribute.
   */
  readonly label: LocalizedString
  /**
   *	Whether the attribute is required to have a value.
   */
  readonly isRequired: boolean
  /**
   *	Describes how an attribute or a set of attributes should be validated across all variants of a product.
   */
  readonly attributeConstraint: AttributeConstraintEnum
  /**
   *	Additional information about the attribute that aids content managers when setting product details.
   */
  readonly inputTip?: LocalizedString
  /**
   *	Provides a visual representation type for this attribute.
   *	only relevant for text-based attribute types
   *	like TextType and LocalizableTextType.
   */
  readonly inputHint: TextInputHint
  /**
   *	Whether the attribute's values should generally be enabled in product search.
   *	This determines whether the value is stored in products for matching terms in the context of full-text search queries  and can be used in facets & filters as part of product search queries.
   *	The exact features that are enabled/disabled with this flag depend on the concrete attribute type and are described there.
   *	The max size of a searchable field is **restricted to 10922 characters**.
   *	This constraint is enforced at both product creation and product update.
   *	If the length of the input exceeds the maximum size an InvalidField error is returned.
   */
  readonly isSearchable: boolean
}
export interface AttributeDefinitionDraft {
  /**
   *	Describes the type of the attribute.
   */
  readonly type: AttributeType
  /**
   *	The unique name of the attribute used in the API.
   *	The name must be between two and 256 characters long and can contain the ASCII letters A to Z in lowercase or uppercase, digits, underscores (`_`) and the hyphen-minus (`-`).
   *	When using the same `name` for an attribute in two or more product types all fields of the AttributeDefinition of this attribute need to be the same across the product types.
   */
  readonly name: string
  /**
   *	A human-readable label for the attribute.
   */
  readonly label: LocalizedString
  /**
   *	Whether the attribute is required to have a value.
   */
  readonly isRequired: boolean
  /**
   *	Describes how an attribute or a set of attributes should be validated across all variants of a product.
   */
  readonly attributeConstraint?: AttributeConstraintEnum
  /**
   *	Additional information about the attribute that aids content managers when setting product details.
   */
  readonly inputTip?: LocalizedString
  /**
   *	Provides a visual representation type for this attribute.
   *	only relevant for text-based attribute types like TextType and LocalizableTextType.
   */
  readonly inputHint?: TextInputHint
  /**
   *	Whether the attribute's values should generally be enabled in product search.
   *	This determines whether the value is stored in products for matching terms in the context of full-text search queries and can be used in facets & filters as part of product search queries.
   *	The exact features that are enabled/disabled with this flag depend on the concrete attribute type and are described there.
   */
  readonly isSearchable?: boolean
}
export interface AttributeLocalizedEnumValue {
  readonly key: string
  readonly label: LocalizedString
}
export interface AttributePlainEnumValue {
  readonly key: string
  readonly label: string
}
export type AttributeType =
  | AttributeLocalizedEnumType
  | AttributeDateType
  | AttributeMoneyType
  | AttributeEnumType
  | AttributeReferenceType
  | AttributeNestedType
  | AttributeDateTimeType
  | AttributeTimeType
  | AttributeTextType
  | AttributeLocalizableTextType
  | AttributeBooleanType
  | AttributeSetType
  | AttributeNumberType
export interface AttributeBooleanType {
  readonly name: 'boolean'
}
export interface AttributeDateTimeType {
  readonly name: 'datetime'
}
export interface AttributeDateType {
  readonly name: 'date'
}
export interface AttributeEnumType {
  readonly name: 'enum'
  readonly values: AttributePlainEnumValue[]
}
export interface AttributeLocalizableTextType {
  readonly name: 'ltext'
}
export interface AttributeLocalizedEnumType {
  readonly name: 'lenum'
  readonly values: AttributeLocalizedEnumValue[]
}
export interface AttributeMoneyType {
  readonly name: 'money'
}
export interface AttributeNestedType {
  readonly name: 'nested'
  readonly typeReference: ProductTypeReference
}
export interface AttributeNumberType {
  readonly name: 'number'
}
export interface AttributeReferenceType {
  readonly name: 'reference'
  readonly referenceTypeId: ReferenceTypeId
}
export interface AttributeSetType {
  readonly name: 'set'
  readonly elementType: AttributeType
}
export interface AttributeTextType {
  readonly name: 'text'
}
export interface AttributeTimeType {
  readonly name: 'time'
}
export interface ProductType extends BaseResource {
  /**
   *	The unique ID of the product type.
   */
  readonly id: string
  /**
   *	The current version of the product type.
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
   *	User-specific unique identifier for the product type (max.
   *	256 characters).
   */
  readonly key?: string
  readonly name: string
  readonly description: string
  readonly attributes?: AttributeDefinition[]
}
export interface ProductTypeDraft {
  /**
   *	User-specific unique identifier for the product type (min.
   *	2 and max.
   *	256 characters).
   */
  readonly key?: string
  readonly name: string
  readonly description: string
  readonly attributes?: AttributeDefinitionDraft[]
}
export interface ProductTypePagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: ProductType[]
}
export interface ProductTypeReference {
  readonly typeId: 'product-type'
  readonly id: string
  readonly obj?: ProductType
}
export interface ProductTypeResourceIdentifier {
  readonly typeId: 'product-type'
  readonly id?: string
  readonly key?: string
}
export interface ProductTypeUpdate {
  readonly version: number
  readonly actions: ProductTypeUpdateAction[]
}
export type ProductTypeUpdateAction =
  | ProductTypeAddAttributeDefinitionAction
  | ProductTypeAddLocalizedEnumValueAction
  | ProductTypeAddPlainEnumValueAction
  | ProductTypeChangeAttributeConstraintAction
  | ProductTypeChangeAttributeNameAction
  | ProductTypeChangeAttributeOrderAction
  | ProductTypeChangeAttributeOrderByNameAction
  | ProductTypeChangeDescriptionAction
  | ProductTypeChangeEnumKeyAction
  | ProductTypeChangeInputHintAction
  | ProductTypeChangeIsSearchableAction
  | ProductTypeChangeLabelAction
  | ProductTypeChangeLocalizedEnumValueLabelAction
  | ProductTypeChangeLocalizedEnumValueOrderAction
  | ProductTypeChangeNameAction
  | ProductTypeChangePlainEnumValueLabelAction
  | ProductTypeChangePlainEnumValueOrderAction
  | ProductTypeRemoveAttributeDefinitionAction
  | ProductTypeRemoveEnumValuesAction
  | ProductTypeSetInputTipAction
  | ProductTypeSetKeyAction
export type TextInputHint = 'SingleLine' | 'MultiLine'
export interface ProductTypeAddAttributeDefinitionAction {
  readonly action: 'addAttributeDefinition'
  readonly attribute: AttributeDefinitionDraft
}
export interface ProductTypeAddLocalizedEnumValueAction {
  readonly action: 'addLocalizedEnumValue'
  readonly attributeName: string
  readonly value: AttributeLocalizedEnumValue
}
export interface ProductTypeAddPlainEnumValueAction {
  readonly action: 'addPlainEnumValue'
  readonly attributeName: string
  readonly value: AttributePlainEnumValue
}
export interface ProductTypeChangeAttributeConstraintAction {
  readonly action: 'changeAttributeConstraint'
  readonly attributeName: string
  readonly newValue: AttributeConstraintEnumDraft
}
export interface ProductTypeChangeAttributeNameAction {
  readonly action: 'changeAttributeName'
  readonly attributeName: string
  readonly newAttributeName: string
}
export interface ProductTypeChangeAttributeOrderAction {
  readonly action: 'changeAttributeOrder'
  readonly attributes: AttributeDefinition[]
}
export interface ProductTypeChangeAttributeOrderByNameAction {
  readonly action: 'changeAttributeOrderByName'
  readonly attributeNames: string[]
}
export interface ProductTypeChangeDescriptionAction {
  readonly action: 'changeDescription'
  readonly description: string
}
export interface ProductTypeChangeEnumKeyAction {
  readonly action: 'changeEnumKey'
  readonly attributeName: string
  readonly key: string
  readonly newKey: string
}
export interface ProductTypeChangeInputHintAction {
  readonly action: 'changeInputHint'
  readonly attributeName: string
  readonly newValue: TextInputHint
}
export interface ProductTypeChangeIsSearchableAction {
  readonly action: 'changeIsSearchable'
  readonly attributeName: string
  readonly isSearchable: boolean
}
export interface ProductTypeChangeLabelAction {
  readonly action: 'changeLabel'
  readonly attributeName: string
  readonly label: LocalizedString
}
export interface ProductTypeChangeLocalizedEnumValueLabelAction {
  readonly action: 'changeLocalizedEnumValueLabel'
  readonly attributeName: string
  readonly newValue: AttributeLocalizedEnumValue
}
export interface ProductTypeChangeLocalizedEnumValueOrderAction {
  readonly action: 'changeLocalizedEnumValueOrder'
  readonly attributeName: string
  readonly values: AttributeLocalizedEnumValue[]
}
export interface ProductTypeChangeNameAction {
  readonly action: 'changeName'
  readonly name: string
}
export interface ProductTypeChangePlainEnumValueLabelAction {
  readonly action: 'changePlainEnumValueLabel'
  readonly attributeName: string
  readonly newValue: AttributePlainEnumValue
}
export interface ProductTypeChangePlainEnumValueOrderAction {
  readonly action: 'changePlainEnumValueOrder'
  readonly attributeName: string
  readonly values: AttributePlainEnumValue[]
}
export interface ProductTypeRemoveAttributeDefinitionAction {
  readonly action: 'removeAttributeDefinition'
  /**
   *	The name of the attribute to remove.
   */
  readonly name: string
}
export interface ProductTypeRemoveEnumValuesAction {
  readonly action: 'removeEnumValues'
  readonly attributeName: string
  readonly keys: string[]
}
export interface ProductTypeSetInputTipAction {
  readonly action: 'setInputTip'
  readonly attributeName: string
  readonly inputTip?: LocalizedString
}
export interface ProductTypeSetKeyAction {
  readonly action: 'setKey'
  /**
   *	If `key` is absent or `null`, this field will be removed if it exists.
   */
  readonly key?: string
}
