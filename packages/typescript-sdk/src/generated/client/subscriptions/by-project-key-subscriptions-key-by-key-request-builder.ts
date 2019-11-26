import { Subscription, SubscriptionUpdate } from './../../models/subscription'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeySubscriptionsKeyByKeyRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
        key: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  /**
   *	Retrieves the representation of a subscription by its key.
   */
  public get(methodArgs?: {
    queryArgs?: {
      expand?: string | string[]
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Subscription> {
    return new ApiRequest<Subscription>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/subscriptions/key={key}',
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
   *	Update Subscription by key
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
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
        uriTemplate: '/{projectKey}/subscriptions/key={key}',
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
   *	Delete Subscription by key
   */
  public delete(methodArgs: {
    queryArgs: {
      version: number | number[]
      expand?: string | string[]
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Subscription> {
    return new ApiRequest<Subscription>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'DELETE',
        uriTemplate: '/{projectKey}/subscriptions/key={key}',
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
