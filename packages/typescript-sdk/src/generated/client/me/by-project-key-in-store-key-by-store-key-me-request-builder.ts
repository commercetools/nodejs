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
import { ByProjectKeyInStoreKeyByStoreKeyMeActiveCartRequestBuilder } from 'client/active-cart/by-project-key-in-store-key-by-store-key-me-active-cart-request-builder'
import { ByProjectKeyInStoreKeyByStoreKeyMeCartsRequestBuilder } from 'client/carts/by-project-key-in-store-key-by-store-key-me-carts-request-builder'
import { ByProjectKeyInStoreKeyByStoreKeyMeOrdersRequestBuilder } from 'client/orders/by-project-key-in-store-key-by-store-key-me-orders-request-builder'
import { QueryParam, executeRequest } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyMeRequestBuilder {
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
  public carts(): ByProjectKeyInStoreKeyByStoreKeyMeCartsRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyMeCartsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  /**
   *	An order can be created from a order, usually after a checkout process has been completed.
   */
  public orders(): ByProjectKeyInStoreKeyByStoreKeyMeOrdersRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyMeOrdersRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public activeCart(): ByProjectKeyInStoreKeyByStoreKeyMeActiveCartRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyMeActiveCartRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
}
