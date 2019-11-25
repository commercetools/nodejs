//Generated file, please do not change

import {
  CreatedBy,
  LastModifiedBy,
  LocalizedString,
  LoggedResource,
  Money,
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
  TypedMoney,
} from './common'
import { CustomerReference, CustomerResourceIdentifier } from './customer'
import { StateReference, StateResourceIdentifier } from './state'
import {
  CustomFields,
  CustomFieldsDraft,
  FieldContainer,
  TypeResourceIdentifier,
} from './type'

export interface Payment extends LoggedResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  /**
   *		Present on resources updated after 1/02/2019 except for events not tracked.
   */
  readonly lastModifiedBy?: LastModifiedBy
  /**
   *		Present on resources created after 1/02/2019 except for events not tracked.
   */
  readonly createdBy?: CreatedBy
  /**
   *		A reference to the customer this payment belongs to.
   */
  readonly customer?: CustomerReference
  /**
   *		Identifies payments belonging to an anonymous session (the customer has not signed up/in yet).
   */
  readonly anonymousId?: string
  readonly externalId?: string
  /**
   *		The identifier that is used by the interface that manages the payment (usually the PSP).
   *		Cannot be changed once it has been set.
   *		The combination of this ID and the PaymentMethodInfo `paymentInterface` must be unique.
   */
  readonly interfaceId?: string
  /**
   *		How much money this payment intends to receive from the customer.
   *		The value usually matches the cart or order gross total.
   */
  readonly amountPlanned: TypedMoney
  readonly amountAuthorized?: TypedMoney
  readonly authorizedUntil?: string
  readonly amountPaid?: TypedMoney
  readonly amountRefunded?: TypedMoney
  readonly paymentMethodInfo: PaymentMethodInfo
  readonly paymentStatus: PaymentStatus
  /**
   *		A list of financial transactions of different TransactionTypes with different TransactionStates.
   */
  readonly transactions: Transaction[]
  /**
   *		Interface interactions can be requests sent to the PSP, responses received from the PSP or notifications received from the PSP.
   *		Some interactions may result in a transaction.
   *		If so, the `interactionId` in the Transaction should be set to match the ID of the PSP for the interaction.
   *		Interactions are managed by the PSP integration and are usually neither written nor read by the user facing frontends or other services.
   */
  readonly interfaceInteractions: CustomFields[]
  readonly custom?: CustomFields
  /**
   *		User-specific unique identifier for the payment (max.
   *		256 characters).
   */
  readonly key?: string
}
export interface PaymentDraft {
  /**
   *		A reference to the customer this payment belongs to.
   */
  readonly customer?: CustomerResourceIdentifier
  /**
   *		Identifies payments belonging to an anonymous session (the customer has not signed up/in yet).
   */
  readonly anonymousId?: string
  readonly externalId?: string
  /**
   *		The identifier that is used by the interface that manages the payment (usually the PSP).
   *		Cannot be changed once it has been set.
   *		The combination of this ID and the PaymentMethodInfo `paymentInterface` must be unique.
   */
  readonly interfaceId?: string
  /**
   *		How much money this payment intends to receive from the customer.
   *		The value usually matches the cart or order gross total.
   */
  readonly amountPlanned: Money
  readonly amountAuthorized?: Money
  readonly authorizedUntil?: string
  readonly amountPaid?: Money
  readonly amountRefunded?: Money
  readonly paymentMethodInfo?: PaymentMethodInfo
  readonly paymentStatus?: PaymentStatusDraft
  /**
   *		A list of financial transactions of different TransactionTypes with different TransactionStates.
   */
  readonly transactions?: TransactionDraft[]
  /**
   *		Interface interactions can be requests send to the PSP, responses received from the PSP or notifications received from the PSP.
   *		Some interactions may result in a transaction.
   *		If so, the `interactionId` in the Transaction should be set to match the ID of the PSP for the interaction.
   *		Interactions are managed by the PSP integration and are usually neither written nor read by the user facing frontends or other services.
   */
  readonly interfaceInteractions?: CustomFieldsDraft[]
  readonly custom?: CustomFieldsDraft
  /**
   *		User-specific unique identifier for the payment (max.
   *		256 characters).
   */
  readonly key?: string
}
export interface PaymentMethodInfo {
  /**
   *		The interface that handles the payment (usually a PSP).
   *		Cannot be changed once it has been set.
   *		The combination of Payment`interfaceId` and this field must be unique.
   */
  readonly paymentInterface?: string
  /**
   *		The payment method that is used, e.g.
   *		e.g.
   *		a conventional string representing Credit Card, Cash Advance etc.
   */
  readonly method?: string
  /**
   *		A human-readable, localized name for the payment method, e.g.
   *		'Credit Card'.
   */
  readonly name?: LocalizedString
}
export interface PaymentPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Payment[]
}
export interface PaymentReference {
  readonly typeId: 'payment'
  readonly id: string
  readonly obj?: Payment
}
export interface PaymentResourceIdentifier {
  readonly typeId: 'payment'
  readonly id?: string
  readonly key?: string
}
export interface PaymentStatus {
  /**
   *		A code describing the current status returned by the interface that processes the payment.
   */
  readonly interfaceCode?: string
  /**
   *		A text describing the current status returned by the interface that processes the payment.
   */
  readonly interfaceText?: string
  readonly state?: StateReference
}
export interface PaymentStatusDraft {
  readonly interfaceCode?: string
  readonly interfaceText?: string
  readonly state?: StateResourceIdentifier
}
export interface PaymentUpdate {
  readonly version: number
  readonly actions: PaymentUpdateAction[]
}
export type PaymentUpdateAction =
  | PaymentAddInterfaceInteractionAction
  | PaymentAddTransactionAction
  | PaymentChangeAmountPlannedAction
  | PaymentChangeTransactionInteractionIdAction
  | PaymentChangeTransactionStateAction
  | PaymentChangeTransactionTimestampAction
  | PaymentSetAmountPaidAction
  | PaymentSetAmountRefundedAction
  | PaymentSetAnonymousIdAction
  | PaymentSetAuthorizationAction
  | PaymentSetCustomFieldAction
  | PaymentSetCustomTypeAction
  | PaymentSetCustomerAction
  | PaymentSetExternalIdAction
  | PaymentSetInterfaceIdAction
  | PaymentSetKeyAction
  | PaymentSetMethodInfoInterfaceAction
  | PaymentSetMethodInfoMethodAction
  | PaymentSetMethodInfoNameAction
  | PaymentSetStatusInterfaceCodeAction
  | PaymentSetStatusInterfaceTextAction
  | PaymentTransitionStateAction
