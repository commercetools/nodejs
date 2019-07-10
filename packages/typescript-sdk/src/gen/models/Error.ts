/* tslint:disable */
//Generated file, please do not change

import { Attribute } from './Product'
import { Reference } from './Common'
import { Price } from './Common'
import { LocalizedString } from './Common'
import { CustomerGroupReference } from './CustomerGroup'
import { ChannelReference } from './Channel'
import { ReferenceTypeId } from './Common'


export interface ErrorByExtension {
  
  readonly id: string;
  
  readonly key?: string
}

export type ErrorObject =
  ExtensionBadResponseError |
  ExtensionNoResponseError |
  ExtensionUpdateActionsFailedError |
  InsufficientScopeError |
  InvalidCredentialsError |
  InvalidCurrentPasswordError |
  InvalidFieldError |
  InvalidInputError |
  InvalidItemShippingDetailsError |
  InvalidJsonInputError |
  InvalidOperationError |
  InvalidSubjectError |
  InvalidTokenError |
  MatchingPriceNotFoundError |
  MissingTaxRateForCountryError |
  NoMatchingProductDiscountFoundError |
  OutOfStockError |
  PriceChangedError |
  ReferenceExistsError |
  RequiredFieldError |
  ResourceNotFoundError |
  ShippingMethodDoesNotMatchCartError |
  AccessDeniedError |
  ConcurrentModificationError |
  DiscountCodeNonApplicableError |
  DuplicateAttributeValueError |
  DuplicateAttributeValuesError |
  DuplicateFieldError |
  DuplicateFieldWithConflictingResourceError |
  DuplicatePriceScopeError |
  DuplicateVariantValuesError |
  EnumValueIsUsedError
;

export interface AccessDeniedError {
  readonly code: "access_denied";
  
  readonly message: string
}

export interface ConcurrentModificationError {
  readonly code: "ConcurrentModification";
  
  readonly message: string;
  
  readonly currentVersion?: number
}

export interface DiscountCodeNonApplicableError {
  readonly code: "DiscountCodeNonApplicable";
  
  readonly message: string;
  
  readonly reason?: string;
  
  readonly validityCheckTime?: string;
  
  readonly discountCode?: string;
  
  readonly validUntil?: string;
  
  readonly validFrom?: string;
  
  readonly dicountCodeId?: string
}

export interface DuplicateAttributeValueError {
  readonly code: "DuplicateAttributeValue";
  
  readonly message: string;
  
  readonly attribute: Attribute
}

export interface DuplicateAttributeValuesError {
  readonly code: "DuplicateAttributeValues";
  
  readonly message: string;
  
  readonly attributes: Attribute[]
}

export interface DuplicateFieldError {
  readonly code: "DuplicateField";
  
  readonly message: string;
  
  readonly duplicateValue?: object;
  
  readonly field?: string
}

export interface DuplicateFieldWithConflictingResourceError {
  readonly code: "DuplicateFieldWithConflictingResource";
  
  readonly message: string;
  
  readonly conflictingResource: Reference;
  
  readonly duplicateValue: object;
  
  readonly field: string
}

export interface DuplicatePriceScopeError {
  readonly code: "DuplicatePriceScope";
  
  readonly message: string;
  
  readonly conflictingPrices: Price[]
}

export interface DuplicateVariantValuesError {
  readonly code: "DuplicateVariantValues";
  
  readonly message: string;
  
  readonly variantValues: VariantValues
}

export interface EnumValueIsUsedError {
  readonly code: "EnumValueIsUsed";
  
  readonly message: string
}

export interface ErrorResponse {
  
  readonly statusCode: number;
  
  readonly message: string;
  
  readonly error?: string;
  
  readonly error_description?: string;
  
  readonly errors?: ErrorObject[]
}

export interface ExtensionBadResponseError {
  readonly code: "ExtensionBadResponse";
  
  readonly message: string;
  
  readonly localizedMessage?: LocalizedString;
  
  readonly extensionExtraInfo?: object;
  
  readonly errorByExtension: ErrorByExtension
}

export interface ExtensionNoResponseError {
  readonly code: "ExtensionNoResponse";
  
  readonly message: string;
  
  readonly localizedMessage?: LocalizedString;
  
  readonly extensionExtraInfo?: object;
  
  readonly errorByExtension: ErrorByExtension
}

export interface ExtensionUpdateActionsFailedError {
  readonly code: "ExtensionUpdateActionsFailed";
  
  readonly message: string;
  
  readonly localizedMessage?: LocalizedString;
  
  readonly extensionExtraInfo?: object;
  
  readonly errorByExtension: ErrorByExtension
}

export interface InsufficientScopeError {
  readonly code: "insufficient_scope";
  
  readonly message: string
}

export interface InvalidCredentialsError {
  readonly code: "InvalidCredentials";
  
  readonly message: string
}

export interface InvalidCurrentPasswordError {
  readonly code: "InvalidCurrentPassword";
  
  readonly message: string
}

export interface InvalidFieldError {
  readonly code: "InvalidField";
  
  readonly message: string;
  
  readonly allowedValues?: object[];
  
  readonly field: string;
  
  readonly invalidValue: object
}

export interface InvalidInputError {
  readonly code: "InvalidInput";
  
  readonly message: string
}

export interface InvalidItemShippingDetailsError {
  readonly code: "InvalidItemShippingDetails";
  
  readonly message: string;
  
  readonly itemId: string;
  
  readonly subject: string
}

export interface InvalidJsonInputError {
  readonly code: "InvalidJsonInput";
  
  readonly message: string
}

export interface InvalidOperationError {
  readonly code: "InvalidOperation";
  
  readonly message: string
}

export interface InvalidSubjectError {
  readonly code: "InvalidSubject";
  
  readonly message: string
}

export interface InvalidTokenError {
  readonly code: "invalid_token";
  
  readonly message: string
}

export interface MatchingPriceNotFoundError {
  readonly code: "MatchingPriceNotFound";
  
  readonly message: string;
  
  readonly country?: string;
  
  readonly productId: string;
  
  readonly customerGroup?: CustomerGroupReference;
  
  readonly channel?: ChannelReference;
  
  readonly currency?: string;
  
  readonly variantId: number
}

export interface MissingTaxRateForCountryError {
  readonly code: "MissingTaxRateForCountry";
  
  readonly message: string;
  
  readonly country?: string;
  
  readonly state?: string;
  
  readonly taxCategoryId: string
}

export interface NoMatchingProductDiscountFoundError {
  readonly code: "NoMatchingProductDiscountFound";
  
  readonly message: string
}

export interface OutOfStockError {
  readonly code: "OutOfStock";
  
  readonly message: string;
  
  readonly lineItems: string[];
  
  readonly skus: string[]
}

export interface PriceChangedError {
  readonly code: "PriceChanged";
  
  readonly message: string;
  
  readonly lineItems: string[];
  
  readonly shipping: boolean
}

export interface ReferenceExistsError {
  readonly code: "ReferenceExists";
  
  readonly message: string;
  
  readonly referencedBy?: ReferenceTypeId
}

export interface RequiredFieldError {
  readonly code: "RequiredField";
  
  readonly message: string;
  
  readonly field: string
}

export interface ResourceNotFoundError {
  readonly code: "ResourceNotFound";
  
  readonly message: string
}

export interface ShippingMethodDoesNotMatchCartError {
  readonly code: "ShippingMethodDoesNotMatchCart";
  
  readonly message: string
}

export interface VariantValues {
  
  readonly sku?: string;
  
  readonly prices: Price[];
  
  readonly attributes: Attribute[]
}