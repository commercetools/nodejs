//Generated file, please do not change

import {
  Address,
  CreatedBy,
  LastModifiedBy,
  LoggedResource,
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
} from './common'
import {
  CustomerGroupReference,
  CustomerGroupResourceIdentifier,
} from './customer-group'
import { StoreKeyReference, StoreResourceIdentifier } from './store'
import {
  CustomFields,
  CustomFieldsDraft,
  FieldContainer,
  TypeResourceIdentifier,
} from './type'

export type AnonymousCartSignInMode =
  | 'MergeWithExistingCustomerCart'
  | 'UseAsNewActiveCustomerCart'
export interface Customer extends LoggedResource {
  /**
   *	The unique ID of the customer.
   */
  readonly id: string
  /**
   *	The current version of the customer.
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
   *	The customer number can be used to create a more human-readable (in contrast to ID) identifier for the customer.
   *	It should be unique across a project.
   *	Once the field was set it cannot be changed anymore.
   */
  readonly customerNumber?: string
  /**
   *	The customer's email address and the main identifier of uniqueness for a customer account.
   *	Email addresses are either unique to the store they're specified for, _or_ for the entire project.
   *	For more information, see Email uniquenes.
   */
  readonly email: string
  readonly password: string
  readonly firstName?: string
  readonly lastName?: string
  readonly middleName?: string
  readonly title?: string
  readonly dateOfBirth?: string
  readonly companyName?: string
  readonly vatId?: string
  /**
   *	The addresses have unique IDs in the addresses list
   */
  readonly addresses: Address[]
  /**
   *	The address ID in the addresses list
   */
  readonly defaultShippingAddressId?: string
  /**
   *	The IDs from the addresses list which are used as shipping addresses
   */
  readonly shippingAddressIds?: string[]
  /**
   *	The address ID in the addresses list
   */
  readonly defaultBillingAddressId?: string
  /**
   *	The IDs from the addresses list which are used as billing addresses
   */
  readonly billingAddressIds?: string[]
  readonly isEmailVerified: boolean
  readonly externalId?: string
  readonly customerGroup?: CustomerGroupReference
  readonly custom?: CustomFields
  readonly locale?: string
  readonly salutation?: string
  /**
   *	User-specific unique identifier for a customer.
   *	Must be unique across a project.
   *	The field can be reset using the Set Key UpdateAction
   */
  readonly key?: string
  /**
   *	References to the stores the customer account is associated with.
   *	If no stores are specified, the customer is a global customer, and can log in using the Password Flow for global Customers.
   *	If one or more stores are specified, the customer can only log in using the Password Flow for Customers in a Store for those specific stores.
   */
  readonly stores?: StoreKeyReference[]
}
export interface CustomerChangePassword {
  readonly id: string
  readonly version: number
  readonly currentPassword: string
  readonly newPassword: string
}
export interface CustomerCreateEmailToken {
  readonly id: string
  readonly version?: number
  readonly ttlMinutes: number
}
export interface CustomerCreatePasswordResetToken {
  readonly email: string
  readonly ttlMinutes?: number
}
export interface CustomerDraft {
  /**
   *	String that uniquely identifies a customer.
   *	It can be used to create more human-readable (in contrast to ID) identifier for the customer.
   *	It should be **unique** across a project.
   *	Once it's set it cannot be changed.
   */
  readonly customerNumber?: string
  /**
   *	The customer's email address and the main identifier of uniqueness for a customer account.
   *	Email addresses are either unique to the store they're specified for, _or_ for the entire project, and are case insensitive.
   *	For more information, see Email uniquenes.
   */
  readonly email: string
  readonly password: string
  readonly firstName?: string
  readonly lastName?: string
  readonly middleName?: string
  readonly title?: string
  /**
   *	Identifies a single cart that will be assigned to the new customer account.
   */
  readonly anonymousCartId?: string
  /**
   *	Identifies carts and orders belonging to an anonymous session that will be assigned to the new customer account.
   */
  readonly anonymousId?: string
  readonly dateOfBirth?: string
  readonly companyName?: string
  readonly vatId?: string
  /**
   *	Sets the ID of each address to be unique in the addresses list.
   */
  readonly addresses?: Address[]
  /**
   *	The index of the address in the addresses array.
   *	The `defaultShippingAddressId` of the customer will be set to the ID of that address.
   */
  readonly defaultShippingAddress?: number
  /**
   *	The indices of the shipping addresses in the addresses array.
   *	The `shippingAddressIds` of the Customer will be set to the IDs of that addresses.
   */
  readonly shippingAddresses?: number[]
  /**
   *	The index of the address in the addresses array.
   *	The `defaultBillingAddressId` of the customer will be set to the ID of that address.
   */
  readonly defaultBillingAddress?: number
  /**
   *	The indices of the billing addresses in the addresses array.
   *	The `billingAddressIds` of the customer will be set to the IDs of that addresses.
   */
  readonly billingAddresses?: number[]
  readonly isEmailVerified?: boolean
  readonly externalId?: string
  readonly customerGroup?: CustomerGroupResourceIdentifier
  /**
   *	The custom fields.
   */
  readonly custom?: CustomFieldsDraft
  /**
   *	Must be one of the languages supported for this project
   */
  readonly locale?: string
  readonly salutation?: string
  /**
   *	User-specific unique identifier for a customer.
   *	Must be unique across a project.
   *	The field can be reset using the Set Key UpdateAction
   */
  readonly key?: string
  /**
   *	References to the stores the customer account is associated with.
   *	If no stores are specified, the customer is a global customer, and can log in using the Password Flow for global Customers.
   *	If one or more stores are specified, the customer can only log in using the Password Flow for Customers in a Store for those specific stores.
   */
  readonly stores?: StoreResourceIdentifier[]
}
export interface CustomerEmailVerify {
  readonly version?: number
  readonly tokenValue: string
}
export interface CustomerPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Customer[]
}
export interface CustomerReference {
  readonly typeId: 'customer'
  readonly id: string
  readonly obj?: Customer
}
export interface CustomerResetPassword {
  readonly tokenValue: string
  readonly newPassword: string
  readonly version?: number
}
export interface CustomerResourceIdentifier {
  readonly typeId: 'customer'
  readonly id?: string
  readonly key?: string
}
export interface CustomerSignInResult {
  readonly customer: Customer
  /**
   *	A cart that is associated to the customer.
   *	Empty if the customer does not have a cart yet.
   */
  readonly cart?: object
}
export interface CustomerSignin {
  readonly email: string
  readonly password: string
  readonly anonymousCartId?: string
  readonly anonymousCartSignInMode?: AnonymousCartSignInMode
  readonly anonymousId?: string
  readonly updateProductData?: boolean
}
export interface CustomerToken {
  readonly id: string
  readonly createdAt: string
  readonly lastModifiedAt?: string
  readonly customerId: string
  readonly expiresAt: string
  readonly value: string
}
export interface CustomerUpdate {
  readonly version: number
  readonly actions: CustomerUpdateAction[]
}
export type CustomerUpdateAction =
  | CustomerAddAddressAction
  | CustomerAddBillingAddressIdAction
  | CustomerAddShippingAddressIdAction
  | CustomerChangeAddressAction
  | CustomerChangeEmailAction
  | CustomerRemoveAddressAction
  | CustomerRemoveBillingAddressIdAction
  | CustomerRemoveShippingAddressIdAction
  | CustomerSetCompanyNameAction
  | CustomerSetCustomFieldAction
  | CustomerSetCustomTypeAction
  | CustomerSetCustomerGroupAction
  | CustomerSetCustomerNumberAction
  | CustomerSetDateOfBirthAction
  | CustomerSetDefaultBillingAddressAction
  | CustomerSetDefaultShippingAddressAction
  | CustomerSetExternalIdAction
  | CustomerSetFirstNameAction
  | CustomerSetKeyAction
  | CustomerSetLastNameAction
  | CustomerSetLocaleAction
  | CustomerSetMiddleNameAction
  | CustomerSetSalutationAction
  | CustomerSetTitleAction
  | CustomerSetVatIdAction
