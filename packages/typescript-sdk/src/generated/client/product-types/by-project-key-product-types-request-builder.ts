import { ByProjectKeyProductTypesByIDRequestBuilder } from './by-project-key-product-types-by-id-request-builder'
import { ByProjectKeyProductTypesKeyByKeyRequestBuilder } from './by-project-key-product-types-key-by-key-request-builder'
import {
  ProductType,
  ProductTypeDraft,
  ProductTypePagedQueryResponse,
} from './../../models/product-type'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyProductTypesRequestBuilder {
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
  }): ByProjectKeyProductTypesKeyByKeyRequestBuilder {
    return new ByProjectKeyProductTypesKeyByKeyRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public withId(childPathArgs: {
    ID: string
  }): ByProjectKeyProductTypesByIDRequestBuilder {
    return new ByProjectKeyProductTypesByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

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
  }): ApiRequest<ProductTypePagedQueryResponse> {
    return new ApiRequest<ProductTypePagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/product-types',
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
    body: ProductTypeDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ProductType> {
    return new ApiRequest<ProductType>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/product-types',
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
