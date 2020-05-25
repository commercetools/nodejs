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
import { ByProjectKeyCustomersByIDRequestBuilder } from 'client/customers/by-project-key-customers-by-id-request-builder'
import { ByProjectKeyCustomersEmailTokenByEmailTokenRequestBuilder } from 'client/customers/by-project-key-customers-email-token-by-email-token-request-builder'
import { ByProjectKeyCustomersKeyByKeyRequestBuilder } from 'client/customers/by-project-key-customers-key-by-key-request-builder'
import { ByProjectKeyCustomersPasswordTokenByPasswordTokenRequestBuilder } from 'client/customers/by-project-key-customers-password-token-by-password-token-request-builder'
import { ByProjectKeyCustomersEmailTokenRequestBuilder } from 'client/email-token/by-project-key-customers-email-token-request-builder'
import { ByProjectKeyCustomersEmailRequestBuilder } from 'client/email/by-project-key-customers-email-request-builder'
import { ByProjectKeyCustomersPasswordTokenRequestBuilder } from 'client/password-token/by-project-key-customers-password-token-request-builder'
import { ByProjectKeyCustomersPasswordRequestBuilder } from 'client/password/by-project-key-customers-password-request-builder'
import {
  CustomerDraft,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
} from 'models/customer'
import { executeRequest, QueryParam } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyCustomersRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      executeRequest: executeRequest
      baseUri?: string
    }
  ) {}
  public withPasswordToken(childPathArgs: {
    passwordToken: string
  }): ByProjectKeyCustomersPasswordTokenByPasswordTokenRequestBuilder {
    return new ByProjectKeyCustomersPasswordTokenByPasswordTokenRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public withEmailToken(childPathArgs: {
    emailToken: string
  }): ByProjectKeyCustomersEmailTokenByEmailTokenRequestBuilder {
    return new ByProjectKeyCustomersEmailTokenByEmailTokenRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  /**
   *	To verify a customer's email, an email token can be created. This should be embedded in a link and sent to the
   *	customer via email. When the customer clicks on the link, the "verify customer's email" endpoint should be called,
   *	which sets customer's isVerifiedEmail field to true.
   *
   */
  public emailToken(): ByProjectKeyCustomersEmailTokenRequestBuilder {
    return new ByProjectKeyCustomersEmailTokenRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public email(): ByProjectKeyCustomersEmailRequestBuilder {
    return new ByProjectKeyCustomersEmailRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public password(): ByProjectKeyCustomersPasswordRequestBuilder {
    return new ByProjectKeyCustomersPasswordRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  /**
   *	The following workflow can be used to reset the customer's password:
   *
   *	* Create a password reset token and send it embedded in a link to the customer.
   *	* When the customer clicks on the link, the customer is retrieved with the token.
   *	* The customer enters a new password and the "reset customer's password" endpoint is called.
   *
   */
  public passwordToken(): ByProjectKeyCustomersPasswordTokenRequestBuilder {
    return new ByProjectKeyCustomersPasswordTokenRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public withKey(childPathArgs: {
    key: string
  }): ByProjectKeyCustomersKeyByKeyRequestBuilder {
    return new ByProjectKeyCustomersKeyByKeyRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public withId(childPathArgs: {
    ID: string
  }): ByProjectKeyCustomersByIDRequestBuilder {
    return new ByProjectKeyCustomersByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }

  /**
   *	Query customers
   */
  public get(methodArgs?: {
    queryArgs?: {
      expand?: string | string[]
      sort?: string | string[]
      limit?: number | number[]
      offset?: number | number[]
      withTotal?: boolean | boolean[]
      where?: string | string[]
      [key: string]: QueryParam
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<CustomerPagedQueryResponse> {
    return new ApiRequest<CustomerPagedQueryResponse>(
      {
        baseUri: this.args.baseUri,
        method: 'GET',
        uriTemplate: '/{projectKey}/customers',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
      },
      this.args.executeRequest
    )
  }
  /**
   *	Creates a customer. If an anonymous cart is passed in,
   *	then the cart is assigned to the created customer and the version number of the Cart will increase.
   *	If the ID of an anonymous session is given, all carts and orders will be assigned to the created customer.
   *
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
      [key: string]: QueryParam
    }
    body: CustomerDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<CustomerSignInResult> {
    return new ApiRequest<CustomerSignInResult>(
      {
        baseUri: this.args.baseUri,
        method: 'POST',
        uriTemplate: '/{projectKey}/customers',
        pathVariables: this.args.pathArgs,
        headers: {
          'Content-Type': 'application/json',
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
        body: methodArgs?.body,
      },
      this.args.executeRequest
    )
  }
}
