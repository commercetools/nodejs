/* tslint:disable */
//Generated file, please do not change

import { StagedOrderAddCustomLineItemAction } from './OrderEdit'
import { StagedOrderAddDeliveryAction } from './OrderEdit'
import { StagedOrderAddDiscountCodeAction } from './OrderEdit'
import { StagedOrderAddItemShippingAddressAction } from './OrderEdit'
import { StagedOrderAddLineItemAction } from './OrderEdit'
import { StagedOrderAddParcelToDeliveryAction } from './OrderEdit'
import { StagedOrderAddPaymentAction } from './OrderEdit'
import { StagedOrderAddReturnInfoAction } from './OrderEdit'
import { StagedOrderAddShoppingListAction } from './OrderEdit'
import { StagedOrderChangeCustomLineItemMoneyAction } from './OrderEdit'
import { StagedOrderChangeCustomLineItemQuantityAction } from './OrderEdit'
import { StagedOrderChangeLineItemQuantityAction } from './OrderEdit'
import { StagedOrderChangeOrderStateAction } from './OrderEdit'
import { StagedOrderChangePaymentStateAction } from './OrderEdit'
import { StagedOrderChangeShipmentStateAction } from './OrderEdit'
import { StagedOrderChangeTaxCalculationModeAction } from './OrderEdit'
import { StagedOrderChangeTaxModeAction } from './OrderEdit'
import { StagedOrderChangeTaxRoundingModeAction } from './OrderEdit'
import { StagedOrderImportCustomLineItemStateAction } from './OrderEdit'
import { StagedOrderImportLineItemStateAction } from './OrderEdit'
import { StagedOrderRemoveCustomLineItemAction } from './OrderEdit'
import { StagedOrderRemoveDeliveryAction } from './OrderEdit'
import { StagedOrderRemoveDiscountCodeAction } from './OrderEdit'
import { StagedOrderRemoveItemShippingAddressAction } from './OrderEdit'
import { StagedOrderRemoveLineItemAction } from './OrderEdit'
import { StagedOrderRemoveParcelFromDeliveryAction } from './OrderEdit'
import { StagedOrderRemovePaymentAction } from './OrderEdit'
import { StagedOrderSetBillingAddressAction } from './OrderEdit'
import { StagedOrderSetCountryAction } from './OrderEdit'
import { StagedOrderSetCustomFieldAction } from './OrderEdit'
import { StagedOrderSetCustomLineItemCustomFieldAction } from './OrderEdit'
import { StagedOrderSetCustomLineItemCustomTypeAction } from './OrderEdit'
import { StagedOrderSetCustomLineItemShippingDetailsAction } from './OrderEdit'
import { StagedOrderSetCustomLineItemTaxAmountAction } from './OrderEdit'
import { StagedOrderSetCustomLineItemTaxRateAction } from './OrderEdit'
import { StagedOrderSetCustomShippingMethodAction } from './OrderEdit'
import { StagedOrderSetCustomTypeAction } from './OrderEdit'
import { StagedOrderSetCustomerEmailAction } from './OrderEdit'
import { StagedOrderSetCustomerGroupAction } from './OrderEdit'
import { StagedOrderSetCustomerIdAction } from './OrderEdit'
import { StagedOrderSetDeliveryAddressAction } from './OrderEdit'
import { StagedOrderSetDeliveryItemsAction } from './OrderEdit'
import { StagedOrderSetLineItemCustomFieldAction } from './OrderEdit'
import { StagedOrderSetLineItemCustomTypeAction } from './OrderEdit'
import { StagedOrderSetLineItemPriceAction } from './OrderEdit'
import { StagedOrderSetLineItemShippingDetailsAction } from './OrderEdit'
import { StagedOrderSetLineItemTaxAmountAction } from './OrderEdit'
import { StagedOrderSetLineItemTaxRateAction } from './OrderEdit'
import { StagedOrderSetLineItemTotalPriceAction } from './OrderEdit'
import { StagedOrderSetLocaleAction } from './OrderEdit'
import { StagedOrderSetOrderNumberAction } from './OrderEdit'
import { StagedOrderSetOrderTotalTaxAction } from './OrderEdit'
import { StagedOrderSetParcelItemsAction } from './OrderEdit'
import { StagedOrderSetParcelMeasurementsAction } from './OrderEdit'
import { StagedOrderSetParcelTrackingDataAction } from './OrderEdit'
import { StagedOrderSetReturnPaymentStateAction } from './OrderEdit'
import { StagedOrderSetReturnShipmentStateAction } from './OrderEdit'
import { StagedOrderSetShippingAddressAction } from './OrderEdit'
import { StagedOrderSetShippingAddressAndCustomShippingMethodAction } from './OrderEdit'
import { StagedOrderSetShippingAddressAndShippingMethodAction } from './OrderEdit'
import { StagedOrderSetShippingMethodAction } from './OrderEdit'
import { StagedOrderSetShippingMethodTaxAmountAction } from './OrderEdit'
import { StagedOrderSetShippingMethodTaxRateAction } from './OrderEdit'
import { StagedOrderSetShippingRateInputAction } from './OrderEdit'
import { StagedOrderTransitionCustomLineItemStateAction } from './OrderEdit'
import { StagedOrderTransitionLineItemStateAction } from './OrderEdit'
import { StagedOrderTransitionStateAction } from './OrderEdit'
import { StagedOrderUpdateItemShippingAddressAction } from './OrderEdit'
import { StagedOrderUpdateSyncInfoAction } from './OrderEdit'
import { Address } from './Common'
import { DiscountedLineItemPortion } from './Cart'
import { Money } from './Common'
import { StateReference } from './State'
import { TaxRate } from './TaxCategory'
import { ItemShippingDetailsDraft } from './Cart'
import { PriceDraft } from './Common'
import { CustomFieldsDraft } from './Type'
import { LocalizedString } from './Common'
import { ChannelResourceIdentifier } from './Channel'
import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { ShippingRateInput } from './Cart'
import { TaxedPrice } from './Cart'
import { CartOrigin } from './Cart'
import { ShippingInfo } from './Cart'
import { CartReference } from './Cart'
import { InventoryMode } from './Cart'
import { LineItem } from './Cart'
import { CustomLineItem } from './Cart'
import { DiscountCodeInfo } from './Cart'
import { CustomerGroupReference } from './CustomerGroup'
import { CustomFields } from './Type'
import { TaxCalculationMode } from './Cart'
import { StoreKeyReference } from './Store'
import { RoundingMode } from './Cart'
import { TaxMode } from './Cart'
import { StagedOrder } from './OrderEdit'
import { LoggedResource } from './Common'
import { CustomerGroupResourceIdentifier } from './CustomerGroup'
import { CustomLineItemDraft } from './Cart'
import { ReferenceTypeId } from './Common'
import { Reference } from './Common'
import { ResourceIdentifier } from './Common'
import { PaymentReference } from './Payment'
import { Image } from './Common'
import { Attribute } from './Product'
import { ShippingRateDraft } from './ShippingMethod'
import { ShippingMethodState } from './Cart'
import { ShippingMethodResourceIdentifier } from './ShippingMethod'
import { TaxCategoryResourceIdentifier } from './TaxCategory'
import { ChannelReference } from './Channel'
import { PaymentResourceIdentifier } from './Payment'
import { FieldContainer } from './Type'
import { TypeResourceIdentifier } from './Type'
import { StateResourceIdentifier } from './State'


