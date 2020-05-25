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
import { ByProjectKeyMeActiveCartRequestBuilder } from 'client/active-cart/by-project-key-me-active-cart-request-builder'
import { ByProjectKeyMeCartsRequestBuilder } from 'client/carts/by-project-key-me-carts-request-builder'
import { ByProjectKeyMeEmailRequestBuilder } from 'client/email/by-project-key-me-email-request-builder'
import { ByProjectKeyMeLoginRequestBuilder } from 'client/login/by-project-key-me-login-request-builder'
import { ByProjectKeyMeOrdersRequestBuilder } from 'client/orders/by-project-key-me-orders-request-builder'
import { ByProjectKeyMePasswordRequestBuilder } from 'client/password/by-project-key-me-password-request-builder'
import { ByProjectKeyMePaymentRequestBuilder } from 'client/payment/by-project-key-me-payment-request-builder'
import { ByProjectKeyMePaymentsRequestBuilder } from 'client/payments/by-project-key-me-payments-request-builder'
import { ByProjectKeyMeShoppingListsRequestBuilder } from 'client/shopping-lists/by-project-key-me-shopping-lists-request-builder'
import { ByProjectKeyMeSignupRequestBuilder } from 'client/signup/by-project-key-me-signup-request-builder'
import { Update } from 'models/common'
import { MyCustomer } from 'models/me'
import { executeRequest, QueryParam } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyMeRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      executeRequest: executeRequest
      baseUri?: string
    }
  ) {}
  public email(): ByProjectKeyMeEmailRequestBuilder {
    return new ByProjectKeyMeEmailRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public password(): ByProjectKeyMePasswordRequestBuilder {
    return new ByProjectKeyMePasswordRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public signup(): ByProjectKeyMeSignupRequestBuilder {
    return new ByProjectKeyMeSignupRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public login(): ByProjectKeyMeLoginRequestBuilder {
    return new ByProjectKeyMeLoginRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public activeCart(): ByProjectKeyMeActiveCartRequestBuilder {
    return new ByProjectKeyMeActiveCartRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  /**
   *	A shopping cart holds product variants and can be ordered.
   */
  public carts(): ByProjectKeyMeCartsRequestBuilder {
    return new ByProjectKeyMeCartsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  /**
   *	An order can be created from a cart, usually after a checkout process has been completed.
   */
  public orders(): ByProjectKeyMeOrdersRequestBuilder {
    return new ByProjectKeyMeOrdersRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  /**
   *	The My Payments endpoint creates and provides access to payments scoped to a specific user.
   */
  public payments(): ByProjectKeyMePaymentsRequestBuilder {
    return new ByProjectKeyMePaymentsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  /**
   *	The My Shopping Lists endpoint creates and provides access to shopping lists scoped to a specific user.
   */
  public shoppingLists(): ByProjectKeyMeShoppingListsRequestBuilder {
    return new ByProjectKeyMeShoppingListsRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public payment(): ByProjectKeyMePaymentRequestBuilder {
    return new ByProjectKeyMePaymentRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }

  public get(methodArgs?: {
    queryArgs?: {
      sort?: string | string[]
      limit?: number | number[]
      offset?: number | number[]
      withTotal?: boolean | boolean[]
      expand?: string | string[]
      where?: string | string[]
      [key: string]: QueryParam
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<MyCustomer> {
    return new ApiRequest<MyCustomer>(
      {
        baseUri: this.args.baseUri,
        method: 'GET',
        uriTemplate: '/{projectKey}/me',
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
   *	Create a customer
   */
  public post(methodArgs: {
    body: Update
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<MyCustomer> {
    return new ApiRequest<MyCustomer>(
      {
        baseUri: this.args.baseUri,
        method: 'POST',
        uriTemplate: '/{projectKey}/me',
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
  /**
   *	Delete a Customer
   */
  public delete(methodArgs: {
    queryArgs: {
      version: number | number[]
      [key: string]: QueryParam
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<MyCustomer> {
    return new ApiRequest<MyCustomer>(
      {
        baseUri: this.args.baseUri,
        method: 'DELETE',
        uriTemplate: '/{projectKey}/me',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
      },
      this.args.executeRequest
    )
  }
}
