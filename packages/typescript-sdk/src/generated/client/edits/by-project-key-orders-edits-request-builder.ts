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
import { ByProjectKeyOrdersEditsByIDRequestBuilder } from 'client/edits/by-project-key-orders-edits-by-id-request-builder'
import { ByProjectKeyOrdersEditsKeyByKeyRequestBuilder } from 'client/edits/by-project-key-orders-edits-key-by-key-request-builder'
import {
  OrderEdit,
  OrderEditDraft,
  OrderEditPagedQueryResponse,
} from 'models/order-edit'
import { QueryParam, executeRequest } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyOrdersEditsRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      executeRequest: executeRequest
      baseUri?: string
    }
  ) {}
  public withKey(childPathArgs: {
    key: string
  }): ByProjectKeyOrdersEditsKeyByKeyRequestBuilder {
    return new ByProjectKeyOrdersEditsKeyByKeyRequestBuilder({
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
  }): ByProjectKeyOrdersEditsByIDRequestBuilder {
    return new ByProjectKeyOrdersEditsByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }

  /**
   *	Query edits
   */
  public get(methodArgs?: {
    queryArgs?: {
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
  }): ApiRequest<OrderEditPagedQueryResponse> {
    return new ApiRequest<OrderEditPagedQueryResponse>(
      {
        baseUri: this.args.baseUri,
        method: 'GET',
        uriTemplate: '/{projectKey}/orders/edits',
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
   *	Create OrderEdit
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
      [key: string]: QueryParam
    }
    body: OrderEditDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<OrderEdit> {
    return new ApiRequest<OrderEdit>(
      {
        baseUri: this.args.baseUri,
        method: 'POST',
        uriTemplate: '/{projectKey}/orders/edits',
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
