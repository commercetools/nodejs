//Generated file, please do not change

import {
  CartOrigin,
  CartReference,
  CustomLineItem,
  CustomLineItemDraft,
  DiscountCodeInfo,
  DiscountedLineItemPortion,
  InventoryMode,
  ItemShippingDetailsDraft,
  LineItem,
  RoundingMode,
  ShippingInfo,
  ShippingMethodState,
  ShippingRateInput,
  TaxCalculationMode,
  TaxMode,
  TaxedPrice,
} from './cart'
import { CartDiscountReference } from './cart-discount'
import { ChannelReference, ChannelResourceIdentifier } from './channel'
import {
  Address,
  CreatedBy,
  Image,
  LastModifiedBy,
  LocalizedString,
  LoggedResource,
  Money,
  PriceDraft,
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
  TypedMoney,
} from './common'
import {
  CustomerGroupReference,
  CustomerGroupResourceIdentifier,
} from './customer-group'
import {
  StagedOrder,
  StagedOrderAddCustomLineItemAction,
  StagedOrderAddDeliveryAction,
  StagedOrderAddDiscountCodeAction,
  StagedOrderAddItemShippingAddressAction,
  StagedOrderAddLineItemAction,
  StagedOrderAddParcelToDeliveryAction,
  StagedOrderAddPaymentAction,
  StagedOrderAddReturnInfoAction,
  StagedOrderAddShoppingListAction,
  StagedOrderChangeCustomLineItemMoneyAction,
  StagedOrderChangeCustomLineItemQuantityAction,
  StagedOrderChangeLineItemQuantityAction,
  StagedOrderChangeOrderStateAction,
  StagedOrderChangePaymentStateAction,
  StagedOrderChangeShipmentStateAction,
  StagedOrderChangeTaxCalculationModeAction,
  StagedOrderChangeTaxModeAction,
  StagedOrderChangeTaxRoundingModeAction,
  StagedOrderImportCustomLineItemStateAction,
  StagedOrderImportLineItemStateAction,
  StagedOrderRemoveCustomLineItemAction,
  StagedOrderRemoveDeliveryAction,
  StagedOrderRemoveDiscountCodeAction,
  StagedOrderRemoveItemShippingAddressAction,
  StagedOrderRemoveLineItemAction,
  StagedOrderRemoveParcelFromDeliveryAction,
  StagedOrderRemovePaymentAction,
  StagedOrderSetBillingAddressAction,
  StagedOrderSetCountryAction,
  StagedOrderSetCustomFieldAction,
  StagedOrderSetCustomLineItemCustomFieldAction,
  StagedOrderSetCustomLineItemCustomTypeAction,
  StagedOrderSetCustomLineItemShippingDetailsAction,
  StagedOrderSetCustomLineItemTaxAmountAction,
  StagedOrderSetCustomLineItemTaxRateAction,
  StagedOrderSetCustomShippingMethodAction,
  StagedOrderSetCustomTypeAction,
  StagedOrderSetCustomerEmailAction,
  StagedOrderSetCustomerGroupAction,
  StagedOrderSetCustomerIdAction,
  StagedOrderSetDeliveryAddressAction,
  StagedOrderSetDeliveryItemsAction,
  StagedOrderSetLineItemCustomFieldAction,
  StagedOrderSetLineItemCustomTypeAction,
  StagedOrderSetLineItemPriceAction,
  StagedOrderSetLineItemShippingDetailsAction,
  StagedOrderSetLineItemTaxAmountAction,
  StagedOrderSetLineItemTaxRateAction,
  StagedOrderSetLineItemTotalPriceAction,
  StagedOrderSetLocaleAction,
  StagedOrderSetOrderNumberAction,
  StagedOrderSetOrderTotalTaxAction,
  StagedOrderSetParcelItemsAction,
  StagedOrderSetParcelMeasurementsAction,
  StagedOrderSetParcelTrackingDataAction,
  StagedOrderSetReturnPaymentStateAction,
  StagedOrderSetReturnShipmentStateAction,
  StagedOrderSetShippingAddressAction,
  StagedOrderSetShippingAddressAndCustomShippingMethodAction,
  StagedOrderSetShippingAddressAndShippingMethodAction,
  StagedOrderSetShippingMethodAction,
  StagedOrderSetShippingMethodTaxAmountAction,
  StagedOrderSetShippingMethodTaxRateAction,
  StagedOrderSetShippingRateInputAction,
  StagedOrderTransitionCustomLineItemStateAction,
  StagedOrderTransitionLineItemStateAction,
  StagedOrderTransitionStateAction,
  StagedOrderUpdateItemShippingAddressAction,
  StagedOrderUpdateSyncInfoAction,
} from './order-edit'
import { PaymentReference, PaymentResourceIdentifier } from './payment'
import { Attribute } from './product'
import {
  ShippingMethodResourceIdentifier,
  ShippingRateDraft,
} from './shipping-method'
import { StateReference, StateResourceIdentifier } from './state'
import { StoreKeyReference } from './store'
import { TaxCategoryResourceIdentifier, TaxRate } from './tax-category'
import {
  CustomFields,
  CustomFieldsDraft,
  FieldContainer,
  TypeResourceIdentifier,
} from './type'

