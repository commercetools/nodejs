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
import { ApiClient } from 'models/api-client'
import { ApiRequestExecutor, ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyApiClientsByIDRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
        ID: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  /**
   *	Get ApiClient by ID
   */
  public get(methodArgs?: {
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ApiClient> {
    return new ApiRequest<ApiClient>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/api-clients/{ID}',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
      },
      this.args.apiRequestExecutor
    )
  }
  /**
   *	Delete ApiClient by ID
   */
  public delete(methodArgs?: {
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ApiClient> {
    return new ApiRequest<ApiClient>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'DELETE',
        uriTemplate: '/{projectKey}/api-clients/{ID}',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
      },
      this.args.apiRequestExecutor
    )
  }
}
