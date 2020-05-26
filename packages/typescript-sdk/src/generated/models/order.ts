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
  TaxedPrice,
  TaxedPriceDraft,
  TaxMode,
} from 'models/cart'
import { CartDiscountReference } from 'models/cart-discount'
import { ChannelReference, ChannelResourceIdentifier } from 'models/channel'
import {
  Address,
  BaseResource,
  CreatedBy,
  Image,
  LastModifiedBy,
  LocalizedString,
  Money,
  PriceDraft,
  TypedMoney,
} from 'models/common'
import {
  CustomerGroupReference,
  CustomerGroupResourceIdentifier,
} from 'models/customer-group'
import {
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
  StagedOrderSetCustomerEmailAction,
  StagedOrderSetCustomerGroupAction,
  StagedOrderSetCustomerIdAction,
  StagedOrderSetCustomFieldAction,
  StagedOrderSetCustomLineItemCustomFieldAction,
  StagedOrderSetCustomLineItemCustomTypeAction,
  StagedOrderSetCustomLineItemShippingDetailsAction,
  StagedOrderSetCustomLineItemTaxAmountAction,
  StagedOrderSetCustomLineItemTaxRateAction,
  StagedOrderSetCustomShippingMethodAction,
  StagedOrderSetCustomTypeAction,
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
} from 'models/order-edit'
import { PaymentReference, PaymentResourceIdentifier } from 'models/payment'
import { Attribute } from 'models/product'
import {
  ShippingMethodResourceIdentifier,
  ShippingRateDraft,
} from 'models/shipping-method'
import { StateReference, StateResourceIdentifier } from 'models/state'
import { StoreKeyReference, StoreResourceIdentifier } from 'models/store'
import { TaxCategoryResourceIdentifier, TaxRate } from 'models/tax-category'
import {
  CustomFields,
  CustomFieldsDraft,
  FieldContainer,
  TypeResourceIdentifier,
} from 'models/type'

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
  /**
   *	Items which are shipped in this delivery regardless their distribution over several parcels.
   *	Can also be specified individually for each Parcel.
   */
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
  /**
   *	ID of the existing product.
   *	You also need to specify the ID of the variant if this property is set or alternatively you can just specify SKU of the product variant.
   */
  readonly productId?: string
  /**
   *	The product name.
   */
  readonly name: LocalizedString
  readonly variant: ProductVariantImportDraft
  readonly price: PriceDraft
  readonly quantity: number
  readonly state?: ItemState[]
  /**
   *	Optional connection to a particular supplier.
   *	By providing supply channel information, you can uniquely identify
   *	inventory entries that should be reserved.
   *	The provided channel should have the
   *	InventorySupply role.
   */
  readonly supplyChannel?: ChannelResourceIdentifier
  /**
   *	The channel is used to select a ProductPrice.
   *	The provided channel should have the ProductDistribution role.
   */
  readonly distributionChannel?: ChannelResourceIdentifier
  readonly taxRate?: TaxRate
  /**
   *	The custom fields.
   */
  readonly custom?: CustomFieldsDraft
  readonly shippingDetails?: ItemShippingDetailsDraft
}
export interface Order extends BaseResource {
  /**
   *	The unique ID of the order.
   */
  readonly id: string
  /**
   *	The current version of the order.
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
   *	This field will only be present if it was set for Order Import
   */
  readonly completedAt?: string
  /**
   *	String that uniquely identifies an order.
   *	It can be used to create more human-readable (in contrast to ID) identifier for the order.
   *	It should be unique across a project.
   *	Once it's set it cannot be changed.
   */
  readonly orderNumber?: string
  readonly customerId?: string
  readonly customerEmail?: string
  /**
   *	Identifies carts and orders belonging to an anonymous session (the customer has not signed up/in yet).
   */
  readonly anonymousId?: string
  readonly store?: StoreKeyReference
  readonly lineItems: LineItem[]
  readonly customLineItems: CustomLineItem[]
  readonly totalPrice: TypedMoney
  /**
   *	The taxes are calculated based on the shipping address.
   */
  readonly taxedPrice?: TaxedPrice
  readonly shippingAddress?: Address
  readonly billingAddress?: Address
  readonly taxMode?: TaxMode
  /**
   *	When calculating taxes for `taxedPrice`, the selected mode is used for rouding.
   */
  readonly taxRoundingMode?: RoundingMode
  /**
   *	Set when the customer is set and the customer is a member of a customer group.
   *	Used for product variant price selection.
   */
  readonly customerGroup?: CustomerGroupReference
  /**
   *	A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   *	Used for product variant price selection.
   */
  readonly country?: string
  /**
   *	One of the four predefined OrderStates.
   */
  readonly orderState: OrderState
  /**
   *	This reference can point to a state in a custom workflow.
   */
  readonly state?: StateReference
  readonly shipmentState?: ShipmentState
  readonly paymentState?: PaymentState
  /**
   *	Set if the ShippingMethod is set.
   */
  readonly shippingInfo?: ShippingInfo
  readonly syncInfo: SyncInfo[]
  readonly returnInfo?: ReturnInfo[]
  readonly discountCodes?: DiscountCodeInfo[]
  /**
   *	The sequence number of the last order message produced by changes to this order.
   *	`0` means, that no messages were created yet.
   */
  readonly lastMessageSequenceNumber: number
  /**
   *	Set when this order was created from a cart.
   *	The cart will have the state `Ordered`.
   */
  readonly cart?: CartReference
  readonly custom?: CustomFields
  readonly paymentInfo?: PaymentInfo
  readonly locale?: string
  readonly inventoryMode?: InventoryMode
  readonly origin: CartOrigin
  /**
   *	When calculating taxes for `taxedPrice`, the selected mode is used for calculating the price with LineItemLevel (horizontally) or UnitPriceLevel (vertically) calculation mode.
   */
  readonly taxCalculationMode?: TaxCalculationMode
  /**
   *	The shippingRateInput is used as an input to select a ShippingRatePriceTier.
   */
  readonly shippingRateInput?: ShippingRateInput
  /**
   *	Contains addresses for orders with multiple shipping addresses.
   */
  readonly itemShippingAddresses?: Address[]
  /**
   *	Automatically filled when a line item with LineItemMode `GiftLineItem` is removed from this order.
   */
  readonly refusedGifts: CartDiscountReference[]
}
export interface OrderFromCartDraft {
  /**
   *	The unique id of the cart from which an order is created.
   */
  readonly id: string
  readonly version: number
  /**
   *	String that uniquely identifies an order.
   *	It can be used to create more human-readable (in contrast to ID) identifier for the order.
   *	It should be unique across a project.
   *	Once it's set it cannot be changed.
   *	For easier use on Get, Update and Delete actions we suggest assigning order numbers that match the regular expression `[a-z0-9_\-]{2,36}`.
   */
  readonly orderNumber?: string
  readonly paymentState?: PaymentState
  readonly shipmentState?: ShipmentState
  /**
   *	Order will be created with `Open` status by default.
   */
  readonly orderState?: OrderState
  readonly state?: StateResourceIdentifier
}
export interface OrderImportDraft {
  /**
   *	String that unique identifies an order.
   *	It can be used to create more human-readable (in contrast to ID) identifier for the order.
   *	It should be unique within a project.
   */
  readonly orderNumber?: string
  /**
   *	If given the customer with that ID must exist in the project.
   */
  readonly customerId?: string
  /**
   *	The customer email can be used when no check against existing Customers is desired during order import.
   */
  readonly customerEmail?: string
  /**
   *	If not given `customLineItems` must not be empty.
   */
  readonly lineItems?: LineItemImportDraft[]
  /**
   *	If not given `lineItems` must not be empty.
   */
  readonly customLineItems?: CustomLineItemDraft[]
  readonly totalPrice: Money
  /**
   *	Order Import does not support calculation of taxes.
   *	When setting the draft the taxedPrice is to be provided.
   */
  readonly taxedPrice?: TaxedPriceDraft
  readonly shippingAddress?: Address
  readonly billingAddress?: Address
  /**
   *	Set when the customer is set and the customer is a member of a customer group.
   *	Used for product variant price selection.
   */
  readonly customerGroup?: CustomerGroupResourceIdentifier
  /**
   *	A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   *	Used for product variant price selection.
   */
  readonly country?: string
  /**
   *	If not given the `Open` state will be assigned by default.
   */
  readonly orderState?: OrderState
  readonly shipmentState?: ShipmentState
  readonly paymentState?: PaymentState
  /**
   *	Set if the ShippingMethod is set.
   */
  readonly shippingInfo?: ShippingInfoImportDraft
  readonly completedAt?: string
  /**
   *	The custom fields.
   */
  readonly custom?: CustomFieldsDraft
  /**
   *	If not given the mode `None` will be assigned by default.
   */
  readonly inventoryMode?: InventoryMode
  /**
   *	If not given the tax rounding mode `HalfEven` will be assigned by default.
   */
  readonly taxRoundingMode?: RoundingMode
  /**
   *	Contains addresses for orders with multiple shipping addresses.
   */
  readonly itemShippingAddresses?: Address[]
  readonly store?: StoreResourceIdentifier
  /**
   *	The default origin is `Customer`.
   */
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
  | OrderSetStoreAction
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
  /**
   *	The delivery items contained in this parcel.
   */
  readonly items?: DeliveryItem[]
}
export interface ParcelDraft {
  readonly measurements?: ParcelMeasurements
  readonly trackingData?: TrackingData
  /**
   *	The delivery items contained in this parcel.
   */
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
  /**
   *	The sequential ID of the variant within the product.
   *	The variant with provided ID should exist in some existing product, so you also need to specify the productId if this property is set,
   *	or alternatively you can just specify SKU of the product variant.
   */
  readonly id?: number
  /**
   *	The SKU of the existing variant.
   */
  readonly sku?: string
  /**
   *	The prices of the variant.
   *	The prices should not contain two prices for the same price scope (same currency, country and customer group).
   *	If this property is defined, then it will override the `prices` property from the original product variant, otherwise `prices` property from the original product variant would be copied in the resulting order.
   */
  readonly prices?: PriceDraft[]
  /**
   *	If this property is defined, then it will override the `attributes` property from the original
   *	product variant, otherwise `attributes` property from the original product variant would be copied in the resulting order.
   */
  readonly attributes?: Attribute[]
  /**
   *	If this property is defined, then it will override the `images` property from the original
   *	product variant, otherwise `images` property from the original product variant would be copied in the resulting order.
   */
  readonly images?: Image[]
}
export interface ReturnInfo {
  readonly items: ReturnItem[]
  /**
   *	Identifies, which return tracking ID is connected to this particular return.
   */
  readonly returnTrackingId?: string
  readonly returnDate?: string
}
export type ReturnItem = CustomLineItemReturnItem | LineItemReturnItem
export interface CustomLineItemReturnItem {
  readonly type: 'CustomLineItemReturnItem'
  readonly id: string
  readonly quantity: number
  readonly comment?: string
  readonly shipmentState: ReturnShipmentState
  readonly paymentState: ReturnPaymentState
  readonly lastModifiedAt: string
  readonly createdAt: string
  readonly customLineItemId: string
}
export interface LineItemReturnItem {
  readonly type: 'LineItemReturnItem'
  readonly id: string
  readonly quantity: number
  readonly comment?: string
  readonly shipmentState: ReturnShipmentState
  readonly paymentState: ReturnPaymentState
  readonly lastModifiedAt: string
  readonly createdAt: string
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
  /**
   *	The shipping rate used to determine the price.
   */
  readonly shippingRate: ShippingRateDraft
  readonly taxRate?: TaxRate
  readonly taxCategory?: TaxCategoryResourceIdentifier
  /**
   *	Not set if custom shipping method is used.
   */
  readonly shippingMethod?: ShippingMethodResourceIdentifier
  /**
   *	Deliveries are compilations of information on how the articles are being delivered to the customers.
   */
  readonly deliveries?: Delivery[]
  readonly discountedPrice?: DiscountedLineItemPriceDraft
  /**
   *	Indicates whether the ShippingMethod referenced is allowed for the cart or not.
   */
  readonly shippingMethodState?: ShippingMethodState
}
export interface SyncInfo {
  /**
   *	Connection to a particular synchronization destination.
   */
  readonly channel: ChannelReference
  /**
   *	Can be used to reference an external order instance, file etc.
   */
  readonly externalId?: string
  readonly syncedAt: string
}
export interface TaxedItemPriceDraft {
  readonly totalNet: Money
  readonly totalGross: Money
}
export interface TrackingData {
  /**
   *	The ID to track one parcel.
   */
  readonly trackingId?: string
  /**
   *	The carrier that delivers the parcel.
   */
  readonly carrier?: string
  readonly provider?: string
  readonly providerTransaction?: string
  /**
   *	Flag to distinguish if the parcel is on the way to the customer (false) or on the way back (true).
   */
  readonly isReturn?: boolean
}
export interface OrderAddDeliveryAction {
  readonly action: 'addDelivery'
  readonly items?: DeliveryItem[]
  readonly address?: Address
  readonly parcels?: ParcelDraft[]
}
export interface OrderAddItemShippingAddressAction {
  readonly action: 'addItemShippingAddress'
  readonly address: Address
}
export interface OrderAddParcelToDeliveryAction {
  readonly action: 'addParcelToDelivery'
  readonly deliveryId: string
  readonly measurements?: ParcelMeasurements
  readonly trackingData?: TrackingData
  readonly items?: DeliveryItem[]
}
export interface OrderAddPaymentAction {
  readonly action: 'addPayment'
  readonly payment: PaymentResourceIdentifier
}
export interface OrderAddReturnInfoAction {
  readonly action: 'addReturnInfo'
  readonly returnTrackingId?: string
  readonly items: ReturnItemDraft[]
  readonly returnDate?: string
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
  readonly value?: any
}
export interface OrderSetCustomLineItemCustomFieldAction {
  readonly action: 'setCustomLineItemCustomField'
  readonly customLineItemId: string
  readonly name: string
  readonly value?: any
}
export interface OrderSetCustomLineItemCustomTypeAction {
  readonly action: 'setCustomLineItemCustomType'
  readonly customLineItemId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface OrderSetCustomLineItemShippingDetailsAction {
  readonly action: 'setCustomLineItemShippingDetails'
  readonly customLineItemId: string
  readonly shippingDetails?: ItemShippingDetailsDraft
}
export interface OrderSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
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
  readonly value?: any
}
export interface OrderSetLineItemCustomTypeAction {
  readonly action: 'setLineItemCustomType'
  readonly lineItemId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface OrderSetLineItemShippingDetailsAction {
  readonly action: 'setLineItemShippingDetails'
  readonly lineItemId: string
  readonly shippingDetails?: ItemShippingDetailsDraft
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
  readonly parcelId: string
  readonly items: DeliveryItem[]
}
export interface OrderSetParcelMeasurementsAction {
  readonly action: 'setParcelMeasurements'
  readonly parcelId: string
  readonly measurements?: ParcelMeasurements
}
export interface OrderSetParcelTrackingDataAction {
  readonly action: 'setParcelTrackingData'
  readonly parcelId: string
  readonly trackingData?: TrackingData
}
export interface OrderSetReturnPaymentStateAction {
  readonly action: 'setReturnPaymentState'
  readonly returnItemId: string
  readonly paymentState: ReturnPaymentState
}
export interface OrderSetReturnShipmentStateAction {
  readonly action: 'setReturnShipmentState'
  readonly returnItemId: string
  readonly shipmentState: ReturnShipmentState
}
export interface OrderSetShippingAddressAction {
  readonly action: 'setShippingAddress'
  readonly address?: Address
}
export interface OrderSetStoreAction {
  readonly action: 'setStore'
  readonly store?: StoreResourceIdentifier
}
export interface OrderTransitionCustomLineItemStateAction {
  readonly action: 'transitionCustomLineItemState'
  readonly customLineItemId: string
  readonly quantity: number
  readonly fromState: StateResourceIdentifier
  readonly toState: StateResourceIdentifier
  readonly actualTransitionDate?: string
}
export interface OrderTransitionLineItemStateAction {
  readonly action: 'transitionLineItemState'
  readonly lineItemId: string
  readonly quantity: number
  readonly fromState: StateResourceIdentifier
  readonly toState: StateResourceIdentifier
  readonly actualTransitionDate?: string
}
export interface OrderTransitionStateAction {
  readonly action: 'transitionState'
  readonly state: StateResourceIdentifier
  readonly force?: boolean
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
