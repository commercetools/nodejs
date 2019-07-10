/* tslint:disable */
//Generated file, please do not change

import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { OrderReference } from './Order'
import { CustomFields } from './Type'
import { StagedOrderUpdateAction } from './Order'
import { LoggedResource } from './Common'
import { CustomFieldsDraft } from './Type'
import { ReferenceTypeId } from './Common'
import { Reference } from './Common'
import { ResourceIdentifier } from './Common'
import { ErrorObject } from './Error'
import { MessagePayload } from './Message'
import { Money } from './Common'
import { TaxedPrice } from './Cart'
import { ShipmentState } from './Order'
import { ShippingRateInput } from './Cart'
import { CartOrigin } from './Cart'
import { ShippingInfo } from './Cart'
import { CartReference } from './Cart'
import { InventoryMode } from './Cart'
import { OrderState } from './Order'
import { ReturnInfo } from './Order'
import { LineItem } from './Cart'
import { CustomLineItem } from './Cart'
import { Address } from './Common'
import { StateReference } from './State'
import { PaymentState } from './Order'
import { DiscountCodeInfo } from './Cart'
import { CustomerGroupReference } from './CustomerGroup'
import { TaxCalculationMode } from './Cart'
import { StoreKeyReference } from './Store'
import { SyncInfo } from './Order'
import { RoundingMode } from './Cart'
import { TaxMode } from './Cart'
import { PaymentInfo } from './Order'
import { Order } from './Order'
import { TypeResourceIdentifier } from './Type'
import { ExternalTaxRateDraft } from './Cart'
import { LocalizedString } from './Common'
import { TaxCategoryResourceIdentifier } from './TaxCategory'
import { DeliveryItem } from './Order'
import { ParcelDraft } from './Order'
import { ItemShippingDetailsDraft } from './Cart'
import { ExternalLineItemTotalPrice } from './Cart'
import { ChannelResourceIdentifier } from './Channel'
import { TrackingData } from './Order'
import { ParcelMeasurements } from './Order'
import { PaymentResourceIdentifier } from './Payment'
import { ReturnItemDraft } from './Order'
import { ShoppingListResourceIdentifier } from './ShoppingList'
import { ItemState } from './Order'
import { DiscountCodeReference } from './DiscountCode'
import { FieldContainer } from './Type'
import { ExternalTaxAmountDraft } from './Cart'
import { ShippingRateDraft } from './ShippingMethod'
import { CustomerGroupResourceIdentifier } from './CustomerGroup'
import { TaxPortion } from './Cart'
import { ReturnPaymentState } from './Order'
import { ReturnShipmentState } from './Order'
import { ShippingMethodResourceIdentifier } from './ShippingMethod'
import { ShippingRateInputDraft } from './Cart'
import { StateResourceIdentifier } from './State'


export interface OrderEdit extends LoggedResource {
  
  readonly createdAt: string;
  
  readonly lastModifiedAt: string;
  
  readonly key?: string;
  
  readonly resource: OrderReference;
  
  readonly stagedActions: StagedOrderUpdateAction[];
  
  readonly custom?: CustomFields;
  
  readonly result: OrderEditResult;
  
  readonly comment?: string
}

export interface OrderEditApply {
  
  readonly editVersion: number;
  
  readonly resourceVersion: number
}

export interface OrderEditDraft {
  
  readonly key?: string;
  
  readonly resource: OrderReference;
  
  readonly stagedActions?: StagedOrderUpdateAction[];
  
  readonly custom?: CustomFieldsDraft;
  
  readonly comment?: string;
  
  readonly dryRun?: boolean
}

export interface OrderEditPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: OrderEdit[]
}

export interface OrderEditReference {
  readonly typeId: "order-edit";
  
  readonly id: string;
  
  readonly obj?: OrderEdit
}

export interface OrderEditResourceIdentifier {
  readonly typeId: "order-edit";
  
  readonly id?: string;
  
  readonly key?: string
}

export type OrderEditResult =
  OrderEditApplied |
  OrderEditNotProcessed |
  OrderEditPreviewFailure |
  OrderEditPreviewSuccess
;

export interface OrderEditApplied {
  readonly type: "Applied";
  