export type StagedOrderUpdateAction =
  StagedOrderAddCustomLineItemAction |
  StagedOrderAddDeliveryAction |
  StagedOrderAddDiscountCodeAction |
  StagedOrderAddItemShippingAddressAction |
  StagedOrderAddLineItemAction |
  StagedOrderAddParcelToDeliveryAction |
  StagedOrderAddPaymentAction |
  StagedOrderAddReturnInfoAction |
  StagedOrderAddShoppingListAction |
  StagedOrderChangeCustomLineItemMoneyAction |
  StagedOrderChangeCustomLineItemQuantityAction |
  StagedOrderChangeLineItemQuantityAction |
  StagedOrderChangeOrderStateAction |
  StagedOrderChangePaymentStateAction |
  StagedOrderChangeShipmentStateAction |
  StagedOrderChangeTaxCalculationModeAction |
  StagedOrderChangeTaxModeAction |
  StagedOrderChangeTaxRoundingModeAction |
  StagedOrderImportCustomLineItemStateAction |
  StagedOrderImportLineItemStateAction |
  StagedOrderRemoveCustomLineItemAction |
  StagedOrderRemoveDeliveryAction |
  StagedOrderRemoveDiscountCodeAction |
  StagedOrderRemoveItemShippingAddressAction |
  StagedOrderRemoveLineItemAction |
  StagedOrderRemoveParcelFromDeliveryAction |
  StagedOrderRemovePaymentAction |
  StagedOrderSetBillingAddressAction |
  StagedOrderSetCountryAction |
  StagedOrderSetCustomFieldAction |
  StagedOrderSetCustomLineItemCustomFieldAction |
  StagedOrderSetCustomLineItemCustomTypeAction |
  StagedOrderSetCustomLineItemShippingDetailsAction |
  StagedOrderSetCustomLineItemTaxAmountAction |
  StagedOrderSetCustomLineItemTaxRateAction |
  StagedOrderSetCustomShippingMethodAction |
  StagedOrderSetCustomTypeAction |
  StagedOrderSetCustomerEmailAction |
  StagedOrderSetCustomerGroupAction |
  StagedOrderSetCustomerIdAction |
  StagedOrderSetDeliveryAddressAction |
  StagedOrderSetDeliveryItemsAction |
  StagedOrderSetLineItemCustomFieldAction |
  StagedOrderSetLineItemCustomTypeAction |
  StagedOrderSetLineItemPriceAction |
  StagedOrderSetLineItemShippingDetailsAction |
  StagedOrderSetLineItemTaxAmountAction |
  StagedOrderSetLineItemTaxRateAction |
  StagedOrderSetLineItemTotalPriceAction |
  StagedOrderSetLocaleAction |
  StagedOrderSetOrderNumberAction |
  StagedOrderSetOrderTotalTaxAction |
  StagedOrderSetParcelItemsAction |
  StagedOrderSetParcelMeasurementsAction |
  StagedOrderSetParcelTrackingDataAction |
  StagedOrderSetReturnPaymentStateAction |
  StagedOrderSetReturnShipmentStateAction |
  StagedOrderSetShippingAddressAction |
  StagedOrderSetShippingAddressAndCustomShippingMethodAction |
  StagedOrderSetShippingAddressAndShippingMethodAction |
  StagedOrderSetShippingMethodAction |
  StagedOrderSetShippingMethodTaxAmountAction |
  StagedOrderSetShippingMethodTaxRateAction |
  StagedOrderSetShippingRateInputAction |
  StagedOrderTransitionCustomLineItemStateAction |
  StagedOrderTransitionLineItemStateAction |
  StagedOrderTransitionStateAction |
  StagedOrderUpdateItemShippingAddressAction |
  StagedOrderUpdateSyncInfoAction
