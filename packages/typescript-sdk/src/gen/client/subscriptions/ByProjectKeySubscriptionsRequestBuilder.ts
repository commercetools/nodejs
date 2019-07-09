
import { ByProjectKeySubscriptionsKeyByKeyRequestBuilder } from './ByProjectKeySubscriptionsKeyByKeyRequestBuilder'
import { ByProjectKeySubscriptionsByIDRequestBuilder } from './ByProjectKeySubscriptionsByIDRequestBuilder'
import { SubscriptionDraft } from './../../models/Subscription'
import { SubscriptionPagedQueryResponse } from './../../models/Subscription'
import { Subscription } from './../../models/Subscription'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeySubscriptionsRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    withKey(
       childPathArgs: {
           key: string
       }
    ): ByProjectKeySubscriptionsKeyByKeyRequestBuilder {
       return new ByProjectKeySubscriptionsKeyByKeyRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                   ...childPathArgs
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    withId(
       childPathArgs: {
           ID: string
       }
    ): ByProjectKeySubscriptionsByIDRequestBuilder {
       return new ByProjectKeySubscriptionsByIDRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                   ...childPathArgs
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    
    get(
        methodArgs?:{
           
           queryArgs?: {
              expand?: string
              where?: string
              sort?: string
              limit?: number
              offset?: number
              withTotal?: boolean
           },
           headers?: {
              [key:string]:string
           },
        }): ApiRequest<SubscriptionPagedQueryResponse> {
       return new ApiRequest<SubscriptionPagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/subscriptions',
              pathVariables: this.args.pathArgs,
              headers: {
                  ...(methodArgs || {} as any).headers
              },
              queryParams: (methodArgs || {} as any).queryArgs,
           },
           this.args.middlewares
       )
    }
    
    post(
         methodArgs:{
            
            queryArgs?: {
               expand?: string
            },
            body: SubscriptionDraft,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<Subscription> {
       return new ApiRequest<Subscription>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/subscriptions',
              pathVariables: this.args.pathArgs,
              headers: {
                  'Content-Type': 'application/json',
                  ...(methodArgs || {} as any).headers
              },
              queryParams: (methodArgs || {} as any).queryArgs,
              body: (methodArgs || {} as any).body,
           },
           this.args.middlewares
       )
    }
    

}
