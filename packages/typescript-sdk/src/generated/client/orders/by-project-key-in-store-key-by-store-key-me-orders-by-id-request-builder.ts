import { Order } from './../../models/order'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyMeOrdersByIDRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
        storeKey: string
        ID: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  /**
   *	Get Order by ID
   */
  public get(methodArgs?: {
    queryArgs?: {
      expand?: string | string[]
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Order> {
    return new ApiRequest<Order>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/in-store/key={storeKey}/me/orders/{ID}',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
      },
      this.args.apiRequestExecutor
    )
  }
}