export type StagedOrderUpdateAction =
  | StagedOrderAddCustomLineItemAction
  | StagedOrderAddDeliveryAction
  | StagedOrderAddDiscountCodeAction
  | StagedOrderAddItemShippingAddressAction
  | StagedOrderAddLineItemAction
  | StagedOrderAddParcelToDeliveryAction
  | StagedOrderAddPaymentAction
  | StagedOrderAddReturnInfoAction
  | StagedOrderAddShoppingListAction
  | StagedOrderChangeCustomLineItemMoneyAction
  | StagedOrderChangeCustomLineItemQuantityAction
  | StagedOrderChangeLineItemQuantityAction
  | StagedOrderChangeOrderStateAction
  | StagedOrderChangePaymentStateAction
  | StagedOrderChangeShipmentStateAction
  | StagedOrderChangeTaxCalculationModeAction
  | StagedOrderChangeTaxModeAction
  | StagedOrderChangeTaxRoundingModeAction
  | StagedOrderImportCustomLineItemStateAction
  | StagedOrderImportLineItemStateAction
  | StagedOrderRemoveCustomLineItemAction
  | StagedOrderRemoveDeliveryAction
  | StagedOrderRemoveDiscountCodeAction
  | StagedOrderRemoveItemShippingAddressAction
  | StagedOrderRemoveLineItemAction
  | StagedOrderRemoveParcelFromDeliveryAction
  | StagedOrderRemovePaymentAction
  | StagedOrderSetBillingAddressAction
  | StagedOrderSetCountryAction
  | StagedOrderSetCustomFieldAction
  | StagedOrderSetCustomLineItemCustomFieldAction
  | StagedOrderSetCustomLineItemCustomTypeAction
  | StagedOrderSetCustomLineItemShippingDetailsAction
  | StagedOrderSetCustomLineItemTaxAmountAction
  | StagedOrderSetCustomLineItemTaxRateAction
  | StagedOrderSetCustomShippingMethodAction
  | StagedOrderSetCustomTypeAction
  | StagedOrderSetCustomerEmailAction
  | StagedOrderSetCustomerGroupAction
  | StagedOrderSetCustomerIdAction
  | StagedOrderSetDeliveryAddressAction
  | StagedOrderSetDeliveryItemsAction
  | StagedOrderSetLineItemCustomFieldAction
  | StagedOrderSetLineItemCustomTypeAction
  | StagedOrderSetLineItemPriceAction
  | StagedOrderSetLineItemShippingDetailsAction
  | StagedOrderSetLineItemTaxAmountAction
  | StagedOrderSetLineItemTaxRateAction
  | StagedOrderSetLineItemTotalPriceAction
  | StagedOrderSetLocaleAction
  | StagedOrderSetOrderNumberAction
  | StagedOrderSetOrderTotalTaxAction
  | StagedOrderSetParcelItemsAction
  | StagedOrderSetParcelMeasurementsAction
  | StagedOrderSetParcelTrackingDataAction
  | StagedOrderSetReturnPaymentStateAction
  | StagedOrderSetReturnShipmentStateAction
  | StagedOrderSetShippingAddressAction
  | StagedOrderSetShippingAddressAndCustomShippingMethodAction
  | StagedOrderSetShippingAddressAndShippingMethodAction
  | StagedOrderSetShippingMethodAction
  | StagedOrderSetShippingMethodTaxAmountAction
  | StagedOrderSetShippingMethodTaxRateAction
  | StagedOrderSetShippingRateInputAction
  | StagedOrderTransitionCustomLineItemStateAction
  | StagedOrderTransitionLineItemStateAction
  | StagedOrderTransitionStateAction
  | StagedOrderUpdateItemShippingAddressAction
  | StagedOrderUpdateSyncInfoAction

