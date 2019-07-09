
import { ByProjectKeyCategoriesRequestBuilder } from './categories/ByProjectKeyCategoriesRequestBuilder'
import { ByProjectKeyCartsRequestBuilder } from './carts/ByProjectKeyCartsRequestBuilder'
import { ByProjectKeyCartDiscountsRequestBuilder } from './cart-discounts/ByProjectKeyCartDiscountsRequestBuilder'
import { ByProjectKeyChannelsRequestBuilder } from './channels/ByProjectKeyChannelsRequestBuilder'
import { ByProjectKeyCustomersRequestBuilder } from './customers/ByProjectKeyCustomersRequestBuilder'
import { ByProjectKeyCustomerGroupsRequestBuilder } from './customer-groups/ByProjectKeyCustomerGroupsRequestBuilder'
import { ByProjectKeyCustomObjectsRequestBuilder } from './custom-objects/ByProjectKeyCustomObjectsRequestBuilder'
import { ByProjectKeyDiscountCodesRequestBuilder } from './discount-codes/ByProjectKeyDiscountCodesRequestBuilder'
import { ByProjectKeyGraphqlRequestBuilder } from './graphql/ByProjectKeyGraphqlRequestBuilder'
import { ByProjectKeyInventoryRequestBuilder } from './inventory/ByProjectKeyInventoryRequestBuilder'
import { ByProjectKeyLoginRequestBuilder } from './login/ByProjectKeyLoginRequestBuilder'
import { ByProjectKeyMessagesRequestBuilder } from './messages/ByProjectKeyMessagesRequestBuilder'
import { ByProjectKeyOrdersRequestBuilder } from './orders/ByProjectKeyOrdersRequestBuilder'
import { ByProjectKeyPaymentsRequestBuilder } from './payments/ByProjectKeyPaymentsRequestBuilder'
import { ByProjectKeyProductsRequestBuilder } from './products/ByProjectKeyProductsRequestBuilder'
import { ByProjectKeyProductDiscountsRequestBuilder } from './product-discounts/ByProjectKeyProductDiscountsRequestBuilder'
import { ByProjectKeyProductProjectionsRequestBuilder } from './product-projections/ByProjectKeyProductProjectionsRequestBuilder'
import { ByProjectKeyProductTypesRequestBuilder } from './product-types/ByProjectKeyProductTypesRequestBuilder'
import { ByProjectKeyReviewsRequestBuilder } from './reviews/ByProjectKeyReviewsRequestBuilder'
import { ByProjectKeyShippingMethodsRequestBuilder } from './shipping-methods/ByProjectKeyShippingMethodsRequestBuilder'
import { ByProjectKeyShoppingListsRequestBuilder } from './shopping-lists/ByProjectKeyShoppingListsRequestBuilder'
import { ByProjectKeyStatesRequestBuilder } from './states/ByProjectKeyStatesRequestBuilder'
import { ByProjectKeySubscriptionsRequestBuilder } from './subscriptions/ByProjectKeySubscriptionsRequestBuilder'
import { ByProjectKeyTaxCategoriesRequestBuilder } from './tax-categories/ByProjectKeyTaxCategoriesRequestBuilder'
import { ByProjectKeyTypesRequestBuilder } from './types/ByProjectKeyTypesRequestBuilder'
import { ByProjectKeyZonesRequestBuilder } from './zones/ByProjectKeyZonesRequestBuilder'
import { ByProjectKeyMeRequestBuilder } from './me/ByProjectKeyMeRequestBuilder'
import { ByProjectKeyExtensionsRequestBuilder } from './extensions/ByProjectKeyExtensionsRequestBuilder'
import { ByProjectKeyApiClientsRequestBuilder } from './api-clients/ByProjectKeyApiClientsRequestBuilder'
import { ByProjectKeyStoresRequestBuilder } from './stores/ByProjectKeyStoresRequestBuilder'
import { ByProjectKeyInStoreKeyByStoreKeyRequestBuilder } from './in-store/ByProjectKeyInStoreKeyByStoreKeyRequestBuilder'
import { ProjectUpdate } from './../models/Project'
import { Project } from './../models/Project'
import { Middleware } from './../base/common-types'
import { ApiRequest } from './../base/requests-utils'

