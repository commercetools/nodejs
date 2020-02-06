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
import { ByProjectKeyCartsByIDRequestBuilder } from 'client/carts/by-project-key-carts-by-id-request-builder'
import { ByProjectKeyCartsReplicateRequestBuilder } from 'client/replicate/by-project-key-carts-replicate-request-builder'
import { Cart, CartDraft } from 'models/cart'
import { QueryParamType } from 'shared/utils/common-types'
import { ApiRequestExecutor, ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyCartsRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  public replicate(): ByProjectKeyCartsReplicateRequestBuilder {
    return new ByProjectKeyCartsReplicateRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public withId(childPathArgs: {
    ID: string
  }): ByProjectKeyCartsByIDRequestBuilder {
    return new ByProjectKeyCartsByIDRequestBuilder({
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
      customerId?: string | string[]
      expand?: string | string[]
      where?: string | string[]
      sort?: string | string[]
      limit?: number | number[]
      offset?: number | number[]
      withTotal?: boolean | boolean[]
      [key: string]: QueryParamType
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<any> {
    return new ApiRequest<any>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/carts',
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
   *	Creating a cart can fail with an InvalidOperation if the referenced shipping method in the
   *	CartDraft has a predicate which does not match the cart.
   *
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
      [key: string]: QueryParamType
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
        uriTemplate: '/{projectKey}/carts',
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
