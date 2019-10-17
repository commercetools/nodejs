import { ByProjectKeyCustomersPasswordResetRequestBuilder } from './../reset/by-project-key-customers-password-reset-request-builder'
import { Customer, CustomerChangePassword } from './../../models/customer'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCustomersPasswordRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}

  public reset(): ByProjectKeyCustomersPasswordResetRequestBuilder {
    return new ByProjectKeyCustomersPasswordResetRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public post(methodArgs: {
    body: CustomerChangePassword
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Customer> {
    return new ApiRequest<Customer>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/customers/password',
        pathVariables: this.args.pathArgs,
        headers: {
          'Content-Type': 'application/json',
          ...(methodArgs || ({} as any)).headers,
        },
        body: (methodArgs || ({} as any)).body,
      },
      this.args.apiRequestExecutor
    )
  }
}
