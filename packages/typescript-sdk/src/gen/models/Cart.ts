/* tslint:disable */
//Generated file, please do not change

import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { TypedMoney } from './Common'
import { CartDiscountReference } from './CartDiscount'
import { Address } from './Common'
import { CustomerGroupReference } from './CustomerGroup'
import { CustomFields } from './Type'
import { StoreKeyReference } from './Store'
import { PaymentInfo } from './Order'
import { LoggedResource } from './Common'
import { CustomerGroupResourceIdentifier } from './CustomerGroup'
import { CustomFieldsDraft } from './Type'
import { ShippingMethodResourceIdentifier } from './ShippingMethod'
import { StoreResourceIdentifier } from './Store'
import { ReferenceTypeId } from './Common'
import { Reference } from './Common'
import { ResourceIdentifier } from './Common'
import { TaxRate } from './TaxCategory'
import { LocalizedString } from './Common'
import { ItemState } from './Order'
import { TaxCategoryReference } from './TaxCategory'
import { Money } from './Common'
import { TaxCategoryResourceIdentifier } from './TaxCategory'
import { DiscountCodeReference } from './DiscountCode'
import { SubRate } from './TaxCategory'
import { Price } from './Common'
import { ProductVariant } from './Product'
import { ChannelReference } from './Channel'
import { ProductTypeReference } from './ProductType'
import { ChannelResourceIdentifier } from './Channel'
import { OrderReference } from './Order'
import { ShippingRate } from './ShippingMethod'
import { ShippingMethodReference } from './ShippingMethod'
import { Delivery } from './Order'
import { PaymentResourceIdentifier } from './Payment'
import { ShoppingListResourceIdentifier } from './ShoppingList'
import { FieldContainer } from './Type'
import { TypeResourceIdentifier } from './Type'
import { ShippingRateDraft } from './ShippingMethod'


export interface Cart extends LoggedResource {
  
  readonly customerId?: string;
  
  readonly customerEmail?: string;
  
  readonly anonymousId?: string;
  
  readonly store?: StoreKeyReference;
  
  readonly lineItems: LineItem[];
  
  readonly customLineItems: CustomLineItem[];
  
  readonly totalPrice: TypedMoney;
  
  readonly taxedPrice?: TaxedPrice;
  
  readonly cartState: CartState;
  
  readonly shippingAddress?: Address;
  
  readonly billingAddress?: Address;
  
  readonly inventoryMode?: InventoryMode;
  
  readonly taxMode: TaxMode;
  
  readonly taxRoundingMode: RoundingMode;
  
  readonly taxCalculationMode: TaxCalculationMode;
  
  readonly customerGroup?: CustomerGroupReference;
  /**
  	<p>A two-digit country code as per <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 alpha-2</a>.</p>
  */
  readonly country?: string;
  
  readonly shippingInfo?: ShippingInfo;
  
  readonly discountCodes?: DiscountCodeInfo[];
  
  readonly custom?: CustomFields;
  
  readonly paymentInfo?: PaymentInfo;
  
  readonly locale?: string;
  
  readonly deleteDaysAfterLastModification?: number;
  
  readonly refusedGifts: CartDiscountReference[];
  
  readonly origin: CartOrigin;
  
  readonly shippingRateInput?: ShippingRateInput;
  
  readonly itemShippingAddresses?: Address[]
}

export interface CartDraft {
  /**
  	<p>The currency code compliant to <a href="https://en.wikipedia.org/wiki/ISO_4217">ISO 4217</a>.</p>
  */
  readonly currency: string;
  
  readonly customerId?: string;
  
  readonly customerEmail?: string;
  
  readonly customerGroup?: CustomerGroupResourceIdentifier;
  
  readonly anonymousId?: string;
  
  readonly store?: StoreResourceIdentifier;
  
  readonly country?: string;
  
  readonly inventoryMode?: InventoryMode;
  
  readonly taxMode?: TaxMode;
  
  readonly taxRoundingMode?: RoundingMode;
  