export interface Delivery {
  readonly id: string

  readonly createdAt: string

  readonly items: DeliveryItem[]

  readonly parcels: Parcel[]

  readonly address?: Address
}

export interface DeliveryItem {
  readonly id: string

  readonly quantity: number
}

export interface DiscountedLineItemPriceDraft {
  readonly value: Money

  readonly includedDiscounts: DiscountedLineItemPortion[]
}

export interface ItemState {
  readonly quantity: number

  readonly state: StateReference
}

export interface LineItemImportDraft {
  readonly productId?: string

  readonly name: LocalizedString

  readonly variant: ProductVariantImportDraft

  readonly price: PriceDraft

  readonly quantity: number

  readonly state?: ItemState[]

  readonly supplyChannel?: ChannelResourceIdentifier

  readonly distributionChannel?: ChannelResourceIdentifier

  readonly taxRate?: TaxRate

  readonly custom?: CustomFieldsDraft

  readonly shippingDetails?: ItemShippingDetailsDraft
}

export interface Order extends LoggedResource {
  readonly completedAt?: string

  readonly orderNumber?: string

  readonly customerId?: string

  readonly customerEmail?: string

  readonly anonymousId?: string

  readonly store?: StoreKeyReference

  readonly lineItems: LineItem[]

  readonly customLineItems: CustomLineItem[]

  readonly totalPrice: TypedMoney

  readonly taxedPrice?: TaxedPrice

  readonly shippingAddress?: Address

  readonly billingAddress?: Address

  readonly taxMode?: TaxMode

  readonly taxRoundingMode?: RoundingMode

  readonly customerGroup?: CustomerGroupReference

  readonly country?: string

  readonly orderState: OrderState

  readonly state?: StateReference

  readonly shipmentState?: ShipmentState

  readonly paymentState?: PaymentState

  readonly shippingInfo?: ShippingInfo

  readonly syncInfo: SyncInfo[]

  readonly returnInfo?: ReturnInfo[]

  readonly discountCodes?: DiscountCodeInfo[]

  readonly lastMessageSequenceNumber: number

  readonly cart?: CartReference

  readonly custom?: CustomFields

  readonly paymentInfo?: PaymentInfo

  readonly locale?: string

  readonly inventoryMode?: InventoryMode

  readonly origin: CartOrigin

  readonly taxCalculationMode?: TaxCalculationMode

  readonly shippingRateInput?: ShippingRateInput

  readonly itemShippingAddresses?: Address[]

  readonly refusedGifts: CartDiscountReference[]
}

export interface OrderFromCartDraft {
  readonly id: string

  readonly version: number

  readonly orderNumber?: string

  readonly paymentState?: PaymentState

  readonly shipmentState?: ShipmentState

  readonly orderState?: OrderState

  readonly state?: StateResourceIdentifier
}

export interface OrderImportDraft {
  readonly orderNumber?: string

  readonly customerId?: string

  readonly customerEmail?: string

  readonly lineItems?: LineItemImportDraft[]

  readonly customLineItems?: CustomLineItemDraft[]

  readonly totalPrice: Money

  readonly taxedPrice?: TaxedPrice

  readonly shippingAddress?: Address

  readonly billingAddress?: Address

  readonly customerGroup?: CustomerGroupResourceIdentifier

  readonly country?: string

  readonly orderState?: OrderState

  readonly shipmentState?: ShipmentState

  readonly paymentState?: PaymentState

  readonly shippingInfo?: ShippingInfoImportDraft

  readonly completedAt?: string

  readonly custom?: CustomFieldsDraft

  readonly inventoryMode?: InventoryMode

  readonly taxRoundingMode?: RoundingMode

  readonly itemShippingAddresses?: Address[]

  readonly store?: StoreKeyReference

  readonly origin?: CartOrigin
}