  readonly excerptAfterEdit: OrderExcerpt;
  
  readonly excerptBeforeEdit: OrderExcerpt;
  
  readonly appliedAt: string
}

export interface OrderEditNotProcessed {
  readonly type: "NotProcessed";
}

export interface OrderEditPreviewFailure {
  readonly type: "PreviewFailure";
  
  readonly errors: ErrorObject[]
}

export interface OrderEditPreviewSuccess {
  readonly type: "PreviewSuccess";
  
  readonly preview: StagedOrder;
  
  readonly messagePayloads: MessagePayload[]
}

export interface OrderEditUpdate {
  
  readonly version: number;
  
  readonly actions: OrderEditUpdateAction[];
  
  readonly dryRun: boolean
}

export type OrderEditUpdateAction =
  OrderEditAddStagedActionAction |
  OrderEditSetCommentAction |
  OrderEditSetCustomFieldAction |
  OrderEditSetCustomTypeAction |
  OrderEditSetKeyAction |
  OrderEditSetStagedActionsAction
;

export interface OrderExcerpt {
  
  readonly totalPrice: Money;
  
  readonly taxedPrice?: TaxedPrice;
  
  readonly version: number
}

export interface StagedOrder extends Order {
}

export interface OrderEditAddStagedActionAction {
  readonly action: "addStagedAction";
  
  readonly stagedAction: StagedOrderUpdateAction
}

export interface OrderEditSetCommentAction {
  readonly action: "setComment";
  
  readonly comment?: string
}

export interface OrderEditSetCustomFieldAction {
  readonly action: "setCustomField";
  
  readonly name: string;
  
  readonly value?: object
}

export interface OrderEditSetCustomTypeAction {
  readonly action: "setCustomType";
  
  readonly fields?: object;
  
  readonly type?: TypeResourceIdentifier
}

export interface OrderEditSetKeyAction {
  readonly action: "setKey";
  
  readonly key?: string
}

export interface OrderEditSetStagedActionsAction {
  readonly action: "setStagedActions";
  
  readonly stagedActions: StagedOrderUpdateAction[]
}

export interface StagedOrderAddCustomLineItemAction {
  readonly action: "addCustomLineItem";
  
  readonly externalTaxRate?: ExternalTaxRateDraft;
  
  readonly quantity?: number;
  
  readonly money: Money;
  
  readonly custom?: CustomFieldsDraft;
  
  readonly name: LocalizedString;
  
  readonly slug: string;
  
  readonly taxCategory?: TaxCategoryResourceIdentifier
}

export interface StagedOrderAddDeliveryAction {
  readonly action: "addDelivery";
  
  readonly address?: Address;
  
  readonly items?: DeliveryItem[];
  
  readonly parcels?: ParcelDraft[]
}

export interface StagedOrderAddDiscountCodeAction {
  readonly action: "addDiscountCode";
  
  readonly code: string
}

export interface StagedOrderAddItemShippingAddressAction {
  readonly action: "addItemShippingAddress";
  
  readonly address: Address
}

export interface StagedOrderAddLineItemAction {
  readonly action: "addLineItem";
  
  readonly quantity?: number;
  
  readonly externalTaxRate?: ExternalTaxRateDraft;
  
  readonly shippingDetails?: ItemShippingDetailsDraft;
  
  readonly productId?: string;
  
  readonly externalTotalPrice?: ExternalLineItemTotalPrice;
  
  readonly custom?: CustomFieldsDraft;
  
  readonly supplyChannel?: ChannelResourceIdentifier;
  
  readonly variantId?: number;
  
  readonly sku?: string;
  
  readonly distributionChannel?: ChannelResourceIdentifier;
  
  readonly externalPrice?: Money
}

export interface StagedOrderAddParcelToDeliveryAction {
  readonly action: "addParcelToDelivery";
  
  readonly deliveryId: string;
  
  readonly items?: DeliveryItem[];
  
  readonly trackingData?: TrackingData;
  
  readonly measurements?: ParcelMeasurements
}

export interface StagedOrderAddPaymentAction {
  readonly action: "addPayment";
  
  readonly payment: PaymentResourceIdentifier
}

export interface StagedOrderAddReturnInfoAction {
  readonly action: "addReturnInfo";
  
