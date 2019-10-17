import { ByProjectKeyApiClientsRequestBuilder } from './api-clients/by-project-key-api-clients-request-builder'
import { ByProjectKeyCartDiscountsRequestBuilder } from './cart-discounts/by-project-key-cart-discounts-request-builder'
import { ByProjectKeyCartsRequestBuilder } from './carts/by-project-key-carts-request-builder'
import { ByProjectKeyCategoriesRequestBuilder } from './categories/by-project-key-categories-request-builder'
import { ByProjectKeyChannelsRequestBuilder } from './channels/by-project-key-channels-request-builder'
import { ByProjectKeyCustomObjectsRequestBuilder } from './custom-objects/by-project-key-custom-objects-request-builder'
import { ByProjectKeyCustomerGroupsRequestBuilder } from './customer-groups/by-project-key-customer-groups-request-builder'
import { ByProjectKeyCustomersRequestBuilder } from './customers/by-project-key-customers-request-builder'
import { ByProjectKeyDiscountCodesRequestBuilder } from './discount-codes/by-project-key-discount-codes-request-builder'
import { ByProjectKeyExtensionsRequestBuilder } from './extensions/by-project-key-extensions-request-builder'
import { ByProjectKeyGraphqlRequestBuilder } from './graphql/by-project-key-graphql-request-builder'
import { ByProjectKeyInStoreKeyByStoreKeyRequestBuilder } from './in-store/by-project-key-in-store-key-by-store-key-request-builder'
import { ByProjectKeyInventoryRequestBuilder } from './inventory/by-project-key-inventory-request-builder'
import { ByProjectKeyLoginRequestBuilder } from './login/by-project-key-login-request-builder'
import { ByProjectKeyMeRequestBuilder } from './me/by-project-key-me-request-builder'
import { ByProjectKeyMessagesRequestBuilder } from './messages/by-project-key-messages-request-builder'
import { ByProjectKeyOrdersRequestBuilder } from './orders/by-project-key-orders-request-builder'
import { ByProjectKeyPaymentsRequestBuilder } from './payments/by-project-key-payments-request-builder'
import { ByProjectKeyProductDiscountsRequestBuilder } from './product-discounts/by-project-key-product-discounts-request-builder'
import { ByProjectKeyProductProjectionsRequestBuilder } from './product-projections/by-project-key-product-projections-request-builder'
import { ByProjectKeyProductTypesRequestBuilder } from './product-types/by-project-key-product-types-request-builder'
import { ByProjectKeyProductsRequestBuilder } from './products/by-project-key-products-request-builder'
import { ByProjectKeyReviewsRequestBuilder } from './reviews/by-project-key-reviews-request-builder'
import { ByProjectKeyShippingMethodsRequestBuilder } from './shipping-methods/by-project-key-shipping-methods-request-builder'
import { ByProjectKeyShoppingListsRequestBuilder } from './shopping-lists/by-project-key-shopping-lists-request-builder'
import { ByProjectKeyStatesRequestBuilder } from './states/by-project-key-states-request-builder'
import { ByProjectKeyStoresRequestBuilder } from './stores/by-project-key-stores-request-builder'
import { ByProjectKeySubscriptionsRequestBuilder } from './subscriptions/by-project-key-subscriptions-request-builder'
import { ByProjectKeyTaxCategoriesRequestBuilder } from './tax-categories/by-project-key-tax-categories-request-builder'
import { ByProjectKeyTypesRequestBuilder } from './types/by-project-key-types-request-builder'
import { ByProjectKeyZonesRequestBuilder } from './zones/by-project-key-zones-request-builder'
import { Project, ProjectUpdate } from './../models/project'
import { ApiRequestExecutor, ApiRequest } from './../base/requests-utils'

