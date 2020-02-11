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
  | CategoryCreatedMessage
  | CategorySlugChangedMessage
  | CustomLineItemStateTransitionMessage
  | CustomerAddressAddedMessage
  | CustomerAddressChangedMessage
  | CustomerAddressRemovedMessage
  | CustomerCompanyNameSetMessage
  | CustomerCreatedMessage
  | CustomerDateOfBirthSetMessage
  | CustomerEmailChangedMessage
  | CustomerEmailVerifiedMessage
  | CustomerGroupSetMessage
  | DeliveryAddedMessage
  | DeliveryAddressSetMessage
  | DeliveryItemsUpdatedMessage
  | DeliveryRemovedMessage
  | InventoryEntryDeletedMessage
  | LineItemStateTransitionMessage
export interface CategoryCreatedMessage {
  readonly type: 'CategoryCreated'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly category: Category
}
export interface CategorySlugChangedMessage {
  readonly type: 'CategorySlugChanged'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly slug: LocalizedString
}
export interface CustomLineItemStateTransitionMessage {
  readonly type: 'CustomLineItemStateTransition'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly toState: StateReference
  readonly fromState: StateReference
  readonly customLineItemId: string
  readonly quantity: number
  readonly transitionDate: string
}
export interface CustomerAddressAddedMessage {
  readonly type: 'CustomerAddressAdded'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly address: Address
}
export interface CustomerAddressChangedMessage {
  readonly type: 'CustomerAddressChanged'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly address: Address
}
export interface CustomerAddressRemovedMessage {
  readonly type: 'CustomerAddressRemoved'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly address: Address
}
export interface CustomerCompanyNameSetMessage {
  readonly type: 'CustomerCompanyNameSet'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly companyName: string
}
export interface CustomerCreatedMessage {
  readonly type: 'CustomerCreated'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly customer: Customer
}
export interface CustomerDateOfBirthSetMessage {
  readonly type: 'CustomerDateOfBirthSet'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly dateOfBirth: string
}
export interface CustomerEmailChangedMessage {
  readonly type: 'CustomerEmailChanged'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly email: string
}
export interface CustomerEmailVerifiedMessage {
  readonly type: 'CustomerEmailVerified'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
}
export interface CustomerGroupSetMessage {
  readonly type: 'CustomerGroupSet'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly customerGroup: CustomerGroupReference
}
export interface DeliveryAddedMessage {
  readonly type: 'DeliveryAdded'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly delivery: Delivery
}
export interface DeliveryAddressSetMessage {
  readonly type: 'DeliveryAddressSet'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly oldAddress?: Address
  readonly deliveryId: string
  readonly address?: Address
}
export interface DeliveryItemsUpdatedMessage {
  readonly type: 'DeliveryItemsUpdated'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly deliveryId: string
  readonly oldItems: DeliveryItem[]
  readonly items: DeliveryItem[]
}
export interface DeliveryRemovedMessage {
  readonly type: 'DeliveryRemoved'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly delivery: Delivery
}
export interface InventoryEntryDeletedMessage {
  readonly type: 'InventoryEntryDeleted'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly supplyChannel: ChannelReference
  readonly sku: string
}
export interface LineItemStateTransitionMessage {
  readonly type: 'LineItemStateTransition'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly toState: StateReference
  readonly fromState: StateReference
  readonly quantity: number
  readonly lineItemId: string
  readonly transitionDate: string
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
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly oldAddress?: Address
  readonly address?: Address
}
export interface OrderCreatedMessage {
  readonly type: 'OrderCreated'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly order: Order
}
export interface OrderCustomLineItemDiscountSetMessage {
  readonly type: 'OrderCustomLineItemDiscountSet'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly customLineItemId: string
  readonly taxedPrice?: TaxedItemPrice
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[]
}
export interface OrderCustomerEmailSetMessage {
  readonly type: 'OrderCustomerEmailSet'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly oldEmail?: string
  readonly email?: string
}
export interface OrderCustomerGroupSetMessage {
  readonly type: 'OrderCustomerGroupSet'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly oldCustomerGroup?: CustomerGroupReference
  readonly customerGroup?: CustomerGroupReference
}
export interface OrderCustomerSetMessage {
  readonly type: 'OrderCustomerSet'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly oldCustomerGroup?: CustomerGroupReference
  readonly customerGroup?: CustomerGroupReference
  readonly oldCustomer?: CustomerReference
  readonly customer?: CustomerReference
}
export interface OrderDeletedMessage {
  readonly type: 'OrderDeleted'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly order: Order
}
export interface OrderDiscountCodeAddedMessage {
  readonly type: 'OrderDiscountCodeAdded'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly discountCode: DiscountCodeReference
}
export interface OrderDiscountCodeRemovedMessage {
  readonly type: 'OrderDiscountCodeRemoved'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly discountCode: DiscountCodeReference
}
export interface OrderDiscountCodeStateSetMessage {
  readonly type: 'OrderDiscountCodeStateSet'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly discountCode: DiscountCodeReference
  readonly oldState?: DiscountCodeState
  readonly state: DiscountCodeState
}
export interface OrderEditAppliedMessage {
  readonly type: 'OrderEditApplied'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly result: OrderEditApplied
  readonly edit: OrderEditReference
}
export interface OrderImportedMessage {
  readonly type: 'OrderImported'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly order: Order
}
export interface OrderLineItemAddedMessage {
  readonly type: 'OrderLineItemAdded'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly lineItem: LineItem
  readonly addedQuantity: number
}
export interface OrderLineItemDiscountSetMessage {
  readonly type: 'OrderLineItemDiscountSet'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly totalPrice: Money
  readonly lineItemId: string
  readonly taxedPrice?: TaxedItemPrice
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[]
}
export interface OrderPaymentStateChangedMessage {
  readonly type: 'OrderPaymentStateChanged'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly oldPaymentState?: PaymentState
  readonly paymentState: PaymentState
}
export interface OrderReturnInfoAddedMessage {
  readonly type: 'ReturnInfoAdded'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly returnInfo: ReturnInfo
}
export interface OrderReturnShipmentStateChangedMessage {
  readonly type: 'OrderReturnShipmentStateChanged'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly returnItemId: string
  readonly returnShipmentState: ReturnShipmentState
}
export interface OrderShipmentStateChangedMessage {
  readonly type: 'OrderShipmentStateChanged'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly shipmentState: ShipmentState
  readonly oldShipmentState?: ShipmentState
}
export interface OrderShippingAddressSetMessage {
  readonly type: 'OrderShippingAddressSet'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly oldAddress?: Address
  readonly address?: Address
}
export interface OrderShippingInfoSetMessage {
  readonly type: 'OrderShippingInfoSet'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly shippingInfo?: ShippingInfo
  readonly oldShippingInfo?: ShippingInfo
}
export interface OrderShippingRateInputSetMessage {
  readonly type: 'OrderShippingRateInputSet'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly shippingRateInput?: ShippingRateInput
  readonly oldShippingRateInput?: ShippingRateInput
}
export interface OrderStateChangedMessage {
  readonly type: 'OrderStateChanged'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly oldOrderState: OrderState
  readonly orderState: OrderState
}
export interface OrderStateTransitionMessage {
  readonly type: 'OrderStateTransition'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly force: boolean
  readonly state: StateReference
}
export interface ParcelAddedToDeliveryMessage {
  readonly type: 'ParcelAddedToDelivery'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly delivery: Delivery
  readonly parcel: Parcel
}
export interface ParcelItemsUpdatedMessage {
  readonly type: 'ParcelItemsUpdated'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly deliveryId?: string
  readonly oldItems: DeliveryItem[]
  readonly items: DeliveryItem[]
  readonly parcelId: string
}
export interface ParcelMeasurementsUpdatedMessage {
  readonly type: 'ParcelMeasurementsUpdated'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly deliveryId: string
  readonly measurements?: ParcelMeasurements
  readonly parcelId: string
}
export interface ParcelRemovedFromDeliveryMessage {
  readonly type: 'ParcelRemovedFromDelivery'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly parcel: Parcel
  readonly deliveryId: string
}
export interface ParcelTrackingDataUpdatedMessage {
  readonly type: 'ParcelTrackingDataUpdated'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly deliveryId: string
  readonly trackingData?: TrackingData
  readonly parcelId: string
}
export interface PaymentCreatedMessage {
  readonly type: 'PaymentCreated'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly payment: Payment
}
export interface PaymentInteractionAddedMessage {
  readonly type: 'PaymentInteractionAdded'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly interaction: CustomFields
}
export interface PaymentStatusInterfaceCodeSetMessage {
  readonly type: 'PaymentStatusInterfaceCodeSet'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly paymentId: string
  readonly interfaceCode: string
}
export interface PaymentStatusStateTransitionMessage {
  readonly type: 'PaymentStatusStateTransition'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly force: boolean
  readonly state: StateReference
}
export interface PaymentTransactionAddedMessage {
  readonly type: 'PaymentTransactionAdded'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly transaction: Transaction
}
export interface PaymentTransactionStateChangedMessage {
  readonly type: 'PaymentTransactionStateChanged'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly state: TransactionState
  readonly transactionId: string
}
export interface ProductAddedToCategoryMessage {
  readonly type: 'ProductAddedToCategory'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly staged: boolean
  readonly category: CategoryReference
}
export interface ProductCreatedMessage {
  readonly type: 'ProductCreated'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly productProjection: ProductProjection
}
export interface ProductDeletedMessage {
  readonly type: 'ProductDeleted'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly removedImageUrls: string[]
  readonly currentProjection: ProductProjection
}
export interface ProductImageAddedMessage {
  readonly type: 'ProductImageAdded'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly image: Image
  readonly staged: boolean
  readonly variantId: number
}
export interface ProductPriceDiscountsSetMessage {
  readonly type: 'ProductPriceDiscountsSet'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
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
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly discounted?: DiscountedPrice
  readonly staged: boolean
  readonly variantId: number
  readonly priceId: string
  readonly sku?: string
  readonly variantKey?: string
}
export interface ProductPublishedMessage {
  readonly type: 'ProductPublished'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly removedImageUrls: any[]
  readonly productProjection: ProductProjection
  readonly scope: ProductPublishScope
}
export interface ProductRemovedFromCategoryMessage {
  readonly type: 'ProductRemovedFromCategory'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly staged: boolean
  readonly category: CategoryReference
}
export interface ProductRevertedStagedChangesMessage {
  readonly type: 'ProductRevertedStagedChanges'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly removedImageUrls: string[]
}
export interface ProductSlugChangedMessage {
  readonly type: 'ProductSlugChanged'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly slug: LocalizedString
}
export interface ProductStateTransitionMessage {
  readonly type: 'ProductStateTransition'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly force: boolean
  readonly state: StateReference
}
export interface ProductUnpublishedMessage {
  readonly type: 'ProductUnpublished'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
}
export interface ProductVariantDeletedMessage {
  readonly type: 'ProductVariantDeleted'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly removedImageUrls: string[]
  readonly variant: ProductVariant
}
export interface ReviewCreatedMessage {
  readonly type: 'ReviewCreated'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly review: Review
}
export interface ReviewRatingSetMessage {
  readonly type: 'ReviewRatingSet'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly oldRating?: number
  readonly includedInStatistics: boolean
  readonly newRating?: number
  readonly target?: Reference
}
export interface ReviewStateTransitionMessage {
  readonly type: 'ReviewStateTransition'
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly id: string
  readonly version: number
  readonly sequenceNumber: number
  readonly resource: Reference
  readonly createdBy?: CreatedBy
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly resourceVersion: number
  readonly lastModifiedBy?: LastModifiedBy
  readonly newIncludedInStatistics: boolean
  readonly oldState: StateReference
  readonly force: boolean
  readonly oldIncludedInStatistics: boolean
  readonly newState: StateReference
  readonly target: Reference
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
  | CategoryCreatedMessagePayload
  | CategorySlugChangedMessagePayload
  | CustomLineItemStateTransitionMessagePayload
  | CustomerAddressAddedMessagePayload
  | CustomerAddressChangedMessagePayload
  | CustomerAddressRemovedMessagePayload
  | CustomerCompanyNameSetMessagePayload
  | CustomerCreatedMessagePayload
  | CustomerDateOfBirthSetMessagePayload
  | CustomerEmailChangedMessagePayload
  | CustomerEmailVerifiedMessagePayload
  | CustomerGroupSetMessagePayload
  | DeliveryAddedMessagePayload
  | DeliveryAddressSetMessagePayload
  | DeliveryItemsUpdatedMessagePayload
  | DeliveryRemovedMessagePayload
  | InventoryEntryDeletedMessagePayload
  | LineItemStateTransitionMessagePayload
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
  readonly toState: StateReference
  readonly fromState: StateReference
  readonly customLineItemId: string
  readonly quantity: number
  readonly transitionDate: string
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
  readonly oldAddress?: Address
  readonly deliveryId: string
  readonly address?: Address
}
export interface DeliveryItemsUpdatedMessagePayload {
  readonly type: 'DeliveryItemsUpdated'
  readonly deliveryId: string
  readonly oldItems: DeliveryItem[]
  readonly items: DeliveryItem[]
}
export interface DeliveryRemovedMessagePayload {
  readonly type: 'DeliveryRemoved'
  readonly delivery: Delivery
}
export interface InventoryEntryDeletedMessagePayload {
  readonly type: 'InventoryEntryDeleted'
  readonly supplyChannel: ChannelReference
  readonly sku: string
}
export interface LineItemStateTransitionMessagePayload {
  readonly type: 'LineItemStateTransition'
  readonly toState: StateReference
  readonly fromState: StateReference
  readonly quantity: number
  readonly lineItemId: string
  readonly transitionDate: string
}
export interface OrderBillingAddressSetMessagePayload {
  readonly type: 'OrderBillingAddressSet'
  readonly oldAddress?: Address
  readonly address?: Address
}
export interface OrderCreatedMessagePayload {
  readonly type: 'OrderCreated'
  readonly order: Order
}
export interface OrderCustomLineItemDiscountSetMessagePayload {
  readonly type: 'OrderCustomLineItemDiscountSet'
  readonly customLineItemId: string
  readonly taxedPrice?: TaxedItemPrice
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[]
}
export interface OrderCustomerEmailSetMessagePayload {
  readonly type: 'OrderCustomerEmailSet'
  readonly oldEmail?: string
  readonly email?: string
}
export interface OrderCustomerGroupSetMessagePayload {
  readonly type: 'OrderCustomerGroupSet'
  readonly oldCustomerGroup?: CustomerGroupReference
  readonly customerGroup?: CustomerGroupReference
}
export interface OrderCustomerSetMessagePayload {
  readonly type: 'OrderCustomerSet'
  readonly oldCustomerGroup?: CustomerGroupReference
  readonly customerGroup?: CustomerGroupReference
  readonly oldCustomer?: CustomerReference
  readonly customer?: CustomerReference
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
  readonly oldState?: DiscountCodeState
  readonly state: DiscountCodeState
}
export interface OrderEditAppliedMessagePayload {
  readonly type: 'OrderEditApplied'
  readonly result: OrderEditApplied
  readonly edit: OrderEditReference
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
  readonly totalPrice: Money
  readonly lineItemId: string
  readonly taxedPrice?: TaxedItemPrice
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[]
}
export interface OrderPaymentStateChangedMessagePayload {
  readonly type: 'OrderPaymentStateChanged'
  readonly oldPaymentState?: PaymentState
  readonly paymentState: PaymentState
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
  readonly oldAddress?: Address
  readonly address?: Address
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
  readonly oldOrderState: OrderState
  readonly orderState: OrderState
}
export interface OrderStateTransitionMessagePayload {
  readonly type: 'OrderStateTransition'
  readonly force: boolean
  readonly state: StateReference
}
export interface ParcelAddedToDeliveryMessagePayload {
  readonly type: 'ParcelAddedToDelivery'
  readonly delivery: Delivery
  readonly parcel: Parcel
}
export interface ParcelItemsUpdatedMessagePayload {
  readonly type: 'ParcelItemsUpdated'
  readonly deliveryId?: string
  readonly oldItems: DeliveryItem[]
  readonly items: DeliveryItem[]
  readonly parcelId: string
}
export interface ParcelMeasurementsUpdatedMessagePayload {
  readonly type: 'ParcelMeasurementsUpdated'
  readonly deliveryId: string
  readonly measurements?: ParcelMeasurements
  readonly parcelId: string
}
export interface ParcelRemovedFromDeliveryMessagePayload {
  readonly type: 'ParcelRemovedFromDelivery'
  readonly parcel: Parcel
  readonly deliveryId: string
}
export interface ParcelTrackingDataUpdatedMessagePayload {
  readonly type: 'ParcelTrackingDataUpdated'
  readonly deliveryId: string
  readonly trackingData?: TrackingData
  readonly parcelId: string
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
  readonly force: boolean
  readonly state: StateReference
}
export interface PaymentTransactionAddedMessagePayload {
  readonly type: 'PaymentTransactionAdded'
  readonly transaction: Transaction
}
export interface PaymentTransactionStateChangedMessagePayload {
  readonly type: 'PaymentTransactionStateChanged'
  readonly state: TransactionState
  readonly transactionId: string
}
export interface ProductAddedToCategoryMessagePayload {
  readonly type: 'ProductAddedToCategory'
  readonly staged: boolean
  readonly category: CategoryReference
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
  readonly image: Image
  readonly staged: boolean
  readonly variantId: number
}
export interface ProductPriceDiscountsSetMessagePayload {
  readonly type: 'ProductPriceDiscountsSet'
  readonly updatedPrices: ProductPriceDiscountsSetUpdatedPrice[]
}
export interface ProductPriceExternalDiscountSetMessagePayload {
  readonly type: 'ProductPriceExternalDiscountSet'
  readonly discounted?: DiscountedPrice
  readonly staged: boolean
  readonly variantId: number
  readonly priceId: string
  readonly sku?: string
  readonly variantKey?: string
}
export interface ProductPublishedMessagePayload {
  readonly type: 'ProductPublished'
  readonly removedImageUrls: string[]
  readonly productProjection: ProductProjection
  readonly scope: ProductPublishScope
}
export interface ProductRemovedFromCategoryMessagePayload {
  readonly type: 'ProductRemovedFromCategory'
  readonly staged: boolean
  readonly category: CategoryReference
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
  readonly force: boolean
  readonly state: StateReference
}
export interface ProductUnpublishedMessagePayload {
  readonly type: 'ProductUnpublished'
}
export interface ProductVariantDeletedMessagePayload {
  readonly type: 'ProductVariantDeleted'
  readonly removedImageUrls: string[]
  readonly variant: ProductVariant
}
export interface ReviewCreatedMessagePayload {
  readonly type: 'ReviewCreated'
  readonly review: Review
}
export interface ReviewRatingSetMessagePayload {
  readonly type: 'ReviewRatingSet'
  readonly oldRating?: number
  readonly includedInStatistics: boolean
  readonly newRating?: number
  readonly target?: Reference
}
export interface ReviewStateTransitionMessagePayload {
  readonly type: 'ReviewStateTransition'
  readonly newIncludedInStatistics: boolean
  readonly oldState: StateReference
  readonly force: boolean
  readonly oldIncludedInStatistics: boolean
  readonly newState: StateReference
  readonly target: Reference
}
