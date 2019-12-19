import { GraphQLRequest, GraphQLResponse } from './../../models/graph-ql'
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
    body: GraphQLRequest
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<GraphQLResponse> {
    return new ApiRequest<GraphQLResponse>(
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
