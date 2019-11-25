//Generated file, please do not change

import { CartDiscountReference } from './cart-discount'
import { ChannelReference, ChannelResourceIdentifier } from './channel'
import {
  Address,
  CreatedBy,
  LastModifiedBy,
  LocalizedString,
  LoggedResource,
  Money,
  Price,
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
  TypedMoney,
  TypedMoneyDraft,
} from './common'
import {
  CustomerGroupReference,
  CustomerGroupResourceIdentifier,
} from './customer-group'
import { DiscountCodeReference } from './discount-code'
import { Delivery, ItemState, OrderReference, PaymentInfo } from './order'
import { PaymentResourceIdentifier } from './payment'
import { ProductVariant } from './product'
import { ProductTypeReference } from './product-type'
import {
  ShippingMethodReference,
  ShippingMethodResourceIdentifier,
  ShippingRate,
  ShippingRateDraft,
} from './shipping-method'
import { ShoppingListResourceIdentifier } from './shopping-list'
import { StoreKeyReference, StoreResourceIdentifier } from './store'
import {
  SubRate,
  TaxCategoryReference,
  TaxCategoryResourceIdentifier,
  TaxRate,
} from './tax-category'
import {
  CustomFields,
  CustomFieldsDraft,
  FieldContainer,
  TypeResourceIdentifier,
} from './type'

