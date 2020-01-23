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
import { ByProjectKeySubscriptionsByIDRequestBuilder } from 'client/subscriptions/by-project-key-subscriptions-by-id-request-builder'
import { ByProjectKeySubscriptionsKeyByKeyRequestBuilder } from 'client/subscriptions/by-project-key-subscriptions-key-by-key-request-builder'
import {
  Subscription,
  SubscriptionDraft,
  SubscriptionPagedQueryResponse,
} from 'models/subscription'
import { ApiRequestExecutor, ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeySubscriptionsRequestBuilder {
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
  }): ByProjectKeySubscriptionsKeyByKeyRequestBuilder {
    return new ByProjectKeySubscriptionsKeyByKeyRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public withId(childPathArgs: {
    ID: string
  }): ByProjectKeySubscriptionsByIDRequestBuilder {
    return new ByProjectKeySubscriptionsByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  /**
   *	Query subscriptions
   */
  public get(methodArgs?: {
    queryArgs?: {
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
  }): ApiRequest<SubscriptionPagedQueryResponse> {
    return new ApiRequest<SubscriptionPagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/subscriptions',
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
   *	The creation of a Subscription is eventually consistent, it may take up to a minute before it becomes fully active.
   *	In order to test that the destination is correctly configured, a test message will be put into the queue.
   *	If the message could not be delivered, the subscription will not be created.
   *	The payload of the test message is a notification of type ResourceCreated for the resourceTypeId subscription.
   *	Currently, a maximum of 25 subscriptions can be created per project.
   *
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
    body: SubscriptionDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Subscription> {
    return new ApiRequest<Subscription>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/subscriptions',
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
