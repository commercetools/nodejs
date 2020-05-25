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
import { ByProjectKeyInStoreKeyByStoreKeyCustomersEmailConfirmRequestBuilder } from 'client/confirm/by-project-key-in-store-key-by-store-key-customers-email-confirm-request-builder'
import { executeRequest } from 'shared/utils/common-types'

export class ByProjectKeyInStoreKeyByStoreKeyCustomersEmailRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
        storeKey: string
      }
      executeRequest: executeRequest
      baseUri?: string
    }
  ) {}
  public confirm(): ByProjectKeyInStoreKeyByStoreKeyCustomersEmailConfirmRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyCustomersEmailConfirmRequestBuilder(
      {
        pathArgs: {
          ...this.args.pathArgs,
        },
        executeRequest: this.args.executeRequest,
        baseUri: this.args.baseUri,
      }
    )
  }
}