;

export interface Delivery {
  
  readonly id: string;
  
  readonly createdAt: string;
  
  readonly items: DeliveryItem[];
  
  readonly parcels: Parcel[];
  
  readonly address?: Address
}

export interface DeliveryItem {
  
  readonly id: string;
  
  readonly quantity: number
}

export interface DiscountedLineItemPriceDraft {
  
  readonly value: Money;
  
  readonly includedDiscounts: DiscountedLineItemPortion[]
}

export interface ItemState {
  
  readonly quantity: number;
  
  readonly state: StateReference
}

export interface LineItemImportDraft {
  
  readonly productId?: string;
  
  readonly name: LocalizedString;
  
  readonly variant: ProductVariantImportDraft;
  
  readonly price: PriceDraft;
  
  readonly quantity: number;
  
  readonly state?: ItemState[];
  
  readonly supplyChannel?: ChannelResourceIdentifier;
  
  readonly distributionChannel?: ChannelResourceIdentifier;
  
  readonly taxRate?: TaxRate;
  
  readonly custom?: CustomFieldsDraft;
  
  readonly shippingDetails?: ItemShippingDetailsDraft
}

export interface Order extends LoggedResource {
  
  readonly completedAt?: string;
  
  readonly orderNumber?: string;
  
  readonly customerId?: string;
  
