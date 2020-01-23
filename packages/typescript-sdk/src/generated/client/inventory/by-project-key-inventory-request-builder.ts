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
import { ByProjectKeyInventoryByIDRequestBuilder } from 'client/inventory/by-project-key-inventory-by-id-request-builder'
import {
  InventoryEntry,
  InventoryEntryDraft,
  InventoryPagedQueryResponse,
} from 'models/inventory'
import { ApiRequestExecutor, ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyInventoryRequestBuilder {
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
  }): ByProjectKeyInventoryByIDRequestBuilder {
    return new ByProjectKeyInventoryByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  /**
   *	Query inventory
   */
  public get(methodArgs?: {
    queryArgs?: {
      expand?: string | string[]
      where?: string | string[]
      sort?: string | string[]
      limit?: number | number[]
      offset?: number | number[]
      withTotal?: boolean | boolean[]
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
  }): ApiRequest<InventoryPagedQueryResponse> {
    return new ApiRequest<InventoryPagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/inventory',
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
   *	Create InventoryEntry
   */
  public post(methodArgs: {
    queryArgs?: {
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
    body: InventoryEntryDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<InventoryEntry> {
    return new ApiRequest<InventoryEntry>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/inventory',
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
