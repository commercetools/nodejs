/* tslint:disable */
//Generated file, please do not change

import { Reference } from './Common'
import { BaseResource } from './Common'
import { Category } from './Category'
import { LocalizedString } from './Common'
import { StateReference } from './State'
import { Address } from './Common'
import { Customer } from './Customer'
import { CustomerGroupReference } from './CustomerGroup'
import { Delivery } from './Order'
import { DeliveryItem } from './Order'
import { ChannelReference } from './Channel'
import { Order } from './Order'
import { TaxedItemPrice } from './Cart'
import { DiscountedLineItemPriceForQuantity } from './Cart'
import { CustomerReference } from './Customer'
import { DiscountCodeReference } from './DiscountCode'
import { DiscountCodeState } from './Cart'
import { OrderEditApplied } from './OrderEdit'
import { OrderEditReference } from './OrderEdit'
import { LineItem } from './Cart'
import { Money } from './Common'
import { PaymentState } from './Order'
import { ReturnInfo } from './Order'
import { ReturnShipmentState } from './Order'
import { ShipmentState } from './Order'
import { ShippingInfo } from './Cart'
import { ShippingRateInput } from './Cart'
import { OrderState } from './Order'
import { Parcel } from './Order'
import { ParcelMeasurements } from './Order'
import { TrackingData } from './Order'
import { Payment } from './Payment'
import { CustomFields } from './Type'
import { Transaction } from './Payment'
import { TransactionState } from './Payment'
import { ProductProjection } from './Product'
import { Image } from './Common'
import { DiscountedPrice } from './Common'
import { ProductPublishScope } from './Cart'
import { ProductVariant } from './Product'
import { Review } from './Review'


export interface Message extends BaseResource {
  
  readonly sequenceNumber: number;
  
  readonly resource: Reference;
  
  readonly resourceVersion: number;
  
  readonly type: string;
  
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
}

export interface CategoryCreatedMessage extends Message {
  
  readonly category: Category
}

export interface CategorySlugChangedMessage extends Message {
  
  readonly slug: LocalizedString
}

export interface CustomLineItemStateTransitionMessage extends Message {
  
  readonly customLineItemId: string;
  
  readonly transitionDate: string;
  
  readonly quantity: number;
  
  readonly fromState: StateReference;
  
  readonly toState: StateReference
}

export interface CustomerAddressAddedMessage extends Message {
  
  readonly address: Address
}

export interface CustomerAddressChangedMessage extends Message {
  
  readonly address: Address
}

export interface CustomerAddressRemovedMessage extends Message {
  
  readonly address: Address
}

export interface CustomerCompanyNameSetMessage extends Message {
  
  readonly companyName: string
}

export interface CustomerCreatedMessage extends Message {
  
  readonly customer: Customer
}

export interface CustomerDateOfBirthSetMessage extends Message {
  
  readonly dateOfBirth: string
}

export interface CustomerEmailChangedMessage extends Message {
  
  readonly email: string
}

export interface CustomerEmailVerifiedMessage extends Message {
}

export interface CustomerGroupSetMessage extends Message {
  
  readonly customerGroup: CustomerGroupReference
}

export interface DeliveryAddedMessage extends Message {
  
  readonly delivery: Delivery
}

export interface DeliveryAddressSetMessage extends Message {
  
  readonly deliveryId: string;
  
  readonly address?: Address;
  
  readonly oldAddress?: Address
}

export interface DeliveryItemsUpdatedMessage extends Message {
  
  readonly deliveryId: string;
  
  readonly items: DeliveryItem[];
  
  readonly oldItems: DeliveryItem[]
}

export interface DeliveryRemovedMessage extends Message {
  
  readonly delivery: Delivery
}

export interface InventoryEntryDeletedMessage extends Message {
  
  readonly sku: string;
  
  readonly supplyChannel: ChannelReference
}

export interface LineItemStateTransitionMessage extends Message {
  
  readonly lineItemId: string;
  
  readonly transitionDate: string;
  
