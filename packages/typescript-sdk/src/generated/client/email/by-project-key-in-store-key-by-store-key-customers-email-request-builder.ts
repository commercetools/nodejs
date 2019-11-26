import { ByProjectKeyInStoreKeyByStoreKeyCustomersEmailConfirmRequestBuilder } from './../confirm/by-project-key-in-store-key-by-store-key-customers-email-confirm-request-builder'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyCustomersEmailRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
        storeKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  public confirm(): ByProjectKeyInStoreKeyByStoreKeyCustomersEmailConfirmRequestBuilder {
    return new ByProjectKeyInStoreKeyByStoreKeyCustomersEmailConfirmRequestBuilder(
      {
        pathArgs: {
          ...this.args.pathArgs,
        },
        apiRequestExecutor: this.args.apiRequestExecutor,
      }
    )
  }
}
