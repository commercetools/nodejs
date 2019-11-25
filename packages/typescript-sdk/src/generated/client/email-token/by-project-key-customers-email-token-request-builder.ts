import {
  CustomerCreateEmailToken,
  CustomerToken,
} from './../../models/customer'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCustomersEmailTokenRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  /**
   *	Create a Token for verifying the Customer's Email
   */
  public post(methodArgs: {
    body: CustomerCreateEmailToken
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<CustomerToken> {
    return new ApiRequest<CustomerToken>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/customers/email-token',
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