export interface Cart extends LoggedResource {
  /**
   *		The unique ID of the cart.
   */
  readonly id: string
  /**
   *		The current version of the cart.
   */
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
  readonly customerId?: string
  readonly customerEmail?: string
  /**
   *		Identifies carts and orders belonging to an anonymous session (the customer has not signed up/in yet).
   */
  readonly anonymousId?: string
  readonly store?: StoreKeyReference
  readonly lineItems: LineItem[]
  readonly customLineItems: CustomLineItem[]
  /**
   *		The sum of all `totalPrice` fields of the `lineItems` and `customLineItems`, as well as the `price` field of `shippingInfo` (if it exists).
   *		`totalPrice` may or may not include the taxes: it depends on the taxRate.includedInPrice property of each price.
   */
  readonly totalPrice: TypedMoney
  /**
   *		Not set until the shipping address is set.
   *		Will be set automatically in the `Platform` TaxMode.
   *		For the `External` tax mode it will be set  as soon as the external tax rates for all line items, custom line items, and shipping in the cart are set.
   */
  readonly taxedPrice?: TaxedPrice
  readonly cartState: CartState
  /**
   *		The shipping address is used to determine the eligible shipping methods and rates as well as the tax rate of the line items.
   */
  readonly shippingAddress?: Address
  readonly billingAddress?: Address
  readonly inventoryMode?: InventoryMode
  readonly taxMode: TaxMode
  /**
   *		When calculating taxes for `taxedPrice`, the selected mode is used for rounding.
   */
  readonly taxRoundingMode: RoundingMode
  /**
   *		When calculating taxes for `taxedPrice`, the selected mode is used for calculating the price with `LineItemLevel` (horizontally) or `UnitPriceLevel` (vertically) calculation mode.
   */
  readonly taxCalculationMode: TaxCalculationMode
  /**
   *		Set automatically when the customer is set and the customer is a member of a customer group.
   *		Used for product variant
   *		price selection.
   */
  readonly customerGroup?: CustomerGroupReference
  /**
   *		A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   *		Used for product variant price selection.
   */
  readonly country?: string
  /**
   *		Set automatically once the ShippingMethod is set.
   */
  readonly shippingInfo?: ShippingInfo
  readonly discountCodes?: DiscountCodeInfo[]
  readonly custom?: CustomFields
  readonly paymentInfo?: PaymentInfo
  readonly locale?: string
  /**
   *		The cart will be deleted automatically if it hasn't been modified for the specified amount of days and it is in the `Active` CartState.
   */
  readonly deleteDaysAfterLastModification?: number
  /**
   *		Automatically filled when a line item with LineItemMode `GiftLineItem` is removed from the cart.
   */
  readonly refusedGifts: CartDiscountReference[]
  /**
   *		The origin field indicates how this cart was created.
   *		The value `Customer` indicates, that the cart was created by the customer.
   */
  readonly origin: CartOrigin
  /**
   *		The shippingRateInput is used as an input to select a ShippingRatePriceTier.
   */
  readonly shippingRateInput?: ShippingRateInput
  /**
   *		Contains addresses for carts with multiple shipping addresses.
   *		Line items reference these addresses under their `shippingDetails`.
   *		The addresses captured here are not used to determine eligible shipping methods or the applicable tax rate.
   *		Only the cart's `shippingAddress` is used for this.
   */
  readonly itemShippingAddresses?: Address[]
}
export interface CartDraft {
  /**
   *		A three-digit currency code as per [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
   */
  readonly currency: string
  /**
   *		Id of an existing Customer.
   */
  readonly customerId?: string
  readonly customerEmail?: string
  /**
   *		Will be set automatically when the `customerId` is set and the customer is a member of a customer group.
   *		Can be set explicitly when no `customerId` is present.
   */
  readonly customerGroup?: CustomerGroupResourceIdentifier
  /**
   *		Assigns the new cart to an anonymous session (the customer has not signed up/in yet).
   */
  readonly anonymousId?: string
  /**
   *		Assigns the new cart to the store.
   *		The store assignment can not be modified.
   */
  readonly store?: StoreResourceIdentifier
  /**
   *		A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   */
  readonly country?: string
  /**
   *		Default inventory mode is `None`.
   */
  readonly inventoryMode?: InventoryMode
  /**
   *		The default tax mode is `Platform`.
   */
  readonly taxMode?: TaxMode
  /**
   *		The default tax rounding mode is `HalfEven`.
   */
  readonly taxRoundingMode?: RoundingMode
  /**
   *		The default tax calculation mode is `LineItemLevel`.
   */
  readonly taxCalculationMode?: TaxCalculationMode
  readonly lineItems?: LineItemDraft[]
  readonly customLineItems?: CustomLineItemDraft[]
  /**
   *		The shipping address is used to determine the eligible shipping methods and rates as well as the tax rate of the line items.
   */
  readonly shippingAddress?: Address
  readonly billingAddress?: Address
  readonly shippingMethod?: ShippingMethodResourceIdentifier
  /**
   *		An external tax rate can be set for the `shippingMethod` if the cart has the `External` TaxMode.
   */
  readonly externalTaxRateForShippingMethod?: ExternalTaxRateDraft
  /**
   *		The custom fields.
   */
  readonly custom?: CustomFieldsDraft
  /**
   *		Must be one of the languages supported for this project
   */
  readonly locale?: string
  /**
   *		The cart will be deleted automatically if it hasn't been modified for the specified amount of days and it is in the `Active` CartState.
   *		If a ChangeSubscription for carts exists, a `ResourceDeleted` notification will be sent.
   */
  readonly deleteDaysAfterLastModification?: number
  /**
   *		The default origin is `Customer`.
   */
  readonly origin?: CartOrigin
  /**
   *		The shippingRateInput is used as an input to select a ShippingRatePriceTier.
   *		Based on the definition of ShippingRateInputType.
   *		If CartClassification is defined, it must be ClassificationShippingRateInput.
   *		If CartScore is defined, it must be ScoreShippingRateInput.
   *		Otherwise it can not bet set.
   */
  readonly shippingRateInput?: ShippingRateInputDraft
  /**
   *		Contains addresses for carts with multiple shipping addresses.
   *		Each address must contain a key which is unique in this cart.
   *		Line items will use these keys to reference the addresses under their `shippingDetails`.
   *		The addresses captured here are not used to determine eligible shipping methods or the applicable tax rate.
   *		Only the cart's `shippingAddress` is used for this.
   */
  readonly itemShippingAddresses?: Address[]
}
export type CartOrigin = 'Customer' | 'Merchant'
export interface CartPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Cart[]
}
export interface CartReference {
  readonly typeId: 'cart'
  readonly id: string
  readonly obj?: Cart
}
export interface CartResourceIdentifier {
  readonly typeId: 'cart'
  readonly id?: string
  readonly key?: string
}
export type CartState = 'Active' | 'Merged' | 'Ordered'
export interface CartUpdate {
  readonly version: number
  readonly actions: CartUpdateAction[]
}
export type CartUpdateAction =
  | CartAddCustomLineItemAction
  | CartAddDiscountCodeAction
  | CartAddItemShippingAddressAction
  | CartAddLineItemAction
  | CartAddPaymentAction
  | CartAddShoppingListAction
  | CartApplyDeltaToCustomLineItemShippingDetailsTargetsAction
  | CartApplyDeltaToLineItemShippingDetailsTargetsAction
  | CartChangeCustomLineItemMoneyAction
  | CartChangeCustomLineItemQuantityAction
  | CartChangeLineItemQuantityAction
  | CartChangeTaxCalculationModeAction
  | CartChangeTaxModeAction
  | CartChangeTaxRoundingModeAction
  | CartRecalculateAction
  | CartRemoveCustomLineItemAction
  | CartRemoveDiscountCodeAction
  | CartRemoveItemShippingAddressAction
  | CartRemoveLineItemAction
  | CartRemovePaymentAction
  | CartSetAnonymousIdAction
  | CartSetBillingAddressAction
  | CartSetCartTotalTaxAction
  | CartSetCountryAction
  | CartSetCustomFieldAction
  | CartSetCustomLineItemCustomFieldAction
  | CartSetCustomLineItemCustomTypeAction
  | CartSetCustomLineItemShippingDetailsAction
  | CartSetCustomLineItemTaxAmountAction
  | CartSetCustomLineItemTaxRateAction
  | CartSetCustomShippingMethodAction
  | CartSetCustomTypeAction
  | CartSetCustomerEmailAction
  | CartSetCustomerGroupAction
  | CartSetCustomerIdAction
  | CartSetDeleteDaysAfterLastModificationAction
  | CartSetLineItemCustomFieldAction
  | CartSetLineItemCustomTypeAction
  | CartSetLineItemPriceAction
  | CartSetLineItemShippingDetailsAction
  | CartSetLineItemTaxAmountAction
  | CartSetLineItemTaxRateAction
  | CartSetLineItemTotalPriceAction
  | CartSetLocaleAction
  | CartSetShippingAddressAction
  | CartSetShippingMethodAction
  | CartSetShippingMethodTaxAmountAction
  | CartSetShippingMethodTaxRateAction
  | CartSetShippingRateInputAction
  | CartUpdateItemShippingAddressAction
