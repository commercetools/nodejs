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

import { MessageConfiguration, MessageConfigurationDraft } from 'models/message'
import { ShippingRateTierType } from 'models/shipping-method'
import { CustomFieldLocalizedEnumValue } from 'models/type'

export interface ExternalOAuth {
  readonly url: string
  readonly authorizationHeader: string
}
export interface Project {
  /**
   *	The current version of the project.
   */
  readonly version: number
  /**
   *	The unique key of the project.
   */
  readonly key: string
  /**
   *	The name of the project.
   */
  readonly name: string
  /**
   *	A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   */
  readonly countries: string[]
  /**
   *	A three-digit currency code as per [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
   */
  readonly currencies: string[]
  readonly languages: string[]
  readonly createdAt: string
  /**
   *	The time is in the format Year-Month `YYYY-MM`.
   */
  readonly trialUntil?: string
  readonly messages: MessageConfiguration
  readonly shippingRateInputType?: ShippingRateInputType
  readonly externalOAuth?: ExternalOAuth
}
export interface ProjectUpdate {
  readonly version: number
  readonly actions: ProjectUpdateAction[]
}
export type ProjectUpdateAction =
  | ProjectChangeCountriesAction
  | ProjectChangeCurrenciesAction
  | ProjectChangeLanguagesAction
  | ProjectChangeMessagesConfigurationAction
  | ProjectChangeMessagesEnabledAction
  | ProjectChangeNameAction
  | ProjectSetExternalOAuthAction
  | ProjectSetShippingRateInputTypeAction
export type ShippingRateInputType =
  | CartClassificationType
  | CartScoreType
  | CartValueType
export interface CartClassificationType {
  readonly type: 'CartClassification'
  readonly values: CustomFieldLocalizedEnumValue[]
}
export interface CartScoreType {
  readonly type: 'CartScore'
}
export interface CartValueType {
  readonly type: 'CartValue'
}
export interface ProjectChangeCountriesAction {
  readonly action: 'changeCountries'
  /**
   *	A two-digit country code as per country code.
   */
  readonly countries: string[]
}
export interface ProjectChangeCurrenciesAction {
  readonly action: 'changeCurrencies'
  /**
   *	A three-digit currency code as per currency code.
   */
  readonly currencies: string[]
}
export interface ProjectChangeLanguagesAction {
  readonly action: 'changeLanguages'
  /**
   *	 .
   */
  readonly languages: string[]
}
export interface ProjectChangeMessagesConfigurationAction {
  readonly action: 'changeMessagesConfiguration'
  readonly messagesConfiguration: MessageConfigurationDraft
}
export interface ProjectChangeMessagesEnabledAction {
  readonly action: 'changeMessagesEnabled'
  readonly messagesEnabled: boolean
}
export interface ProjectChangeNameAction {
  readonly action: 'changeName'
  readonly name: string
}
export interface ProjectSetExternalOAuthAction {
  readonly action: 'setExternalOAuth'
  /**
   *	If you do not provide the `externalOAuth` field or provide a value
   *	of `null`, the update action unsets the External OAuth provider.
   *
   */
  readonly externalOAuth?: ExternalOAuth
}
export interface ProjectSetShippingRateInputTypeAction {
  readonly action: 'setShippingRateInputType'
  /**
   *	If not set, removes existing shippingRateInputType.
   */
  readonly shippingRateInputType?: ShippingRateInputType
}