export interface OrderPagedQueryResponse {
  readonly limit: number

  readonly count: number

  readonly total?: number

  readonly offset: number

  readonly results: Order[]
}

export interface OrderReference {
  readonly typeId: 'order'

  readonly id: string

  readonly obj?: Order
}

export interface OrderResourceIdentifier {
  readonly typeId: 'order'

  readonly id?: string

  readonly key?: string
}

export type OrderState = 'Open' | 'Confirmed' | 'Complete' | 'Cancelled'

export interface OrderUpdate {
  readonly version: number

  readonly actions: OrderUpdateAction[]
}

export type OrderUpdateAction =
  | OrderAddDeliveryAction
  | OrderAddItemShippingAddressAction
  | OrderAddParcelToDeliveryAction
  | OrderAddPaymentAction
  | OrderAddReturnInfoAction
  | OrderChangeOrderStateAction
  | OrderChangePaymentStateAction
  | OrderChangeShipmentStateAction
  | OrderImportCustomLineItemStateAction
  | OrderImportLineItemStateAction
  | OrderRemoveDeliveryAction
  | OrderRemoveItemShippingAddressAction
  | OrderRemoveParcelFromDeliveryAction
  | OrderRemovePaymentAction
  | OrderSetBillingAddressAction
  | OrderSetCustomFieldAction
  | OrderSetCustomLineItemCustomFieldAction
  | OrderSetCustomLineItemCustomTypeAction
  | OrderSetCustomLineItemShippingDetailsAction
  | OrderSetCustomTypeAction
  | OrderSetCustomerEmailAction
  | OrderSetCustomerIdAction
  | OrderSetDeliveryAddressAction
  | OrderSetDeliveryItemsAction
  | OrderSetLineItemCustomFieldAction
  | OrderSetLineItemCustomTypeAction
  | OrderSetLineItemShippingDetailsAction
  | OrderSetLocaleAction
  | OrderSetOrderNumberAction
  | OrderSetParcelItemsAction
  | OrderSetParcelMeasurementsAction
  | OrderSetParcelTrackingDataAction
  | OrderSetReturnPaymentStateAction
  | OrderSetReturnShipmentStateAction
  | OrderSetShippingAddressAction
  | OrderTransitionCustomLineItemStateAction
  | OrderTransitionLineItemStateAction
  | OrderTransitionStateAction
  | OrderUpdateItemShippingAddressAction
  | OrderUpdateSyncInfoAction

export interface Parcel {
  readonly id: string

  readonly createdAt: string

  readonly measurements?: ParcelMeasurements

  readonly trackingData?: TrackingData

  readonly items?: DeliveryItem[]
}

export interface ParcelDraft {
  readonly measurements?: ParcelMeasurements

  readonly trackingData?: TrackingData

  readonly items?: DeliveryItem[]
}

export interface ParcelMeasurements {
  readonly heightInMillimeter?: number

  readonly lengthInMillimeter?: number

  readonly widthInMillimeter?: number

  readonly weightInGram?: number
}

export interface PaymentInfo {
  readonly payments: PaymentReference[]
}

export type PaymentState =
  | 'BalanceDue'
  | 'Failed'
  | 'Pending'
  | 'CreditOwed'
  | 'Paid'

export interface ProductVariantImportDraft {
  readonly id?: number

  readonly sku?: string

  readonly prices?: PriceDraft[]

  readonly attributes?: Attribute[]

  readonly images?: Image[]
}

export interface ReturnInfo {
  readonly items: ReturnItem[]

  readonly returnTrackingId?: string

  readonly returnDate?: string
}

export type ReturnItem = CustomLineItemReturnItem | LineItemReturnItem

export interface CustomLineItemReturnItem {
  readonly type: 'CustomLineItemReturnItem'

  readonly shipmentState: ReturnShipmentState

  readonly createdAt: string

  readonly lastModifiedAt: string

  readonly quantity: number

  readonly comment?: string

  readonly id: string

  readonly paymentState: ReturnPaymentState

  readonly customLineItemId: string
}

export interface LineItemReturnItem {
  readonly type: 'LineItemReturnItem'

  readonly shipmentState: ReturnShipmentState

  readonly createdAt: string

  readonly lastModifiedAt: string