  readonly taxCalculationMode?: TaxCalculationMode;
  
  readonly lineItems?: LineItemDraft[];
  
  readonly customLineItems?: CustomLineItemDraft[];
  
  readonly shippingAddress?: Address;
  
  readonly billingAddress?: Address;
  
  readonly shippingMethod?: ShippingMethodResourceIdentifier;
  
  readonly externalTaxRateForShippingMethod?: ExternalTaxRateDraft;
  
  readonly custom?: CustomFieldsDraft;
  
  readonly locale?: string;
  
  readonly deleteDaysAfterLastModification?: number;
  
  readonly origin?: CartOrigin;
  
  readonly shippingRateInput?: ShippingRateInputDraft;
  
  readonly itemShippingAddresses?: Address[]
}

export type CartOrigin =
   'Customer' |
   'Merchant';

export interface CartPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: Cart[]
}

export interface CartReference {
  readonly typeId: "cart";
  
  readonly id: string;
  
  readonly obj?: Cart
}

export interface CartResourceIdentifier {
  readonly typeId: "cart";
  
  readonly id?: string;
  
  readonly key?: string
}

export type CartState =
   'Active' |
   'Merged' |
   'Ordered';

export interface CartUpdate {
  
  readonly version: number;
  
  readonly actions: CartUpdateAction[]
}

export type CartUpdateAction =
  CartAddCustomLineItemAction |
  CartAddDiscountCodeAction |
  CartAddItemShippingAddressAction |
  CartAddLineItemAction |
  CartAddPaymentAction |
  CartAddShoppingListAction |
  CartApplyDeltaToCustomLineItemShippingDetailsTargetsAction |
  CartApplyDeltaToLineItemShippingDetailsTargetsAction |
  CartChangeCustomLineItemMoneyAction |
  CartChangeCustomLineItemQuantityAction |
  CartChangeLineItemQuantityAction |
  CartChangeTaxCalculationModeAction |
  CartChangeTaxModeAction |
  CartChangeTaxRoundingModeAction |
  CartRecalculateAction |
  CartRemoveCustomLineItemAction |
  CartRemoveDiscountCodeAction |
  CartRemoveItemShippingAddressAction |
  CartRemoveLineItemAction |
  CartRemovePaymentAction |
  CartSetAnonymousIdAction |
  CartSetBillingAddressAction |
  CartSetCartTotalTaxAction |
  CartSetCountryAction |
  CartSetCustomFieldAction |
  CartSetCustomLineItemCustomFieldAction |
  CartSetCustomLineItemCustomTypeAction |
  CartSetCustomLineItemShippingDetailsAction |
  CartSetCustomLineItemTaxAmountAction |
  CartSetCustomLineItemTaxRateAction |
  CartSetCustomShippingMethodAction |
  CartSetCustomTypeAction |
  CartSetCustomerEmailAction |
  CartSetCustomerGroupAction |
  CartSetCustomerIdAction |
  CartSetDeleteDaysAfterLastModificationAction |
  CartSetLineItemCustomFieldAction |
  CartSetLineItemCustomTypeAction |
  CartSetLineItemPriceAction |
  CartSetLineItemShippingDetailsAction |
  CartSetLineItemTaxAmountAction |
  CartSetLineItemTaxRateAction |
  CartSetLineItemTotalPriceAction |
  CartSetLocaleAction |
  CartSetShippingAddressAction |
  CartSetShippingMethodAction |
  CartSetShippingMethodTaxAmountAction |
  CartSetShippingMethodTaxRateAction |
  CartSetShippingRateInputAction |
  CartUpdateItemShippingAddressAction
;

export interface CustomLineItem {
  
  readonly id: string;
  
  readonly name: LocalizedString;
  
  readonly money: TypedMoney;
  
  readonly taxedPrice?: TaxedItemPrice;
  
  readonly totalPrice: TypedMoney;
  
  readonly slug: string;
  
  readonly quantity: number;
  
