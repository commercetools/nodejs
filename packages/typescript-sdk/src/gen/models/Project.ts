/* tslint:disable */
//Generated file, please do not change

import { MessageConfiguration } from './Message'
import { ShippingRateTierType } from './ShippingMethod'
import { CustomFieldLocalizedEnumValue } from './Type'
import { MessageConfigurationDraft } from './Message'


export interface ExternalOAuth {
  
  readonly url: string;
  
  readonly authorizationHeader: string
}

export interface Project {
  
  readonly version: number;
  
  readonly key: string;
  
  readonly name: string;
  
  readonly countries: string[];
  
  readonly currencies: string[];
  
  readonly languages: string[];
  
  readonly createdAt: string;
  
  readonly trialUntil?: string;
  
  readonly messages: MessageConfiguration;
  
  readonly shippingRateInputType?: ShippingRateInputType;
  
  readonly externalOAuth?: ExternalOAuth
}

export interface ProjectUpdate {
  
  readonly version: number;
  
  readonly actions: ProjectUpdateAction[]
}

export type ProjectUpdateAction =
  ProjectChangeCountriesAction |
  ProjectChangeCurrenciesAction |
  ProjectChangeLanguagesAction |
  ProjectChangeMessagesConfigurationAction |
  ProjectChangeMessagesEnabledAction |
  ProjectChangeNameAction |
  ProjectSetExternalOAuthAction |
  ProjectSetShippingRateInputTypeAction
;

export type ShippingRateInputType =
  CartClassificationType |
  CartScoreType |
  CartValueType
;

export interface CartClassificationType {
  readonly type: "CartClassification";
  
  readonly values: CustomFieldLocalizedEnumValue[]
}

export interface CartScoreType {
  readonly type: "CartScore";
}

export interface CartValueType {
  readonly type: "CartValue";
}

export interface ProjectChangeCountriesAction {
  readonly action: "changeCountries";
  
  readonly countries: string[]
}

export interface ProjectChangeCurrenciesAction {
  readonly action: "changeCurrencies";
  
  readonly currencies: string[]
}

export interface ProjectChangeLanguagesAction {
  readonly action: "changeLanguages";
  
  readonly languages: string[]
}

export interface ProjectChangeMessagesConfigurationAction {
  readonly action: "changeMessagesConfiguration";
  
  readonly messagesConfiguration: MessageConfigurationDraft
}

export interface ProjectChangeMessagesEnabledAction {
  readonly action: "changeMessagesEnabled";
  
  readonly messagesEnabled: boolean
}

export interface ProjectChangeNameAction {
  readonly action: "changeName";
  
  readonly name: string
}

export interface ProjectSetExternalOAuthAction {
  readonly action: "setExternalOAuth";
  
  readonly externalOAuth?: ExternalOAuth
}

export interface ProjectSetShippingRateInputTypeAction {
  readonly action: "setShippingRateInputType";
  
  readonly shippingRateInputType?: ShippingRateInputType
}