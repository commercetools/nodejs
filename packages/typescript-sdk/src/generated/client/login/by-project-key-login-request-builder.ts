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
import { CustomerSignInResult, CustomerSignin } from 'models/customer'
import { QueryParam, executeRequest } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyLoginRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      executeRequest: executeRequest
      baseUri?: string
    }
  ) {}
  /**
   *	Authenticate Customer (Sign In). Retrieves the authenticated
   *	customer (a customer that matches the given email/password pair).
   *	If used with an access token for Anonymous Sessions,
   *	all orders and carts belonging to the anonymousId will be assigned to the newly created customer.
   *	If a cart is is returned as part of the CustomerSignInResult,
   *	it has been recalculated (It will have up-to-date prices, taxes and discounts,
   *	and invalid line items have been removed.).
   *
   */
  public post(methodArgs: {
    body: CustomerSignin
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<CustomerSignInResult> {
    return new ApiRequest<CustomerSignInResult>(
      {
        baseUri: this.args.baseUri,
        method: 'POST',
        uriTemplate: '/{projectKey}/login',
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
