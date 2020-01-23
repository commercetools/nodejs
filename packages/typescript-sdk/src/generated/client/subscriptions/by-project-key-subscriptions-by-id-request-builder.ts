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
import { Subscription, SubscriptionUpdate } from 'models/subscription'
import { ApiRequestExecutor, ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeySubscriptionsByIDRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
        ID: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  /**
   *	Retrieves the representation of a subscription by its id.
   */
  public get(methodArgs?: {
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
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Subscription> {
    return new ApiRequest<Subscription>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/subscriptions/{ID}',
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
   *	Update Subscription by ID
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
    body: SubscriptionUpdate
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Subscription> {
    return new ApiRequest<Subscription>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/subscriptions/{ID}',
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
  /**
   *	Delete Subscription by ID
   */
  public delete(methodArgs: {
    queryArgs: {
      version: number | number[]
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
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Subscription> {
    return new ApiRequest<Subscription>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'DELETE',
        uriTemplate: '/{projectKey}/subscriptions/{ID}',
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
