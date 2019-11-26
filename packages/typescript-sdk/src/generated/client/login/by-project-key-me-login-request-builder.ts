import { CustomerSignInResult } from './../../models/customer'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyMeLoginRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  public post(methodArgs: {
    body: void
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<CustomerSignInResult> {
    return new ApiRequest<CustomerSignInResult>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/me/login',
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
