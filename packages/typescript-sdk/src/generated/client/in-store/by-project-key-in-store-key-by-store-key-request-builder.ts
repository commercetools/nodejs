import { ByProjectKeyInStoreKeyByStoreKeyCartsRequestBuilder } from './../carts/by-project-key-in-store-key-by-store-key-carts-request-builder'
import { ByProjectKeyInStoreKeyByStoreKeyCustomersRequestBuilder } from './../customers/by-project-key-in-store-key-by-store-key-customers-request-builder'
import { ByProjectKeyInStoreKeyByStoreKeyLoginRequestBuilder } from './../login/by-project-key-in-store-key-by-store-key-login-request-builder'
import { ByProjectKeyInStoreKeyByStoreKeyMeRequestBuilder } from './../me/by-project-key-in-store-key-by-store-key-me-request-builder'
import { ByProjectKeyInStoreKeyByStoreKeyOrdersRequestBuilder } from './../orders/by-project-key-in-store-key-by-store-key-orders-request-builder'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
        storeKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  /**
   *		A shopping cart holds product variants and can be ordered.
   */
  public carts(): ByProjectKeyInStoreKeyByStoreKeyCartsRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyCartsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  /**
   *		An order can be created from a cart, usually after a checkout process has been completed.
   */
  public orders(): ByProjectKeyInStoreKeyByStoreKeyOrdersRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyOrdersRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public me(): ByProjectKeyInStoreKeyByStoreKeyMeRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyMeRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  /**
   *		A customer is a person purchasing products. customers, Orders,
   *		Comments and Reviews can be associated to a customer.
   *
   */
  public customers(): ByProjectKeyInStoreKeyByStoreKeyCustomersRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyCustomersRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  /**
   *		Retrieves the authenticated customer.
   */
  public login(): ByProjectKeyInStoreKeyByStoreKeyLoginRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyLoginRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
}
