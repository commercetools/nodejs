import { ByProjectKeyMeCartsByIDRequestBuilder } from './by-project-key-me-carts-by-id-request-builder'
import { CartPagedQueryResponse } from './../../models/cart'
import { MyCart, MyCartDraft } from './../../models/me'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyMeCartsRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  public withId(childPathArgs: {
    ID: string
  }): ByProjectKeyMeCartsByIDRequestBuilder {
    return new ByProjectKeyMeCartsByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  /**
   *	Query carts
   */
  public get(methodArgs?: {
    queryArgs?: {
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
  }): ApiRequest<CartPagedQueryResponse> {
    return new ApiRequest<CartPagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/me/carts',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
      },
      this.args.apiRequestExecutor
    )
  }
  /**
   *	Create MyCart
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
    }
    body: MyCartDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<MyCart> {
    return new ApiRequest<MyCart>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/me/carts',
        pathVariables: this.args.pathArgs,
        headers: {
          'Content-Type': 'application/json',
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
        body: methodArgs?.body,
      },
      this.args.apiRequestExecutor
    )
  }
}
