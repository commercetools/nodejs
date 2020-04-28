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
  DiscountCodeState,
  DiscountedLineItemPriceForQuantity,
  LineItem,
  ProductPublishScope,
  ShippingInfo,
  ShippingRateInput,
  TaxedItemPrice,
} from 'models/cart'
import { Category, CategoryReference } from 'models/category'
import { ChannelReference } from 'models/channel'
import {
  Address,
  BaseResource,
  CreatedBy,
  DiscountedPrice,
  Image,
  LastModifiedBy,
  LocalizedString,
  Money,
  Reference,
} from 'models/common'
import { Customer, CustomerReference } from 'models/customer'
import { CustomerGroupReference } from 'models/customer-group'
import { DiscountCodeReference } from 'models/discount-code'
import { InventoryEntry } from 'models/inventory'
import {
  Delivery,
  DeliveryItem,
  Order,
  OrderState,
  Parcel,
  ParcelMeasurements,
  PaymentState,
  ReturnInfo,
  ReturnShipmentState,
  ShipmentState,
  TrackingData,
} from 'models/order'
import { OrderEditApplied, OrderEditReference } from 'models/order-edit'
import { Payment, Transaction, TransactionState } from 'models/payment'
import { ProductProjection, ProductVariant } from 'models/product'
import { Review } from 'models/review'
import { StateReference } from 'models/state'
import { StoreKeyReference } from 'models/store'
import { CustomFields } from 'models/type'

export type Message =
  | OrderBillingAddressSetMessage
  | OrderCreatedMessage
  | OrderCustomLineItemDiscountSetMessage
  | OrderCustomerEmailSetMessage
  | OrderCustomerGroupSetMessage
  | OrderCustomerSetMessage
  | OrderDeletedMessage
  | OrderDiscountCodeAddedMessage
  | OrderDiscountCodeRemovedMessage
  | OrderDiscountCodeStateSetMessage
  | OrderEditAppliedMessage
  | OrderImportedMessage
  | OrderLineItemAddedMessage
  | OrderLineItemDiscountSetMessage
  | OrderPaymentStateChangedMessage
  | OrderReturnInfoAddedMessage
  | OrderReturnShipmentStateChangedMessage
  | OrderShipmentStateChangedMessage
  | OrderShippingAddressSetMessage
  | OrderShippingInfoSetMessage
  | OrderShippingRateInputSetMessage
  | OrderStateChangedMessage
  | OrderStateTransitionMessage
  | OrderStoreSetMessage
  | ParcelAddedToDeliveryMessage
  | ParcelItemsUpdatedMessage
  | ParcelMeasurementsUpdatedMessage
  | ParcelRemovedFromDeliveryMessage
  | ParcelTrackingDataUpdatedMessage
  | PaymentCreatedMessage
  | PaymentInteractionAddedMessage
  | PaymentStatusInterfaceCodeSetMessage
  | PaymentStatusStateTransitionMessage
  | PaymentTransactionAddedMessage
  | PaymentTransactionStateChangedMessage
  | ProductAddedToCategoryMessage
  | ProductCreatedMessage
  | ProductDeletedMessage
  | ProductImageAddedMessage
  | ProductPriceDiscountsSetMessage
  | ProductPriceExternalDiscountSetMessage
  | ProductPublishedMessage
  | ProductRemovedFromCategoryMessage
  | ProductRevertedStagedChangesMessage
  | ProductSlugChangedMessage
  | ProductStateTransitionMessage
  | ProductUnpublishedMessage
  | ProductVariantDeletedMessage
  | ReviewCreatedMessage
  | ReviewRatingSetMessage
  | ReviewStateTransitionMessage
  | CustomerAddressRemovedMessage
  | CustomerEmailVerifiedMessage
  | CustomerDateOfBirthSetMessage
  | CategorySlugChangedMessage
  | CustomerAddressChangedMessage
  | LineItemStateTransitionMessage
  | CustomerEmailChangedMessage
  | CustomerCompanyNameSetMessage
  | CustomLineItemStateTransitionMessage
  | CustomerGroupSetMessage
  | DeliveryAddedMessage
  | InventoryEntryCreatedMessage
  | CustomerCreatedMessage
  | CustomerAddressAddedMessage
  | DeliveryItemsUpdatedMessage
  | DeliveryRemovedMessage
  | InventoryEntryDeletedMessage
  | InventoryEntryQuantitySetMessage
  | CategoryCreatedMessage
  | DeliveryAddressSetMessage