  readonly quantity: number;
  
  readonly fromState: StateReference;
  
  readonly toState: StateReference
}

export interface MessageConfiguration {
  
  readonly enabled: boolean;
  
  readonly deleteDaysAfterCreation?: number
}

export interface MessageConfigurationDraft {
  
  readonly enabled: boolean;
  
  readonly deleteDaysAfterCreation: number
}

export interface MessagePagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: Message[]
}

export interface OrderBillingAddressSetMessage extends Message {
  
  readonly address?: Address;
  
  readonly oldAddress?: Address
}

export interface OrderCreatedMessage extends Message {
  
  readonly order: Order
}

export interface OrderCustomLineItemDiscountSetMessage extends Message {
  
  readonly customLineItemId: string;
  
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[];
  
  readonly taxedPrice?: TaxedItemPrice
}

export interface OrderCustomerEmailSetMessage extends Message {
  
  readonly email?: string;
  
  readonly oldEmail?: string
}

export interface OrderCustomerSetMessage extends Message {
  
  readonly customer?: CustomerReference;
  
  readonly customerGroup?: CustomerGroupReference;
  
  readonly oldCustomer?: CustomerReference;
  
  readonly oldCustomerGroup?: CustomerGroupReference
}

export interface OrderDeletedMessage extends Message {
  
  readonly order: Order
}

export interface OrderDiscountCodeAddedMessage extends Message {
  
  readonly discountCode: DiscountCodeReference
}

export interface OrderDiscountCodeRemovedMessage extends Message {
  
  readonly discountCode: DiscountCodeReference
}

export interface OrderDiscountCodeStateSetMessage extends Message {
  
  readonly discountCode: DiscountCodeReference;
  
  readonly state: DiscountCodeState;
  
  readonly oldState?: DiscountCodeState
}

export interface OrderEditAppliedMessage extends Message {
  
  readonly edit: OrderEditReference;
  
  readonly result: OrderEditApplied
}

export interface OrderImportedMessage extends Message {
  
  readonly order: Order
}

export interface OrderLineItemAddedMessage extends Message {
  
  readonly lineItem: LineItem;
  
  readonly addedQuantity: number
}

export interface OrderLineItemDiscountSetMessage extends Message {
  
  readonly lineItemId: string;
  
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[];
  
  readonly totalPrice: Money;
  
  readonly taxedPrice?: TaxedItemPrice
}

export interface OrderPaymentStateChangedMessage extends Message {
  
  readonly paymentState: PaymentState;
  
  readonly oldPaymentState: PaymentState
}

export interface OrderReturnInfoAddedMessage extends Message {
  
  readonly returnInfo: ReturnInfo
}

export interface OrderReturnShipmentStateChangedMessage extends Message {
  
  readonly returnItemId: string;
  
  readonly returnShipmentState: ReturnShipmentState
}

export interface OrderShipmentStateChangedMessage extends Message {
  
  readonly shipmentState: ShipmentState;
  
  readonly oldShipmentState: ShipmentState
}

export interface OrderShippingAddressSetMessage extends Message {
  
  readonly address?: Address;
  
  readonly oldAddress?: Address
}

export interface OrderShippingInfoSetMessage extends Message {
  
  readonly shippingInfo?: ShippingInfo;
  
  readonly oldShippingInfo?: ShippingInfo
}

export interface OrderShippingRateInputSetMessage extends Message {
  
  readonly shippingRateInput?: ShippingRateInput;
  
  readonly oldShippingRateInput?: ShippingRateInput
}

export interface OrderStateChangedMessage extends Message {
  
  readonly orderState: OrderState;
  
  readonly oldOrderState: OrderState
}

export interface OrderStateTransitionMessage extends Message {
  
  readonly state: StateReference;
  
  readonly force: boolean
}

export interface ParcelAddedToDeliveryMessage extends Message {
  
  readonly delivery: Delivery;
  
  readonly parcel: Parcel
}

export interface ParcelItemsUpdatedMessage extends Message {
  
