import { ByProjectKeyMeShoppingListsByIDRequestBuilder } from './by-project-key-me-shopping-lists-by-id-request-builder'
import { ByProjectKeyMeShoppingListsKeyByKeyRequestBuilder } from './by-project-key-me-shopping-lists-key-by-key-request-builder'
import { MyShoppingListDraft } from './../../models/me'
import {
  MyShoppingList,
  ShoppingListPagedQueryResponse,
} from './../../models/shopping-list'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyMeShoppingListsRequestBuilder {
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
  }): ByProjectKeyMeShoppingListsByIDRequestBuilder {
    return new ByProjectKeyMeShoppingListsByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public keyWithKeyValue(childPathArgs: {
    key: string
  }): ByProjectKeyMeShoppingListsKeyByKeyRequestBuilder {
    return new ByProjectKeyMeShoppingListsKeyByKeyRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  /**
   *	Query shopping-lists
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
  }): ApiRequest<ShoppingListPagedQueryResponse> {
    return new ApiRequest<ShoppingListPagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/me/shopping-lists',
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
   *	Create MyShoppingList
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
    }
    body: MyShoppingListDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<MyShoppingList> {
    return new ApiRequest<MyShoppingList>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/me/shopping-lists',
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
