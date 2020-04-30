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
import { ByProjectKeyInStoreKeyByStoreKeyShippingMethodsMatchingCartRequestBuilder } from 'client/matching-cart/by-project-key-in-store-key-by-store-key-shipping-methods-matching-cart-request-builder'
import { QueryParam, executeRequest } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyShippingMethodsRequestBuilder {
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
   *	Get ShippingMethods for a cart in a store
   */
  public matchingCart(): ByProjectKeyInStoreKeyByStoreKeyShippingMethodsMatchingCartRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyShippingMethodsMatchingCartRequestBuilder(
      {
        pathArgs: {
          ...this.args.pathArgs,
        },
        executeRequest: this.args.executeRequest,
        baseUri: this.args.baseUri,
      }
    )
  }
}