  readonly state: ItemState[];
  
  readonly taxCategory?: TaxCategoryReference;
  
  readonly taxRate?: TaxRate;
  
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[];
  
  readonly custom?: CustomFields;
  
  readonly shippingDetails?: ItemShippingDetails
}

export interface CustomLineItemDraft {
  
  readonly name: LocalizedString;
  
  readonly quantity: number;
  
  readonly money: Money;
  
  readonly slug: string;
  
  readonly taxCategory?: TaxCategoryResourceIdentifier;
  
  readonly externalTaxRate?: ExternalTaxRateDraft;
  
  readonly custom?: CustomFields;
  
  readonly shippingDetails?: ItemShippingDetailsDraft
}

export interface DiscountCodeInfo {
  
  readonly discountCode: DiscountCodeReference;
  
  readonly state: DiscountCodeState
}

export type DiscountCodeState =
   'NotActive' |
   'DoesNotMatchCart' |
   'MatchesCart' |
   'MaxApplicationReached';

export interface DiscountedLineItemPortion {
  
  readonly discount: CartDiscountReference;
  
  readonly discountedAmount: Money
}

export interface DiscountedLineItemPrice {
  
  readonly value: TypedMoney;
  
  readonly includedDiscounts: DiscountedLineItemPortion[]
}

export interface DiscountedLineItemPriceForQuantity {
  
  readonly quantity: number;
  
  readonly discountedPrice: DiscountedLineItemPrice
}

export interface ExternalLineItemTotalPrice {
  
  readonly price: Money;
  
  readonly totalPrice: Money
}

export interface ExternalTaxAmountDraft {
  
  readonly totalGross: Money;
  
  readonly taxRate: ExternalTaxRateDraft
}

export interface ExternalTaxRateDraft {
  
  readonly name: string;
  
  readonly amount?: number;
  
  readonly country: string;
  
  readonly state?: string;
  
  readonly subRates?: SubRate[];
  
  readonly includedInPrice?: boolean
}

export type InventoryMode =
   'TrackOnly' |
   'ReserveOnOrder' |
   'None';

export interface ItemShippingDetails {
  
  readonly targets: ItemShippingTarget[];
  
  readonly valid: boolean
}

export interface ItemShippingDetailsDraft {
  
  readonly targets: ItemShippingTarget[]
}

export interface ItemShippingTarget {
  
  readonly addressKey: string;
  
  readonly quantity: number
}

export interface LineItem {
  
  readonly id: string;
  
  readonly productId: string;
  
  readonly name: LocalizedString;
  
  readonly productSlug?: LocalizedString;
  
  readonly productType: ProductTypeReference;
  
  readonly variant: ProductVariant;
  
  readonly price: Price;
  
  readonly taxedPrice?: TaxedItemPrice;
  
  readonly totalPrice: Money;
  
  readonly quantity: number;
  
  readonly state: ItemState[];
  
  readonly taxRate?: TaxRate;
  
  readonly supplyChannel?: ChannelReference;
  
  readonly distributionChannel?: ChannelReference;
  
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[];
  
  readonly priceMode: LineItemPriceMode;
  
  readonly lineItemMode: LineItemMode;
  
  readonly custom?: CustomFields;
  
  readonly shippingDetails?: ItemShippingDetails
}

export interface LineItemDraft {
  
  readonly productId?: string;
  
  readonly variantId?: number;
  
  readonly sku?: string;
  
  readonly quantity?: number;
  
  readonly supplyChannel?: ChannelResourceIdentifier;
  
  readonly distributionChannel?: ChannelResourceIdentifier;
  
  readonly externalTaxRate?: ExternalTaxRateDraft;
  
  readonly custom?: CustomFieldsDraft;
  
  readonly externalPrice?: Money;
  
  readonly externalTotalPrice?: ExternalLineItemTotalPrice;
  
  readonly shippingDetails?: ItemShippingDetailsDraft
}

export type LineItemMode =
   'Standard' |
   'GiftLineItem';

