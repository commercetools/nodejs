/* tslint:disable */
//Generated file, please do not change

import { LocalizedString } from './Common'
import { ReferenceTypeId } from './Common'
import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { LoggedResource } from './Common'
import { Reference } from './Common'
import { ResourceIdentifier } from './Common'


export type AttributeConstraintEnum =
   'None' |
   'Unique' |
   'CombinationUnique' |
   'SameForAll';

export type AttributeConstraintEnumDraft =
   'None';

export interface AttributeDefinition {
  
  readonly type: AttributeType;
  
  readonly name: string;
  
  readonly label: LocalizedString;
  
  readonly isRequired: boolean;
  
  readonly attributeConstraint: AttributeConstraintEnum;
  
  readonly inputTip?: LocalizedString;
  
  readonly inputHint: TextInputHint;
  
  readonly isSearchable: boolean
}

export interface AttributeDefinitionDraft {
  
  readonly type: AttributeType;
  
  readonly name: string;
  
  readonly label: LocalizedString;
  
  readonly isRequired: boolean;
  
  readonly attributeConstraint?: AttributeConstraintEnum;
  
  readonly inputTip?: LocalizedString;
  
  readonly inputHint?: TextInputHint;
  
  readonly isSearchable?: boolean
}

export interface AttributeLocalizedEnumValue {
  
  readonly key: string;
  
  readonly label: LocalizedString
}

export interface AttributePlainEnumValue {
  
  readonly key: string;
  
  readonly label: string
}

export type AttributeType =
  AttributeBooleanType |
  AttributeDateTimeType |
  AttributeDateType |
  AttributeEnumType |
  AttributeLocalizableTextType |
  AttributeLocalizedEnumType |
  AttributeMoneyType |
  AttributeNestedType |
  AttributeNumberType |
  AttributeReferenceType |
  AttributeSetType |
  AttributeTextType |
  AttributeTimeType
;

export interface AttributeBooleanType {
  readonly name: "boolean";
}

export interface AttributeDateTimeType {
  readonly name: "datetime";
}

export interface AttributeDateType {
  readonly name: "date";
}

export interface AttributeEnumType {
  readonly name: "enum";
  
  readonly values: AttributePlainEnumValue[]
}

export interface AttributeLocalizableTextType {
  readonly name: "ltext";
}

export interface AttributeLocalizedEnumType {
  readonly name: "lenum";
  
  readonly values: AttributeLocalizedEnumValue[]
}

export interface AttributeMoneyType {
  readonly name: "money";
}

export interface AttributeNestedType {
  readonly name: "nested";
  
  readonly typeReference: ProductTypeReference
}

export interface AttributeNumberType {
  readonly name: "number";
}

export interface AttributeReferenceType {
  readonly name: "reference";
  
  readonly referenceTypeId: ReferenceTypeId
}

export interface AttributeSetType {
  readonly name: "set";
  
  readonly elementType: AttributeType
}

export interface AttributeTextType {
  readonly name: "text";
}

export interface AttributeTimeType {
  readonly name: "time";
}

export interface ProductType extends LoggedResource {
  
  readonly key?: string;
  
  readonly name: string;
  
  readonly description: string;
  
  readonly attributes?: AttributeDefinition[]
}

export interface ProductTypeDraft {
  
  readonly key?: string;
  
  readonly name: string;
  
  readonly description: string;
  
  readonly attributes?: AttributeDefinitionDraft[]
}

export interface ProductTypePagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: ProductType[]
}

export interface ProductTypeReference {
  readonly typeId: "product-type";
  
  readonly id: string;
  
  readonly obj?: ProductType
}

export interface ProductTypeResourceIdentifier {
  readonly typeId: "product-type";
  
  readonly id?: string;
  
  readonly key?: string
}

export interface ProductTypeUpdate {
  
  readonly version: number;
  
  readonly actions: ProductTypeUpdateAction[]
}

