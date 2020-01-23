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
  DiscountCodeInfo,
  ExternalLineItemTotalPrice,
  ExternalTaxAmountDraft,
  ExternalTaxRateDraft,
  InventoryMode,
  ItemShippingDetailsDraft,
  LineItem,
  RoundingMode,
  ShippingInfo,
  ShippingRateInput,
  ShippingRateInputDraft,
  TaxCalculationMode,
  TaxMode,
  TaxPortionDraft,
  TaxedPrice,
} from 'models/cart'
import { CartDiscountReference } from 'models/cart-discount'
import { ChannelResourceIdentifier } from 'models/channel'
import {
  Address,
  CreatedBy,
  LastModifiedBy,
  LocalizedString,
  LoggedResource,
  Money,
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
  TypedMoney,
} from 'models/common'
import {
  CustomerGroupReference,
  CustomerGroupResourceIdentifier,
} from 'models/customer-group'
import { DiscountCodeReference } from 'models/discount-code'
import { ErrorObject } from 'models/error'
import { MessagePayload } from 'models/message'
import {
  DeliveryItem,
  ItemState,
  Order,
  OrderReference,
  OrderState,
  ParcelDraft,
  ParcelMeasurements,
  PaymentInfo,
  PaymentState,
  ReturnInfo,
  ReturnItemDraft,
  ReturnPaymentState,
  ReturnShipmentState,
  ShipmentState,
  StagedOrderUpdateAction,
  SyncInfo,
  TrackingData,
} from 'models/order'
import { PaymentResourceIdentifier } from 'models/payment'
import {
  ShippingMethodResourceIdentifier,
  ShippingRateDraft,
} from 'models/shipping-method'
import { ShoppingListResourceIdentifier } from 'models/shopping-list'
import { StateReference, StateResourceIdentifier } from 'models/state'
import { StoreKeyReference } from 'models/store'
import { TaxCategoryResourceIdentifier } from 'models/tax-category'
import {
  CustomFields,
  CustomFieldsDraft,
  FieldContainer,
  TypeResourceIdentifier,
} from 'models/type'

export interface OrderEdit extends LoggedResource {
  /**
   *	The unique ID of the OrderEdit.
   */
  readonly id: string
  /**
   *	The current version of the OrderEdit.
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
   *	Unique identifier for this edit.
   */
  readonly key?: string
  /**
   *	The order to be updated with this edit.
   */
  readonly resource: OrderReference
  /**
   *	The actions to apply to the Order.
   *	Cannot be updated after the edit has been applied.
   */
  readonly stagedActions: StagedOrderUpdateAction[]
  readonly custom?: CustomFields
  /**
   *	Contains a preview of the changes in case of unapplied edit.
   *	For applied edits, it contains the summary of the changes.
   */
  readonly result: OrderEditResult
  /**
   *	This field can be used to add textual information regarding the edit.
   */
  readonly comment?: string
}
export interface OrderEditApply {
  readonly editVersion: number
  readonly resourceVersion: number
}
export interface OrderEditDraft {
  /**
   *	Unique identifier for this edit.
   */
  readonly key?: string
  /**
   *	The order to be updated with this edit.
   */
  readonly resource: OrderReference
  /**
   *	The actions to apply to `resource`.
   */
  readonly stagedActions?: StagedOrderUpdateAction[]
  /**
   *	The custom fields.
   */
  readonly custom?: CustomFieldsDraft
  /**
   *	This field can be used to add additional textual information regarding the edit.
   */
  readonly comment?: string
  /**
   *	When set to `true` the edit is applied on the Order without persisting it.
   */
  readonly dryRun?: boolean
}
export interface OrderEditPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: OrderEdit[]
}
export interface OrderEditReference {
  readonly typeId: 'order-edit'
  readonly id: string
  readonly obj?: OrderEdit
}
export interface OrderEditResourceIdentifier {
  readonly typeId: 'order-edit'
  readonly id?: string
  readonly key?: string
}
export type OrderEditResult =
  | OrderEditApplied
  | OrderEditNotProcessed
  | OrderEditPreviewFailure
  | OrderEditPreviewSuccess
