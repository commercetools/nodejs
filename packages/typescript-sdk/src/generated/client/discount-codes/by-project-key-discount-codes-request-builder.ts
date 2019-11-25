import { ByProjectKeyDiscountCodesByIDRequestBuilder } from './by-project-key-discount-codes-by-id-request-builder'
import {
  DiscountCode,
  DiscountCodeDraft,
  DiscountCodePagedQueryResponse,
} from './../../models/discount-code'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyDiscountCodesRequestBuilder {
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
  }): ByProjectKeyDiscountCodesByIDRequestBuilder {
    return new ByProjectKeyDiscountCodesByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  /**
   *	Query discount-codes
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
  }): ApiRequest<DiscountCodePagedQueryResponse> {
    return new ApiRequest<DiscountCodePagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/discount-codes',
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
   *	Create DiscountCode
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
    }
    body: DiscountCodeDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<DiscountCode> {
    return new ApiRequest<DiscountCode>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/discount-codes',
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
