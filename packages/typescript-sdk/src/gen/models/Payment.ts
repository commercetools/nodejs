/* tslint:disable */
//Generated file, please do not change

import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { TypedMoney } from './Common'
import { CustomFields } from './Type'
import { CustomerReference } from './Customer'
import { LoggedResource } from './Common'
import { Money } from './Common'
import { CustomFieldsDraft } from './Type'
import { CustomerResourceIdentifier } from './Customer'
import { LocalizedString } from './Common'
import { ReferenceTypeId } from './Common'
import { Reference } from './Common'
import { ResourceIdentifier } from './Common'
import { StateReference } from './State'
import { StateResourceIdentifier } from './State'
import { FieldContainer } from './Type'
import { TypeResourceIdentifier } from './Type'


export interface Payment extends LoggedResource {
  
  readonly customer?: CustomerReference;
  
  readonly anonymousId?: string;
  
  readonly externalId?: string;
  
  readonly interfaceId?: string;
  
  readonly amountPlanned: TypedMoney;
  
  readonly amountAuthorized?: TypedMoney;
  
  readonly authorizedUntil?: string;
  
  readonly amountPaid?: TypedMoney;
  
  readonly amountRefunded?: TypedMoney;
  
  readonly paymentMethodInfo: PaymentMethodInfo;
  
  readonly paymentStatus: PaymentStatus;
  
  readonly transactions: Transaction[];
  
  readonly interfaceInteractions: CustomFields[];
  
  readonly custom?: CustomFields;
  
  readonly key?: string
}

export interface PaymentDraft {
  
  readonly customer?: CustomerResourceIdentifier;
  
  readonly anonymousId?: string;
  
  readonly externalId?: string;
  
  readonly interfaceId?: string;
  
  readonly amountPlanned: Money;
  
  readonly amountAuthorized?: Money;
  
  readonly authorizedUntil?: string;
  
  readonly amountPaid?: Money;
  
  readonly amountRefunded?: Money;
  
  readonly paymentMethodInfo?: PaymentMethodInfo;
  
  readonly paymentStatus?: PaymentStatusDraft;
  
  readonly transactions?: TransactionDraft[];
  
  readonly interfaceInteractions?: CustomFieldsDraft[];
  
  readonly custom?: CustomFieldsDraft;
  
  readonly key?: string
}

export interface PaymentMethodInfo {
  
  readonly paymentInterface?: string;
  
  readonly method?: string;
  
  readonly name?: LocalizedString
}

export interface PaymentPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: Payment[]
}

export interface PaymentReference {
  readonly typeId: "payment";
  
  readonly id: string;
  
  readonly obj?: Payment
}

export interface PaymentResourceIdentifier {
  readonly typeId: "payment";
  
  readonly id?: string;
  
  readonly key?: string
}

export interface PaymentStatus {
  
  readonly interfaceCode?: string;
  
  readonly interfaceText?: string;
  
  readonly state?: StateReference
}

export interface PaymentStatusDraft {
  
  readonly interfaceCode?: string;
  
  readonly interfaceText?: string;
  
  readonly state?: StateResourceIdentifier
}

export interface PaymentUpdate {
  
  readonly version: number;
  
  readonly actions: PaymentUpdateAction[]
}

export type PaymentUpdateAction =
  PaymentAddInterfaceInteractionAction |
  PaymentAddTransactionAction |
  PaymentChangeAmountPlannedAction |
  PaymentChangeTransactionInteractionIdAction |
  PaymentChangeTransactionStateAction |
  PaymentChangeTransactionTimestampAction |
  PaymentSetAmountPaidAction |
  PaymentSetAmountRefundedAction |
  PaymentSetAnonymousIdAction |
  PaymentSetAuthorizationAction |
  PaymentSetCustomFieldAction |
  PaymentSetCustomTypeAction |
  PaymentSetCustomerAction |
  PaymentSetExternalIdAction |
  PaymentSetInterfaceIdAction |
  PaymentSetKeyAction |
  PaymentSetMethodInfoInterfaceAction |
  PaymentSetMethodInfoMethodAction |
  PaymentSetMethodInfoNameAction |
  PaymentSetStatusInterfaceCodeAction |
  PaymentSetStatusInterfaceTextAction |
  PaymentTransitionStateAction