export type ProductTypeUpdateAction =
  ProductTypeAddAttributeDefinitionAction |
  ProductTypeAddLocalizedEnumValueAction |
  ProductTypeAddPlainEnumValueAction |
  ProductTypeChangeAttributeConstraintAction |
  ProductTypeChangeAttributeNameAction |
  ProductTypeChangeAttributeOrderAction |
  ProductTypeChangeAttributeOrderByNameAction |
  ProductTypeChangeDescriptionAction |
  ProductTypeChangeEnumKeyAction |
  ProductTypeChangeInputHintAction |
  ProductTypeChangeIsSearchableAction |
  ProductTypeChangeLabelAction |
  ProductTypeChangeLocalizedEnumValueLabelAction |
  ProductTypeChangeLocalizedEnumValueOrderAction |
  ProductTypeChangeNameAction |
  ProductTypeChangePlainEnumValueLabelAction |
  ProductTypeChangePlainEnumValueOrderAction |
  ProductTypeRemoveAttributeDefinitionAction |
  ProductTypeRemoveEnumValuesAction |
  ProductTypeSetInputTipAction |
  ProductTypeSetKeyAction
;

export type TextInputHint =
   'SingleLine' |
   'MultiLine';

export interface ProductTypeAddAttributeDefinitionAction {
  readonly action: "addAttributeDefinition";
  
  readonly attribute: AttributeDefinitionDraft
}

export interface ProductTypeAddLocalizedEnumValueAction {
  readonly action: "addLocalizedEnumValue";
  
  readonly attributeName: string;
  
  readonly value: AttributeLocalizedEnumValue
}

export interface ProductTypeAddPlainEnumValueAction {
  readonly action: "addPlainEnumValue";
  
  readonly attributeName: string;
  
  readonly value: AttributePlainEnumValue
}

export interface ProductTypeChangeAttributeConstraintAction {
  readonly action: "changeAttributeConstraint";
  
  readonly newValue: AttributeConstraintEnumDraft;
  
  readonly attributeName: string
}

export interface ProductTypeChangeAttributeNameAction {
  readonly action: "changeAttributeName";
  
  readonly newAttributeName: string;
  
  readonly attributeName: string
}

export interface ProductTypeChangeAttributeOrderAction {
  readonly action: "changeAttributeOrder";
  
  readonly attributes: AttributeDefinition[]
}

export interface ProductTypeChangeAttributeOrderByNameAction {
  readonly action: "changeAttributeOrderByName";
  
  readonly attributeNames: string[]
}

export interface ProductTypeChangeDescriptionAction {
  readonly action: "changeDescription";
  
  readonly description: string
}

export interface ProductTypeChangeEnumKeyAction {
  readonly action: "changeEnumKey";
  
  readonly newKey: string;
  
  readonly attributeName: string;
  
  readonly key: string
}

export interface ProductTypeChangeInputHintAction {
  readonly action: "changeInputHint";
  
  readonly newValue: TextInputHint;
  
  readonly attributeName: string
}

export interface ProductTypeChangeIsSearchableAction {
  readonly action: "changeIsSearchable";
  
  readonly attributeName: string;
  
  readonly isSearchable: boolean
}

export interface ProductTypeChangeLabelAction {
  readonly action: "changeLabel";
  
  readonly attributeName: string;
  
  readonly label: LocalizedString
}

export interface ProductTypeChangeLocalizedEnumValueLabelAction {
  readonly action: "changeLocalizedEnumValueLabel";
  
  readonly newValue: AttributeLocalizedEnumValue;
  
  readonly attributeName: string
}

export interface ProductTypeChangeLocalizedEnumValueOrderAction {
  readonly action: "changeLocalizedEnumValueOrder";
  
  readonly values: AttributeLocalizedEnumValue[];
  
  readonly attributeName: string
}

export interface ProductTypeChangeNameAction {
  readonly action: "changeName";
  
  readonly name: string
}

export interface ProductTypeChangePlainEnumValueLabelAction {
  readonly action: "changePlainEnumValueLabel";
  
  readonly newValue: AttributePlainEnumValue;
  
  readonly attributeName: string
}

export interface ProductTypeChangePlainEnumValueOrderAction {
  readonly action: "changePlainEnumValueOrder";
  
  readonly values: AttributePlainEnumValue[];
  
  readonly attributeName: string
}

export interface ProductTypeRemoveAttributeDefinitionAction {
  readonly action: "removeAttributeDefinition";
  
  readonly name: string
}

export interface ProductTypeRemoveEnumValuesAction {
  readonly action: "removeEnumValues";
  
  readonly keys: string[];
  
  readonly attributeName: string
}

export interface ProductTypeSetInputTipAction {
  readonly action: "setInputTip";
  
  readonly attributeName: string;
  
  readonly inputTip?: LocalizedString
}

export interface ProductTypeSetKeyAction {
  readonly action: "setKey";
  
  readonly key?: string
}