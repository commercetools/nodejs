import { ByProjectKeyTaxCategoriesByIDRequestBuilder } from './by-project-key-tax-categories-by-id-request-builder'
import { ByProjectKeyTaxCategoriesKeyByKeyRequestBuilder } from './by-project-key-tax-categories-key-by-key-request-builder'
import {
  TaxCategory,
  TaxCategoryDraft,
  TaxCategoryPagedQueryResponse,
} from './../../models/tax-category'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyTaxCategoriesRequestBuilder {
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
  }): ByProjectKeyTaxCategoriesKeyByKeyRequestBuilder {
    return new ByProjectKeyTaxCategoriesKeyByKeyRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public withId(childPathArgs: {
    ID: string
  }): ByProjectKeyTaxCategoriesByIDRequestBuilder {
    return new ByProjectKeyTaxCategoriesByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  /**
   *	Query tax-categories
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
  }): ApiRequest<TaxCategoryPagedQueryResponse> {
    return new ApiRequest<TaxCategoryPagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/tax-categories',
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
   *	Create TaxCategory
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
    }
    body: TaxCategoryDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<TaxCategory> {
    return new ApiRequest<TaxCategory>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/tax-categories',
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
