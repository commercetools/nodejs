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
import { ByProjectKeyShippingMethodsByIDRequestBuilder } from 'client/shipping-methods/by-project-key-shipping-methods-by-id-request-builder'
import { ByProjectKeyShippingMethodsKeyByKeyRequestBuilder } from 'client/shipping-methods/by-project-key-shipping-methods-key-by-key-request-builder'
import {
  ShippingMethod,
  ShippingMethodDraft,
  ShippingMethodPagedQueryResponse,
} from 'models/shipping-method'
import { ApiRequestExecutor, ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyShippingMethodsRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
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
      apiRequestExecutor: this.args.apiRequestExecutor,
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
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  /**
   *	Query shipping-methods
   */
  public get(methodArgs?: {
    queryArgs?: {
      'shipping-methodId'?: string | string[]
      country?: string | string[]
      state?: string | string[]
      currency?: string | string[]
      expand?: string | string[]
      where?: string | string[]
      sort?: string | string[]
      limit?: number | number[]
      offset?: number | number[]
      withTotal?: boolean | boolean[]
      [key: string]:
        | boolean
        | boolean[]
        | string
        | string[]
        | number
        | number[]
        | undefined
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ShippingMethodPagedQueryResponse> {
    return new ApiRequest<ShippingMethodPagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/shipping-methods',
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
   *	Create ShippingMethod
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
      [key: string]:
        | boolean
        | boolean[]
        | string
        | string[]
        | number
        | number[]
        | undefined
    }
    body: ShippingMethodDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ShippingMethod> {
    return new ApiRequest<ShippingMethod>(
      {
        baseURL: 'https://api.sphere.io',
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
      this.args.apiRequestExecutor
    )
  }
}
