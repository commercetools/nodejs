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
import { ByProjectKeyProductDiscountsMatchingRequestBuilder } from 'client/matching/by-project-key-product-discounts-matching-request-builder'
import { ByProjectKeyProductDiscountsByIDRequestBuilder } from 'client/product-discounts/by-project-key-product-discounts-by-id-request-builder'
import { ByProjectKeyProductDiscountsKeyByKeyRequestBuilder } from 'client/product-discounts/by-project-key-product-discounts-key-by-key-request-builder'
import {
  ProductDiscount,
  ProductDiscountDraft,
  ProductDiscountPagedQueryResponse,
} from 'models/product-discount'
import { QueryParam, executeRequest } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyProductDiscountsRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      executeRequest: executeRequest
      baseUri?: string
    }
  ) {}
  public matching(): ByProjectKeyProductDiscountsMatchingRequestBuilder {
    return new ByProjectKeyProductDiscountsMatchingRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
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
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
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
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }

  /**
   *	Query product-discounts
   */
  public get(methodArgs?: {
    queryArgs?: {
      expand?: string | string[]
      sort?: string | string[]
      limit?: number | number[]
      offset?: number | number[]
      withTotal?: boolean | boolean[]
      where?: string | string[]
      [key: string]: QueryParam
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ProductDiscountPagedQueryResponse> {
    return new ApiRequest<ProductDiscountPagedQueryResponse>(
      {
        baseUri: this.args.baseUri,
        method: 'GET',
        uriTemplate: '/{projectKey}/product-discounts',
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
   *	Create ProductDiscount
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
      [key: string]: QueryParam
    }
    body: ProductDiscountDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ProductDiscount> {
    return new ApiRequest<ProductDiscount>(
      {
        baseUri: this.args.baseUri,
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
      this.args.executeRequest
    )
  }
}