  readonly returnDate?: string;
  
  readonly returnTrackingId?: string;
  
  readonly items: ReturnItemDraft[]
}

export interface StagedOrderAddShoppingListAction {
  readonly action: "addShoppingList";
  
  readonly shoppingList: ShoppingListResourceIdentifier;
  
  readonly supplyChannel?: ChannelResourceIdentifier;
  
  readonly distributionChannel?: ChannelResourceIdentifier
}

export interface StagedOrderChangeCustomLineItemMoneyAction {
  readonly action: "changeCustomLineItemMoney";
  
  readonly customLineItemId: string;
  
  readonly money: Money
}

export interface StagedOrderChangeCustomLineItemQuantityAction {
  readonly action: "changeCustomLineItemQuantity";
  
  readonly customLineItemId: string;
  
  readonly quantity: number
}

export interface StagedOrderChangeLineItemQuantityAction {
  readonly action: "changeLineItemQuantity";
  
  readonly quantity: number;
  
  readonly externalTotalPrice?: ExternalLineItemTotalPrice;
  
  readonly lineItemId: string;
  
  readonly externalPrice?: Money
}

export interface StagedOrderChangeOrderStateAction {
  readonly action: "changeOrderState";
  
  readonly orderState: OrderState
}

export interface StagedOrderChangePaymentStateAction {
  readonly action: "changePaymentState";
  
  readonly paymentState?: PaymentState
}

export interface StagedOrderChangeShipmentStateAction {
  readonly action: "changeShipmentState";
  
  readonly shipmentState?: ShipmentState
}

export interface StagedOrderChangeTaxCalculationModeAction {
  readonly action: "changeTaxCalculationMode";
  
  readonly taxCalculationMode: TaxCalculationMode
}

export interface StagedOrderChangeTaxModeAction {
  readonly action: "changeTaxMode";
  
  readonly taxMode: TaxMode
}

export interface StagedOrderChangeTaxRoundingModeAction {
  readonly action: "changeTaxRoundingMode";
  
  readonly taxRoundingMode: RoundingMode
}

export interface StagedOrderImportCustomLineItemStateAction {
  readonly action: "importCustomLineItemState";
  
  readonly customLineItemId: string;
  
  readonly state: ItemState[]
}

export interface StagedOrderImportLineItemStateAction {
  readonly action: "importLineItemState";
  
  readonly lineItemId: string;
  
  readonly state: ItemState[]
}

export interface StagedOrderRemoveCustomLineItemAction {
  readonly action: "removeCustomLineItem";
  
  readonly customLineItemId: string
}

export interface StagedOrderRemoveDeliveryAction {
  readonly action: "removeDelivery";
  
  readonly deliveryId: string
}

export interface StagedOrderRemoveDiscountCodeAction {
  readonly action: "removeDiscountCode";
  
  readonly discountCode: DiscountCodeReference
}

export interface StagedOrderRemoveItemShippingAddressAction {
  readonly action: "removeItemShippingAddress";
  
  readonly addressKey: string
}

export interface StagedOrderRemoveLineItemAction {
  readonly action: "removeLineItem";
  
  readonly quantity?: number;
  
  readonly externalTotalPrice?: ExternalLineItemTotalPrice;
  
  readonly lineItemId: string;
  
  readonly shippingDetailsToRemove?: ItemShippingDetailsDraft;
  
  readonly externalPrice?: Money
}

export interface StagedOrderRemoveParcelFromDeliveryAction {
  readonly action: "removeParcelFromDelivery";
  
  readonly parcelId: string
}

export interface StagedOrderRemovePaymentAction {
  readonly action: "removePayment";
  
  readonly payment: PaymentResourceIdentifier
}

export interface StagedOrderSetBillingAddressAction {
  readonly action: "setBillingAddress";
  
  readonly address?: Address
}

export interface StagedOrderSetCountryAction {
  readonly action: "setCountry";
  
  readonly country?: string
}

export interface StagedOrderSetCustomFieldAction {
  readonly action: "setCustomField";
  
  readonly name: string;
  
  readonly value?: object
}

export interface StagedOrderSetCustomLineItemCustomFieldAction {
  readonly action: "setCustomLineItemCustomField";
  
