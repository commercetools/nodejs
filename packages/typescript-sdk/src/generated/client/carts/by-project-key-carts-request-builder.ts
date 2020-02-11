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
import { ByProjectKeyCartsCustomerIdByCustomerIdRequestBuilder } from 'client/carts/by-project-key-carts-customer-id-by-customer-id-request-builder'
import { ByProjectKeyCartsReplicateRequestBuilder } from 'client/replicate/by-project-key-carts-replicate-request-builder'
import { Cart, CartDraft } from 'models/cart'
import { QueryParam, executeRequest } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyCartsRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      executeRequest: executeRequest
      baseUri?: string
    }
  ) {}
  public replicate(): ByProjectKeyCartsReplicateRequestBuilder {
    return new ByProjectKeyCartsReplicateRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public withCustomerId(childPathArgs: {
    customerId: string
  }): ByProjectKeyCartsCustomerIdByCustomerIdRequestBuilder {
    return new ByProjectKeyCartsCustomerIdByCustomerIdRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
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
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
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
      [key: string]: QueryParam
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<any> {
    return new ApiRequest<any>(
      {
        baseUri: this.args.baseUri,
        method: 'GET',
        uriTemplate: '/{projectKey}/carts',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
      },
      this.args.executeRequest
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
      [key: string]: QueryParam
    }
    body: CartDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Cart> {
    return new ApiRequest<Cart>(
      {
        baseUri: this.args.baseUri,
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
      this.args.executeRequest
    )
  }
}