export interface CustomLineItem {
  /**
   *		The unique ID of this CustomLineItem.
   */
  readonly id: string
  /**
   *		The name of this CustomLineItem.
   */
  readonly name: LocalizedString
  /**
   *		The cost to add to the cart.
   *		The amount can be negative.
   */
  readonly money: TypedMoney
  /**
   *		Set once the `taxRate` is set.
   */
  readonly taxedPrice?: TaxedItemPrice
  /**
   *		The total price of this custom line item.
   *		If custom line item is discounted, then the `totalPrice` would be the discounted custom line item price multiplied by `quantity`.
   *		Otherwise a total price is just a `money` multiplied by the `quantity`.
   *		`totalPrice` may or may not include the taxes: it depends on the taxRate.includedInPrice property.
   */
  readonly totalPrice: TypedMoney
  /**
   *		A unique String in the cart to identify this CustomLineItem.
   */
  readonly slug: string
  /**
   *		The amount of a CustomLineItem in the cart.
   *		Must be a positive integer.
   */
  readonly quantity: number
  readonly state: ItemState[]
  readonly taxCategory?: TaxCategoryReference
  /**
   *		Will be set automatically in the `Platform` TaxMode once the shipping address is set is set.
   *		For the `External` tax mode the tax rate has to be set explicitly with the ExternalTaxRateDraft.
   */
  readonly taxRate?: TaxRate
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[]
  readonly custom?: CustomFields
  /**
   *		Container for custom line item specific address(es).
   *		CustomLineItem fields that can be used in query predicates: `slug`, `name`, `quantity`,
   *		`money`, `state`, `discountedPricePerQuantity`.
   */
  readonly shippingDetails?: ItemShippingDetails
}
export interface CustomLineItemDraft {
  readonly name: LocalizedString
  /**
   *		The amount of a CustomLineItemin the cart.
   *		Must be a positive integer.
   */
  readonly quantity: number
  readonly money: Money
  readonly slug: string
  /**
   *		The given tax category will be used to select a tax rate when a cart has the TaxMode `Platform`.
   */
  readonly taxCategory?: TaxCategoryResourceIdentifier
  /**
   *		An external tax rate can be set if the cart has the `External` TaxMode.
   */
  readonly externalTaxRate?: ExternalTaxRateDraft
  /**
   *		The custom fields.
   */
  readonly custom?: CustomFields
  /**
   *		Container for custom line item specific address(es).
   */
  readonly shippingDetails?: ItemShippingDetailsDraft
}
export interface DiscountCodeInfo {
  readonly discountCode: DiscountCodeReference
  readonly state: DiscountCodeState
}
export type DiscountCodeState =
  | 'NotActive'
  | 'DoesNotMatchCart'
  | 'MatchesCart'
  | 'MaxApplicationReached'