export type LineItemPriceMode =
   'Platform' |
   'ExternalTotal' |
   'ExternalPrice';

export interface ReplicaCartDraft {
  
  readonly reference: CartReference | OrderReference
}

export type RoundingMode =
   'HalfEven' |
   'HalfUp' |
   'HalfDown';

export interface ShippingInfo {
  
  readonly shippingMethodName: string;
  
  readonly price: TypedMoney;
  
  readonly shippingRate: ShippingRate;
  
  readonly taxedPrice?: TaxedItemPrice;
  
  readonly taxRate?: TaxRate;
  
  readonly taxCategory?: TaxCategoryReference;
  
  readonly shippingMethod?: ShippingMethodReference;
  
  readonly deliveries?: Delivery[];
  
  readonly discountedPrice?: DiscountedLineItemPrice;
  
  readonly shippingMethodState: ShippingMethodState
}

export type ShippingMethodState =
   'DoesNotMatchCart' |
   'MatchesCart';

export type ShippingRateInput =
  ClassificationShippingRateInput |
  ScoreShippingRateInput
;

export interface ClassificationShippingRateInput {
  readonly type: "Classification";
  
  readonly label: LocalizedString;
  
  readonly key: string
}

export interface ScoreShippingRateInput {
  readonly type: "Score";
  
  readonly score: number
}

export type ShippingRateInputDraft =
  ClassificationShippingRateInputDraft |
  ScoreShippingRateInputDraft
;

export interface ClassificationShippingRateInputDraft {
  readonly type: "Classification";
  
  readonly key: string
}

export interface ScoreShippingRateInputDraft {
  readonly type: "Score";
  
  readonly score: number
}

export type TaxCalculationMode =
   'LineItemLevel' |
   'UnitPriceLevel';

export type TaxMode =
   'Platform' |
   'External' |
   'ExternalAmount' |
   'Disabled';

export interface TaxPortion {
  
  readonly name?: string;
  
  readonly rate: number;
  
  readonly amount: Money
}

export interface TaxedItemPrice {
  
  readonly totalNet: TypedMoney;
  
  readonly totalGross: TypedMoney
}

export interface TaxedPrice {
  
  readonly totalNet: Money;
  
  readonly totalGross: Money;
  
  readonly taxPortions: TaxPortion[]
}

export interface CartAddCustomLineItemAction {
  readonly action: "addCustomLineItem";
  
  readonly externalTaxRate?: ExternalTaxRateDraft;
  
  readonly quantity: number;
  
  readonly money: Money;
  
  readonly custom?: CustomFieldsDraft;
  
  readonly name: LocalizedString;
  
  readonly slug: string;
  
  readonly taxCategory?: TaxCategoryResourceIdentifier
}

export interface CartAddDiscountCodeAction {
  readonly action: "addDiscountCode";
  
  readonly code: string
}

export interface CartAddItemShippingAddressAction {
  readonly action: "addItemShippingAddress";
  
  readonly address: Address
}

export interface CartAddLineItemAction {
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

export interface CartAddPaymentAction {
  readonly action: "addPayment";
  
  readonly payment: PaymentResourceIdentifier
}

export interface CartAddShoppingListAction {
  readonly action: "addShoppingList";
  
  readonly shoppingList: ShoppingListResourceIdentifier;
  
  readonly supplyChannel?: ChannelResourceIdentifier;
  
  readonly distributionChannel?: ChannelResourceIdentifier
}

export interface CartApplyDeltaToCustomLineItemShippingDetailsTargetsAction {
  readonly action: "applyDeltaToCustomLineItemShippingDetailsTargets";
  
  readonly customLineItemId: string;
  
  readonly targetsDelta: ItemShippingTarget[]
}

export interface CartApplyDeltaToLineItemShippingDetailsTargetsAction {
  readonly action: "applyDeltaToLineItemShippingDetailsTargets";
  
  readonly lineItemId: string;
  
