import { ByProjectKeyMePasswordResetRequestBuilder } from './../reset/by-project-key-me-password-reset-request-builder'
import { MyCustomer } from './../../models/me'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyMePasswordRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  public reset(): ByProjectKeyMePasswordResetRequestBuilder {
    return new ByProjectKeyMePasswordResetRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public post(methodArgs: {
    body: void
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<MyCustomer> {
    return new ApiRequest<MyCustomer>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/me/password',
        pathVariables: this.args.pathArgs,
        headers: {
          'Content-Type': 'application/json',
          ...methodArgs?.headers,
        },
        body: methodArgs?.body,
      },
      this.args.apiRequestExecutor
    )
  }
}
