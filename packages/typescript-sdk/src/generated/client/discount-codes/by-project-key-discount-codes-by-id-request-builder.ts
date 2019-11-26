import { DiscountCode, DiscountCodeUpdate } from './../../models/discount-code'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyDiscountCodesByIDRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
        ID: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  /**
   *	Get DiscountCode by ID
   */
  public get(methodArgs?: {
    queryArgs?: {
      expand?: string | string[]
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<DiscountCode> {
    return new ApiRequest<DiscountCode>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/discount-codes/{ID}',
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
   *	Update DiscountCode by ID
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
    }
    body: DiscountCodeUpdate
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<DiscountCode> {
    return new ApiRequest<DiscountCode>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/discount-codes/{ID}',
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
  /**
   *	Delete DiscountCode by ID
   */
  public delete(methodArgs: {
    queryArgs: {
      dataErasure?: boolean | boolean[]
      version: number | number[]
      expand?: string | string[]
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<DiscountCode> {
    return new ApiRequest<DiscountCode>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'DELETE',
        uriTemplate: '/{projectKey}/discount-codes/{ID}',
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