  readonly customLineItemId: string;
  
  readonly name: string;
  
  readonly value?: object
}

export interface StagedOrderSetCustomLineItemCustomTypeAction {
  readonly action: "setCustomLineItemCustomType";
  
  readonly customLineItemId: string;
  
  readonly fields?: FieldContainer;
  
  readonly type?: TypeResourceIdentifier
}

export interface StagedOrderSetCustomLineItemShippingDetailsAction {
  readonly action: "setCustomLineItemShippingDetails";
  
  readonly customLineItemId: string;
  
  readonly shippingDetails?: ItemShippingDetailsDraft
}

export interface StagedOrderSetCustomLineItemTaxAmountAction {
  readonly action: "setCustomLineItemTaxAmount";
  
  readonly customLineItemId: string;
  
  readonly externalTaxAmount?: ExternalTaxAmountDraft
}

export interface StagedOrderSetCustomLineItemTaxRateAction {
  readonly action: "setCustomLineItemTaxRate";
  
  readonly customLineItemId: string;
  
  readonly externalTaxRate?: ExternalTaxRateDraft
}

export interface StagedOrderSetCustomShippingMethodAction {
  readonly action: "setCustomShippingMethod";
  
  readonly shippingRate: ShippingRateDraft;
  
  readonly externalTaxRate?: ExternalTaxRateDraft;
  
  readonly shippingMethodName: string;
  
  readonly taxCategory?: TaxCategoryResourceIdentifier
}

export interface StagedOrderSetCustomTypeAction {
  readonly action: "setCustomType";
  
  readonly fields?: FieldContainer;
  
  readonly type?: TypeResourceIdentifier
}

export interface StagedOrderSetCustomerEmailAction {
  readonly action: "setCustomerEmail";
  
  readonly email?: string
}

export interface StagedOrderSetCustomerGroupAction {
  readonly action: "setCustomerGroup";
  
  readonly customerGroup?: CustomerGroupResourceIdentifier
}

export interface StagedOrderSetCustomerIdAction {
  readonly action: "setCustomerId";
  
  readonly customerId?: string
}

export interface StagedOrderSetDeliveryAddressAction {
  readonly action: "setDeliveryAddress";
  
  readonly deliveryId: string;
  
  readonly address?: Address
}

export interface StagedOrderSetDeliveryItemsAction {
  readonly action: "setDeliveryItems";
  
  readonly deliveryId: string;
  
  readonly items: DeliveryItem[]
}

export interface StagedOrderSetLineItemCustomFieldAction {
  readonly action: "setLineItemCustomField";
  
  readonly lineItemId: string;
  
  readonly name: string;
  
  readonly value?: object
}

export interface StagedOrderSetLineItemCustomTypeAction {
  readonly action: "setLineItemCustomType";
  
  readonly lineItemId: string;
  
  readonly fields?: FieldContainer;
  
  readonly type?: TypeResourceIdentifier
}

export interface StagedOrderSetLineItemPriceAction {
  readonly action: "setLineItemPrice";
  
  readonly lineItemId: string;
  
  readonly externalPrice?: Money
}

export interface StagedOrderSetLineItemShippingDetailsAction {
  readonly action: "setLineItemShippingDetails";
  
  readonly shippingDetails?: ItemShippingDetailsDraft;
  
  readonly lineItemId: string
}

export interface StagedOrderSetLineItemTaxAmountAction {
  readonly action: "setLineItemTaxAmount";
  
  readonly lineItemId: string;
  
  readonly externalTaxAmount?: ExternalTaxAmountDraft
}

export interface StagedOrderSetLineItemTaxRateAction {
  readonly action: "setLineItemTaxRate";
  
  readonly externalTaxRate?: ExternalTaxRateDraft;
  
  readonly lineItemId: string
}

export interface StagedOrderSetLineItemTotalPriceAction {
  readonly action: "setLineItemTotalPrice";
  
  readonly externalTotalPrice?: ExternalLineItemTotalPrice;
  
  readonly lineItemId: string
}

export interface StagedOrderSetLocaleAction {
  readonly action: "setLocale";
  
  readonly locale?: string
}