  readonly customerEmail?: string;
  
  readonly anonymousId?: string;
  
  readonly store?: StoreKeyReference;
  
  readonly lineItems: LineItem[];
  
  readonly customLineItems: CustomLineItem[];
  
  readonly totalPrice: Money;
  
  readonly taxedPrice?: TaxedPrice;
  
  readonly shippingAddress?: Address;
  
  readonly billingAddress?: Address;
  
  readonly taxMode?: TaxMode;
  
  readonly taxRoundingMode?: RoundingMode;
  
  readonly customerGroup?: CustomerGroupReference;
  
  readonly country?: string;
  
  readonly orderState: OrderState;
  
  readonly state?: StateReference;
  
  readonly shipmentState?: ShipmentState;
  
  readonly paymentState?: PaymentState;
  
  readonly shippingInfo?: ShippingInfo;
  
  readonly syncInfo: SyncInfo[];
  
  readonly returnInfo?: ReturnInfo[];
  
  readonly discountCodes?: DiscountCodeInfo[];
  
  readonly lastMessageSequenceNumber: number;
  
  readonly cart?: CartReference;
  
  readonly custom?: CustomFields;
  
  readonly paymentInfo?: PaymentInfo;
  
  readonly locale?: string;
  
  readonly inventoryMode?: InventoryMode;
  
  readonly origin: CartOrigin;
  
  readonly taxCalculationMode?: TaxCalculationMode;
  
  readonly shippingRateInput?: ShippingRateInput;
  
  readonly itemShippingAddresses?: Address[]
}

export interface OrderFromCartDraft {
  
  readonly id: string;
  
  readonly version: number;
  
  readonly orderNumber?: string;
  
  readonly paymentState?: PaymentState
}

export interface OrderImportDraft {
  
  readonly orderNumber?: string;
  
  readonly customerId?: string;
  
  readonly customerEmail?: string;
  
  readonly lineItems?: LineItemImportDraft[];
  
  readonly customLineItems?: CustomLineItemDraft[];
  
  readonly totalPrice: Money;
  
  readonly taxedPrice?: TaxedPrice;
  
  readonly shippingAddress?: Address;
  
  readonly billingAddress?: Address;
  
  readonly customerGroup?: CustomerGroupResourceIdentifier;
  
  readonly country?: string;
  
  readonly orderState?: OrderState;
  
  readonly shipmentState?: ShipmentState;
  
  readonly paymentState?: PaymentState;
  
  readonly shippingInfo?: ShippingInfoImportDraft;
  
  readonly completedAt?: string;
  
  readonly custom?: CustomFieldsDraft;
  
  readonly inventoryMode?: InventoryMode;
  
  readonly taxRoundingMode?: RoundingMode;
  
  readonly itemShippingAddresses?: Address[]
}

export interface OrderPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: Order[]
}

export interface OrderReference {
  readonly typeId: "order";
  
  readonly id: string;
  
  readonly obj?: Order
}

export interface OrderResourceIdentifier {
  readonly typeId: "order";
  
  readonly id?: string;
  
  readonly key?: string
}

export type OrderState =
   'Open' |
   'Confirmed' |
   'Complete' |
   'Cancelled';

export interface OrderUpdate {
  
  readonly version: number;
  
  readonly actions: OrderUpdateAction[]
}

