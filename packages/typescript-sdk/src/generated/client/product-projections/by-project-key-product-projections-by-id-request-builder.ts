import { ProductProjection } from './../../models/product'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyProductProjectionsByIDRequestBuilder {
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
      staged?: boolean | boolean[]
      priceCurrency?: string | string[]
      priceCountry?: string | string[]
      priceCustomerGroup?: string | string[]
      priceChannel?: string | string[]
      expand?: string | string[]
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ProductProjection> {
    return new ApiRequest<ProductProjection>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/product-projections/{ID}',
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
