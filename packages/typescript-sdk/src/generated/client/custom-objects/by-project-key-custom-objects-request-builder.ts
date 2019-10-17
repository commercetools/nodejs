import { ByProjectKeyCustomObjectsByContainerByKeyRequestBuilder } from './by-project-key-custom-objects-by-container-by-key-request-builder'
import { ByProjectKeyCustomObjectsByIDRequestBuilder } from './by-project-key-custom-objects-by-id-request-builder'
import {
  CustomObject,
  CustomObjectDraft,
  CustomObjectPagedQueryResponse,
} from './../../models/custom-object'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCustomObjectsRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}

  public withContainerAndKey(childPathArgs: {
    container: string
    key: string
  }): ByProjectKeyCustomObjectsByContainerByKeyRequestBuilder {
    return new ByProjectKeyCustomObjectsByContainerByKeyRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public withId(childPathArgs: {
    ID: string
  }): ByProjectKeyCustomObjectsByIDRequestBuilder {
    return new ByProjectKeyCustomObjectsByIDRequestBuilder({
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
  }): ApiRequest<CustomObjectPagedQueryResponse> {
    return new ApiRequest<CustomObjectPagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/custom-objects',
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
    body: CustomObjectDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<CustomObject> {
    return new ApiRequest<CustomObject>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/custom-objects',
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
