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
import { ByProjectKeyRequestBuilder } from 'client/by-project-key-request-builder'
import { QueryParamType } from 'shared/utils/common-types'
import { Middleware } from 'shared/utils/common-types'
import { ApiRequestExecutor, ApiRequest } from 'shared/utils/requests-utils'

export class ApiRoot {
  private apiRequestExecutor: ApiRequestExecutor
  constructor(args: { middlewares: Middleware[] }) {
    this.apiRequestExecutor = new ApiRequestExecutor(args.middlewares)
  }

  /**
   *	The Project endpoint is used to retrieve certain information from a project.
   */
  public withProjectKey(childPathArgs: {
    projectKey: string
  }): ByProjectKeyRequestBuilder {
    return new ByProjectKeyRequestBuilder({
      pathArgs: {
        ...childPathArgs,
      },
      apiRequestExecutor: this.apiRequestExecutor,
    })
  }
}
