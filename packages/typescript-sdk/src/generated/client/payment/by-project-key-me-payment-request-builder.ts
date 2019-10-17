import { ByProjectKeyMePaymentByIDRequestBuilder } from './by-project-key-me-payment-by-id-request-builder'
import { ByProjectKeyMePaymentKeyByKeyRequestBuilder } from './by-project-key-me-payment-key-by-key-request-builder'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyMePaymentRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}

  public keyWithKeyValue(childPathArgs: {
    key: string
  }): ByProjectKeyMePaymentKeyByKeyRequestBuilder {
    return new ByProjectKeyMePaymentKeyByKeyRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public withIDValue(childPathArgs: {
    ID: string
  }): ByProjectKeyMePaymentByIDRequestBuilder {
    return new ByProjectKeyMePaymentByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
}
