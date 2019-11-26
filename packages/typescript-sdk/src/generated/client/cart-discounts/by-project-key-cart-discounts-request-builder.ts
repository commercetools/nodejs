import { ByProjectKeyCartDiscountsByIDRequestBuilder } from './by-project-key-cart-discounts-by-id-request-builder'
import { ByProjectKeyCartDiscountsKeyByKeyRequestBuilder } from './by-project-key-cart-discounts-key-by-key-request-builder'
import {
  CartDiscount,
  CartDiscountDraft,
  CartDiscountPagedQueryResponse,
} from './../../models/cart-discount'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCartDiscountsRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  public withKey(childPathArgs: {
    key: string
  }): ByProjectKeyCartDiscountsKeyByKeyRequestBuilder {
    return new ByProjectKeyCartDiscountsKeyByKeyRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public withId(childPathArgs: {
    ID: string
  }): ByProjectKeyCartDiscountsByIDRequestBuilder {
    return new ByProjectKeyCartDiscountsByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  /**
   *	Query cart-discounts
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
  }): ApiRequest<CartDiscountPagedQueryResponse> {
    return new ApiRequest<CartDiscountPagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/cart-discounts',
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
   *	Create CartDiscount
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
    }
    body: CartDiscountDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<CartDiscount> {
    return new ApiRequest<CartDiscount>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/cart-discounts',
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