export class ByProjectKeyRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    categories(): ByProjectKeyCategoriesRequestBuilder {
       return new ByProjectKeyCategoriesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    carts(): ByProjectKeyCartsRequestBuilder {
       return new ByProjectKeyCartsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    cartDiscounts(): ByProjectKeyCartDiscountsRequestBuilder {
       return new ByProjectKeyCartDiscountsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    channels(): ByProjectKeyChannelsRequestBuilder {
       return new ByProjectKeyChannelsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    customers(): ByProjectKeyCustomersRequestBuilder {
       return new ByProjectKeyCustomersRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    customerGroups(): ByProjectKeyCustomerGroupsRequestBuilder {
       return new ByProjectKeyCustomerGroupsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    customObjects(): ByProjectKeyCustomObjectsRequestBuilder {
       return new ByProjectKeyCustomObjectsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    discountCodes(): ByProjectKeyDiscountCodesRequestBuilder {
       return new ByProjectKeyDiscountCodesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    graphql(): ByProjectKeyGraphqlRequestBuilder {
       return new ByProjectKeyGraphqlRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    inventory(): ByProjectKeyInventoryRequestBuilder {
       return new ByProjectKeyInventoryRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    login(): ByProjectKeyLoginRequestBuilder {
       return new ByProjectKeyLoginRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    messages(): ByProjectKeyMessagesRequestBuilder {
       return new ByProjectKeyMessagesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    orders(): ByProjectKeyOrdersRequestBuilder {
       return new ByProjectKeyOrdersRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    payments(): ByProjectKeyPaymentsRequestBuilder {
       return new ByProjectKeyPaymentsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    products(): ByProjectKeyProductsRequestBuilder {
       return new ByProjectKeyProductsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    productDiscounts(): ByProjectKeyProductDiscountsRequestBuilder {
       return new ByProjectKeyProductDiscountsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    productProjections(): ByProjectKeyProductProjectionsRequestBuilder {
       return new ByProjectKeyProductProjectionsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    productTypes(): ByProjectKeyProductTypesRequestBuilder {
       return new ByProjectKeyProductTypesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    reviews(): ByProjectKeyReviewsRequestBuilder {
       return new ByProjectKeyReviewsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    shippingMethods(): ByProjectKeyShippingMethodsRequestBuilder {
       return new ByProjectKeyShippingMethodsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    shoppingLists(): ByProjectKeyShoppingListsRequestBuilder {
       return new ByProjectKeyShoppingListsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    states(): ByProjectKeyStatesRequestBuilder {
       return new ByProjectKeyStatesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    subscriptions(): ByProjectKeySubscriptionsRequestBuilder {
       return new ByProjectKeySubscriptionsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    taxCategories(): ByProjectKeyTaxCategoriesRequestBuilder {
       return new ByProjectKeyTaxCategoriesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    types(): ByProjectKeyTypesRequestBuilder {
       return new ByProjectKeyTypesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    zones(): ByProjectKeyZonesRequestBuilder {
       return new ByProjectKeyZonesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    me(): ByProjectKeyMeRequestBuilder {
       return new ByProjectKeyMeRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    extensions(): ByProjectKeyExtensionsRequestBuilder {
       return new ByProjectKeyExtensionsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    apiClients(): ByProjectKeyApiClientsRequestBuilder {
       return new ByProjectKeyApiClientsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    stores(): ByProjectKeyStoresRequestBuilder {
       return new ByProjectKeyStoresRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    inStoreKeyWithStoreKeyValue(
       childPathArgs: {
           storeKey: string
       }
    ): ByProjectKeyInStoreKeyByStoreKeyRequestBuilder {
       return new ByProjectKeyInStoreKeyByStoreKeyRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                   ...childPathArgs
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    
    get(
        methodArgs?:{
           
           headers?: {
              [key:string]:string
           },
        }): ApiRequest<Project> {
       return new ApiRequest<Project>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}',
              pathVariables: this.args.pathArgs,
              headers: {
                  ...(methodArgs || {} as any).headers
              },
           },
           this.args.middlewares
       )
    }
    
    post(
         methodArgs:{
            
            body: ProjectUpdate,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<Project> {
       return new ApiRequest<Project>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}',
              pathVariables: this.args.pathArgs,
              headers: {
                  'Content-Type': 'application/json',
                  ...(methodArgs || {} as any).headers
              },
              body: (methodArgs || {} as any).body,
           },
           this.args.middlewares
       )
    }
    

}