  readonly quantity: number

  readonly comment?: string

  readonly id: string

  readonly paymentState: ReturnPaymentState

  readonly lineItemId: string
}

export interface ReturnItemDraft {
  readonly quantity: number

  readonly lineItemId?: string

  readonly customLineItemId?: string

  readonly comment?: string

  readonly shipmentState: ReturnShipmentState
}

export type ReturnPaymentState =
  | 'NonRefundable'
  | 'Initial'
  | 'Refunded'
  | 'NotRefunded'

export type ReturnShipmentState =
  | 'Advised'
  | 'Returned'
  | 'BackInStock'
  | 'Unusable'

export type ShipmentState =
  | 'Shipped'
  | 'Ready'
  | 'Pending'
  | 'Delayed'
  | 'Partial'
  | 'Backorder'

export interface ShippingInfoImportDraft {
  readonly shippingMethodName: string

  readonly price: Money

  readonly shippingRate: ShippingRateDraft

  readonly taxRate?: TaxRate

  readonly taxCategory?: TaxCategoryResourceIdentifier

  readonly shippingMethod?: ShippingMethodResourceIdentifier

  readonly deliveries?: Delivery[]

  readonly discountedPrice?: DiscountedLineItemPriceDraft

  readonly shippingMethodState?: ShippingMethodState
}

export interface SyncInfo {
  readonly channel: ChannelReference

  readonly externalId?: string

  readonly syncedAt: string
}

export interface TaxedItemPriceDraft {
  readonly totalNet: Money

  readonly totalGross: Money
}

export interface TrackingData {
  readonly trackingId?: string

  readonly carrier?: string

  readonly provider?: string

  readonly providerTransaction?: string

  readonly isReturn?: boolean
}

export interface OrderAddDeliveryAction {
  readonly action: 'addDelivery'

  readonly address?: Address

  readonly items?: DeliveryItem[]

  readonly parcels?: ParcelDraft[]
}

export interface OrderAddItemShippingAddressAction {
  readonly action: 'addItemShippingAddress'

  readonly address: Address
}

export interface OrderAddParcelToDeliveryAction {
  readonly action: 'addParcelToDelivery'

  readonly deliveryId: string

  readonly items?: DeliveryItem[]

  readonly trackingData?: TrackingData

  readonly measurements?: ParcelMeasurements
}

export interface OrderAddPaymentAction {
  readonly action: 'addPayment'

  readonly payment: PaymentResourceIdentifier
}

export interface OrderAddReturnInfoAction {
  readonly action: 'addReturnInfo'

  readonly returnDate?: string

  readonly returnTrackingId?: string

  readonly items: ReturnItemDraft[]
}

export interface OrderChangeOrderStateAction {
  readonly action: 'changeOrderState'

  readonly orderState: OrderState
}

export interface OrderChangePaymentStateAction {
  readonly action: 'changePaymentState'

  readonly paymentState?: PaymentState
}

export interface OrderChangeShipmentStateAction {
  readonly action: 'changeShipmentState'

  readonly shipmentState?: ShipmentState
}

export interface OrderImportCustomLineItemStateAction {
  readonly action: 'importCustomLineItemState'

  readonly customLineItemId: string

  readonly state: ItemState[]
}

export interface OrderImportLineItemStateAction {
  readonly action: 'importLineItemState'

  readonly lineItemId: string

  readonly state: ItemState[]
}

export interface OrderRemoveDeliveryAction {
  readonly action: 'removeDelivery'

  readonly deliveryId: string
}

export interface OrderRemoveItemShippingAddressAction {
  readonly action: 'removeItemShippingAddress'

  readonly addressKey: string
}

export interface OrderRemoveParcelFromDeliveryAction {
  readonly action: 'removeParcelFromDelivery'

  readonly parcelId: string
}

export interface OrderRemovePaymentAction {
  readonly action: 'removePayment'

  readonly payment: PaymentResourceIdentifier
}

export interface OrderSetBillingAddressAction {
  readonly action: 'setBillingAddress'

  readonly address?: Address
}

export interface OrderSetCustomFieldAction {
  readonly action: 'setCustomField'

  readonly name: string

  readonly value?: object
}

export interface OrderSetCustomLineItemCustomFieldAction {
  readonly action: 'setCustomLineItemCustomField'

