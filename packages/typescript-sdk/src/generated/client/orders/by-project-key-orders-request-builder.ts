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
import { ByProjectKeyOrdersEditsRequestBuilder } from 'client/edits/by-project-key-orders-edits-request-builder'
import { ByProjectKeyOrdersImportRequestBuilder } from 'client/import/by-project-key-orders-import-request-builder'
import { ByProjectKeyOrdersByIDRequestBuilder } from 'client/orders/by-project-key-orders-by-id-request-builder'
import { ByProjectKeyOrdersOrderNumberByOrderNumberRequestBuilder } from 'client/orders/by-project-key-orders-order-number-by-order-number-request-builder'
import {
  Order,
  OrderFromCartDraft,
  OrderPagedQueryResponse,
} from 'models/order'
import { QueryParam, executeRequest } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyOrdersRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      executeRequest: executeRequest
      baseUri?: string
    }
  ) {}
  public importOrder(): ByProjectKeyOrdersImportRequestBuilder {
    return new ByProjectKeyOrdersImportRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public withOrderNumber(childPathArgs: {
    orderNumber: string
  }): ByProjectKeyOrdersOrderNumberByOrderNumberRequestBuilder {
    return new ByProjectKeyOrdersOrderNumberByOrderNumberRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  /**
   *	OrderEdit are containers for financial changes after an Order has been placed.
   */
  public edits(): ByProjectKeyOrdersEditsRequestBuilder {
    return new ByProjectKeyOrdersEditsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public withId(childPathArgs: {
    ID: string
  }): ByProjectKeyOrdersByIDRequestBuilder {
    return new ByProjectKeyOrdersByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }

  /**
   *	Query orders
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
  }): ApiRequest<OrderPagedQueryResponse> {
    return new ApiRequest<OrderPagedQueryResponse>(
      {
        baseUri: this.args.baseUri,
        method: 'GET',
        uriTemplate: '/{projectKey}/orders',
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
   *	Creates an order from a Cart.
   *	The cart must have a shipping address set before creating an order.
   *	When using the Platform TaxMode, the shipping address is used for tax calculation.
   *
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
      [key: string]: QueryParam
    }
    body: OrderFromCartDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Order> {
    return new ApiRequest<Order>(
      {
        baseUri: this.args.baseUri,
        method: 'POST',
        uriTemplate: '/{projectKey}/orders',
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
