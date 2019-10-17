import { ByProjectKeyChannelsByIDRequestBuilder } from './by-project-key-channels-by-id-request-builder'
import {
  Channel,
  ChannelDraft,
  ChannelPagedQueryResponse,
} from './../../models/channel'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyChannelsRequestBuilder {
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
  }): ByProjectKeyChannelsByIDRequestBuilder {
    return new ByProjectKeyChannelsByIDRequestBuilder({
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
  }): ApiRequest<ChannelPagedQueryResponse> {
    return new ApiRequest<ChannelPagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/channels',
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
    body: ChannelDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Channel> {
    return new ApiRequest<Channel>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/channels',
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
