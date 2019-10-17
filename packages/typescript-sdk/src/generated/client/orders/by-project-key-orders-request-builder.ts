import { ByProjectKeyOrdersEditsRequestBuilder } from './../edits/by-project-key-orders-edits-request-builder'
import { ByProjectKeyOrdersImportRequestBuilder } from './../import/by-project-key-orders-import-request-builder'
import { ByProjectKeyOrdersByIDRequestBuilder } from './by-project-key-orders-by-id-request-builder'
import { ByProjectKeyOrdersOrderNumberByOrderNumberRequestBuilder } from './by-project-key-orders-order-number-by-order-number-request-builder'
import {
  Order,
  OrderFromCartDraft,
  OrderPagedQueryResponse,
} from './../../models/order'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyOrdersRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}

  public importOrder(): ByProjectKeyOrdersImportRequestBuilder {
    return new ByProjectKeyOrdersImportRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
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
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public edits(): ByProjectKeyOrdersEditsRequestBuilder {
    return new ByProjectKeyOrdersEditsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
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
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

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
  }): ApiRequest<OrderPagedQueryResponse> {
    return new ApiRequest<OrderPagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/orders',
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
    body: OrderFromCartDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Order> {
    return new ApiRequest<Order>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/orders',
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
}