export interface CategoryCreatedMessage {
  readonly type: 'CategoryCreated'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly category: Category
}
export interface CategorySlugChangedMessage {
  readonly type: 'CategorySlugChanged'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly slug: LocalizedString
}
export interface CustomLineItemStateTransitionMessage {
  readonly type: 'CustomLineItemStateTransition'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly customLineItemId: string
  readonly transitionDate: string
  readonly quantity: number
  readonly fromState: StateReference
  readonly toState: StateReference
}
export interface CustomerAddressAddedMessage {
  readonly type: 'CustomerAddressAdded'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly address: Address
}
export interface CustomerAddressChangedMessage {
  readonly type: 'CustomerAddressChanged'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly address: Address
}
export interface CustomerAddressRemovedMessage {
  readonly type: 'CustomerAddressRemoved'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly address: Address
}
export interface CustomerCompanyNameSetMessage {
  readonly type: 'CustomerCompanyNameSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly companyName: string
}
export interface CustomerCreatedMessage {
  readonly type: 'CustomerCreated'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly customer: Customer
}
export interface CustomerDateOfBirthSetMessage {
  readonly type: 'CustomerDateOfBirthSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly dateOfBirth: string
}
export interface CustomerEmailChangedMessage {
  readonly type: 'CustomerEmailChanged'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly email: string
}
export interface CustomerEmailVerifiedMessage {
  readonly type: 'CustomerEmailVerified'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
}
export interface CustomerGroupSetMessage {
  readonly type: 'CustomerGroupSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly customerGroup: CustomerGroupReference
}
export interface DeliveryAddedMessage {
  readonly type: 'DeliveryAdded'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly delivery: Delivery
}
export interface DeliveryAddressSetMessage {
  readonly type: 'DeliveryAddressSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly deliveryId: string
  readonly address?: Address
  readonly oldAddress?: Address
}
export interface DeliveryItemsUpdatedMessage {
  readonly type: 'DeliveryItemsUpdated'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly deliveryId: string
  readonly items: DeliveryItem[]
  readonly oldItems: DeliveryItem[]
}
export interface DeliveryRemovedMessage {
  readonly type: 'DeliveryRemoved'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly delivery: Delivery
}
export interface InventoryEntryCreatedMessage {
  readonly type: 'InventoryEntryCreated'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly inventoryEntry: InventoryEntry
}
export interface InventoryEntryDeletedMessage {
  readonly type: 'InventoryEntryDeleted'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly sku: string
  readonly supplyChannel: ChannelReference
}
export interface InventoryEntryQuantitySetMessage {
  readonly type: 'InventoryEntryQuantitySet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly oldQuantityOnStock: number
  readonly newQuantityOnStock: number
  readonly oldAvailableQuantity: number
  readonly newAvailableQuantity: number
}
export interface LineItemStateTransitionMessage {
  readonly type: 'LineItemStateTransition'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly lineItemId: string
  readonly transitionDate: string
  readonly quantity: number
  readonly fromState: StateReference
  readonly toState: StateReference
}
export interface MessageConfiguration {
  readonly enabled: boolean
  readonly deleteDaysAfterCreation?: number
}
export interface MessageConfigurationDraft {
  readonly enabled: boolean
  readonly deleteDaysAfterCreation: number
}
export interface MessagePagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Message[]
}
export interface OrderBillingAddressSetMessage {
  readonly type: 'OrderBillingAddressSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly address?: Address
  readonly oldAddress?: Address
}
export interface OrderCreatedMessage {
  readonly type: 'OrderCreated'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly order: Order
}
export interface OrderCustomLineItemDiscountSetMessage {
  readonly type: 'OrderCustomLineItemDiscountSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly customLineItemId: string
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[]
  readonly taxedPrice?: TaxedItemPrice
}
export interface OrderCustomerEmailSetMessage {
  readonly type: 'OrderCustomerEmailSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly email?: string
  readonly oldEmail?: string
}
export interface OrderCustomerGroupSetMessage {
  readonly type: 'OrderCustomerGroupSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly customerGroup?: CustomerGroupReference
  readonly oldCustomerGroup?: CustomerGroupReference
}
export interface OrderCustomerSetMessage {
  readonly type: 'OrderCustomerSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly customer?: CustomerReference
  readonly customerGroup?: CustomerGroupReference
  readonly oldCustomer?: CustomerReference
  readonly oldCustomerGroup?: CustomerGroupReference
}
export interface OrderDeletedMessage {
  readonly type: 'OrderDeleted'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly order: Order
}
export interface OrderDiscountCodeAddedMessage {
  readonly type: 'OrderDiscountCodeAdded'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly discountCode: DiscountCodeReference
}
export interface OrderDiscountCodeRemovedMessage {
  readonly type: 'OrderDiscountCodeRemoved'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly discountCode: DiscountCodeReference
}
export interface OrderDiscountCodeStateSetMessage {
  readonly type: 'OrderDiscountCodeStateSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly discountCode: DiscountCodeReference
  readonly state: DiscountCodeState
  readonly oldState?: DiscountCodeState
}
export interface OrderEditAppliedMessage {
  readonly type: 'OrderEditApplied'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly edit: OrderEditReference
  readonly result: OrderEditApplied
}
export interface OrderImportedMessage {
  readonly type: 'OrderImported'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly order: Order
}
export interface OrderLineItemAddedMessage {
  readonly type: 'OrderLineItemAdded'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly lineItem: LineItem
  readonly addedQuantity: number
}
export interface OrderLineItemDiscountSetMessage {
  readonly type: 'OrderLineItemDiscountSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly lineItemId: string
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[]
  readonly totalPrice: Money
  readonly taxedPrice?: TaxedItemPrice
}
export interface OrderPaymentStateChangedMessage {
  readonly type: 'OrderPaymentStateChanged'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly paymentState: PaymentState
  readonly oldPaymentState?: PaymentState
}
export interface OrderReturnInfoAddedMessage {
  readonly type: 'ReturnInfoAdded'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly returnInfo: ReturnInfo
}
export interface OrderReturnShipmentStateChangedMessage {
  readonly type: 'OrderReturnShipmentStateChanged'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly returnItemId: string
  readonly returnShipmentState: ReturnShipmentState
}
export interface OrderShipmentStateChangedMessage {
  readonly type: 'OrderShipmentStateChanged'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly shipmentState: ShipmentState
  readonly oldShipmentState?: ShipmentState
}
export interface OrderShippingAddressSetMessage {
  readonly type: 'OrderShippingAddressSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly address?: Address
  readonly oldAddress?: Address
}
export interface OrderShippingInfoSetMessage {
  readonly type: 'OrderShippingInfoSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly shippingInfo?: ShippingInfo
  readonly oldShippingInfo?: ShippingInfo
}
export interface OrderShippingRateInputSetMessage {
  readonly type: 'OrderShippingRateInputSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly shippingRateInput?: ShippingRateInput
  readonly oldShippingRateInput?: ShippingRateInput
}
export interface OrderStateChangedMessage {
  readonly type: 'OrderStateChanged'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly orderState: OrderState
  readonly oldOrderState: OrderState
}
export interface OrderStateTransitionMessage {
  readonly type: 'OrderStateTransition'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly state: StateReference
  readonly force: boolean
}
export interface OrderStoreSetMessage {
  readonly type: 'OrderStoreSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly store: StoreKeyReference
}
export interface ParcelAddedToDeliveryMessage {
  readonly type: 'ParcelAddedToDelivery'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly delivery: Delivery
  readonly parcel: Parcel
}
export interface ParcelItemsUpdatedMessage {
  readonly type: 'ParcelItemsUpdated'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly parcelId: string
  readonly deliveryId?: string
  readonly items: DeliveryItem[]
  readonly oldItems: DeliveryItem[]
}
export interface ParcelMeasurementsUpdatedMessage {
  readonly type: 'ParcelMeasurementsUpdated'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly deliveryId: string
  readonly parcelId: string
  readonly measurements?: ParcelMeasurements
}
export interface ParcelRemovedFromDeliveryMessage {
  readonly type: 'ParcelRemovedFromDelivery'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly deliveryId: string
  readonly parcel: Parcel
}
export interface ParcelTrackingDataUpdatedMessage {
  readonly type: 'ParcelTrackingDataUpdated'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly deliveryId: string
  readonly parcelId: string
  readonly trackingData?: TrackingData
}
export interface PaymentCreatedMessage {
  readonly type: 'PaymentCreated'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly payment: Payment
}
export interface PaymentInteractionAddedMessage {
  readonly type: 'PaymentInteractionAdded'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly interaction: CustomFields
}
export interface PaymentStatusInterfaceCodeSetMessage {
  readonly type: 'PaymentStatusInterfaceCodeSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly paymentId: string
  readonly interfaceCode: string
}
export interface PaymentStatusStateTransitionMessage {
  readonly type: 'PaymentStatusStateTransition'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly state: StateReference
  readonly force: boolean
}
export interface PaymentTransactionAddedMessage {
  readonly type: 'PaymentTransactionAdded'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly transaction: Transaction
}
export interface PaymentTransactionStateChangedMessage {
  readonly type: 'PaymentTransactionStateChanged'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly transactionId: string
  readonly state: TransactionState
}
export interface ProductAddedToCategoryMessage {
  readonly type: 'ProductAddedToCategory'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly category: CategoryReference
  readonly staged: boolean
}
export interface ProductCreatedMessage {
  readonly type: 'ProductCreated'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly productProjection: ProductProjection
}
export interface ProductDeletedMessage {
  readonly type: 'ProductDeleted'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly removedImageUrls: string[]
  readonly currentProjection: ProductProjection
}
export interface ProductImageAddedMessage {
  readonly type: 'ProductImageAdded'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly variantId: number
  readonly image: Image
  readonly staged: boolean
}
export interface ProductPriceDiscountsSetMessage {
  readonly type: 'ProductPriceDiscountsSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly updatedPrices: ProductPriceDiscountsSetUpdatedPrice[]
}
export interface ProductPriceDiscountsSetUpdatedPrice {
  readonly variantId: number
  readonly variantKey?: string
  readonly sku?: string
  readonly priceId: string
  readonly discounted?: DiscountedPrice
  readonly staged: boolean
}
export interface ProductPriceExternalDiscountSetMessage {
  readonly type: 'ProductPriceExternalDiscountSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly variantId: number
  readonly variantKey?: string
  readonly sku?: string
  readonly priceId: string
  readonly discounted?: DiscountedPrice
  readonly staged: boolean
}
export interface ProductPublishedMessage {
  readonly type: 'ProductPublished'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly removedImageUrls: any[]
  readonly productProjection: ProductProjection
  readonly scope: ProductPublishScope
}
export interface ProductRemovedFromCategoryMessage {
  readonly type: 'ProductRemovedFromCategory'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly category: CategoryReference
  readonly staged: boolean
}
export interface ProductRevertedStagedChangesMessage {
  readonly type: 'ProductRevertedStagedChanges'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly removedImageUrls: string[]
}
export interface ProductSlugChangedMessage {
  readonly type: 'ProductSlugChanged'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly slug: LocalizedString
}
export interface ProductStateTransitionMessage {
  readonly type: 'ProductStateTransition'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly state: StateReference
  readonly force: boolean
}
export interface ProductUnpublishedMessage {
  readonly type: 'ProductUnpublished'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
}
export interface ProductVariantDeletedMessage {
  readonly type: 'ProductVariantDeleted'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly variant: ProductVariant
  readonly removedImageUrls: string[]
}
export interface ReviewCreatedMessage {
  readonly type: 'ReviewCreated'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly review: Review
}
export interface ReviewRatingSetMessage {
  readonly type: 'ReviewRatingSet'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly oldRating?: number
  readonly newRating?: number
  readonly includedInStatistics: boolean
  readonly target?: Reference
}
export interface ReviewStateTransitionMessage {
  readonly type: 'ReviewStateTransition'
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly resourceVersion: number
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly oldState: StateReference
  readonly newState: StateReference
  readonly oldIncludedInStatistics: boolean
  readonly newIncludedInStatistics: boolean
  readonly target: Reference
  readonly force: boolean
}
export interface UserProvidedIdentifiers {
  readonly key?: string
  readonly externalId?: string
  readonly orderNumber?: string
  readonly customerNumber?: string
  readonly sku?: string
  readonly slug?: LocalizedString
}
export type MessagePayload =
  | OrderBillingAddressSetMessagePayload
  | OrderCreatedMessagePayload
  | OrderCustomLineItemDiscountSetMessagePayload
  | OrderCustomerEmailSetMessagePayload
  | OrderCustomerGroupSetMessagePayload
  | OrderCustomerSetMessagePayload
  | OrderDeletedMessagePayload
  | OrderDiscountCodeAddedMessagePayload
  | OrderDiscountCodeRemovedMessagePayload
  | OrderDiscountCodeStateSetMessagePayload
  | OrderEditAppliedMessagePayload
  | OrderImportedMessagePayload
  | OrderLineItemAddedMessagePayload
  | OrderLineItemDiscountSetMessagePayload
  | OrderPaymentStateChangedMessagePayload
  | OrderReturnInfoAddedMessagePayload
  | OrderReturnShipmentStateChangedMessagePayload
  | OrderShipmentStateChangedMessagePayload
  | OrderShippingAddressSetMessagePayload
  | OrderShippingInfoSetMessagePayload
  | OrderShippingRateInputSetMessagePayload
  | OrderStateChangedMessagePayload
  | OrderStateTransitionMessagePayload
  | OrderStoreSetMessagePayload
  | ParcelAddedToDeliveryMessagePayload
  | ParcelItemsUpdatedMessagePayload
  | ParcelMeasurementsUpdatedMessagePayload
  | ParcelRemovedFromDeliveryMessagePayload
  | ParcelTrackingDataUpdatedMessagePayload
  | PaymentCreatedMessagePayload
  | PaymentInteractionAddedMessagePayload
  | PaymentStatusInterfaceCodeSetMessagePayload
  | PaymentStatusStateTransitionMessagePayload
  | PaymentTransactionAddedMessagePayload
  | PaymentTransactionStateChangedMessagePayload
  | ProductAddedToCategoryMessagePayload
  | ProductCreatedMessagePayload
  | ProductDeletedMessagePayload
  | ProductImageAddedMessagePayload
  | ProductPriceDiscountsSetMessagePayload
  | ProductPriceExternalDiscountSetMessagePayload
  | ProductPublishedMessagePayload
  | ProductRemovedFromCategoryMessagePayload
  | ProductRevertedStagedChangesMessagePayload
  | ProductSlugChangedMessagePayload
  | ProductStateTransitionMessagePayload
  | ProductUnpublishedMessagePayload
  | ProductVariantDeletedMessagePayload
  | ReviewCreatedMessagePayload
  | ReviewRatingSetMessagePayload
  | ReviewStateTransitionMessagePayload
  | DeliveryAddedMessagePayload
  | InventoryEntryQuantitySetMessagePayload
  | LineItemStateTransitionMessagePayload
  | CustomLineItemStateTransitionMessagePayload
  | CustomerDateOfBirthSetMessagePayload
  | InventoryEntryDeletedMessagePayload
  | CustomerEmailChangedMessagePayload
  | CategoryCreatedMessagePayload
  | CustomerAddressChangedMessagePayload
  | InventoryEntryCreatedMessagePayload
  | CategorySlugChangedMessagePayload
  | CustomerCreatedMessagePayload
  | CustomerAddressRemovedMessagePayload
  | DeliveryItemsUpdatedMessagePayload
  | DeliveryAddressSetMessagePayload
  | CustomerEmailVerifiedMessagePayload
  | DeliveryRemovedMessagePayload
  | CustomerCompanyNameSetMessagePayload
  | CustomerGroupSetMessagePayload
  | CustomerAddressAddedMessagePayload
