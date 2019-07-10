/* tslint:disable */
//Generated file, please do not change

import { Address } from './Common'
import { TaxMode } from './Cart'
import { CustomFieldsDraft } from './Type'
import { ShippingMethodResourceIdentifier } from './ShippingMethod'
import { InventoryMode } from './Cart'
import { CustomFields } from './Type'
import { ItemShippingDetailsDraft } from './Cart'
import { ChannelResourceIdentifier } from './Channel'


export interface MyCartDraft {
  /**
  	<p>The currency code compliant to <a href="https://en.wikipedia.org/wiki/ISO_4217">ISO 4217</a>.</p>
  */
  readonly currency: string;
  
  readonly customerEmail?: string;
  
  readonly country?: string;
  
  readonly inventoryMode?: InventoryMode;
  
  readonly lineItems?: MyLineItemDraft[];
  
  readonly shippingAddress?: Address;
  
  readonly billingAddress?: Address;
  
  readonly shippingMethod?: ShippingMethodResourceIdentifier;
  
  readonly custom?: CustomFieldsDraft;
  
  readonly locale?: string;
  
  readonly taxMode?: TaxMode;
  
  readonly deleteDaysAfterLastModification?: number;
  
  readonly itemShippingAddresses?: Address[]
}

export interface MyCustomerDraft {
  
  readonly email: string;
  
  readonly password: string;
  
  readonly firstName?: string;
  
  readonly lastName?: string;
  
  readonly middleName?: string;
  
  readonly title?: string;
  
  readonly dateOfBirth?: string;
  
  readonly companyName?: string;
  
  readonly vatId?: string;
  
  readonly addresses?: Address[];
  
  readonly defaultShippingAddress?: number;
  
  readonly defaultBillingAddress?: number;
  
  readonly custom?: CustomFields;
  
  readonly locale?: string
}

export interface MyLineItemDraft {
  
  readonly productId: string;
  
  readonly variantId: number;
  
  readonly quantity: number;
  
  readonly supplyChannel?: ChannelResourceIdentifier;
  
  readonly distributionChannel?: ChannelResourceIdentifier;
  
  readonly custom?: CustomFieldsDraft;
  
  readonly shippingDetails?: ItemShippingDetailsDraft
}

export interface MyOrderFromCartDraft {
  
  readonly id: string;
  
  readonly version: number
}