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
import { ByProjectKeyShippingMethodsMatchingCartRequestBuilder } from 'client/matching-cart/by-project-key-shipping-methods-matching-cart-request-builder'
import { ByProjectKeyShippingMethodsMatchingLocationRequestBuilder } from 'client/matching-location/by-project-key-shipping-methods-matching-location-request-builder'
import { ByProjectKeyShippingMethodsMatchingOrdereditRequestBuilder } from 'client/matching-orderedit/by-project-key-shipping-methods-matching-orderedit-request-builder'
import { ByProjectKeyShippingMethodsByIDRequestBuilder } from 'client/shipping-methods/by-project-key-shipping-methods-by-id-request-builder'
import { ByProjectKeyShippingMethodsKeyByKeyRequestBuilder } from 'client/shipping-methods/by-project-key-shipping-methods-key-by-key-request-builder'
import {
  ShippingMethod,
  ShippingMethodDraft,
  ShippingMethodPagedQueryResponse,
} from 'models/shipping-method'
import { executeRequest, QueryParam } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyShippingMethodsRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      executeRequest: executeRequest
      baseUri?: string
    }
  ) {}
  public withKey(childPathArgs: {
    key: string
  }): ByProjectKeyShippingMethodsKeyByKeyRequestBuilder {
    return new ByProjectKeyShippingMethodsKeyByKeyRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  /**
   *	Get ShippingMethods for a cart
   */
  public matchingCart(): ByProjectKeyShippingMethodsMatchingCartRequestBuilder {
    return new ByProjectKeyShippingMethodsMatchingCartRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  /**
   *	Get ShippingMethods for an order edit
   */
  public matchingOrderedit(): ByProjectKeyShippingMethodsMatchingOrdereditRequestBuilder {
    return new ByProjectKeyShippingMethodsMatchingOrdereditRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  /**
   *	Get ShippingMethods for a location
   */
  public matchingLocation(): ByProjectKeyShippingMethodsMatchingLocationRequestBuilder {
    return new ByProjectKeyShippingMethodsMatchingLocationRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public withId(childPathArgs: {
    ID: string
  }): ByProjectKeyShippingMethodsByIDRequestBuilder {
    return new ByProjectKeyShippingMethodsByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }

  /**
   *	Query shipping-methods
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
  }): ApiRequest<ShippingMethodPagedQueryResponse> {
    return new ApiRequest<ShippingMethodPagedQueryResponse>(
      {
        baseUri: this.args.baseUri,
        method: 'GET',
        uriTemplate: '/{projectKey}/shipping-methods',
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
   *	Create ShippingMethod
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
      [key: string]: QueryParam
    }
    body: ShippingMethodDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ShippingMethod> {
    return new ApiRequest<ShippingMethod>(
      {
        baseUri: this.args.baseUri,
        method: 'POST',
        uriTemplate: '/{projectKey}/shipping-methods',
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
