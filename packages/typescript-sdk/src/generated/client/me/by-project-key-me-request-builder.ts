import { ByProjectKeyMeActiveCartRequestBuilder } from './../active-cart/by-project-key-me-active-cart-request-builder'
import { ByProjectKeyMeCartsRequestBuilder } from './../carts/by-project-key-me-carts-request-builder'
import { ByProjectKeyMeEmailRequestBuilder } from './../email/by-project-key-me-email-request-builder'
import { ByProjectKeyMeLoginRequestBuilder } from './../login/by-project-key-me-login-request-builder'
import { ByProjectKeyMeOrdersRequestBuilder } from './../orders/by-project-key-me-orders-request-builder'
import { ByProjectKeyMePasswordRequestBuilder } from './../password/by-project-key-me-password-request-builder'
import { ByProjectKeyMePaymentRequestBuilder } from './../payment/by-project-key-me-payment-request-builder'
import { ByProjectKeyMePaymentsRequestBuilder } from './../payments/by-project-key-me-payments-request-builder'
import { ByProjectKeyMeShoppingListsRequestBuilder } from './../shopping-lists/by-project-key-me-shopping-lists-request-builder'
import { ByProjectKeyMeSignupRequestBuilder } from './../signup/by-project-key-me-signup-request-builder'
import { Update } from './../../models/common'
import { MyCustomer } from './../../models/me'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyMeRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  public email(): ByProjectKeyMeEmailRequestBuilder {
    return new ByProjectKeyMeEmailRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public password(): ByProjectKeyMePasswordRequestBuilder {
    return new ByProjectKeyMePasswordRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public signup(): ByProjectKeyMeSignupRequestBuilder {
    return new ByProjectKeyMeSignupRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public login(): ByProjectKeyMeLoginRequestBuilder {
    return new ByProjectKeyMeLoginRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public activeCart(): ByProjectKeyMeActiveCartRequestBuilder {
    return new ByProjectKeyMeActiveCartRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
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
      apiRequestExecutor: this.args.apiRequestExecutor,
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
      apiRequestExecutor: this.args.apiRequestExecutor,
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
      apiRequestExecutor: this.args.apiRequestExecutor,
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
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public payment(): ByProjectKeyMePaymentRequestBuilder {
    return new ByProjectKeyMePaymentRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  public get(methodArgs?: {
    queryArgs?: {
      where?: string | string[]
      sort?: string | string[]
      limit?: number | number[]
      offset?: number | number[]
      withTotal?: boolean | boolean[]
      expand?: string | string[]
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<MyCustomer> {
    return new ApiRequest<MyCustomer>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/me',
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
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/me',
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
  /**
   *	Delete a Customer
   */
  public delete(methodArgs: {
    queryArgs: {
      version: number | number[]
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<MyCustomer> {
    return new ApiRequest<MyCustomer>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'DELETE',
        uriTemplate: '/{projectKey}/me',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
      },
      this.args.apiRequestExecutor
    )
  }
}
