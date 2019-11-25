import { ByProjectKeyCustomersByIDRequestBuilder } from './by-project-key-customers-by-id-request-builder'
import { ByProjectKeyCustomersEmailTokenByEmailTokenRequestBuilder } from './by-project-key-customers-email-token-by-email-token-request-builder'
import { ByProjectKeyCustomersKeyByKeyRequestBuilder } from './by-project-key-customers-key-by-key-request-builder'
import { ByProjectKeyCustomersPasswordTokenByPasswordTokenRequestBuilder } from './by-project-key-customers-password-token-by-password-token-request-builder'
import { ByProjectKeyCustomersEmailTokenRequestBuilder } from './../email-token/by-project-key-customers-email-token-request-builder'
import { ByProjectKeyCustomersEmailRequestBuilder } from './../email/by-project-key-customers-email-request-builder'
import { ByProjectKeyCustomersPasswordTokenRequestBuilder } from './../password-token/by-project-key-customers-password-token-request-builder'
import { ByProjectKeyCustomersPasswordRequestBuilder } from './../password/by-project-key-customers-password-request-builder'
import {
  CustomerDraft,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
} from './../../models/customer'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCustomersRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
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
      apiRequestExecutor: this.args.apiRequestExecutor,
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
      apiRequestExecutor: this.args.apiRequestExecutor,
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
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public email(): ByProjectKeyCustomersEmailRequestBuilder {
    return new ByProjectKeyCustomersEmailRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public password(): ByProjectKeyCustomersPasswordRequestBuilder {
    return new ByProjectKeyCustomersPasswordRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
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
      apiRequestExecutor: this.args.apiRequestExecutor,
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
      apiRequestExecutor: this.args.apiRequestExecutor,
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
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  /**
   *	Query customers
   */
  public get(methodArgs?: {
    queryArgs?: {
      expand?: string | string[]
      where?: string | string[]
      sort?: string | string[]
      limit?: number | number[]
      offset?: number | number[]
      withTotal?: boolean | boolean[]
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<CustomerPagedQueryResponse> {
    return new ApiRequest<CustomerPagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/customers',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
      },
      this.args.apiRequestExecutor
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
    }
    body: CustomerDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<CustomerSignInResult> {
    return new ApiRequest<CustomerSignInResult>(
      {
        baseURL: 'https://api.sphere.io',
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
      this.args.apiRequestExecutor
    )
  }
}