export interface DiscountedLineItemPortion {
  readonly discount: CartDiscountReference
  readonly discountedAmount: TypedMoney
}
export interface DiscountedLineItemPrice {
  readonly value: TypedMoney
  readonly includedDiscounts: DiscountedLineItemPortion[]
}
export interface DiscountedLineItemPriceForQuantity {
  readonly quantity: number
  readonly discountedPrice: DiscountedLineItemPrice
}
export interface ExternalLineItemTotalPrice {
  readonly price: Money
  readonly totalPrice: Money
}
export interface ExternalTaxAmountDraft {
  /**
   *		The total gross amount of the item (totalNet + taxes).
   */
  readonly totalGross: Money
  readonly taxRate: ExternalTaxRateDraft
}
export interface ExternalTaxRateDraft {
  readonly name: string
  /**
   *		Percentage in the range of [0..1].
   *		Must be supplied if no `subRates` are specified.
   *		If `subRates` are specified
   *		then the `amount` can be omitted or it must be the sum of the amounts of all `subRates`.
   */
  readonly amount?: number
  /**
   *		A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   */
  readonly country: string
  /**
   *		The state in the country
   */
  readonly state?: string
  /**
   *		For countries (e.g.
   *		the US) where the total tax is a combination of multiple taxes (e.g.
   *		state and local taxes).
   */
  readonly subRates?: SubRate[]
  /**
   *		The default value for `includedInPrice` is FALSE.
   */
  readonly includedInPrice?: boolean
}
export type InventoryMode = 'TrackOnly' | 'ReserveOnOrder' | 'None'
export interface ItemShippingDetails {
  /**
   *		Used to map what sub-quantity should be shipped to which address.
   *		Duplicate address keys are not allowed.
   */
  readonly targets: ItemShippingTarget[]
  /**
   *		`true` if the quantity of the (custom) line item is equal to the sum of the sub-quantities in `targets`, `false` otherwise.
   *		A cart cannot be ordered when the value is `false`.
   *		The error InvalidItemShippingDetails will be triggered.
   */
  readonly valid: boolean
}
export interface ItemShippingDetailsDraft {
  /**
   *		Used to capture one or more (custom) line item specific shipping addresses.
   *		By specifying sub-quantities, it is possible to set multiple shipping addresses for one line item.
   *		A cart can have `shippingDetails` where the `targets` sum does not match the quantity of the line item or custom line item.
   *		For the order creation and order updates the `targets` sum must match the quantity.
   */
  readonly targets: ItemShippingTarget[]
}
export interface ItemShippingTarget {
  /**
   *		The key of the address in the cart's `itemShippingAddresses`
   */
  readonly addressKey: string
  /**
   *		The quantity of items that should go to the address with the specified `addressKey`.
   *		Only positive values are allowed.
   *		Using `0` as quantity is also possible in a draft object, but the element will not be present in the resulting ItemShippingDetails.
   */
  readonly quantity: number
}
export interface LineItem {
  /**
   *		The unique ID of this LineItem.
   */
  readonly id: string
  readonly productId: string
  /**
   *		The product name.
   */
  readonly name: LocalizedString
  /**
   *		The slug of a product is inserted on the fly.
   *		It is always up-to-date and can therefore be used to link to the product detail page of the product.
   *		It is empty if the product has been deleted.
   *		The slug is also empty if the cart or order is retrieved via Reference Expansion or is a snapshot in a Message.
   */
  readonly productSlug?: LocalizedString
  readonly productType: ProductTypeReference
  /**
   *		The variant data is saved when the variant is added to the cart, and not updated automatically.
   *		It can manually be updated with the Recalculate update action.
   */
  readonly variant: ProductVariant
  /**
   *		The price of a line item is selected from the prices array of the product variant.
   *		If the `variant` field hasn't been updated, the price may not correspond to a price in `variant.prices`.
   */
  readonly price: Price
  /**
   *		Set once the `taxRate` is set.
   */
  readonly taxedPrice?: TaxedItemPrice
  /**
   *		The total price of this line item.
   *		If the line item is discounted, then the `totalPrice` is the DiscountedLineItemPriceForQuantity multiplied by `quantity`.
   *		Otherwise the total price is the product price multiplied by the `quantity`.
   *		`totalPrice` may or may not include the taxes: it depends on the taxRate.includedInPrice property.
   */
  readonly totalPrice: TypedMoney
  /**
   *		The amount of a LineItem in the cart.
   *		Must be a positive integer.
   */
  readonly quantity: number
  readonly state: ItemState[]
  /**
   *		Will be set automatically in the `Platform` TaxMode once the shipping address is set is set.
   *		For the `External` tax mode the tax rate has to be set explicitly with the ExternalTaxRateDraft.
   */
  readonly taxRate?: TaxRate
  /**
   *		The supply channel identifies the inventory entries that should be reserved.
   *		The channel has
   *		the role InventorySupply.
   */
  readonly supplyChannel?: ChannelReference
  /**
   *		The distribution channel is used to select a ProductPrice.
   *		The channel has the role ProductDistribution.
   */
  readonly distributionChannel?: ChannelReference
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[]
  readonly priceMode: LineItemPriceMode
  readonly lineItemMode: LineItemMode
  readonly custom?: CustomFields
  /**
   *		Container for line item specific address(es).
   */
  readonly shippingDetails?: ItemShippingDetails
}
export interface LineItemDraft {
  readonly productId?: string
  readonly variantId?: number
  readonly sku?: string
  /**
   *		The amount of a `LineItem`in the cart.
   *		Must be a positive integer.
   */
  readonly quantity?: number
  /**
   *		By providing supply channel information, you can unique identify
   *		inventory entries that should be reserved.
   *		The provided channel should have
   *		the InventorySupply role.
   */
  readonly supplyChannel?: ChannelResourceIdentifier
  /**
   *		The channel is used to select a ProductPrice.
   *		The provided channel should have the ProductDistribution role.
   */
  readonly distributionChannel?: ChannelResourceIdentifier
  /**
   *		An external tax rate can be set if the cart has the `External` TaxMode.
   */
  readonly externalTaxRate?: ExternalTaxRateDraft
  /**
   *		The custom fields.
   */
  readonly custom?: CustomFieldsDraft
  /**
   *		Sets the line item `price` to the given value and sets the line item `priceMode` to `ExternalPrice` LineItemPriceMode.
   */
  readonly externalPrice?: Money
  /**
   *		Sets the line item `price` and `totalPrice` to the given values and sets the line item `priceMode` to `ExternalTotal` LineItemPriceMode.
   */
  readonly externalTotalPrice?: ExternalLineItemTotalPrice
  /**
   *		Container for line item specific address(es).
   */
  readonly shippingDetails?: ItemShippingDetailsDraft
}
export type LineItemMode = 'Standard' | 'GiftLineItem'
export type LineItemPriceMode = 'Platform' | 'ExternalTotal' | 'ExternalPrice'
export interface ReplicaCartDraft {
  readonly reference: CartReference | OrderReference
}
export type RoundingMode = 'HalfEven' | 'HalfUp' | 'HalfDown'
export interface ShippingInfo {
  readonly shippingMethodName: string
  /**
   *		Determined based on the ShippingRate and its tiered prices, and either the sum of LineItem prices or the `shippingRateInput` field.
   */
  readonly price: TypedMoney
  /**
   *		The shipping rate used to determine the price.
   */
  readonly shippingRate: ShippingRate
  /**
   *		Set once the `taxRate` is set.
   */
  readonly taxedPrice?: TaxedItemPrice
  /**
   *		Will be set automatically in the `Platform` TaxMode once the shipping address is set is set.
   *		For the `External` tax mode the tax rate has to be set explicitly with the ExternalTaxRateDraft.
   */
  readonly taxRate?: TaxRate
  readonly taxCategory?: TaxCategoryReference
  /**
   *		Not set if custom shipping method is used.
   */
  readonly shippingMethod?: ShippingMethodReference
  /**
   *		Deliveries are compilations of information on how the articles are being delivered to the customers.
   */
  readonly deliveries?: Delivery[]
  readonly discountedPrice?: DiscountedLineItemPrice
  /**
   *		Indicates whether the ShippingMethod referenced in this ShippingInfo is allowed for the cart or not.
   */
  readonly shippingMethodState: ShippingMethodState
}
export type ShippingMethodState = 'DoesNotMatchCart' | 'MatchesCart'
export type ShippingRateInput =
  | ClassificationShippingRateInput
  | ScoreShippingRateInput