;

export interface Transaction {
  
  readonly id: string;
  
  readonly timestamp?: string;
  
  readonly type: TransactionType;
  
  readonly amount: TypedMoney;
  
  readonly interactionId?: string;
  
  readonly state?: TransactionState
}

export interface TransactionDraft {
  
  readonly timestamp?: string;
  
  readonly type: TransactionType;
  
  readonly amount: Money;
  
  readonly interactionId?: string;
  
  readonly state?: TransactionState
}

export type TransactionState =
   'Initial' |
   'Pending' |
   'Success' |
   'Failure';

export type TransactionType =
   'Authorization' |
   'CancelAuthorization' |
   'Charge' |
   'Refund' |
   'Chargeback';

export interface PaymentAddInterfaceInteractionAction {
  readonly action: "addInterfaceInteraction";
  
  readonly fields?: FieldContainer;
  
  readonly type: TypeResourceIdentifier
}

export interface PaymentAddTransactionAction {
  readonly action: "addTransaction";
  
  readonly transaction: TransactionDraft
}

export interface PaymentChangeAmountPlannedAction {
  readonly action: "changeAmountPlanned";
  
  readonly amount: Money
}

export interface PaymentChangeTransactionInteractionIdAction {
  readonly action: "changeTransactionInteractionId";
  
  readonly interactionId: string;
  
  readonly transactionId: string
}

export interface PaymentChangeTransactionStateAction {
  readonly action: "changeTransactionState";
  
  readonly state: TransactionState;
  
  readonly transactionId: string
}

export interface PaymentChangeTransactionTimestampAction {
  readonly action: "changeTransactionTimestamp";
  
  readonly transactionId: string;
  
  readonly timestamp: string
}

export interface PaymentSetAmountPaidAction {
  readonly action: "setAmountPaid";
  
  readonly amount?: Money
}

export interface PaymentSetAmountRefundedAction {
  readonly action: "setAmountRefunded";
  
  readonly amount?: Money
}

export interface PaymentSetAnonymousIdAction {
  readonly action: "setAnonymousId";
  
  readonly anonymousId?: string
}

export interface PaymentSetAuthorizationAction {
  readonly action: "setAuthorization";
  
  readonly amount?: Money;
  
  readonly until?: string
}

export interface PaymentSetCustomFieldAction {
  readonly action: "setCustomField";
  
  readonly name: string;
  
  readonly value?: object
}

export interface PaymentSetCustomTypeAction {
  readonly action: "setCustomType";
  
  readonly fields?: FieldContainer;
  
  readonly type?: TypeResourceIdentifier
}

export interface PaymentSetCustomerAction {
  readonly action: "setCustomer";
  
  readonly customer?: CustomerResourceIdentifier
}

export interface PaymentSetExternalIdAction {
  readonly action: "setExternalId";
  
  readonly externalId?: string
}

export interface PaymentSetInterfaceIdAction {
  readonly action: "setInterfaceId";
  
  readonly interfaceId: string
}

export interface PaymentSetKeyAction {
  readonly action: "setKey";
  
  readonly key?: string
}

export interface PaymentSetMethodInfoInterfaceAction {
  readonly action: "setMethodInfoInterface";
  
  readonly interface: string
}

export interface PaymentSetMethodInfoMethodAction {
  readonly action: "setMethodInfoMethod";
  
  readonly method?: string
}

export interface PaymentSetMethodInfoNameAction {
  readonly action: "setMethodInfoName";
  
  readonly name?: LocalizedString
}

export interface PaymentSetStatusInterfaceCodeAction {
  readonly action: "setStatusInterfaceCode";
  
  readonly interfaceCode?: string
}

export interface PaymentSetStatusInterfaceTextAction {
  readonly action: "setStatusInterfaceText";
  
  readonly interfaceText: string
}

export interface PaymentTransitionStateAction {
  readonly action: "transitionState";
  
  readonly force?: boolean;
  
  readonly state: StateResourceIdentifier
}