export interface CategoryCreatedMessagePayload {
  readonly type: 'CategoryCreated'
  readonly category: Category
}
export interface CategorySlugChangedMessagePayload {
  readonly type: 'CategorySlugChanged'
  readonly slug: LocalizedString
}
export interface CustomLineItemStateTransitionMessagePayload {
  readonly type: 'CustomLineItemStateTransition'
  readonly customLineItemId: string
  readonly transitionDate: string
  readonly quantity: number
  readonly fromState: StateReference
  readonly toState: StateReference
}
export interface CustomerAddressAddedMessagePayload {
  readonly type: 'CustomerAddressAdded'
  readonly address: Address
}
export interface CustomerAddressChangedMessagePayload {
  readonly type: 'CustomerAddressChanged'
  readonly address: Address
}
export interface CustomerAddressRemovedMessagePayload {
  readonly type: 'CustomerAddressRemoved'
  readonly address: Address
}
export interface CustomerCompanyNameSetMessagePayload {
  readonly type: 'CustomerCompanyNameSet'
  readonly companyName: string
}
export interface CustomerCreatedMessagePayload {
  readonly type: 'CustomerCreated'
  readonly customer: Customer
}
export interface CustomerDateOfBirthSetMessagePayload {
  readonly type: 'CustomerDateOfBirthSet'
  readonly dateOfBirth: string
}
export interface CustomerEmailChangedMessagePayload {
  readonly type: 'CustomerEmailChanged'
  readonly email: string
}
export interface CustomerEmailVerifiedMessagePayload {
  readonly type: 'CustomerEmailVerified'
}
export interface CustomerGroupSetMessagePayload {
  readonly type: 'CustomerGroupSet'
  readonly customerGroup: CustomerGroupReference
}
export interface DeliveryAddedMessagePayload {
  readonly type: 'DeliveryAdded'
  readonly delivery: Delivery
}
export interface DeliveryAddressSetMessagePayload {
  readonly type: 'DeliveryAddressSet'
  readonly deliveryId: string
  readonly address?: Address
  readonly oldAddress?: Address
}
export interface DeliveryItemsUpdatedMessagePayload {
  readonly type: 'DeliveryItemsUpdated'
  readonly deliveryId: string
  readonly items: DeliveryItem[]
  readonly oldItems: DeliveryItem[]
}
export interface DeliveryRemovedMessagePayload {
  readonly type: 'DeliveryRemoved'
  readonly delivery: Delivery
}
export interface InventoryEntryCreatedMessagePayload {
  readonly type: 'InventoryEntryCreated'
  readonly inventoryEntry: InventoryEntry
}
export interface InventoryEntryDeletedMessagePayload {
  readonly type: 'InventoryEntryDeleted'
  readonly sku: string
  readonly supplyChannel: ChannelReference
}
export interface InventoryEntryQuantitySetMessagePayload {
  readonly type: 'InventoryEntryQuantitySet'
  readonly oldQuantityOnStock: number
  readonly newQuantityOnStock: number
  readonly oldAvailableQuantity: number
  readonly newAvailableQuantity: number
}
export interface LineItemStateTransitionMessagePayload {
  readonly type: 'LineItemStateTransition'
  readonly lineItemId: string
  readonly transitionDate: string
  readonly quantity: number
  readonly fromState: StateReference
  readonly toState: StateReference
}
export interface OrderBillingAddressSetMessagePayload {
  readonly type: 'OrderBillingAddressSet'
  readonly address?: Address
  readonly oldAddress?: Address
}
export interface OrderCreatedMessagePayload {
  readonly type: 'OrderCreated'
  readonly order: Order
}
export interface OrderCustomLineItemDiscountSetMessagePayload {
  readonly type: 'OrderCustomLineItemDiscountSet'
  readonly customLineItemId: string
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[]
  readonly taxedPrice?: TaxedItemPrice
}
export interface OrderCustomerEmailSetMessagePayload {
  readonly type: 'OrderCustomerEmailSet'
  readonly email?: string
  readonly oldEmail?: string
}
export interface OrderCustomerGroupSetMessagePayload {
  readonly type: 'OrderCustomerGroupSet'
  readonly customerGroup?: CustomerGroupReference
  readonly oldCustomerGroup?: CustomerGroupReference
}
export interface OrderCustomerSetMessagePayload {
  readonly type: 'OrderCustomerSet'
  readonly customer?: CustomerReference
  readonly customerGroup?: CustomerGroupReference
  readonly oldCustomer?: CustomerReference
  readonly oldCustomerGroup?: CustomerGroupReference
}
export interface OrderDeletedMessagePayload {
  readonly type: 'OrderDeleted'
  readonly order: Order
}
export interface OrderDiscountCodeAddedMessagePayload {
  readonly type: 'OrderDiscountCodeAdded'
  readonly discountCode: DiscountCodeReference
}
export interface OrderDiscountCodeRemovedMessagePayload {
  readonly type: 'OrderDiscountCodeRemoved'
  readonly discountCode: DiscountCodeReference
}
export interface OrderDiscountCodeStateSetMessagePayload {
  readonly type: 'OrderDiscountCodeStateSet'
  readonly discountCode: DiscountCodeReference
  readonly state: DiscountCodeState
  readonly oldState?: DiscountCodeState
}
export interface OrderEditAppliedMessagePayload {
  readonly type: 'OrderEditApplied'
  readonly edit: OrderEditReference
  readonly result: OrderEditApplied
}
export interface OrderImportedMessagePayload {
  readonly type: 'OrderImported'
  readonly order: Order
}
export interface OrderLineItemAddedMessagePayload {
  readonly type: 'OrderLineItemAdded'
  readonly lineItem: LineItem
  readonly addedQuantity: number
}
export interface OrderLineItemDiscountSetMessagePayload {
  readonly type: 'OrderLineItemDiscountSet'
  readonly lineItemId: string
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[]
  readonly totalPrice: Money
  readonly taxedPrice?: TaxedItemPrice
}
export interface OrderPaymentStateChangedMessagePayload {
  readonly type: 'OrderPaymentStateChanged'
  readonly paymentState: PaymentState
  readonly oldPaymentState?: PaymentState
}
export interface OrderReturnInfoAddedMessagePayload {
  readonly type: 'ReturnInfoAdded'
  readonly returnInfo: ReturnInfo
}
export interface OrderReturnShipmentStateChangedMessagePayload {
  readonly type: 'OrderReturnShipmentStateChanged'
  readonly returnItemId: string
  readonly returnShipmentState: ReturnShipmentState
}
export interface OrderShipmentStateChangedMessagePayload {
  readonly type: 'OrderShipmentStateChanged'
  readonly shipmentState: ShipmentState
  readonly oldShipmentState?: ShipmentState
}
export interface OrderShippingAddressSetMessagePayload {
  readonly type: 'OrderShippingAddressSet'
  readonly address?: Address
  readonly oldAddress?: Address
}
export interface OrderShippingInfoSetMessagePayload {
  readonly type: 'OrderShippingInfoSet'
  readonly shippingInfo?: ShippingInfo
  readonly oldShippingInfo?: ShippingInfo
}
export interface OrderShippingRateInputSetMessagePayload {
  readonly type: 'OrderShippingRateInputSet'
  readonly shippingRateInput?: ShippingRateInput
  readonly oldShippingRateInput?: ShippingRateInput
}
export interface OrderStateChangedMessagePayload {
  readonly type: 'OrderStateChanged'
  readonly orderState: OrderState
  readonly oldOrderState: OrderState
}
export interface OrderStateTransitionMessagePayload {
  readonly type: 'OrderStateTransition'
  readonly state: StateReference
  readonly force: boolean
}
export interface OrderStoreSetMessagePayload {
  readonly type: 'OrderStoreSet'
  readonly store: StoreKeyReference
}
export interface ParcelAddedToDeliveryMessagePayload {
  readonly type: 'ParcelAddedToDelivery'
  readonly delivery: Delivery
  readonly parcel: Parcel
}
export interface ParcelItemsUpdatedMessagePayload {
  readonly type: 'ParcelItemsUpdated'
  readonly parcelId: string
  readonly deliveryId?: string
  readonly items: DeliveryItem[]
  readonly oldItems: DeliveryItem[]
}
export interface ParcelMeasurementsUpdatedMessagePayload {
  readonly type: 'ParcelMeasurementsUpdated'
  readonly deliveryId: string
  readonly parcelId: string
  readonly measurements?: ParcelMeasurements
}
export interface ParcelRemovedFromDeliveryMessagePayload {
  readonly type: 'ParcelRemovedFromDelivery'
  readonly deliveryId: string
  readonly parcel: Parcel
}
export interface ParcelTrackingDataUpdatedMessagePayload {
  readonly type: 'ParcelTrackingDataUpdated'
  readonly deliveryId: string
  readonly parcelId: string
  readonly trackingData?: TrackingData
}
export interface PaymentCreatedMessagePayload {
  readonly type: 'PaymentCreated'
  readonly payment: Payment
}
export interface PaymentInteractionAddedMessagePayload {
  readonly type: 'PaymentInteractionAdded'
  readonly interaction: CustomFields
}
export interface PaymentStatusInterfaceCodeSetMessagePayload {
  readonly type: 'PaymentStatusInterfaceCodeSet'
  readonly paymentId: string
  readonly interfaceCode: string
}
export interface PaymentStatusStateTransitionMessagePayload {
  readonly type: 'PaymentStatusStateTransition'
  readonly state: StateReference
  readonly force: boolean
}
export interface PaymentTransactionAddedMessagePayload {
  readonly type: 'PaymentTransactionAdded'
  readonly transaction: Transaction
}
export interface PaymentTransactionStateChangedMessagePayload {
  readonly type: 'PaymentTransactionStateChanged'
  readonly transactionId: string
  readonly state: TransactionState
}
export interface ProductAddedToCategoryMessagePayload {
  readonly type: 'ProductAddedToCategory'
  readonly category: CategoryReference
  readonly staged: boolean
}
export interface ProductCreatedMessagePayload {
  readonly type: 'ProductCreated'
  readonly productProjection: ProductProjection
}
export interface ProductDeletedMessagePayload {
  readonly type: 'ProductDeleted'
  readonly removedImageUrls: string[]
  readonly currentProjection: ProductProjection
}
export interface ProductImageAddedMessagePayload {
  readonly type: 'ProductImageAdded'
  readonly variantId: number
  readonly image: Image
  readonly staged: boolean
}
export interface ProductPriceDiscountsSetMessagePayload {
  readonly type: 'ProductPriceDiscountsSet'
  readonly updatedPrices: ProductPriceDiscountsSetUpdatedPrice[]
}
export interface ProductPriceExternalDiscountSetMessagePayload {
  readonly type: 'ProductPriceExternalDiscountSet'
  readonly variantId: number
  readonly variantKey?: string
  readonly sku?: string
  readonly priceId: string
  readonly discounted?: DiscountedPrice
  readonly staged: boolean
}
export interface ProductPublishedMessagePayload {
  readonly type: 'ProductPublished'
  readonly removedImageUrls: any[]
  readonly productProjection: ProductProjection
  readonly scope: ProductPublishScope
}
export interface ProductRemovedFromCategoryMessagePayload {
  readonly type: 'ProductRemovedFromCategory'
  readonly category: CategoryReference
  readonly staged: boolean
}
export interface ProductRevertedStagedChangesMessagePayload {
  readonly type: 'ProductRevertedStagedChanges'
  readonly removedImageUrls: string[]
}
export interface ProductSlugChangedMessagePayload {
  readonly type: 'ProductSlugChanged'
  readonly slug: LocalizedString
}
export interface ProductStateTransitionMessagePayload {
  readonly type: 'ProductStateTransition'
  readonly state: StateReference
  readonly force: boolean
}
export interface ProductUnpublishedMessagePayload {
  readonly type: 'ProductUnpublished'
}
export interface ProductVariantDeletedMessagePayload {
  readonly type: 'ProductVariantDeleted'
  readonly variant: ProductVariant
  readonly removedImageUrls: string[]
}
export interface ReviewCreatedMessagePayload {
  readonly type: 'ReviewCreated'
  readonly review: Review
}
export interface ReviewRatingSetMessagePayload {
  readonly type: 'ReviewRatingSet'
  readonly oldRating?: number
  readonly newRating?: number
  readonly includedInStatistics: boolean
  readonly target?: Reference
}
export interface ReviewStateTransitionMessagePayload {
  readonly type: 'ReviewStateTransition'
  readonly oldState: StateReference
  readonly newState: StateReference
  readonly oldIncludedInStatistics: boolean
  readonly newIncludedInStatistics: boolean
  readonly target: Reference
  readonly force: boolean
}
