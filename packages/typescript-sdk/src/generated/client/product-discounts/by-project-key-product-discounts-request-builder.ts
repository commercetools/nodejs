import { ByProjectKeyProductDiscountsMatchingRequestBuilder } from './../matching/by-project-key-product-discounts-matching-request-builder'
import { ByProjectKeyProductDiscountsByIDRequestBuilder } from './by-project-key-product-discounts-by-id-request-builder'
import { ByProjectKeyProductDiscountsKeyByKeyRequestBuilder } from './by-project-key-product-discounts-key-by-key-request-builder'
import {
  ProductDiscount,
  ProductDiscountDraft,
  ProductDiscountPagedQueryResponse,
} from './../../models/product-discount'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyProductDiscountsRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  public matching(): ByProjectKeyProductDiscountsMatchingRequestBuilder {
    return new ByProjectKeyProductDiscountsMatchingRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public withKey(childPathArgs: {
    key: string
  }): ByProjectKeyProductDiscountsKeyByKeyRequestBuilder {
    return new ByProjectKeyProductDiscountsKeyByKeyRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public withId(childPathArgs: {
    ID: string
  }): ByProjectKeyProductDiscountsByIDRequestBuilder {
    return new ByProjectKeyProductDiscountsByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  /**
   *		Query product-discounts
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
  }): ApiRequest<ProductDiscountPagedQueryResponse> {
    return new ApiRequest<ProductDiscountPagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/product-discounts',
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
   *		Create ProductDiscount
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
    }
    body: ProductDiscountDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ProductDiscount> {
    return new ApiRequest<ProductDiscount>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/product-discounts',
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