  readonly parcelId: string;
  
  readonly deliveryId?: string;
  
  readonly items: DeliveryItem[];
  
  readonly oldItems: DeliveryItem[]
}

export interface ParcelMeasurementsUpdatedMessage extends Message {
  
  readonly deliveryId: string;
  
  readonly parcelId: string;
  
  readonly measurements?: ParcelMeasurements
}

export interface ParcelRemovedFromDeliveryMessage extends Message {
  
  readonly deliveryId: string;
  
  readonly parcel: Parcel
}

export interface ParcelTrackingDataUpdatedMessage extends Message {
  
  readonly deliveryId: string;
  
  readonly parcelId: string;
  
  readonly trackingData?: TrackingData
}

export interface PaymentCreatedMessage extends Message {
  
  readonly payment: Payment
}

export interface PaymentInteractionAddedMessage extends Message {
  
  readonly interaction: CustomFields
}

export interface PaymentStatusInterfaceCodeSetMessage extends Message {
  
  readonly paymentId: string;
  
  readonly interfaceCode: string
}

export interface PaymentStatusStateTransitionMessage extends Message {
  
  readonly state: StateReference;
  
  readonly force: boolean
}

export interface PaymentTransactionAddedMessage extends Message {
  
  readonly transaction: Transaction
}

export interface PaymentTransactionStateChangedMessage extends Message {
  
  readonly transactionId: string;
  
  readonly state: TransactionState
}

export interface ProductCreatedMessage extends Message {
  
  readonly productProjection: ProductProjection
}

export interface ProductDeletedMessage extends Message {
  
  readonly removedImageUrls: string[];
  
  readonly currentProjection: ProductProjection
}

export interface ProductImageAddedMessage extends Message {
  
  readonly variantId: number;
  
  readonly image: Image;
  
  readonly staged: boolean
}

export interface ProductPriceDiscountsSetMessage extends Message {
  
  readonly updatedPrices: ProductPriceDiscountsSetUpdatedPrice[]
}

export interface ProductPriceDiscountsSetUpdatedPrice {
  
  readonly variantId: number;
  
  readonly variantKey?: string;
  
  readonly sku?: string;
  
  readonly priceId: string;
  
  readonly discounted?: DiscountedPrice;
  
  readonly staged: boolean
}

export interface ProductPriceExternalDiscountSetMessage extends Message {
  
  readonly variantId: number;
  
  readonly variantKey?: string;
  
  readonly sku?: string;
  
  readonly priceId: string;
  
  readonly discounted?: DiscountedPrice;
  
  readonly staged: boolean
}

export interface ProductPublishedMessage extends Message {
  
  readonly removedImageUrls: object[];
  
  readonly productProjection: ProductProjection;
  
  readonly scope: ProductPublishScope
}

export interface ProductRevertedStagedChangesMessage extends Message {
  
  readonly removedImageUrls: object[]
}

export interface ProductSlugChangedMessage extends Message {
  
  readonly slug: LocalizedString
}

export interface ProductStateTransitionMessage extends Message {
  
  readonly state: StateReference;
  
  readonly force: boolean
}

export interface ProductUnpublishedMessage extends Message {
}

export interface ProductVariantDeletedMessage extends Message {
  
  readonly removedImageUrls: object[];
  
  readonly variant: ProductVariant
}

export interface ReviewCreatedMessage extends Message {
  
  readonly review: Review
}

export interface ReviewRatingSetMessage extends Message {
  
  readonly oldRating?: number;
  
  readonly newRating?: number;
  
  readonly includedInStatistics: boolean;
  
  readonly target?: Reference
}

export interface ReviewStateTransitionMessage extends Message {
  
  readonly oldState: StateReference;
  
  readonly newState: StateReference;
  
  readonly oldIncludedInStatistics: boolean;
  
  readonly newIncludedInStatistics: boolean;
  
  readonly target: Reference;
  
  readonly force: boolean
}

export interface UserProvidedIdentifiers {
  
