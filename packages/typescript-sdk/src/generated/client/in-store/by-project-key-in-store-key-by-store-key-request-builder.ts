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
import { ByProjectKeyInStoreKeyByStoreKeyCartsRequestBuilder } from 'client/carts/by-project-key-in-store-key-by-store-key-carts-request-builder'
import { ByProjectKeyInStoreKeyByStoreKeyCustomersRequestBuilder } from 'client/customers/by-project-key-in-store-key-by-store-key-customers-request-builder'
import { ByProjectKeyInStoreKeyByStoreKeyLoginRequestBuilder } from 'client/login/by-project-key-in-store-key-by-store-key-login-request-builder'
import { ByProjectKeyInStoreKeyByStoreKeyMeRequestBuilder } from 'client/me/by-project-key-in-store-key-by-store-key-me-request-builder'
import { ByProjectKeyInStoreKeyByStoreKeyOrdersRequestBuilder } from 'client/orders/by-project-key-in-store-key-by-store-key-orders-request-builder'
import { ByProjectKeyInStoreKeyByStoreKeyShippingMethodsRequestBuilder } from 'client/shipping-methods/by-project-key-in-store-key-by-store-key-shipping-methods-request-builder'
import { QueryParam, executeRequest } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
        storeKey: string
      }
      executeRequest: executeRequest
      baseUri?: string
    }
  ) {}
  /**
   *	A shopping cart holds product variants and can be ordered.
   */
  public carts(): ByProjectKeyInStoreKeyByStoreKeyCartsRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyCartsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  /**
   *	An order can be created from a cart, usually after a checkout process has been completed.
   */
  public orders(): ByProjectKeyInStoreKeyByStoreKeyOrdersRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyOrdersRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public me(): ByProjectKeyInStoreKeyByStoreKeyMeRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyMeRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  /**
   *	A customer is a person purchasing products. customers, Orders,
   *	Comments and Reviews can be associated to a customer.
   *
   */
  public customers(): ByProjectKeyInStoreKeyByStoreKeyCustomersRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyCustomersRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  /**
   *	Retrieves the authenticated customer.
   */
  public login(): ByProjectKeyInStoreKeyByStoreKeyLoginRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyLoginRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public shippingMethods(): ByProjectKeyInStoreKeyByStoreKeyShippingMethodsRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyShippingMethodsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
}
