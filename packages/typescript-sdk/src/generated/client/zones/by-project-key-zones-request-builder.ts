import { ByProjectKeyZonesByIDRequestBuilder } from './by-project-key-zones-by-id-request-builder'
import { ByProjectKeyZonesKeyByKeyRequestBuilder } from './by-project-key-zones-key-by-key-request-builder'
import { Zone, ZoneDraft, ZonePagedQueryResponse } from './../../models/zone'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyZonesRequestBuilder {
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
  }): ByProjectKeyZonesKeyByKeyRequestBuilder {
    return new ByProjectKeyZonesKeyByKeyRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public withId(childPathArgs: {
    ID: string
  }): ByProjectKeyZonesByIDRequestBuilder {
    return new ByProjectKeyZonesByIDRequestBuilder({
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
  }): ApiRequest<ZonePagedQueryResponse> {
    return new ApiRequest<ZonePagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/zones',
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
    body: ZoneDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Zone> {
    return new ApiRequest<Zone>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/zones',
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
