import { ByProjectKeyInStoreKeyByStoreKeyCartsRequestBuilder } from './../carts/by-project-key-in-store-key-by-store-key-carts-request-builder'
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

  public carts(): ByProjectKeyInStoreKeyByStoreKeyCartsRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyCartsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

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
}