export interface OrderEditApplied {
  readonly type: 'Applied'
  readonly excerptAfterEdit: OrderExcerpt
  readonly excerptBeforeEdit: OrderExcerpt
  readonly appliedAt: string
}
export interface OrderEditNotProcessed {
  readonly type: 'NotProcessed'
}
export interface OrderEditPreviewFailure {
  readonly type: 'PreviewFailure'
  readonly errors: ErrorObject[]
}
export interface OrderEditPreviewSuccess {
  readonly type: 'PreviewSuccess'
  readonly preview: StagedOrder
  readonly messagePayloads: MessagePayload[]
}
export interface OrderEditUpdate {
  readonly version: number
  readonly actions: OrderEditUpdateAction[]
  readonly dryRun?: boolean
}
export type OrderEditUpdateAction =
  | OrderEditAddStagedActionAction
  | OrderEditSetCommentAction
  | OrderEditSetCustomFieldAction
  | OrderEditSetCustomTypeAction
  | OrderEditSetKeyAction
  | OrderEditSetStagedActionsAction
export interface OrderExcerpt {
  readonly totalPrice: TypedMoney
  readonly taxedPrice?: TaxedPrice
  readonly version: number
}
export interface StagedOrder extends Order {}
export interface OrderEditAddStagedActionAction {
  readonly action: 'addStagedAction'
  readonly stagedAction: StagedOrderUpdateAction
}
export interface OrderEditSetCommentAction {
  readonly action: 'setComment'
  readonly comment?: string
}
export interface OrderEditSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface OrderEditSetCustomTypeAction {
  readonly action: 'setCustomType'
  /**
   *	If set, the custom fields are set to this new value.
   */
  readonly fields?: any
  /**
   *	If set, the custom type is set to this new value.
   *	If absent, the custom type and any existing custom fields are removed.
   */
  readonly type?: TypeResourceIdentifier
}
export interface OrderEditSetKeyAction {
  readonly action: 'setKey'
  /**
   *	If `key` is absent or `null`, this field will be removed if it exists.
   */
  readonly key?: string
}
export interface OrderEditSetStagedActionsAction {
  readonly action: 'setStagedActions'
  /**
   *	The actions to edit the `resource`.
   */
  readonly stagedActions: StagedOrderUpdateAction[]
}
export interface StagedOrderAddCustomLineItemAction {
  readonly action: 'addCustomLineItem'
  readonly externalTaxRate?: ExternalTaxRateDraft
  readonly quantity?: number
  readonly money: Money
  readonly custom?: CustomFieldsDraft
  readonly name: LocalizedString
  readonly slug: string
  readonly taxCategory?: TaxCategoryResourceIdentifier
}
export interface StagedOrderAddDeliveryAction {
  readonly action: 'addDelivery'
  readonly address?: Address
  readonly items?: DeliveryItem[]
  readonly parcels?: ParcelDraft[]
}
export interface StagedOrderAddDiscountCodeAction {
  readonly action: 'addDiscountCode'
  readonly code: string
}
export interface StagedOrderAddItemShippingAddressAction {
  readonly action: 'addItemShippingAddress'
  readonly address: Address
}
export interface StagedOrderAddLineItemAction {
  readonly action: 'addLineItem'
  readonly quantity?: number
  readonly externalTaxRate?: ExternalTaxRateDraft
  readonly shippingDetails?: ItemShippingDetailsDraft
  readonly productId?: string
  readonly externalTotalPrice?: ExternalLineItemTotalPrice
  readonly custom?: CustomFieldsDraft
  readonly supplyChannel?: ChannelResourceIdentifier
  readonly variantId?: number
  readonly sku?: string
  readonly distributionChannel?: ChannelResourceIdentifier
  readonly externalPrice?: Money
}
export interface StagedOrderAddParcelToDeliveryAction {
  readonly action: 'addParcelToDelivery'
  readonly deliveryId: string
  readonly items?: DeliveryItem[]
  readonly trackingData?: TrackingData
  readonly measurements?: ParcelMeasurements
}
export interface StagedOrderAddPaymentAction {
  readonly action: 'addPayment'
  readonly payment: PaymentResourceIdentifier
}
export interface StagedOrderAddReturnInfoAction {
  readonly action: 'addReturnInfo'
  readonly returnDate?: string
  readonly returnTrackingId?: string
  readonly items: ReturnItemDraft[]
}
export interface StagedOrderAddShoppingListAction {
  readonly action: 'addShoppingList'
  readonly shoppingList: ShoppingListResourceIdentifier
  readonly supplyChannel?: ChannelResourceIdentifier
  readonly distributionChannel?: ChannelResourceIdentifier
}
export interface StagedOrderChangeCustomLineItemMoneyAction {
  readonly action: 'changeCustomLineItemMoney'
  readonly customLineItemId: string
  readonly money: Money
}
export interface StagedOrderChangeCustomLineItemQuantityAction {
  readonly action: 'changeCustomLineItemQuantity'
  readonly customLineItemId: string
  readonly quantity: number
}
export interface StagedOrderChangeLineItemQuantityAction {
  readonly action: 'changeLineItemQuantity'
  readonly quantity: number
  readonly externalTotalPrice?: ExternalLineItemTotalPrice
  readonly lineItemId: string
  readonly externalPrice?: Money
}
export interface StagedOrderChangeOrderStateAction {
  readonly action: 'changeOrderState'
  readonly orderState: OrderState
}
export interface StagedOrderChangePaymentStateAction {
  readonly action: 'changePaymentState'
  readonly paymentState?: PaymentState
}
export interface StagedOrderChangeShipmentStateAction {
  readonly action: 'changeShipmentState'
  readonly shipmentState?: ShipmentState
}
export interface StagedOrderChangeTaxCalculationModeAction {
  readonly action: 'changeTaxCalculationMode'
  readonly taxCalculationMode: TaxCalculationMode
}
export interface StagedOrderChangeTaxModeAction {
  readonly action: 'changeTaxMode'
  readonly taxMode: TaxMode
}
export interface StagedOrderChangeTaxRoundingModeAction {
  readonly action: 'changeTaxRoundingMode'
  readonly taxRoundingMode: RoundingMode
}
export interface StagedOrderImportCustomLineItemStateAction {
  readonly action: 'importCustomLineItemState'
  readonly customLineItemId: string
  readonly state: ItemState[]
}
export interface StagedOrderImportLineItemStateAction {
  readonly action: 'importLineItemState'
  readonly lineItemId: string
  readonly state: ItemState[]
}
export interface StagedOrderRemoveCustomLineItemAction {
  readonly action: 'removeCustomLineItem'
  readonly customLineItemId: string
}
export interface StagedOrderRemoveDeliveryAction {
  readonly action: 'removeDelivery'
  readonly deliveryId: string
}
export interface StagedOrderRemoveDiscountCodeAction {
  readonly action: 'removeDiscountCode'
  readonly discountCode: DiscountCodeReference
}
export interface StagedOrderRemoveItemShippingAddressAction {
  readonly action: 'removeItemShippingAddress'
  readonly addressKey: string
}
export interface StagedOrderRemoveLineItemAction {
  readonly action: 'removeLineItem'
  readonly quantity?: number
  readonly externalTotalPrice?: ExternalLineItemTotalPrice
  readonly lineItemId: string
  readonly shippingDetailsToRemove?: ItemShippingDetailsDraft
  readonly externalPrice?: Money
}
export interface StagedOrderRemoveParcelFromDeliveryAction {
  readonly action: 'removeParcelFromDelivery'
  readonly parcelId: string
}
export interface StagedOrderRemovePaymentAction {
  readonly action: 'removePayment'
  readonly payment: PaymentResourceIdentifier
}
export interface StagedOrderSetBillingAddressAction {
  readonly action: 'setBillingAddress'
  readonly address?: Address
}
export interface StagedOrderSetCountryAction {
  readonly action: 'setCountry'
  readonly country?: string
}
export interface StagedOrderSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface StagedOrderSetCustomLineItemCustomFieldAction {
  readonly action: 'setCustomLineItemCustomField'
  readonly customLineItemId: string
  readonly name: string
  readonly value?: any
}
export interface StagedOrderSetCustomLineItemCustomTypeAction {
  readonly action: 'setCustomLineItemCustomType'
  readonly customLineItemId: string
  readonly fields?: FieldContainer
  readonly type?: TypeResourceIdentifier
}
export interface StagedOrderSetCustomLineItemShippingDetailsAction {
  readonly action: 'setCustomLineItemShippingDetails'
  readonly customLineItemId: string
  readonly shippingDetails?: ItemShippingDetailsDraft
}
export interface StagedOrderSetCustomLineItemTaxAmountAction {
  readonly action: 'setCustomLineItemTaxAmount'
  readonly customLineItemId: string
  readonly externalTaxAmount?: ExternalTaxAmountDraft
}
export interface StagedOrderSetCustomLineItemTaxRateAction {
  readonly action: 'setCustomLineItemTaxRate'
  readonly customLineItemId: string
  readonly externalTaxRate?: ExternalTaxRateDraft
}
export interface StagedOrderSetCustomShippingMethodAction {
  readonly action: 'setCustomShippingMethod'
  readonly shippingRate: ShippingRateDraft
  readonly externalTaxRate?: ExternalTaxRateDraft
  readonly shippingMethodName: string
  readonly taxCategory?: TaxCategoryResourceIdentifier
}
export interface StagedOrderSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly fields?: FieldContainer
  readonly type?: TypeResourceIdentifier
}
export interface StagedOrderSetCustomerEmailAction {
  readonly action: 'setCustomerEmail'
  readonly email?: string
}
export interface StagedOrderSetCustomerGroupAction {
  readonly action: 'setCustomerGroup'
  readonly customerGroup?: CustomerGroupResourceIdentifier
}
export interface StagedOrderSetCustomerIdAction {
  readonly action: 'setCustomerId'
  readonly customerId?: string
}
export interface StagedOrderSetDeliveryAddressAction {
  readonly action: 'setDeliveryAddress'
  readonly deliveryId: string
  readonly address?: Address
}
export interface StagedOrderSetDeliveryItemsAction {
  readonly action: 'setDeliveryItems'
  readonly deliveryId: string
  readonly items: DeliveryItem[]
}
export interface StagedOrderSetLineItemCustomFieldAction {
  readonly action: 'setLineItemCustomField'
  readonly lineItemId: string
  readonly name: string
  readonly value?: any
}
export interface StagedOrderSetLineItemCustomTypeAction {
  readonly action: 'setLineItemCustomType'
  readonly lineItemId: string
  readonly fields?: FieldContainer
  readonly type?: TypeResourceIdentifier
}
export interface StagedOrderSetLineItemPriceAction {
  readonly action: 'setLineItemPrice'
  readonly lineItemId: string
  readonly externalPrice?: Money
}
export interface StagedOrderSetLineItemShippingDetailsAction {
  readonly action: 'setLineItemShippingDetails'
  readonly shippingDetails?: ItemShippingDetailsDraft
  readonly lineItemId: string
}
export interface StagedOrderSetLineItemTaxAmountAction {
  readonly action: 'setLineItemTaxAmount'
  readonly lineItemId: string
  readonly externalTaxAmount?: ExternalTaxAmountDraft
}
export interface StagedOrderSetLineItemTaxRateAction {
  readonly action: 'setLineItemTaxRate'
  readonly externalTaxRate?: ExternalTaxRateDraft
  readonly lineItemId: string
}
export interface StagedOrderSetLineItemTotalPriceAction {
  readonly action: 'setLineItemTotalPrice'
  readonly externalTotalPrice?: ExternalLineItemTotalPrice
  readonly lineItemId: string
}
export interface StagedOrderSetLocaleAction {
  readonly action: 'setLocale'
  readonly locale?: string
}
export interface StagedOrderSetOrderNumberAction {
  readonly action: 'setOrderNumber'
  readonly orderNumber?: string
}
export interface StagedOrderSetOrderTotalTaxAction {
  readonly action: 'setOrderTotalTax'
  readonly externalTaxPortions?: TaxPortionDraft[]
  readonly externalTotalGross: Money
}
export interface StagedOrderSetParcelItemsAction {
  readonly action: 'setParcelItems'
  readonly items: DeliveryItem[]
  readonly parcelId: string
}
export interface StagedOrderSetParcelMeasurementsAction {
  readonly action: 'setParcelMeasurements'
  readonly measurements?: ParcelMeasurements
  readonly parcelId: string
}
export interface StagedOrderSetParcelTrackingDataAction {
  readonly action: 'setParcelTrackingData'
  readonly trackingData?: TrackingData
  readonly parcelId: string
}
export interface StagedOrderSetReturnPaymentStateAction {
  readonly action: 'setReturnPaymentState'
  readonly returnItemId: string
  readonly paymentState: ReturnPaymentState
}
export interface StagedOrderSetReturnShipmentStateAction {
  readonly action: 'setReturnShipmentState'
  readonly shipmentState: ReturnShipmentState
  readonly returnItemId: string
}
export interface StagedOrderSetShippingAddressAction {
  readonly action: 'setShippingAddress'
  readonly address?: Address
}
export interface StagedOrderSetShippingAddressAndCustomShippingMethodAction {
  readonly action: 'setShippingAddressAndCustomShippingMethod'
  readonly shippingRate: ShippingRateDraft
  readonly externalTaxRate?: ExternalTaxRateDraft
  readonly address: Address
  readonly shippingMethodName: string
  readonly taxCategory?: TaxCategoryResourceIdentifier
}
export interface StagedOrderSetShippingAddressAndShippingMethodAction {
  readonly action: 'setShippingAddressAndShippingMethod'
  readonly externalTaxRate?: ExternalTaxRateDraft
  readonly address: Address
  readonly shippingMethod?: ShippingMethodResourceIdentifier
}
export interface StagedOrderSetShippingMethodAction {
  readonly action: 'setShippingMethod'
  readonly externalTaxRate?: ExternalTaxRateDraft
  readonly shippingMethod?: ShippingMethodResourceIdentifier
}
export interface StagedOrderSetShippingMethodTaxAmountAction {
  readonly action: 'setShippingMethodTaxAmount'
  readonly externalTaxAmount?: ExternalTaxAmountDraft
}
export interface StagedOrderSetShippingMethodTaxRateAction {
  readonly action: 'setShippingMethodTaxRate'
  readonly externalTaxRate?: ExternalTaxRateDraft
}
export interface StagedOrderSetShippingRateInputAction {
  readonly action: 'setShippingRateInput'
  readonly shippingRateInput?: ShippingRateInputDraft
}
export interface StagedOrderTransitionCustomLineItemStateAction {
  readonly action: 'transitionCustomLineItemState'
  readonly toState: StateResourceIdentifier
  readonly fromState: StateResourceIdentifier
  readonly customLineItemId: string
  readonly quantity: number
  readonly actualTransitionDate?: string
}
export interface StagedOrderTransitionLineItemStateAction {
  readonly action: 'transitionLineItemState'
  readonly toState: StateResourceIdentifier
  readonly fromState: StateResourceIdentifier
  readonly quantity: number
  readonly lineItemId: string
  readonly actualTransitionDate?: string
}
export interface StagedOrderTransitionStateAction {
  readonly action: 'transitionState'
  readonly force?: boolean
  readonly state: StateResourceIdentifier
}
export interface StagedOrderUpdateItemShippingAddressAction {
  readonly action: 'updateItemShippingAddress'
  readonly address: Address
}
export interface StagedOrderUpdateSyncInfoAction {
  readonly action: 'updateSyncInfo'
  readonly channel: ChannelResourceIdentifier
  readonly externalId?: string
  readonly syncedAt?: string
}