  readonly key?: string;
  
  readonly externalId?: string;
  
  readonly orderNumber?: string;
  
  readonly customerNumber?: string;
  
  readonly sku?: string;
  
  readonly slug?: LocalizedString
}

export type MessagePayload =
  OrderBillingAddressSetMessagePayload |
  OrderCreatedMessagePayload |
  OrderCustomLineItemDiscountSetMessagePayload |
  OrderCustomerEmailSetMessagePayload |
  OrderCustomerSetMessagePayload |
  OrderDeletedMessagePayload |
  OrderDiscountCodeAddedMessagePayload |
  OrderDiscountCodeRemovedMessagePayload |
  OrderDiscountCodeStateSetMessagePayload |
  OrderEditAppliedMessagePayload |
  OrderImportedMessagePayload |
  OrderLineItemAddedMessagePayload |
  OrderLineItemDiscountSetMessagePayload |
  OrderPaymentStateChangedMessagePayload |
  OrderReturnInfoAddedMessagePayload |
  OrderReturnShipmentStateChangedMessagePayload |
  OrderShipmentStateChangedMessagePayload |
  OrderShippingAddressSetMessagePayload |
  OrderShippingInfoSetMessagePayload |
  OrderShippingRateInputSetMessagePayload |
  OrderStateChangedMessagePayload |
  OrderStateTransitionMessagePayload |
  ParcelAddedToDeliveryMessagePayload |
  ParcelItemsUpdatedMessagePayload |
  ParcelMeasurementsUpdatedMessagePayload |
  ParcelRemovedFromDeliveryMessagePayload |
  ParcelTrackingDataUpdatedMessagePayload |
  PaymentCreatedMessagePayload |
  PaymentInteractionAddedMessagePayload |
  PaymentStatusInterfaceCodeSetMessagePayload |
  PaymentStatusStateTransitionMessagePayload |
  PaymentTransactionAddedMessagePayload |
  PaymentTransactionStateChangedMessagePayload |
  ProductCreatedMessagePayload |
  ProductDeletedMessagePayload |
  ProductImageAddedMessagePayload |
  ProductPriceDiscountsSetMessagePayload |
  ProductPriceExternalDiscountSetMessagePayload |
  ProductPublishedMessagePayload |
  ProductRevertedStagedChangesMessagePayload |
  ProductSlugChangedMessagePayload |
  ProductStateTransitionMessagePayload |
  ProductUnpublishedMessagePayload |
  ProductVariantDeletedMessagePayload |
  ReviewCreatedMessagePayload |
  ReviewRatingSetMessagePayload |
  ReviewStateTransitionMessagePayload |
  CategoryCreatedMessagePayload |
  CategorySlugChangedMessagePayload |
  CustomLineItemStateTransitionMessagePayload |
  CustomerAddressAddedMessagePayload |
  CustomerAddressChangedMessagePayload |
  CustomerAddressRemovedMessagePayload |
  CustomerCompanyNameSetMessagePayload |
  CustomerCreatedMessagePayload |
  CustomerDateOfBirthSetMessagePayload |
  CustomerEmailChangedMessagePayload |
  CustomerEmailVerifiedMessagePayload |
  CustomerGroupSetMessagePayload |
  DeliveryAddedMessagePayload |
  DeliveryAddressSetMessagePayload |
  DeliveryItemsUpdatedMessagePayload |
  DeliveryRemovedMessagePayload |
  InventoryEntryDeletedMessagePayload |
  LineItemStateTransitionMessagePayload
;

export interface CategoryCreatedMessagePayload {
  readonly type: "CategoryCreated";
  
  readonly category: Category
}

export interface CategorySlugChangedMessagePayload {
  readonly type: "CategorySlugChanged";
  
  readonly slug: LocalizedString
}

export interface CustomLineItemStateTransitionMessagePayload {
  readonly type: "CustomLineItemStateTransition";
  
  readonly toState: StateReference;
  
  readonly fromState: StateReference;
  
  readonly customLineItemId: string;
  
