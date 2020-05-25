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
import { executeRequest } from 'shared/utils/common-types'

export class ApiRoot {
  private executeRequest: executeRequest
  private baseUri: string

  constructor(args: { executeRequest: executeRequest; baseUri?: string }) {
    this.executeRequest = args.executeRequest
    this.baseUri =
      args.baseUri ?? 'https://api.europe-west1.gcp.commercetools.com/'
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
      executeRequest: this.executeRequest,
      baseUri: this.baseUri,
    })
  }
}