export interface Transaction {
  /**
   *		The unique ID of this object.
   */
  readonly id: string
  /**
   *		The time at which the transaction took place.
   */
  readonly timestamp?: string
  /**
   *		The type of this transaction.
   */
  readonly type: TransactionType
  readonly amount: TypedMoney
  /**
   *		The identifier that is used by the interface that managed the transaction (usually the PSP).
   *		If a matching interaction was logged in the `interfaceInteractions` array, the corresponding interaction should be findable with this ID.
   */
  readonly interactionId?: string
  /**
   *		The state of this transaction.
   */
  readonly state?: TransactionState
}
export interface TransactionDraft {
  /**
   *		The time at which the transaction took place.
   */
  readonly timestamp?: string
  /**
   *		The type of this transaction.
   */
  readonly type: TransactionType
  readonly amount: Money
  /**
   *		The identifier that is used by the interface that managed the transaction (usually the PSP).
   *		If a matching interaction was logged in the `interfaceInteractions` array, the corresponding interaction should be findable with this ID.
   */
  readonly interactionId?: string
  /**
   *		The state of this transaction.
   *		If not set, defaults to `Initial`.
   */
  readonly state?: TransactionState
}
export type TransactionState = 'Initial' | 'Pending' | 'Success' | 'Failure'
export type TransactionType =
  | 'Authorization'
  | 'CancelAuthorization'
  | 'Charge'
  | 'Refund'
  | 'Chargeback'
export interface PaymentAddInterfaceInteractionAction {
  readonly action: 'addInterfaceInteraction'
  readonly fields?: FieldContainer
  readonly type: TypeResourceIdentifier
}
export interface PaymentAddTransactionAction {
  readonly action: 'addTransaction'
  readonly transaction: TransactionDraft
}
export interface PaymentChangeAmountPlannedAction {
  readonly action: 'changeAmountPlanned'
  readonly amount: Money
}
export interface PaymentChangeTransactionInteractionIdAction {
  readonly action: 'changeTransactionInteractionId'
  readonly interactionId: string
  readonly transactionId: string
}
export interface PaymentChangeTransactionStateAction {
  readonly action: 'changeTransactionState'
  readonly state: TransactionState
  readonly transactionId: string
}
export interface PaymentChangeTransactionTimestampAction {
  readonly action: 'changeTransactionTimestamp'
  readonly transactionId: string
  readonly timestamp: string
}
export interface PaymentSetAmountPaidAction {
  readonly action: 'setAmountPaid'
  readonly amount?: Money
}
export interface PaymentSetAmountRefundedAction {
  readonly action: 'setAmountRefunded'
  readonly amount?: Money
}
export interface PaymentSetAnonymousIdAction {
  readonly action: 'setAnonymousId'
  readonly anonymousId?: string
}
export interface PaymentSetAuthorizationAction {
  readonly action: 'setAuthorization'
  readonly amount?: Money
  readonly until?: string
}
export interface PaymentSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: object
}
export interface PaymentSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly fields?: FieldContainer
  readonly type?: TypeResourceIdentifier
}
export interface PaymentSetCustomerAction {
  readonly action: 'setCustomer'
  readonly customer?: CustomerResourceIdentifier
}
export interface PaymentSetExternalIdAction {
  readonly action: 'setExternalId'
  readonly externalId?: string
}
export interface PaymentSetInterfaceIdAction {
  readonly action: 'setInterfaceId'
  readonly interfaceId: string
}
export interface PaymentSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
export interface PaymentSetMethodInfoInterfaceAction {
  readonly action: 'setMethodInfoInterface'
  readonly interface: string
}
export interface PaymentSetMethodInfoMethodAction {
  readonly action: 'setMethodInfoMethod'
  readonly method?: string
}
export interface PaymentSetMethodInfoNameAction {
  readonly action: 'setMethodInfoName'
  readonly name?: LocalizedString
}
export interface PaymentSetStatusInterfaceCodeAction {
  readonly action: 'setStatusInterfaceCode'
  readonly interfaceCode?: string
}
export interface PaymentSetStatusInterfaceTextAction {
  readonly action: 'setStatusInterfaceText'
  readonly interfaceText: string
}
export interface PaymentTransitionStateAction {
  readonly action: 'transitionState'
  readonly force?: boolean
  readonly state: StateResourceIdentifier
}
