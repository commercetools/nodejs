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
import { ByProjectKeyCustomersPasswordResetRequestBuilder } from 'client/reset/by-project-key-customers-password-reset-request-builder'
import { Customer, CustomerChangePassword } from 'models/customer'
import { QueryParam, executeRequest } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyCustomersPasswordRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      executeRequest: executeRequest
      baseUri?: string
    }
  ) {}
  public reset(): ByProjectKeyCustomersPasswordResetRequestBuilder {
    return new ByProjectKeyCustomersPasswordResetRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }

  /**
   *	Change a customers password
   */
  public post(methodArgs: {
    body: CustomerChangePassword
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Customer> {
    return new ApiRequest<Customer>(
      {
        baseUri: this.args.baseUri,
        method: 'POST',
        uriTemplate: '/{projectKey}/customers/password',
        pathVariables: this.args.pathArgs,
        headers: {
          'Content-Type': 'application/json',
          ...methodArgs?.headers,
        },
        body: methodArgs?.body,
      },
      this.args.executeRequest
    )
  }
}
