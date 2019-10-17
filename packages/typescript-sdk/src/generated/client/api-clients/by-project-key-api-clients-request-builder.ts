import { ByProjectKeyApiClientsByIDRequestBuilder } from './by-project-key-api-clients-by-id-request-builder'
import {
  ApiClient,
  ApiClientDraft,
  ApiClientPagedQueryResponse,
} from './../../models/api-client'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyApiClientsRequestBuilder {
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
  }): ByProjectKeyApiClientsByIDRequestBuilder {
    return new ByProjectKeyApiClientsByIDRequestBuilder({
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
  }): ApiRequest<ApiClientPagedQueryResponse> {
    return new ApiRequest<ApiClientPagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/api-clients',
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
    body: ApiClientDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ApiClient> {
    return new ApiRequest<ApiClient>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/api-clients',
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