  readonly quantity: number;
  
  readonly transitionDate: string
}

export interface CustomerAddressAddedMessagePayload {
  readonly type: "CustomerAddressAdded";
  
  readonly address: Address
}

export interface CustomerAddressChangedMessagePayload {
  readonly type: "CustomerAddressChanged";
  
  readonly address: Address
}

export interface CustomerAddressRemovedMessagePayload {
  readonly type: "CustomerAddressRemoved";
  
  readonly address: Address
}

export interface CustomerCompanyNameSetMessagePayload {
  readonly type: "CustomerCompanyNameSet";
  
  readonly companyName: string
}

export interface CustomerCreatedMessagePayload {
  readonly type: "CustomerCreated";
  
  readonly customer: Customer
}

export interface CustomerDateOfBirthSetMessagePayload {
  readonly type: "CustomerDateOfBirthSet";
  
  readonly dateOfBirth: string
}

export interface CustomerEmailChangedMessagePayload {
  readonly type: "CustomerEmailChanged";
  
  readonly email: string
}

export interface CustomerEmailVerifiedMessagePayload {
  readonly type: "CustomerEmailVerified";
}

export interface CustomerGroupSetMessagePayload {
  readonly type: "CustomerGroupSet";
  
  readonly customerGroup: CustomerGroupReference
}

export interface DeliveryAddedMessagePayload {
  readonly type: "DeliveryAdded";
  
  readonly delivery: Delivery
}

export interface DeliveryAddressSetMessagePayload {
  readonly type: "DeliveryAddressSet";
  
  readonly oldAddress?: Address;
  
  readonly deliveryId: string;
  
  readonly address?: Address
}

export interface DeliveryItemsUpdatedMessagePayload {
  readonly type: "DeliveryItemsUpdated";
  
  readonly deliveryId: string;
  
  readonly oldItems: DeliveryItem[];
  
  readonly items: DeliveryItem[]
}

export interface DeliveryRemovedMessagePayload {
  readonly type: "DeliveryRemoved";
  
  readonly delivery: Delivery
}

export interface InventoryEntryDeletedMessagePayload {
  readonly type: "InventoryEntryDeleted";
  
  readonly supplyChannel: ChannelReference;
  
  readonly sku: string
}

export interface LineItemStateTransitionMessagePayload {
  readonly type: "LineItemStateTransition";
  
  readonly toState: StateReference;
  
  readonly fromState: StateReference;
  
  readonly quantity: number;
  
  readonly lineItemId: string;
  
  readonly transitionDate: string
}

export interface OrderBillingAddressSetMessagePayload {
  readonly type: "OrderBillingAddressSet";
  
  readonly oldAddress?: Address;
  
  readonly address?: Address
}

export interface OrderCreatedMessagePayload {
  readonly type: "OrderCreated";
  
  readonly order: Order
}

export interface OrderCustomLineItemDiscountSetMessagePayload {
  readonly type: "OrderCustomLineItemDiscountSet";
  
  readonly customLineItemId: string;
  
  readonly taxedPrice?: TaxedItemPrice;
  
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[]
}

export interface OrderCustomerEmailSetMessagePayload {
  readonly type: "OrderCustomerEmailSet";
  
  readonly oldEmail?: string;
  
  readonly email?: string
}

export interface OrderCustomerSetMessagePayload {
  readonly type: "OrderCustomerSet";
  
  readonly oldCustomerGroup?: CustomerGroupReference;
  
  readonly customerGroup?: CustomerGroupReference;
  
  readonly oldCustomer?: CustomerReference;
  
  readonly customer?: CustomerReference
}

export interface OrderDeletedMessagePayload {
  readonly type: "OrderDeleted";
  
  readonly order: Order
}

export interface OrderDiscountCodeAddedMessagePayload {
  readonly type: "OrderDiscountCodeAdded";
  
  readonly discountCode: DiscountCodeReference
}

export interface OrderDiscountCodeRemovedMessagePayload {
  readonly type: "OrderDiscountCodeRemoved";
  
