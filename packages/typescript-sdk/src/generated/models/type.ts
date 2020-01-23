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
  CreatedBy,
  LastModifiedBy,
  LocalizedString,
  LoggedResource,
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
} from 'models/common'

export interface CustomFieldEnumValue {
  readonly key: string
  readonly label: string
}
export interface CustomFieldLocalizedEnumValue {
  readonly key: string
  readonly label: LocalizedString
}
export interface CustomFields {
  readonly type: TypeReference
  /**
   *	A valid JSON object, based on FieldDefinition.
   */
  readonly fields: FieldContainer
}
export interface CustomFieldsDraft {
  /**
   *	The `id` or the `key` of the type to use.
   */
  readonly type: TypeResourceIdentifier
  /**
   *	A valid JSON object, based on the FieldDefinitions of the Type.
   */
  readonly fields?: FieldContainer
}
export interface FieldContainer {
  [key: string]: any
}
export interface FieldDefinition {
  /**
   *	Describes the type of the field.
   */
  readonly type: FieldType
  /**
   *	The name of the field.
   *	The name must be between two and 36 characters long and can contain the ASCII letters A to Z in lowercase or uppercase, digits, underscores (`_`) and the hyphen-minus (`-`).
   *	The name must be unique for a given resource type ID.
   *	In case there is a field with the same name in another type it has to have the same FieldType also.
   */
  readonly name: string
  /**
   *	A human-readable label for the field.
   */
  readonly label: LocalizedString
  /**
   *	Whether the field is required to have a value.
   */
  readonly required: boolean
  /**
   *	Provides a visual representation type for this field.
   *	It is only relevant for string-based field types like StringType and LocalizedStringType.
   */
  readonly inputHint?: TypeTextInputHint
}
export type FieldType =
  | CustomFieldBooleanType
  | CustomFieldDateTimeType
  | CustomFieldDateType
  | CustomFieldEnumType
  | CustomFieldLocalizedEnumType
  | CustomFieldLocalizedStringType
  | CustomFieldMoneyType
  | CustomFieldNumberType
  | CustomFieldReferenceType
  | CustomFieldSetType
  | CustomFieldStringType
  | CustomFieldTimeType
export interface CustomFieldBooleanType {
  readonly name: 'Boolean'
}
export interface CustomFieldDateTimeType {
  readonly name: 'DateTime'
}
export interface CustomFieldDateType {
  readonly name: 'Date'
}
export interface CustomFieldEnumType {
  readonly name: 'Enum'
  readonly values: CustomFieldEnumValue[]
}
export interface CustomFieldLocalizedEnumType {
  readonly name: 'LocalizedEnum'
  readonly values: CustomFieldLocalizedEnumValue[]
}
export interface CustomFieldLocalizedStringType {
  readonly name: 'LocalizedString'
}
export interface CustomFieldMoneyType {
  readonly name: 'Money'
}
export interface CustomFieldNumberType {
  readonly name: 'Number'
}
export interface CustomFieldReferenceType {
  readonly name: 'Reference'
  readonly referenceTypeId: ReferenceTypeId
}
export interface CustomFieldSetType {
  readonly name: 'Set'
  readonly elementType: FieldType
}
export interface CustomFieldStringType {
  readonly name: 'String'
}
export interface CustomFieldTimeType {
  readonly name: 'Time'
}
export type ResourceTypeId =
  | 'asset'
  | 'category'
  | 'channel'
  | 'customer'
  | 'order'
  | 'order-edit'
  | 'inventory-entry'
  | 'line-item'
  | 'custom-line-item'
  | 'product-price'
  | 'payment'
  | 'payment-interface-interaction'
  | 'review'
  | 'shopping-list'
  | 'shopping-list-text-line-item'
  | 'discount-code'
  | 'cart-discount'
  | 'customer-group'
