import { ProductType, ProductTypeUpdate } from './../../models/product-type'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyProductTypesByIDRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
        ID: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}

  public get(methodArgs?: {
    queryArgs?: {
      expand?: string | string[]
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ProductType> {
    return new ApiRequest<ProductType>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/product-types/{ID}',
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
    body: ProductTypeUpdate
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ProductType> {
    return new ApiRequest<ProductType>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/product-types/{ID}',
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

  public delete(methodArgs: {
    queryArgs: {
      version: number | number[]
      expand?: string | string[]
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ProductType> {
    return new ApiRequest<ProductType>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'DELETE',
        uriTemplate: '/{projectKey}/product-types/{ID}',
        pathVariables: this.args.pathArgs,
        headers: {
          ...(methodArgs || ({} as any)).headers,
        },
        queryParams: (methodArgs || ({} as any)).queryArgs,
      },
      this.args.apiRequestExecutor
    )
  }
}