export interface StagedOrderSetOrderNumberAction {
  readonly action: "setOrderNumber";
  
  readonly orderNumber?: string
}

export interface StagedOrderSetOrderTotalTaxAction {
  readonly action: "setOrderTotalTax";
  
  readonly externalTaxPortions?: TaxPortion[];
  
  readonly externalTotalGross: Money
}

export interface StagedOrderSetParcelItemsAction {
  readonly action: "setParcelItems";
  
  readonly items: DeliveryItem[];
  
  readonly parcelId: string
}

export interface StagedOrderSetParcelMeasurementsAction {
  readonly action: "setParcelMeasurements";
  
  readonly measurements?: ParcelMeasurements;
  
  readonly parcelId: string
}

export interface StagedOrderSetParcelTrackingDataAction {
  readonly action: "setParcelTrackingData";
  
  readonly trackingData?: TrackingData;
  
  readonly parcelId: string
}

export interface StagedOrderSetReturnPaymentStateAction {
  readonly action: "setReturnPaymentState";
  
  readonly returnItemId: string;
  
  readonly paymentState: ReturnPaymentState
}

export interface StagedOrderSetReturnShipmentStateAction {
  readonly action: "setReturnShipmentState";
  
  readonly shipmentState: ReturnShipmentState;
  
  readonly returnItemId: string
}

export interface StagedOrderSetShippingAddressAction {
  readonly action: "setShippingAddress";
  
  readonly address?: Address
}

export interface StagedOrderSetShippingAddressAndCustomShippingMethodAction {
  readonly action: "setShippingAddressAndCustomShippingMethod";
  
  readonly shippingRate: ShippingRateDraft;
  
  readonly externalTaxRate?: ExternalTaxRateDraft;
  
  readonly address: Address;
  
  readonly shippingMethodName: string;
  
  readonly taxCategory?: TaxCategoryResourceIdentifier
}

export interface StagedOrderSetShippingAddressAndShippingMethodAction {
  readonly action: "setShippingAddressAndShippingMethod";
  
  readonly externalTaxRate?: ExternalTaxRateDraft;
  
  readonly address: Address;
  
  readonly shippingMethod?: ShippingMethodResourceIdentifier
}

export interface StagedOrderSetShippingMethodAction {
  readonly action: "setShippingMethod";
  
  readonly externalTaxRate?: ExternalTaxRateDraft;
  
  readonly shippingMethod?: ShippingMethodResourceIdentifier
}

export interface StagedOrderSetShippingMethodTaxAmountAction {
  readonly action: "setShippingMethodTaxAmount";
  
  readonly externalTaxAmount?: ExternalTaxAmountDraft
}

export interface StagedOrderSetShippingMethodTaxRateAction {
  readonly action: "setShippingMethodTaxRate";
  
  readonly externalTaxRate?: ExternalTaxRateDraft
}

export interface StagedOrderSetShippingRateInputAction {
  readonly action: "setShippingRateInput";
  
  readonly shippingRateInput?: ShippingRateInputDraft
}

export interface StagedOrderTransitionCustomLineItemStateAction {
  readonly action: "transitionCustomLineItemState";
  
  readonly toState: StateResourceIdentifier;
  
  readonly fromState: StateResourceIdentifier;
  
  readonly customLineItemId: string;
  
  readonly quantity: number;
  
  readonly actualTransitionDate?: string
}

export interface StagedOrderTransitionLineItemStateAction {
  readonly action: "transitionLineItemState";
  
  readonly toState: StateResourceIdentifier;
  
  readonly fromState: StateResourceIdentifier;
  
  readonly quantity: number;
  
  readonly lineItemId: string;
  
  readonly actualTransitionDate?: string
}

export interface StagedOrderTransitionStateAction {
  readonly action: "transitionState";
  
  readonly force?: boolean;
  
  readonly state: StateResourceIdentifier
}

export interface StagedOrderUpdateItemShippingAddressAction {
  readonly action: "updateItemShippingAddress";
  
  readonly address: Address
}

export interface StagedOrderUpdateSyncInfoAction {
  readonly action: "updateSyncInfo";
  
  readonly channel: ChannelResourceIdentifier;
  
  readonly externalId?: string;
  
  readonly syncedAt?: string
}