  readonly customLineItemId: string

  readonly name: string

  readonly value?: object
}

export interface OrderSetCustomLineItemCustomTypeAction {
  readonly action: 'setCustomLineItemCustomType'

  readonly customLineItemId: string

  readonly fields?: FieldContainer

  readonly type?: TypeResourceIdentifier
}

export interface OrderSetCustomLineItemShippingDetailsAction {
  readonly action: 'setCustomLineItemShippingDetails'

  readonly customLineItemId: string

  readonly shippingDetails?: ItemShippingDetailsDraft
}

export interface OrderSetCustomTypeAction {
  readonly action: 'setCustomType'

  readonly fields?: FieldContainer

  readonly type?: TypeResourceIdentifier
}

export interface OrderSetCustomerEmailAction {
  readonly action: 'setCustomerEmail'

  readonly email?: string
}

export interface OrderSetCustomerIdAction {
  readonly action: 'setCustomerId'

  readonly customerId?: string
}

export interface OrderSetDeliveryAddressAction {
  readonly action: 'setDeliveryAddress'

  readonly deliveryId: string

  readonly address?: Address
}

export interface OrderSetDeliveryItemsAction {
  readonly action: 'setDeliveryItems'

  readonly deliveryId: string

  readonly items: DeliveryItem[]
}

export interface OrderSetLineItemCustomFieldAction {
  readonly action: 'setLineItemCustomField'

  readonly lineItemId: string

  readonly name: string

  readonly value?: object
}

export interface OrderSetLineItemCustomTypeAction {
  readonly action: 'setLineItemCustomType'

  readonly lineItemId: string

  readonly fields?: FieldContainer

  readonly type?: TypeResourceIdentifier
}

export interface OrderSetLineItemShippingDetailsAction {
  readonly action: 'setLineItemShippingDetails'

  readonly shippingDetails?: ItemShippingDetailsDraft

  readonly lineItemId: string
}

export interface OrderSetLocaleAction {
  readonly action: 'setLocale'

  readonly locale?: string
}

export interface OrderSetOrderNumberAction {
  readonly action: 'setOrderNumber'

  readonly orderNumber?: string
}

export interface OrderSetParcelItemsAction {
  readonly action: 'setParcelItems'

  readonly items: DeliveryItem[]

  readonly parcelId: string
}

export interface OrderSetParcelMeasurementsAction {
  readonly action: 'setParcelMeasurements'

  readonly measurements?: ParcelMeasurements

  readonly parcelId: string
}

export interface OrderSetParcelTrackingDataAction {
  readonly action: 'setParcelTrackingData'

  readonly trackingData?: TrackingData

  readonly parcelId: string
}

export interface OrderSetReturnPaymentStateAction {
  readonly action: 'setReturnPaymentState'

  readonly returnItemId: string

  readonly paymentState: ReturnPaymentState
}

export interface OrderSetReturnShipmentStateAction {
  readonly action: 'setReturnShipmentState'

  readonly shipmentState: ReturnShipmentState

  readonly returnItemId: string
}

export interface OrderSetShippingAddressAction {
  readonly action: 'setShippingAddress'

  readonly address?: Address
}

export interface OrderTransitionCustomLineItemStateAction {
  readonly action: 'transitionCustomLineItemState'

  readonly toState: StateResourceIdentifier

  readonly fromState: StateResourceIdentifier

  readonly customLineItemId: string

  readonly quantity: number

  readonly actualTransitionDate?: string
}

export interface OrderTransitionLineItemStateAction {
  readonly action: 'transitionLineItemState'

  readonly toState: StateResourceIdentifier

  readonly fromState: StateResourceIdentifier

  readonly quantity: number

  readonly lineItemId: string

  readonly actualTransitionDate?: string
}

export interface OrderTransitionStateAction {
  readonly action: 'transitionState'

  readonly force?: boolean

  readonly state: StateResourceIdentifier
}

export interface OrderUpdateItemShippingAddressAction {
  readonly action: 'updateItemShippingAddress'

  readonly address: Address
}

export interface OrderUpdateSyncInfoAction {
  readonly action: 'updateSyncInfo'

  readonly channel: ChannelResourceIdentifier

  readonly externalId?: string

  readonly syncedAt?: string
}
