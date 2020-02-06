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
import { ByProjectKeyMePaymentByIDRequestBuilder } from 'client/payment/by-project-key-me-payment-by-id-request-builder'
import { ByProjectKeyMePaymentKeyByKeyRequestBuilder } from 'client/payment/by-project-key-me-payment-key-by-key-request-builder'
import { QueryParamType } from 'shared/utils/common-types'
import { ApiRequestExecutor, ApiRequest } from 'shared/utils/requests-utils'

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
