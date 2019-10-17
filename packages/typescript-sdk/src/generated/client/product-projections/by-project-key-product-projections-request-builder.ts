import { ByProjectKeyProductProjectionsByIDRequestBuilder } from './by-project-key-product-projections-by-id-request-builder'
import { ByProjectKeyProductProjectionsKeyByKeyRequestBuilder } from './by-project-key-product-projections-key-by-key-request-builder'
import { ByProjectKeyProductProjectionsSearchRequestBuilder } from './../search/by-project-key-product-projections-search-request-builder'
import { ByProjectKeyProductProjectionsSuggestRequestBuilder } from './../suggest/by-project-key-product-projections-suggest-request-builder'
import { ProductProjectionPagedQueryResponse } from './../../models/product'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyProductProjectionsRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}

  public search(): ByProjectKeyProductProjectionsSearchRequestBuilder {
    return new ByProjectKeyProductProjectionsSearchRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public suggest(): ByProjectKeyProductProjectionsSuggestRequestBuilder {
    return new ByProjectKeyProductProjectionsSuggestRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public withKey(childPathArgs: {
    key: string
  }): ByProjectKeyProductProjectionsKeyByKeyRequestBuilder {
    return new ByProjectKeyProductProjectionsKeyByKeyRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public withId(childPathArgs: {
    ID: string
  }): ByProjectKeyProductProjectionsByIDRequestBuilder {
    return new ByProjectKeyProductProjectionsByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public get(methodArgs?: {
    queryArgs?: {
      staged?: boolean | boolean[]
      priceCurrency?: string | string[]
      priceCountry?: string | string[]
      priceCustomerGroup?: string | string[]
      priceChannel?: string | string[]
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
  }): ApiRequest<ProductProjectionPagedQueryResponse> {
    return new ApiRequest<ProductProjectionPagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/product-projections',
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