export type OrderUpdateAction =
  OrderAddDeliveryAction |
  OrderAddItemShippingAddressAction |
  OrderAddParcelToDeliveryAction |
  OrderAddPaymentAction |
  OrderAddReturnInfoAction |
  OrderChangeOrderStateAction |
  OrderChangePaymentStateAction |
  OrderChangeShipmentStateAction |
  OrderImportCustomLineItemStateAction |
  OrderImportLineItemStateAction |
  OrderRemoveDeliveryAction |
  OrderRemoveItemShippingAddressAction |
  OrderRemoveParcelFromDeliveryAction |
  OrderRemovePaymentAction |
  OrderSetBillingAddressAction |
  OrderSetCustomFieldAction |
  OrderSetCustomLineItemCustomFieldAction |
  OrderSetCustomLineItemCustomTypeAction |
  OrderSetCustomLineItemShippingDetailsAction |
  OrderSetCustomTypeAction |
  OrderSetCustomerEmailAction |
  OrderSetCustomerIdAction |
  OrderSetDeliveryAddressAction |
  OrderSetDeliveryItemsAction |
  OrderSetLineItemCustomFieldAction |
  OrderSetLineItemCustomTypeAction |
  OrderSetLineItemShippingDetailsAction |
  OrderSetLocaleAction |
  OrderSetOrderNumberAction |
  OrderSetParcelItemsAction |
  OrderSetParcelMeasurementsAction |
  OrderSetParcelTrackingDataAction |
  OrderSetReturnPaymentStateAction |
  OrderSetReturnShipmentStateAction |
  OrderSetShippingAddressAction |
  OrderTransitionCustomLineItemStateAction |
  OrderTransitionLineItemStateAction |
  OrderTransitionStateAction |
  OrderUpdateItemShippingAddressAction |
  OrderUpdateSyncInfoAction
;

export interface Parcel {
  
  readonly id: string;
  
  readonly createdAt: string;
  
  readonly measurements?: ParcelMeasurements;
  
  readonly trackingData?: TrackingData;
  
  readonly items?: DeliveryItem[]
}

export interface ParcelDraft {
  
  readonly measurements?: ParcelMeasurements;
  
  readonly trackingData?: TrackingData;
  
  readonly items?: DeliveryItem[]
}

export interface ParcelMeasurements {
  
  readonly heightInMillimeter?: number;
  
  readonly lengthInMillimeter?: number;
  
  readonly widthInMillimeter?: number;
  
  readonly weightInGram?: number
}

export interface PaymentInfo {
  
  readonly payments: PaymentReference[]
}

export type PaymentState =
   'BalanceDue' |
   'Failed' |
   'Pending' |
   'CreditOwed' |
   'Paid';

export interface ProductVariantImportDraft {
  
  readonly id?: number;
  
  readonly sku?: string;
  
  readonly prices?: PriceDraft[];
  
  readonly attributes?: Attribute[];
  
  readonly images?: Image[]
}

export interface ReturnInfo {
  
  readonly items: ReturnItem[];
  
  readonly returnTrackingId?: string;
  
  readonly returnDate?: string
}

export type ReturnItem =
  CustomLineItemReturnItem |
  LineItemReturnItem
;

export interface CustomLineItemReturnItem {
  readonly type: "CustomLineItemReturnItem";
  
  readonly shipmentState: ReturnShipmentState;
  
  readonly createdAt: string;
  
  readonly lastModifiedAt: string;
  
  readonly quantity: number;
  
  readonly comment?: string;
  
  readonly id: string;
  
  readonly paymentState: ReturnPaymentState;
  
  readonly customLineItemId: string
}

export interface LineItemReturnItem {
  readonly type: "LineItemReturnItem";
  
  readonly shipmentState: ReturnShipmentState;
  
  readonly createdAt: string;
  
  readonly lastModifiedAt: string;
  
  readonly quantity: number;
  
  readonly comment?: string;
  
  readonly id: string;
  
  readonly paymentState: ReturnPaymentState;
  
  readonly lineItemId: string
}

export interface ReturnItemDraft {
  
  readonly quantity: number;
  
  readonly lineItemId?: string;
  
  readonly customLineItemId?: string;
  
  readonly comment?: string;
  
  readonly shipmentState: ReturnShipmentState
}

export type ReturnPaymentState =
   'NonRefundable' |
   'Initial' |
   'Refunded' |
   'NotRefunded';

export type ReturnShipmentState =
   'Advised' |
   'Returned' |
   'BackInStock' |
   'Unusable';

export type ShipmentState =
   'Shipped' |
   'Ready' |
   'Pending' |
   'Delayed' |
   'Partial' |
   'Backorder';