export interface Type extends LoggedResource {
  /**
   *	The unique ID of the type.
   */
  readonly id: string
  /**
   *	The current version of the type.
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
   *	Identifier for the type (max.
   *	256 characters).
   */
  readonly key: string
  readonly name: LocalizedString
  readonly description?: LocalizedString
  /**
   *	Defines for which resource(s) the type is valid.
   */
  readonly resourceTypeIds: ResourceTypeId[]
  readonly fieldDefinitions: FieldDefinition[]
}
export interface TypeDraft {
  readonly key: string
  readonly name: LocalizedString
  readonly description?: LocalizedString
  /**
   *	The IDs of the resources that can be customized with this type.
   */
  readonly resourceTypeIds: ResourceTypeId[]
  readonly fieldDefinitions?: FieldDefinition[]
}
export interface TypePagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Type[]
}
export interface TypeReference {
  readonly typeId: 'type'
  readonly id: string
  readonly obj?: Type
}
export interface TypeResourceIdentifier {
  readonly typeId: 'type'
  readonly id?: string
  readonly key?: string
}
export type TypeTextInputHint = 'SingleLine' | 'MultiLine'
export interface TypeUpdate {
  readonly version: number
  readonly actions: TypeUpdateAction[]
}
export type TypeUpdateAction =
  | TypeAddEnumValueAction
  | TypeAddFieldDefinitionAction
  | TypeAddLocalizedEnumValueAction
  | TypeChangeEnumValueLabelAction
  | TypeChangeEnumValueOrderAction
  | TypeChangeFieldDefinitionLabelAction
  | TypeChangeFieldDefinitionOrderAction
  | TypeChangeInputHintAction
  | TypeChangeKeyAction
  | TypeChangeLabelAction
  | TypeChangeLocalizedEnumValueLabelAction
  | TypeChangeLocalizedEnumValueOrderAction
  | TypeChangeNameAction
  | TypeRemoveFieldDefinitionAction
  | TypeSetDescriptionAction
export interface TypeAddEnumValueAction {
  readonly action: 'addEnumValue'
  readonly fieldName: string
  readonly value: CustomFieldEnumValue
}
export interface TypeAddFieldDefinitionAction {
  readonly action: 'addFieldDefinition'
  readonly fieldDefinition: FieldDefinition
}
export interface TypeAddLocalizedEnumValueAction {
  readonly action: 'addLocalizedEnumValue'
  readonly fieldName: string
  readonly value: CustomFieldLocalizedEnumValue
}
export interface TypeChangeEnumValueLabelAction {
  readonly action: 'changeEnumValueLabel'
  readonly fieldName: string
  readonly value: CustomFieldEnumValue
}
export interface TypeChangeEnumValueOrderAction {
  readonly action: 'changeEnumValueOrder'
  readonly fieldName: string
  readonly keys: string[]
}
export interface TypeChangeFieldDefinitionLabelAction {
  readonly action: 'changeFieldDefinitionLabel'
  readonly fieldName: string
  readonly label: LocalizedString
}
export interface TypeChangeFieldDefinitionOrderAction {
  readonly action: 'changeFieldDefinitionOrder'
  readonly fieldNames: string[]
}
export interface TypeChangeInputHintAction {
  readonly action: 'changeInputHint'
  readonly fieldName: string
  readonly inputHint: TypeTextInputHint
}
export interface TypeChangeKeyAction {
  readonly action: 'changeKey'
  readonly key: string
}
export interface TypeChangeLabelAction {
  readonly action: 'changeLabel'
  readonly fieldName: string
  readonly label: LocalizedString
}
export interface TypeChangeLocalizedEnumValueLabelAction {
  readonly action: 'changeLocalizedEnumValueLabel'
  readonly fieldName: string
  readonly value: CustomFieldLocalizedEnumValue
}
export interface TypeChangeLocalizedEnumValueOrderAction {
  readonly action: 'changeLocalizedEnumValueOrder'
  readonly fieldName: string
  readonly keys: string[]
}
export interface TypeChangeNameAction {
  readonly action: 'changeName'
  readonly name: LocalizedString
}
export interface TypeRemoveFieldDefinitionAction {
  readonly action: 'removeFieldDefinition'
  readonly fieldName: string
}
export interface TypeSetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: LocalizedString
}
