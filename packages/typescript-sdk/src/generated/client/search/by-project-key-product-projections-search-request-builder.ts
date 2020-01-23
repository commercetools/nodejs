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
import { ProductProjectionPagedSearchResponse } from 'models/product'
import { ApiRequestExecutor, ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyProductProjectionsSearchRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  /**
   *	Search Product Projection
   */
  public post(methodArgs?: {
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<void> {
    return new ApiRequest<void>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/product-projections/search',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
      },
      this.args.apiRequestExecutor
    )
  }
  /**
   *	Search Product Projection
   */
  public get(methodArgs: {
    queryArgs: {
      fuzzy?: boolean | boolean[]
      fuzzyLevel?: number | number[]
      markMatchingVariants: boolean | boolean[]
      staged?: boolean | boolean[]
      filter?: string | string[]
      'filter.facets'?: string | string[]
      'filter.query'?: string | string[]
      facet?: string | string[]
      sort?: string | string[]
      limit?: number | number[]
      offset?: number | number[]
      withTotal?: boolean | boolean[]
      priceCurrency?: string | string[]
      priceCountry?: string | string[]
      priceCustomerGroup?: string | string[]
      priceChannel?: string | string[]
      expand?: string | string[]
      [key: string]:
        | boolean
        | boolean[]
        | string
        | string[]
        | number
        | number[]
        | undefined
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ProductProjectionPagedSearchResponse> {
    return new ApiRequest<ProductProjectionPagedSearchResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/product-projections/search',
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