export interface ShippingInfoImportDraft {
  
  readonly shippingMethodName: string;
  
  readonly price: Money;
  
  readonly shippingRate: ShippingRateDraft;
  
  readonly taxRate?: TaxRate;
  
  readonly taxCategory?: TaxCategoryResourceIdentifier;
  
  readonly shippingMethod?: ShippingMethodResourceIdentifier;
  
  readonly deliveries?: Delivery[];
  
  readonly discountedPrice?: DiscountedLineItemPriceDraft;
  
  readonly shippingMethodState?: ShippingMethodState
}

export interface SyncInfo {
  
  readonly channel: ChannelReference;
  
  readonly externalId?: string;
  
  readonly syncedAt: string
}

export interface TaxedItemPriceDraft {
  
  readonly totalNet: Money;
  
  readonly totalGross: Money
}

export interface TrackingData {
  
  readonly trackingId?: string;
  
  readonly carrier?: string;
  
  readonly provider?: string;
  
  readonly providerTransaction?: string;
  
  readonly isReturn?: boolean
}

export interface OrderAddDeliveryAction {
  readonly action: "addDelivery";
  
  readonly address?: Address;
  
  readonly items?: DeliveryItem[];
  
  readonly parcels?: ParcelDraft[]
}

export interface OrderAddItemShippingAddressAction {
  readonly action: "addItemShippingAddress";
  
  readonly address: Address
}

export interface OrderAddParcelToDeliveryAction {
  readonly action: "addParcelToDelivery";
  
  readonly deliveryId: string;
  
  readonly items?: DeliveryItem[];
  
  readonly trackingData?: TrackingData;
  
  readonly measurements?: ParcelMeasurements
}

export interface OrderAddPaymentAction {
  readonly action: "addPayment";
  
  readonly payment: PaymentResourceIdentifier
}

export interface OrderAddReturnInfoAction {
  readonly action: "addReturnInfo";
  
  readonly returnDate?: string;
  
  readonly returnTrackingId?: string;
  
  readonly items: ReturnItemDraft[]
}

export interface OrderChangeOrderStateAction {
  readonly action: "changeOrderState";
  
  readonly orderState: OrderState
}

export interface OrderChangePaymentStateAction {
  readonly action: "changePaymentState";
  
  readonly paymentState?: PaymentState
}

export interface OrderChangeShipmentStateAction {
  readonly action: "changeShipmentState";
  
  readonly shipmentState?: ShipmentState
}

export interface OrderImportCustomLineItemStateAction {
  readonly action: "importCustomLineItemState";
  
  readonly customLineItemId: string;
  
  readonly state: ItemState[]
}

export interface OrderImportLineItemStateAction {
  readonly action: "importLineItemState";
  
  readonly lineItemId: string;
  
  readonly state: ItemState[]
}

export interface OrderRemoveDeliveryAction {
  readonly action: "removeDelivery";
  
  readonly deliveryId: string
}

export interface OrderRemoveItemShippingAddressAction {
  readonly action: "removeItemShippingAddress";
  
  readonly addressKey: string
}

export interface OrderRemoveParcelFromDeliveryAction {
  readonly action: "removeParcelFromDelivery";
  
  readonly parcelId: string
}

export interface OrderRemovePaymentAction {
  readonly action: "removePayment";
  
  readonly payment: PaymentResourceIdentifier
}

export interface OrderSetBillingAddressAction {
  readonly action: "setBillingAddress";
  
  readonly address?: Address
}

export interface OrderSetCustomFieldAction {
  readonly action: "setCustomField";
  
  readonly name: string;
  
  readonly value?: object
}

export interface OrderSetCustomLineItemCustomFieldAction {
  readonly action: "setCustomLineItemCustomField";
  
  readonly customLineItemId: string;
  
  readonly name: string;
  
  readonly value?: object
}

export interface OrderSetCustomLineItemCustomTypeAction {
  readonly action: "setCustomLineItemCustomType";
  
  readonly customLineItemId: string;
  
  readonly fields?: FieldContainer;
  
  readonly type?: TypeResourceIdentifier
}

