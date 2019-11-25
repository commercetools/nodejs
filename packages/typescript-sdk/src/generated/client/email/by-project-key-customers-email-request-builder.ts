import { ByProjectKeyCustomersEmailConfirmRequestBuilder } from './../confirm/by-project-key-customers-email-confirm-request-builder'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCustomersEmailRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  public confirm(): ByProjectKeyCustomersEmailConfirmRequestBuilder {
    return new ByProjectKeyCustomersEmailConfirmRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
}