export interface ClassificationShippingRateInput {
  readonly type: 'Classification'
  readonly label: LocalizedString
  readonly key: string
}
export interface ScoreShippingRateInput {
  readonly type: 'Score'
  readonly score: number
}
export type ShippingRateInputDraft =
  | ClassificationShippingRateInputDraft
  | ScoreShippingRateInputDraft
export interface ClassificationShippingRateInputDraft {
  readonly type: 'Classification'
  readonly key: string
}
export interface ScoreShippingRateInputDraft {
  readonly type: 'Score'
  readonly score: number
}
export type TaxCalculationMode = 'LineItemLevel' | 'UnitPriceLevel'
export type TaxMode = 'Platform' | 'External' | 'ExternalAmount' | 'Disabled'
export interface TaxPortion {
  readonly name?: string
  /**
   *		A number in the range [0..1]
   */
  readonly rate: number
  readonly amount: TypedMoney
}
export interface TaxPortionDraft {
  readonly name?: string
  readonly rate: number
  readonly amount: TypedMoneyDraft
}
export interface TaxedItemPrice {
  readonly totalNet: TypedMoney
  /**
   *		TaxedItemPrice fields can not be used in query predicates.
   */
  readonly totalGross: TypedMoney
}
export interface TaxedPrice {
  readonly totalNet: TypedMoney
  readonly totalGross: TypedMoney
  /**
   *		TaxedPrice fields that can be used in query predicates: `totalNet`, `totalGross`.
   */
  readonly taxPortions: TaxPortion[]
}
export interface TaxedPriceDraft {
  readonly totalNet: TypedMoneyDraft
  readonly totalGross: TypedMoneyDraft
  readonly taxPortions: TaxPortionDraft[]
}
export interface CartAddCustomLineItemAction {
  readonly action: 'addCustomLineItem'
  readonly externalTaxRate?: ExternalTaxRateDraft
  readonly quantity: number
  readonly money: Money
  readonly custom?: CustomFieldsDraft
  readonly name: LocalizedString
  readonly slug: string
  readonly taxCategory?: TaxCategoryResourceIdentifier
}
export interface CartAddDiscountCodeAction {
  readonly action: 'addDiscountCode'
  readonly code: string
}
export interface CartAddItemShippingAddressAction {
  readonly action: 'addItemShippingAddress'
  readonly address: Address
}
export interface CartAddLineItemAction {
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
export interface CartAddPaymentAction {
  readonly action: 'addPayment'
  readonly payment: PaymentResourceIdentifier
}
export interface CartAddShoppingListAction {
  readonly action: 'addShoppingList'
  readonly shoppingList: ShoppingListResourceIdentifier
  readonly supplyChannel?: ChannelResourceIdentifier
  readonly distributionChannel?: ChannelResourceIdentifier
}
export interface CartApplyDeltaToCustomLineItemShippingDetailsTargetsAction {
  readonly action: 'applyDeltaToCustomLineItemShippingDetailsTargets'
  readonly customLineItemId: string
  readonly targetsDelta: ItemShippingTarget[]
}
export interface CartApplyDeltaToLineItemShippingDetailsTargetsAction {
  readonly action: 'applyDeltaToLineItemShippingDetailsTargets'
  readonly lineItemId: string
  readonly targetsDelta: ItemShippingTarget[]
}
export interface CartChangeCustomLineItemMoneyAction {
  readonly action: 'changeCustomLineItemMoney'
  readonly customLineItemId: string
  readonly money: Money
}
export interface CartChangeCustomLineItemQuantityAction {
  readonly action: 'changeCustomLineItemQuantity'
  readonly customLineItemId: string
  readonly quantity: number
}
export interface CartChangeLineItemQuantityAction {
  readonly action: 'changeLineItemQuantity'
  readonly quantity: number
  readonly externalTotalPrice?: ExternalLineItemTotalPrice
  readonly lineItemId: string
  readonly externalPrice?: Money
}
export interface CartChangeTaxCalculationModeAction {
  readonly action: 'changeTaxCalculationMode'
  readonly taxCalculationMode: TaxCalculationMode
}
export interface CartChangeTaxModeAction {
  readonly action: 'changeTaxMode'
  readonly taxMode: TaxMode
}
export interface CartChangeTaxRoundingModeAction {
  readonly action: 'changeTaxRoundingMode'
  readonly taxRoundingMode: RoundingMode
}
export interface CartRecalculateAction {
  readonly action: 'recalculate'
  readonly updateProductData?: boolean
}
export interface CartRemoveCustomLineItemAction {
  readonly action: 'removeCustomLineItem'
  readonly customLineItemId: string
}
export interface CartRemoveDiscountCodeAction {
  readonly action: 'removeDiscountCode'
  readonly discountCode: DiscountCodeReference
}
export interface CartRemoveItemShippingAddressAction {
  readonly action: 'removeItemShippingAddress'
  readonly addressKey: string
}
export interface CartRemoveLineItemAction {
  readonly action: 'removeLineItem'
  readonly quantity?: number
  readonly externalTotalPrice?: ExternalLineItemTotalPrice
  readonly lineItemId: string
  readonly shippingDetailsToRemove?: ItemShippingDetailsDraft
  readonly externalPrice?: Money
}
export interface CartRemovePaymentAction {
  readonly action: 'removePayment'
  readonly payment: PaymentResourceIdentifier
}
export interface CartSetAnonymousIdAction {
  readonly action: 'setAnonymousId'
  readonly anonymousId?: string
}
export interface CartSetBillingAddressAction {
  readonly action: 'setBillingAddress'
  readonly address?: Address
}
export interface CartSetCartTotalTaxAction {
  readonly action: 'setCartTotalTax'
  readonly externalTaxPortions?: TaxPortionDraft[]
  readonly externalTotalGross: Money
}
export interface CartSetCountryAction {
  readonly action: 'setCountry'
  /**
   *		A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   *
   */
  readonly country?: string
}
export interface CartSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: object
}
export interface CartSetCustomLineItemCustomFieldAction {
  readonly action: 'setCustomLineItemCustomField'
  readonly customLineItemId: string
  readonly name: string
  readonly value?: object
}
export interface CartSetCustomLineItemCustomTypeAction {
  readonly action: 'setCustomLineItemCustomType'
  readonly customLineItemId: string
  readonly fields?: FieldContainer
  readonly type?: TypeResourceIdentifier
}
export interface CartSetCustomLineItemShippingDetailsAction {
  readonly action: 'setCustomLineItemShippingDetails'
  readonly customLineItemId: string
  readonly shippingDetails?: ItemShippingDetailsDraft
}
export interface CartSetCustomLineItemTaxAmountAction {
  readonly action: 'setCustomLineItemTaxAmount'
  readonly customLineItemId: string
  readonly externalTaxAmount?: ExternalTaxAmountDraft
}
export interface CartSetCustomLineItemTaxRateAction {
  readonly action: 'setCustomLineItemTaxRate'
  readonly customLineItemId: string
  readonly externalTaxRate?: ExternalTaxRateDraft
}
export interface CartSetCustomShippingMethodAction {
  readonly action: 'setCustomShippingMethod'
  readonly shippingRate: ShippingRateDraft
  readonly externalTaxRate?: ExternalTaxRateDraft
  readonly shippingMethodName: string
  readonly taxCategory?: TaxCategoryResourceIdentifier
}
export interface CartSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly fields?: FieldContainer
  readonly type?: TypeResourceIdentifier
}
export interface CartSetCustomerEmailAction {
  readonly action: 'setCustomerEmail'
  readonly email: string
}
export interface CartSetCustomerGroupAction {
  readonly action: 'setCustomerGroup'
  readonly customerGroup?: CustomerGroupResourceIdentifier
}
export interface CartSetCustomerIdAction {
  readonly action: 'setCustomerId'
  readonly customerId?: string
}
export interface CartSetDeleteDaysAfterLastModificationAction {
  readonly action: 'setDeleteDaysAfterLastModification'
  readonly deleteDaysAfterLastModification?: number
}
export interface CartSetLineItemCustomFieldAction {
  readonly action: 'setLineItemCustomField'
  readonly lineItemId: string
  readonly name: string
  readonly value?: object
}
export interface CartSetLineItemCustomTypeAction {
  readonly action: 'setLineItemCustomType'
  readonly lineItemId: string
  readonly fields?: FieldContainer
  readonly type?: TypeResourceIdentifier
}
export interface CartSetLineItemPriceAction {
  readonly action: 'setLineItemPrice'
  readonly lineItemId: string
  readonly externalPrice?: Money
}
export interface CartSetLineItemShippingDetailsAction {
  readonly action: 'setLineItemShippingDetails'
  readonly shippingDetails?: ItemShippingDetailsDraft
  readonly lineItemId: string
}
export interface CartSetLineItemTaxAmountAction {
  readonly action: 'setLineItemTaxAmount'
  readonly lineItemId: string
  readonly externalTaxAmount?: ExternalTaxAmountDraft
}
export interface CartSetLineItemTaxRateAction {
  readonly action: 'setLineItemTaxRate'
  readonly externalTaxRate?: ExternalTaxRateDraft
  readonly lineItemId: string
}
export interface CartSetLineItemTotalPriceAction {
  readonly action: 'setLineItemTotalPrice'
  readonly externalTotalPrice?: ExternalLineItemTotalPrice
  readonly lineItemId: string
}
export interface CartSetLocaleAction {
  readonly action: 'setLocale'
  readonly locale?: string
}
export interface CartSetShippingAddressAction {
  readonly action: 'setShippingAddress'
  readonly address?: Address
}
export interface CartSetShippingMethodAction {
  readonly action: 'setShippingMethod'
  readonly externalTaxRate?: ExternalTaxRateDraft
  readonly shippingMethod?: ShippingMethodResourceIdentifier
}
export interface CartSetShippingMethodTaxAmountAction {
  readonly action: 'setShippingMethodTaxAmount'
  readonly externalTaxAmount?: ExternalTaxAmountDraft
}
export interface CartSetShippingMethodTaxRateAction {
  readonly action: 'setShippingMethodTaxRate'
  readonly externalTaxRate?: ExternalTaxRateDraft
}
export interface CartSetShippingRateInputAction {
  readonly action: 'setShippingRateInput'
  readonly shippingRateInput?: ShippingRateInputDraft
}
export interface CartUpdateItemShippingAddressAction {
  readonly action: 'updateItemShippingAddress'
  readonly address: Address
}
export type ProductPublishScope = 'All' | 'Prices'