  readonly discountCode: DiscountCodeReference
}

export interface OrderDiscountCodeStateSetMessagePayload {
  readonly type: "OrderDiscountCodeStateSet";
  
  readonly discountCode: DiscountCodeReference;
  
  readonly oldState?: DiscountCodeState;
  
  readonly state: DiscountCodeState
}

export interface OrderEditAppliedMessagePayload {
  readonly type: "OrderEditApplied";
  
  readonly result: OrderEditApplied;
  
  readonly edit: OrderEditReference
}

export interface OrderImportedMessagePayload {
  readonly type: "OrderImported";
  
  readonly order: Order
}

export interface OrderLineItemAddedMessagePayload {
  readonly type: "OrderLineItemAdded";
  
  readonly lineItem: LineItem;
  
  readonly addedQuantity: number
}

export interface OrderLineItemDiscountSetMessagePayload {
  readonly type: "OrderLineItemDiscountSet";
  
  readonly totalPrice: Money;
  
  readonly lineItemId: string;
  
  readonly taxedPrice?: TaxedItemPrice;
  
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[]
}

export interface OrderPaymentStateChangedMessagePayload {
  readonly type: "OrderPaymentStateChanged";
  
  readonly oldPaymentState: PaymentState;
  
  readonly paymentState: PaymentState
}

export interface OrderReturnInfoAddedMessagePayload {
  readonly type: "ReturnInfoAdded";
  
  readonly returnInfo: ReturnInfo
}

export interface OrderReturnShipmentStateChangedMessagePayload {
  readonly type: "OrderReturnShipmentStateChanged";
  
  readonly returnItemId: string;
  
  readonly returnShipmentState: ReturnShipmentState
}

export interface OrderShipmentStateChangedMessagePayload {
  readonly type: "OrderShipmentStateChanged";
  
  readonly shipmentState: ShipmentState;
  
  readonly oldShipmentState: ShipmentState
}

export interface OrderShippingAddressSetMessagePayload {
  readonly type: "OrderShippingAddressSet";
  
  readonly oldAddress?: Address;
  
  readonly address?: Address
}

export interface OrderShippingInfoSetMessagePayload {
  readonly type: "OrderShippingInfoSet";
  
  readonly shippingInfo?: ShippingInfo;
  
  readonly oldShippingInfo?: ShippingInfo
}

export interface OrderShippingRateInputSetMessagePayload {
  readonly type: "OrderShippingRateInputSet";
  
  readonly shippingRateInput?: ShippingRateInput;
  
  readonly oldShippingRateInput?: ShippingRateInput
}

export interface OrderStateChangedMessagePayload {
  readonly type: "OrderStateChanged";
  
  readonly oldOrderState: OrderState;
  
  readonly orderState: OrderState
}

export interface OrderStateTransitionMessagePayload {
  readonly type: "OrderStateTransition";
  
  readonly force: boolean;
  
  readonly state: StateReference
}

export interface ParcelAddedToDeliveryMessagePayload {
  readonly type: "ParcelAddedToDelivery";
  
  readonly delivery: Delivery;
  
  readonly parcel: Parcel
}

export interface ParcelItemsUpdatedMessagePayload {
  readonly type: "ParcelItemsUpdated";
  
  readonly deliveryId?: string;
  
  readonly oldItems: DeliveryItem[];
  
  readonly items: DeliveryItem[];
  
  readonly parcelId: string
}

export interface ParcelMeasurementsUpdatedMessagePayload {
  readonly type: "ParcelMeasurementsUpdated";
  
  readonly deliveryId: string;
  
  readonly measurements?: ParcelMeasurements;
  
  readonly parcelId: string
}

export interface ParcelRemovedFromDeliveryMessagePayload {
  readonly type: "ParcelRemovedFromDelivery";
  
  readonly parcel: Parcel;
  
  readonly deliveryId: string
}

export interface ParcelTrackingDataUpdatedMessagePayload {
  readonly type: "ParcelTrackingDataUpdated";
  