export interface OrderSetCustomLineItemShippingDetailsAction {
  readonly action: "setCustomLineItemShippingDetails";
  
  readonly customLineItemId: string;
  
  readonly shippingDetails?: ItemShippingDetailsDraft
}

export interface OrderSetCustomTypeAction {
  readonly action: "setCustomType";
  
  readonly fields?: FieldContainer;
  
  readonly type?: TypeResourceIdentifier
}

export interface OrderSetCustomerEmailAction {
  readonly action: "setCustomerEmail";
  
  readonly email?: string
}

export interface OrderSetCustomerIdAction {
  readonly action: "setCustomerId";
  
  readonly customerId?: string
}

export interface OrderSetDeliveryAddressAction {
  readonly action: "setDeliveryAddress";
  
  readonly deliveryId: string;
  
  readonly address?: Address
}

export interface OrderSetDeliveryItemsAction {
  readonly action: "setDeliveryItems";
  
  readonly deliveryId: string;
  
  readonly items: DeliveryItem[]
}

export interface OrderSetLineItemCustomFieldAction {
  readonly action: "setLineItemCustomField";
  
  readonly lineItemId: string;
  
  readonly name: string;
  
  readonly value?: object
}

export interface OrderSetLineItemCustomTypeAction {
  readonly action: "setLineItemCustomType";
  
  readonly lineItemId: string;
  
  readonly fields?: FieldContainer;
  
  readonly type?: TypeResourceIdentifier
}

export interface OrderSetLineItemShippingDetailsAction {
  readonly action: "setLineItemShippingDetails";
  
  readonly shippingDetails?: ItemShippingDetailsDraft;
  
  readonly lineItemId: string
}

export interface OrderSetLocaleAction {
  readonly action: "setLocale";
  
  readonly locale?: string
}

export interface OrderSetOrderNumberAction {
  readonly action: "setOrderNumber";
  
  readonly orderNumber?: string
}

export interface OrderSetParcelItemsAction {
  readonly action: "setParcelItems";
  
  readonly items: DeliveryItem[];
  
  readonly parcelId: string
}

export interface OrderSetParcelMeasurementsAction {
  readonly action: "setParcelMeasurements";
  
  readonly measurements?: ParcelMeasurements;
  
  readonly parcelId: string
}

export interface OrderSetParcelTrackingDataAction {
  readonly action: "setParcelTrackingData";
  
  readonly trackingData?: TrackingData;
  
  readonly parcelId: string
}

export interface OrderSetReturnPaymentStateAction {
  readonly action: "setReturnPaymentState";
  
  readonly returnItemId: string;
  
  readonly paymentState: ReturnPaymentState
}

export interface OrderSetReturnShipmentStateAction {
  readonly action: "setReturnShipmentState";
  
  readonly shipmentState: ReturnShipmentState;
  
  readonly returnItemId: string
}

export interface OrderSetShippingAddressAction {
  readonly action: "setShippingAddress";
  
  readonly address?: Address
}

export interface OrderTransitionCustomLineItemStateAction {
  readonly action: "transitionCustomLineItemState";
  
  readonly toState: StateResourceIdentifier;
  
  readonly fromState: StateResourceIdentifier;
  
  readonly customLineItemId: string;
  
  readonly quantity: number;
  
  readonly actualTransitionDate?: string
}

export interface OrderTransitionLineItemStateAction {
  readonly action: "transitionLineItemState";
  
  readonly toState: StateResourceIdentifier;
  
  readonly fromState: StateResourceIdentifier;
  
  readonly quantity: number;
  
  readonly lineItemId: string;
  
  readonly actualTransitionDate?: string
}

export interface OrderTransitionStateAction {
  readonly action: "transitionState";
  
  readonly force?: boolean;
  
  readonly state: StateResourceIdentifier
}

export interface OrderUpdateItemShippingAddressAction {
  readonly action: "updateItemShippingAddress";
  
  readonly address: Address
}

export interface OrderUpdateSyncInfoAction {
  readonly action: "updateSyncInfo";
  
  readonly channel: ChannelResourceIdentifier;
  
  readonly externalId?: string;
  
  readonly syncedAt?: string
}