export class ByProjectKeyRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}

  public categories(): ByProjectKeyCategoriesRequestBuilder {
    return new ByProjectKeyCategoriesRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public carts(): ByProjectKeyCartsRequestBuilder {
    return new ByProjectKeyCartsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public cartDiscounts(): ByProjectKeyCartDiscountsRequestBuilder {
    return new ByProjectKeyCartDiscountsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public channels(): ByProjectKeyChannelsRequestBuilder {
    return new ByProjectKeyChannelsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public customers(): ByProjectKeyCustomersRequestBuilder {
    return new ByProjectKeyCustomersRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public customerGroups(): ByProjectKeyCustomerGroupsRequestBuilder {
    return new ByProjectKeyCustomerGroupsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public customObjects(): ByProjectKeyCustomObjectsRequestBuilder {
    return new ByProjectKeyCustomObjectsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public discountCodes(): ByProjectKeyDiscountCodesRequestBuilder {
    return new ByProjectKeyDiscountCodesRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public graphql(): ByProjectKeyGraphqlRequestBuilder {
    return new ByProjectKeyGraphqlRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public inventory(): ByProjectKeyInventoryRequestBuilder {
    return new ByProjectKeyInventoryRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public login(): ByProjectKeyLoginRequestBuilder {
    return new ByProjectKeyLoginRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public messages(): ByProjectKeyMessagesRequestBuilder {
    return new ByProjectKeyMessagesRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public orders(): ByProjectKeyOrdersRequestBuilder {
    return new ByProjectKeyOrdersRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public payments(): ByProjectKeyPaymentsRequestBuilder {
    return new ByProjectKeyPaymentsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public products(): ByProjectKeyProductsRequestBuilder {
    return new ByProjectKeyProductsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public productDiscounts(): ByProjectKeyProductDiscountsRequestBuilder {
    return new ByProjectKeyProductDiscountsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public productProjections(): ByProjectKeyProductProjectionsRequestBuilder {
    return new ByProjectKeyProductProjectionsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public productTypes(): ByProjectKeyProductTypesRequestBuilder {
    return new ByProjectKeyProductTypesRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public reviews(): ByProjectKeyReviewsRequestBuilder {
    return new ByProjectKeyReviewsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public shippingMethods(): ByProjectKeyShippingMethodsRequestBuilder {
    return new ByProjectKeyShippingMethodsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public shoppingLists(): ByProjectKeyShoppingListsRequestBuilder {
    return new ByProjectKeyShoppingListsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public states(): ByProjectKeyStatesRequestBuilder {
    return new ByProjectKeyStatesRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public subscriptions(): ByProjectKeySubscriptionsRequestBuilder {
    return new ByProjectKeySubscriptionsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public taxCategories(): ByProjectKeyTaxCategoriesRequestBuilder {
    return new ByProjectKeyTaxCategoriesRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public types(): ByProjectKeyTypesRequestBuilder {
    return new ByProjectKeyTypesRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public zones(): ByProjectKeyZonesRequestBuilder {
    return new ByProjectKeyZonesRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public me(): ByProjectKeyMeRequestBuilder {
    return new ByProjectKeyMeRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public extensions(): ByProjectKeyExtensionsRequestBuilder {
    return new ByProjectKeyExtensionsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public apiClients(): ByProjectKeyApiClientsRequestBuilder {
    return new ByProjectKeyApiClientsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public stores(): ByProjectKeyStoresRequestBuilder {
    return new ByProjectKeyStoresRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public inStoreKeyWithStoreKeyValue(childPathArgs: {
    storeKey: string
  }): ByProjectKeyInStoreKeyByStoreKeyRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public get(methodArgs?: {
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Project> {
    return new ApiRequest<Project>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}',
        pathVariables: this.args.pathArgs,
        headers: {
          ...(methodArgs || ({} as any)).headers,
        },
      },
      this.args.apiRequestExecutor
    )
  }

  public post(methodArgs: {
    body: ProjectUpdate
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Project> {
    return new ApiRequest<Project>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}',
        pathVariables: this.args.pathArgs,
        headers: {
          'Content-Type': 'application/json',
          ...(methodArgs || ({} as any)).headers,
        },
        body: (methodArgs || ({} as any)).body,
      },
      this.args.apiRequestExecutor
    )
  }
}
