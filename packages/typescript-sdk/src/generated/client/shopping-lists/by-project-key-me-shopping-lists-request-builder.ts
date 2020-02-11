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
import { ByProjectKeyMeShoppingListsByIDRequestBuilder } from 'client/shopping-lists/by-project-key-me-shopping-lists-by-id-request-builder'
import { ByProjectKeyMeShoppingListsKeyByKeyRequestBuilder } from 'client/shopping-lists/by-project-key-me-shopping-lists-key-by-key-request-builder'
import { MyShoppingListDraft } from 'models/me'
import {
  MyShoppingList,
  ShoppingListPagedQueryResponse,
} from 'models/shopping-list'
import { QueryParam, executeRequest } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyMeShoppingListsRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      executeRequest: executeRequest
      baseUri?: string
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
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
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
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
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
      [key: string]: QueryParam
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ShoppingListPagedQueryResponse> {
    return new ApiRequest<ShoppingListPagedQueryResponse>(
      {
        baseUri: this.args.baseUri,
        method: 'GET',
        uriTemplate: '/{projectKey}/me/shopping-lists',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
      },
      this.args.executeRequest
    )
  }
  /**
   *	Create MyShoppingList
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
      [key: string]: QueryParam
    }
    body: MyShoppingListDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<MyShoppingList> {
    return new ApiRequest<MyShoppingList>(
      {
        baseUri: this.args.baseUri,
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
      this.args.executeRequest
    )
  }
}