export interface CustomerAddAddressAction {
  readonly action: 'addAddress'
  readonly address: Address
}
export interface CustomerAddBillingAddressIdAction {
  readonly action: 'addBillingAddressId'
  readonly addressId: string
}
export interface CustomerAddShippingAddressIdAction {
  readonly action: 'addShippingAddressId'
  readonly addressId: string
}
export interface CustomerChangeAddressAction {
  readonly action: 'changeAddress'
  readonly address: Address
  readonly addressId: string
}
export interface CustomerChangeEmailAction {
  readonly action: 'changeEmail'
  readonly email: string
}
export interface CustomerRemoveAddressAction {
  readonly action: 'removeAddress'
  readonly addressId: string
}
export interface CustomerRemoveBillingAddressIdAction {
  readonly action: 'removeBillingAddressId'
  readonly addressId: string
}
export interface CustomerRemoveShippingAddressIdAction {
  readonly action: 'removeShippingAddressId'
  readonly addressId: string
}
export interface CustomerSetCompanyNameAction {
  readonly action: 'setCompanyName'
  /**
   *	If not defined, the company name is unset.
   */
  readonly companyName?: string
}
export interface CustomerSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: object
}
export interface CustomerSetCustomTypeAction {
  readonly action: 'setCustomType'
  /**
   *	A valid JSON object, based on the FieldDefinitions of the Type.
   *	Sets the custom fields to this value.
   */
  readonly fields?: FieldContainer
  /**
   *	If absent, the custom type and any existing custom fields are removed.
   */
  readonly type?: TypeResourceIdentifier
}
export interface CustomerSetCustomerGroupAction {
  readonly action: 'setCustomerGroup'
  /**
   *	If not defined, the customer group is unset.
   */
  readonly customerGroup?: CustomerGroupResourceIdentifier
}
export interface CustomerSetCustomerNumberAction {
  readonly action: 'setCustomerNumber'
  /**
   *	It should be **unique** across a project.
   *	Once it's set, it cannot be changed.
   */
  readonly customerNumber?: string
}
export interface CustomerSetDateOfBirthAction {
  readonly action: 'setDateOfBirth'
  /**
   *	If not defined, the date of birth is unset.
   */
  readonly dateOfBirth?: string
}
export interface CustomerSetDefaultBillingAddressAction {
  readonly action: 'setDefaultBillingAddress'
  /**
   *	If not defined, the customer's `defaultBillingAddress` is unset.
   */
  readonly addressId?: string
}
export interface CustomerSetDefaultShippingAddressAction {
  readonly action: 'setDefaultShippingAddress'
  /**
   *	If not defined, the customer's `defaultShippingAddress` is unset.
   */
  readonly addressId?: string
}
export interface CustomerSetExternalIdAction {
  readonly action: 'setExternalId'
  /**
   *	If not defined, the external ID is unset.
   */
  readonly externalId?: string
}
export interface CustomerSetFirstNameAction {
  readonly action: 'setFirstName'
  readonly firstName?: string
}
export interface CustomerSetKeyAction {
  readonly action: 'setKey'
  /**
   *	If `key` is absent or `null`, this field will be removed if it exists.
   */
  readonly key?: string
}
export interface CustomerSetLastNameAction {
  readonly action: 'setLastName'
  readonly lastName?: string
}
export interface CustomerSetLocaleAction {
  readonly action: 'setLocale'
  readonly locale?: string
}
export interface CustomerSetMiddleNameAction {
  readonly action: 'setMiddleName'
  readonly middleName?: string
}
export interface CustomerSetSalutationAction {
  readonly action: 'setSalutation'
  readonly salutation?: string
}
export interface CustomerSetTitleAction {
  readonly action: 'setTitle'
  readonly title?: string
}
export interface CustomerSetVatIdAction {
  readonly action: 'setVatId'
  /**
   *	If not defined, the vat Id is unset.
   */
  readonly vatId?: string
}