  readonly targetsDelta: ItemShippingTarget[]
}

export interface CartChangeCustomLineItemMoneyAction {
  readonly action: "changeCustomLineItemMoney";
  
  readonly customLineItemId: string;
  
  readonly money: Money
}

export interface CartChangeCustomLineItemQuantityAction {
  readonly action: "changeCustomLineItemQuantity";
  
  readonly customLineItemId: string;
  
  readonly quantity: number
}

export interface CartChangeLineItemQuantityAction {
  readonly action: "changeLineItemQuantity";
  
  readonly quantity: number;
  
  readonly externalTotalPrice?: ExternalLineItemTotalPrice;
  
  readonly lineItemId: string;
  
  readonly externalPrice?: Money
}

export interface CartChangeTaxCalculationModeAction {
  readonly action: "changeTaxCalculationMode";
  
  readonly taxCalculationMode: TaxCalculationMode
}

export interface CartChangeTaxModeAction {
  readonly action: "changeTaxMode";
  
  readonly taxMode: TaxMode
}

export interface CartChangeTaxRoundingModeAction {
  readonly action: "changeTaxRoundingMode";
  
  readonly taxRoundingMode: RoundingMode
}

export interface CartRecalculateAction {
  readonly action: "recalculate";
  
  readonly updateProductData?: boolean
}

export interface CartRemoveCustomLineItemAction {
  readonly action: "removeCustomLineItem";
  
  readonly customLineItemId: string
}

export interface CartRemoveDiscountCodeAction {
  readonly action: "removeDiscountCode";
  
  readonly discountCode: DiscountCodeReference
}

export interface CartRemoveItemShippingAddressAction {
  readonly action: "removeItemShippingAddress";
  
  readonly addressKey: string
}

export interface CartRemoveLineItemAction {
  readonly action: "removeLineItem";
  
  readonly quantity?: number;
  
  readonly externalTotalPrice?: ExternalLineItemTotalPrice;
  
  readonly lineItemId: string;
  
  readonly shippingDetailsToRemove?: ItemShippingDetailsDraft;
  
  readonly externalPrice?: Money
}

export interface CartRemovePaymentAction {
  readonly action: "removePayment";
  
  readonly payment: PaymentResourceIdentifier
}

export interface CartSetAnonymousIdAction {
  readonly action: "setAnonymousId";
  
  readonly anonymousId?: string
}

export interface CartSetBillingAddressAction {
  readonly action: "setBillingAddress";
  
  readonly address?: Address
}

export interface CartSetCartTotalTaxAction {
  readonly action: "setCartTotalTax";
  
  readonly externalTaxPortions?: TaxPortion[];
  
  readonly externalTotalGross: Money
}

export interface CartSetCountryAction {
  readonly action: "setCountry";
  /**
  	<p>A two-digit country code as per <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 alpha-2</a>.</p>
  */
  readonly country?: string
}

export interface CartSetCustomFieldAction {
  readonly action: "setCustomField";
  
  readonly name: string;
  
  readonly value?: object
}

export interface CartSetCustomLineItemCustomFieldAction {
  readonly action: "setCustomLineItemCustomField";
  
  readonly customLineItemId: string;
  
  readonly name: string;
  
  readonly value?: object
}

export interface CartSetCustomLineItemCustomTypeAction {
  readonly action: "setCustomLineItemCustomType";
  
  readonly customLineItemId: string;
  
  readonly fields?: FieldContainer;
  
  readonly type?: TypeResourceIdentifier
}

export interface CartSetCustomLineItemShippingDetailsAction {
  readonly action: "setCustomLineItemShippingDetails";
  
  readonly customLineItemId: string;
  
  readonly shippingDetails?: ItemShippingDetailsDraft
}

export interface CartSetCustomLineItemTaxAmountAction {
  readonly action: "setCustomLineItemTaxAmount";
  
  readonly customLineItemId: string;
  
  readonly externalTaxAmount?: ExternalTaxAmountDraft
}

export interface CartSetCustomLineItemTaxRateAction {
  readonly action: "setCustomLineItemTaxRate";
  
