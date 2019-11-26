import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyGraphqlRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  /**
   *	Execute a GraphQL query
   */
  public post(methodArgs: {
    body: object
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<object> {
    return new ApiRequest<object>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/graphql',
        pathVariables: this.args.pathArgs,
        headers: {
          'Content-Type': 'application/graphql',
          ...methodArgs?.headers,
        },
        body: methodArgs?.body,
      },
      this.args.apiRequestExecutor
    )
  }
}