  readonly deliveryId: string;
  
  readonly trackingData?: TrackingData;
  
  readonly parcelId: string
}

export interface PaymentCreatedMessagePayload {
  readonly type: "PaymentCreated";
  
  readonly payment: Payment
}

export interface PaymentInteractionAddedMessagePayload {
  readonly type: "PaymentInteractionAdded";
  
  readonly interaction: CustomFields
}

export interface PaymentStatusInterfaceCodeSetMessagePayload {
  readonly type: "PaymentStatusInterfaceCodeSet";
  
  readonly paymentId: string;
  
  readonly interfaceCode: string
}

export interface PaymentStatusStateTransitionMessagePayload {
  readonly type: "PaymentStatusStateTransition";
  
  readonly force: boolean;
  
  readonly state: StateReference
}

export interface PaymentTransactionAddedMessagePayload {
  readonly type: "PaymentTransactionAdded";
  
  readonly transaction: Transaction
}

export interface PaymentTransactionStateChangedMessagePayload {
  readonly type: "PaymentTransactionStateChanged";
  
  readonly state: TransactionState;
  
  readonly transactionId: string
}

export interface ProductCreatedMessagePayload {
  readonly type: "ProductCreated";
  
  readonly productProjection: ProductProjection
}

export interface ProductDeletedMessagePayload {
  readonly type: "ProductDeleted";
  
  readonly removedImageUrls: string[];
  
  readonly currentProjection: ProductProjection
}

export interface ProductImageAddedMessagePayload {
  readonly type: "ProductImageAdded";
  
  readonly image: Image;
  
  readonly staged: boolean;
  
  readonly variantId: number
}

export interface ProductPriceDiscountsSetMessagePayload {
  readonly type: "ProductPriceDiscountsSet";
  
  readonly updatedPrices: ProductPriceDiscountsSetUpdatedPrice[]
}

export interface ProductPriceExternalDiscountSetMessagePayload {
  readonly type: "ProductPriceExternalDiscountSet";
  
  readonly discounted?: DiscountedPrice;
  
  readonly staged: boolean;
  
  readonly variantId: number;
  
  readonly priceId: string;
  
  readonly sku?: string;
  
  readonly variantKey?: string
}

export interface ProductPublishedMessagePayload {
  readonly type: "ProductPublished";
  
  readonly removedImageUrls: object[];
  
  readonly productProjection: ProductProjection;
  
  readonly scope: ProductPublishScope
}

export interface ProductRevertedStagedChangesMessagePayload {
  readonly type: "ProductRevertedStagedChanges";
  
  readonly removedImageUrls: object[]
}

export interface ProductSlugChangedMessagePayload {
  readonly type: "ProductSlugChanged";
  
  readonly slug: LocalizedString
}

export interface ProductStateTransitionMessagePayload {
  readonly type: "ProductStateTransition";
  
  readonly force: boolean;
  
  readonly state: StateReference
}

export interface ProductUnpublishedMessagePayload {
  readonly type: "ProductUnpublished";
}

export interface ProductVariantDeletedMessagePayload {
  readonly type: "ProductVariantDeleted";
  
  readonly removedImageUrls: object[];
  
  readonly variant: ProductVariant
}

export interface ReviewCreatedMessagePayload {
  readonly type: "ReviewCreated";
  
  readonly review: Review
}

export interface ReviewRatingSetMessagePayload {
  readonly type: "ReviewRatingSet";
  
  readonly oldRating?: number;
  
  readonly includedInStatistics: boolean;
  
  readonly newRating?: number;
  
  readonly target?: Reference
}

export interface ReviewStateTransitionMessagePayload {
  readonly type: "ReviewStateTransition";
  
  readonly newIncludedInStatistics: boolean;
  
  readonly oldState: StateReference;
  
  readonly force: boolean;
  
  readonly oldIncludedInStatistics: boolean;
  
  readonly newState: StateReference;
  
  readonly target: Reference
}