  readonly customLineItemId: string;
  
  readonly externalTaxRate?: ExternalTaxRateDraft
}

export interface CartSetCustomShippingMethodAction {
  readonly action: "setCustomShippingMethod";
  
  readonly shippingRate: ShippingRateDraft;
  
  readonly externalTaxRate?: ExternalTaxRateDraft;
  
  readonly shippingMethodName: string;
  
  readonly taxCategory?: TaxCategoryResourceIdentifier
}

export interface CartSetCustomTypeAction {
  readonly action: "setCustomType";
  
  readonly fields?: FieldContainer;
  
  readonly type?: TypeResourceIdentifier
}

export interface CartSetCustomerEmailAction {
  readonly action: "setCustomerEmail";
  
  readonly email: string
}

export interface CartSetCustomerGroupAction {
  readonly action: "setCustomerGroup";
  
  readonly customerGroup?: CustomerGroupResourceIdentifier
}

export interface CartSetCustomerIdAction {
  readonly action: "setCustomerId";
  
  readonly customerId?: string
}

export interface CartSetDeleteDaysAfterLastModificationAction {
  readonly action: "setDeleteDaysAfterLastModification";
  
  readonly deleteDaysAfterLastModification?: number
}

export interface CartSetLineItemCustomFieldAction {
  readonly action: "setLineItemCustomField";
  
  readonly lineItemId: string;
  
  readonly name: string;
  
  readonly value?: object
}

export interface CartSetLineItemCustomTypeAction {
  readonly action: "setLineItemCustomType";
  
  readonly lineItemId: string;
  
  readonly fields?: FieldContainer;
  
  readonly type?: TypeResourceIdentifier
}

export interface CartSetLineItemPriceAction {
  readonly action: "setLineItemPrice";
  
  readonly lineItemId: string;
  
  readonly externalPrice?: Money
}

export interface CartSetLineItemShippingDetailsAction {
  readonly action: "setLineItemShippingDetails";
  
  readonly shippingDetails?: ItemShippingDetailsDraft;
  
  readonly lineItemId: string
}

export interface CartSetLineItemTaxAmountAction {
  readonly action: "setLineItemTaxAmount";
  
  readonly lineItemId: string;
  
  readonly externalTaxAmount?: ExternalTaxAmountDraft
}

export interface CartSetLineItemTaxRateAction {
  readonly action: "setLineItemTaxRate";
  
  readonly externalTaxRate?: ExternalTaxRateDraft;
  
  readonly lineItemId: string
}

export interface CartSetLineItemTotalPriceAction {
  readonly action: "setLineItemTotalPrice";
  
  readonly externalTotalPrice?: ExternalLineItemTotalPrice;
  
  readonly lineItemId: string
}

export interface CartSetLocaleAction {
  readonly action: "setLocale";
  
  readonly locale?: string
}

export interface CartSetShippingAddressAction {
  readonly action: "setShippingAddress";
  
  readonly address?: Address
}

export interface CartSetShippingMethodAction {
  readonly action: "setShippingMethod";
  
  readonly externalTaxRate?: ExternalTaxRateDraft;
  
  readonly shippingMethod?: ShippingMethodResourceIdentifier
}

export interface CartSetShippingMethodTaxAmountAction {
  readonly action: "setShippingMethodTaxAmount";
  
  readonly externalTaxAmount?: ExternalTaxAmountDraft
}

export interface CartSetShippingMethodTaxRateAction {
  readonly action: "setShippingMethodTaxRate";
  
  readonly externalTaxRate?: ExternalTaxRateDraft
}

export interface CartSetShippingRateInputAction {
  readonly action: "setShippingRateInput";
  
  readonly shippingRateInput?: ShippingRateInputDraft
}

export interface CartUpdateItemShippingAddressAction {
  readonly action: "updateItemShippingAddress";
  
  readonly address: Address
}

export type ProductPublishScope =
   'All' |
   'Prices';