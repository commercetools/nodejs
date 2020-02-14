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
import { ByProjectKeyProductProjectionsByIDRequestBuilder } from 'client/product-projections/by-project-key-product-projections-by-id-request-builder'
import { ByProjectKeyProductProjectionsKeyByKeyRequestBuilder } from 'client/product-projections/by-project-key-product-projections-key-by-key-request-builder'
import { ByProjectKeyProductProjectionsSearchRequestBuilder } from 'client/search/by-project-key-product-projections-search-request-builder'
import { ByProjectKeyProductProjectionsSuggestRequestBuilder } from 'client/suggest/by-project-key-product-projections-suggest-request-builder'
import { ProductProjectionPagedQueryResponse } from 'models/product'
import { QueryParam, executeRequest } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyProductProjectionsRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      executeRequest: executeRequest
      baseUri?: string
    }
  ) {}
  /**
   *	This endpoint provides high performance search queries over ProductProjections. The query result contains the
   *	ProductProjections for which at least one ProductVariant matches the search query. This means that variants can
   *	be included in the result also for which the search query does not match. To determine which ProductVariants match
   *	the search query, the returned ProductProjections include the additional field isMatchingVariant.
   *
   */
  public search(): ByProjectKeyProductProjectionsSearchRequestBuilder {
    return new ByProjectKeyProductProjectionsSearchRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  /**
   *	The source of data for suggestions is the searchKeyword field in a product
   */
  public suggest(): ByProjectKeyProductProjectionsSuggestRequestBuilder {
    return new ByProjectKeyProductProjectionsSuggestRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
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
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
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
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }

  /**
   *	You can use the product projections query endpoint to get the current or staged representations of Products.
   *	When used with an API client that has the view_published_products:{projectKey} scope,
   *	this endpoint only returns published (current) product projections.
   *
   */
  public get(methodArgs?: {
    queryArgs?: {
      staged?: boolean | boolean[]
      priceCurrency?: string | string[]
      priceCountry?: string | string[]
      priceCustomerGroup?: string | string[]
      priceChannel?: string | string[]
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
  }): ApiRequest<ProductProjectionPagedQueryResponse> {
    return new ApiRequest<ProductProjectionPagedQueryResponse>(
      {
        baseUri: this.args.baseUri,
        method: 'GET',
        uriTemplate: '/{projectKey}/product-projections',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
      },
      this.args.executeRequest
    )
  }
}
