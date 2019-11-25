import { ByProjectKeyInStoreKeyByStoreKeyMeActiveCartRequestBuilder } from './../active-cart/by-project-key-in-store-key-by-store-key-me-active-cart-request-builder'
import { ByProjectKeyInStoreKeyByStoreKeyMeCartsRequestBuilder } from './../carts/by-project-key-in-store-key-by-store-key-me-carts-request-builder'
import { ByProjectKeyInStoreKeyByStoreKeyMeOrdersRequestBuilder } from './../orders/by-project-key-in-store-key-by-store-key-me-orders-request-builder'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyMeRequestBuilder {
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
  public carts(): ByProjectKeyInStoreKeyByStoreKeyMeCartsRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyMeCartsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  /**
   *		An order can be created from a order, usually after a checkout process has been completed.
   */
  public orders(): ByProjectKeyInStoreKeyByStoreKeyMeOrdersRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyMeOrdersRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public activeCart(): ByProjectKeyInStoreKeyByStoreKeyMeActiveCartRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyMeActiveCartRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
}
