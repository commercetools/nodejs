/* tslint:disable */
//Generated file, please do not change

import { LocalizedString } from './Common'
import { ReferenceTypeId } from './Common'
import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { LoggedResource } from './Common'
import { Reference } from './Common'
import { ResourceIdentifier } from './Common'


export interface CustomFieldEnumValue {
  
  readonly key: string;
  
  readonly label: string
}

export interface CustomFieldLocalizedEnumValue {
  
  readonly key: string;
  
  readonly label: LocalizedString
}

export interface CustomFields {
  
  readonly type: TypeReference;
  
  readonly fields: FieldContainer
}

export interface CustomFieldsDraft {
  
  readonly type: TypeResourceIdentifier;
  
  readonly fields?: FieldContainer
}

export interface FieldContainer {
  [key:string]: object
}

export interface FieldDefinition {
  
  readonly type: object;
  
  readonly name: string;
  
  readonly label: LocalizedString;
  
  readonly required: boolean;
  
  readonly inputHint?: TypeTextInputHint
}

export type FieldType =
  CustomFieldBooleanType |
  CustomFieldDateTimeType |
  CustomFieldDateType |
  CustomFieldEnumType |
  CustomFieldLocalizedEnumType |
  CustomFieldLocalizedStringType |
  CustomFieldMoneyType |
  CustomFieldNumberType |
  CustomFieldReferenceType |
  CustomFieldSetType |
  CustomFieldStringType |
  CustomFieldTimeType
;

export interface CustomFieldBooleanType {
  readonly name: "Boolean";
}

export interface CustomFieldDateTimeType {
  readonly name: "DateTime";
}

export interface CustomFieldDateType {
  readonly name: "Date";
}

export interface CustomFieldEnumType {
  readonly name: "Enum";
  
  readonly values: CustomFieldEnumValue[]
}

export interface CustomFieldLocalizedEnumType {
  readonly name: "LocalizedEnum";
  
  readonly values: CustomFieldLocalizedEnumValue[]
}

export interface CustomFieldLocalizedStringType {
  readonly name: "LocalizedString";
}

export interface CustomFieldMoneyType {
  readonly name: "Money";
}

export interface CustomFieldNumberType {
  readonly name: "Number";
}

export interface CustomFieldReferenceType {
  readonly name: "Reference";
  
  readonly referenceTypeId: ReferenceTypeId
}

export interface CustomFieldSetType {
  readonly name: "Set";
  
  readonly elementType: FieldType
}

export interface CustomFieldStringType {
  readonly name: "String";
}

export interface CustomFieldTimeType {
  readonly name: "Time";
}

export type ResourceTypeId =
   'asset' |
   'category' |
   'channel' |
   'customer' |
   'order' |
   'order-edit' |
   'inventory-entry' |
   'line-item' |
   'custom-line-item' |
   'product-price' |
   'payment' |
   'payment-interface-interaction' |
   'review' |
   'shopping-list' |
   'shopping-list-text-line-item' |
   'discount-code' |
   'cart-discount' |
   'customer-group';

export interface Type extends LoggedResource {
  
  readonly key: string;
  
  readonly name: LocalizedString;
  
  readonly description?: LocalizedString;
  
  readonly resourceTypeIds: ResourceTypeId[];
  
  readonly fieldDefinitions: FieldDefinition[]
}

export interface TypeDraft {
  
  readonly key: string;
  
  readonly name: LocalizedString;
  
  readonly description?: LocalizedString;
  
  readonly resourceTypeIds: ResourceTypeId[];
  
  readonly fieldDefinitions?: FieldDefinition[]
}

export interface TypePagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: Type[]
}

export interface TypeReference {
  readonly typeId: "type";
  
  readonly id: string;
  
  readonly obj?: Type
}

export interface TypeResourceIdentifier {
  readonly typeId: "type";
  
  readonly id?: string;
  
  readonly key?: string
}

export type TypeTextInputHint =
   'SingleLine' |
   'MultiLine';

export interface TypeUpdate {
  
  readonly version: number;
  
  readonly actions: TypeUpdateAction[]
}

export type TypeUpdateAction =
  TypeAddEnumValueAction |
  TypeAddFieldDefinitionAction |
  TypeAddLocalizedEnumValueAction |
  TypeChangeEnumValueLabelAction |
  TypeChangeEnumValueOrderAction |
  TypeChangeFieldDefinitionLabelAction |
  TypeChangeFieldDefinitionOrderAction |
  TypeChangeInputHintAction |
  TypeChangeKeyAction |
  TypeChangeLabelAction |
  TypeChangeLocalizedEnumValueLabelAction |
  TypeChangeLocalizedEnumValueOrderAction |
  TypeChangeNameAction |
  TypeRemoveFieldDefinitionAction |
  TypeSetDescriptionAction
;

export interface TypeAddEnumValueAction {
  readonly action: "addEnumValue";
  
  readonly fieldName: string;
  
  readonly value: CustomFieldEnumValue
}

export interface TypeAddFieldDefinitionAction {
  readonly action: "addFieldDefinition";
  
  readonly fieldDefinition: FieldDefinition
}

export interface TypeAddLocalizedEnumValueAction {
  readonly action: "addLocalizedEnumValue";
  
  readonly fieldName: string;
  
  readonly value: CustomFieldLocalizedEnumValue
}

export interface TypeChangeEnumValueLabelAction {
  readonly action: "changeEnumValueLabel";
  
  readonly fieldName: string;
  
  readonly value: CustomFieldEnumValue
}

export interface TypeChangeEnumValueOrderAction {
  readonly action: "changeEnumValueOrder";
  
  readonly fieldName: string;
  
  readonly keys: string[]
}

export interface TypeChangeFieldDefinitionLabelAction {
  readonly action: "changeFieldDefinitionLabel";
  
  readonly fieldName: string;
  
  readonly label: LocalizedString
}

export interface TypeChangeFieldDefinitionOrderAction {
  readonly action: "changeFieldDefinitionOrder";
  
  readonly fieldNames: string[]
}

export interface TypeChangeInputHintAction {
  readonly action: "changeInputHint";
  
  readonly fieldName: string;
  
  readonly inputHint: TypeTextInputHint
}

export interface TypeChangeKeyAction {
  readonly action: "changeKey";
  
  readonly key: string
}

export interface TypeChangeLabelAction {
  readonly action: "changeLabel";
  
  readonly fieldName: string;
  
  readonly label: LocalizedString
}

export interface TypeChangeLocalizedEnumValueLabelAction {
  readonly action: "changeLocalizedEnumValueLabel";
  
  readonly fieldName: string;
  
  readonly value: CustomFieldLocalizedEnumValue
}

export interface TypeChangeLocalizedEnumValueOrderAction {
  readonly action: "changeLocalizedEnumValueOrder";
  
  readonly fieldName: string;
  
  readonly keys: string[]
}

export interface TypeChangeNameAction {
  readonly action: "changeName";
  
  readonly name: LocalizedString
}

export interface TypeRemoveFieldDefinitionAction {
  readonly action: "removeFieldDefinition";
  
  readonly fieldName: string
}

export interface TypeSetDescriptionAction {
  readonly action: "setDescription";
  
  readonly description?: LocalizedString
}