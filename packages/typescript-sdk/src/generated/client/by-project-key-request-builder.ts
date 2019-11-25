
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
           },
          apiRequestExecutor: ApiRequestExecutor;
        }
      ) {}
    /**
    *		Categories are used to organize products in a hierarchical structure.
    */
    public categories(): ByProjectKeyCategoriesRequestBuilder {
       return new ByProjectKeyCategoriesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		A shopping cart holds product variants and can be ordered.
    */
    public carts(): ByProjectKeyCartsRequestBuilder {
       return new ByProjectKeyCartsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Cart discounts are used to change the prices of different elements within a cart.
    */
    public cartDiscounts(): ByProjectKeyCartDiscountsRequestBuilder {
       return new ByProjectKeyCartDiscountsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Channels represent a source or destination of different entities. They can be used to model warehouses or stores.
    *		
    */
    public channels(): ByProjectKeyChannelsRequestBuilder {
       return new ByProjectKeyChannelsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		A customer is a person purchasing products. customers, Orders, Comments and Reviews can be associated to a customer.
    *		
    */
    public customers(): ByProjectKeyCustomersRequestBuilder {
       return new ByProjectKeyCustomersRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		customer-groups are used to evaluate products and channels.
    */
    public customerGroups(): ByProjectKeyCustomerGroupsRequestBuilder {
       return new ByProjectKeyCustomerGroupsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Store custom JSON values.
    */
    public customObjects(): ByProjectKeyCustomObjectsRequestBuilder {
       return new ByProjectKeyCustomObjectsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Discount codes can be added to a discount-code to enable certain discount-code discounts.
    */
    public discountCodes(): ByProjectKeyDiscountCodesRequestBuilder {
       return new ByProjectKeyDiscountCodesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		The commercetools™ platform provides a GraphQL API
    */
    public graphql(): ByProjectKeyGraphqlRequestBuilder {
       return new ByProjectKeyGraphqlRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Inventory allows you to track stock quantities.
    */
    public inventory(): ByProjectKeyInventoryRequestBuilder {
       return new ByProjectKeyInventoryRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Retrieves the authenticated customer.
    */
    public login(): ByProjectKeyLoginRequestBuilder {
       return new ByProjectKeyLoginRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		A message represents a change or an action performed on a resource (like an Order or a Product).
    */
    public messages(): ByProjectKeyMessagesRequestBuilder {
       return new ByProjectKeyMessagesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		An order can be created from a order, usually after a checkout process has been completed.
    */
    public orders(): ByProjectKeyOrdersRequestBuilder {
       return new ByProjectKeyOrdersRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Payments hold information about the current state of receiving and/or refunding money
    */
    public payments(): ByProjectKeyPaymentsRequestBuilder {
       return new ByProjectKeyPaymentsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Products are the sellable goods in an e-commerce project on CTP. This document explains some design concepts
    *		of products on CTP and describes the available HTTP APIs for working with them.
    *		
    */
    public products(): ByProjectKeyProductsRequestBuilder {
       return new ByProjectKeyProductsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Product discounts are used to change certain product prices.
    */
    public productDiscounts(): ByProjectKeyProductDiscountsRequestBuilder {
       return new ByProjectKeyProductDiscountsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		A projected representation of a product shows the product with its current or staged data. The current or staged
    *		representation of a product in a catalog is called a product projection.
    *		
    */
    public productProjections(): ByProjectKeyProductProjectionsRequestBuilder {
       return new ByProjectKeyProductProjectionsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Product Types are used to describe common characteristics, most importantly common custom attributes,
    *		of many concrete products.
    *		
    */
    public productTypes(): ByProjectKeyProductTypesRequestBuilder {
       return new ByProjectKeyProductTypesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Reviews are used to evaluate products and channels.
    */
    public reviews(): ByProjectKeyReviewsRequestBuilder {
       return new ByProjectKeyReviewsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Shipping Methods define where orders can be shipped and what the costs are.
    */
    public shippingMethods(): ByProjectKeyShippingMethodsRequestBuilder {
       return new ByProjectKeyShippingMethodsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		shopping-lists e.g. for wishlist support
    */
    public shoppingLists(): ByProjectKeyShoppingListsRequestBuilder {
       return new ByProjectKeyShoppingListsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		The commercetools platform allows you to model states of certain objects, such as orders, line items, products,
    *		reviews, and payments in order to define finite state machines reflecting the business logic you’d like to
    *		implement.
    *		
    */
    public states(): ByProjectKeyStatesRequestBuilder {
       return new ByProjectKeyStatesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Subscriptions allow you to be notified of new messages or changes via a Message Queue of your choice
    */
    public subscriptions(): ByProjectKeySubscriptionsRequestBuilder {
       return new ByProjectKeySubscriptionsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Tax Categories define how products are to be taxed in different countries.
    */
    public taxCategories(): ByProjectKeyTaxCategoriesRequestBuilder {
       return new ByProjectKeyTaxCategoriesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Types define custom fields that are used to enhance resources as you need.
    */
    public types(): ByProjectKeyTypesRequestBuilder {
       return new ByProjectKeyTypesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Zones allow defining ShippingRates for specific Locations.
    */
    public zones(): ByProjectKeyZonesRequestBuilder {
       return new ByProjectKeyZonesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    public me(): ByProjectKeyMeRequestBuilder {
       return new ByProjectKeyMeRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Extend the behavior of an API with your business logic
    */
    public extensions(): ByProjectKeyExtensionsRequestBuilder {
       return new ByProjectKeyExtensionsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Manage your API Clients via an API. Useful for Infrastructure-as-Code tooling, and regularly rotating API secrets.
    *		
    */
    public apiClients(): ByProjectKeyApiClientsRequestBuilder {
       return new ByProjectKeyApiClientsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    /**
    *		Stores let you model the context your customers shop in.
    */
    public stores(): ByProjectKeyStoresRequestBuilder {
       return new ByProjectKeyStoresRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    public inStoreKeyWithStoreKeyValue(
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
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    
    /**
    *		The Endpoint is responding a limited set of information about settings and configuration of the project.
    *		
    */
    public get(
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
                  ...methodArgs?.headers
              },
           },
           this.args.apiRequestExecutor
       )
    }
    /**
    *		Update project
    */
    public post(
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
                  ...methodArgs?.headers
              },
              body: methodArgs?.body,
           },
           this.args.apiRequestExecutor
       )
    }
    

}
