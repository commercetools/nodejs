import { ByProjectKeyMeEmailConfirmRequestBuilder } from './../confirm/by-project-key-me-email-confirm-request-builder'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyMeEmailRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}

  public confirm(): ByProjectKeyMeEmailConfirmRequestBuilder {
    return new ByProjectKeyMeEmailConfirmRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
}
