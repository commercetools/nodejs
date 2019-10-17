import { ByProjectKeyInStoreKeyByStoreKeyCartsByIDRequestBuilder } from './by-project-key-in-store-key-by-store-key-carts-by-id-request-builder'
import { Cart, CartDraft } from './../../models/cart'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyCartsRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
        storeKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}

  public withId(childPathArgs: {
    ID: string
  }): ByProjectKeyInStoreKeyByStoreKeyCartsByIDRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyCartsByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public get(methodArgs?: {
    queryArgs?: {
      customerId?: string | string[]
      expand?: string | string[]
      where?: string | string[]
      sort?: string | string[]
      limit?: number | number[]
      offset?: number | number[]
      withTotal?: boolean | boolean[]
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<object> {
    return new ApiRequest<object>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/in-store/key={storeKey}/carts',
        pathVariables: this.args.pathArgs,
        headers: {
          ...(methodArgs || ({} as any)).headers,
        },
        queryParams: (methodArgs || ({} as any)).queryArgs,
      },
      this.args.apiRequestExecutor
    )
  }

  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
    }
    body: CartDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Cart> {
    return new ApiRequest<Cart>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/in-store/key={storeKey}/carts',
        pathVariables: this.args.pathArgs,
        headers: {
          'Content-Type': 'application/json',
          ...(methodArgs || ({} as any)).headers,
        },
        queryParams: (methodArgs || ({} as any)).queryArgs,
        body: (methodArgs || ({} as any)).body,
      },
      this.args.apiRequestExecutor
    )
  }
}
