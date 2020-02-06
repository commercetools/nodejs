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
import { GraphQLRequest, GraphQLResponse } from 'models/graph-ql'
import { QueryParamType } from 'shared/utils/common-types'
import { ApiRequestExecutor, ApiRequest } from 'shared/utils/requests-utils'

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
