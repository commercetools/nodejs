
import { ByProjectKeyChannelsByIDRequestBuilder } from './ByProjectKeyChannelsByIDRequestBuilder'
import { ChannelDraft } from './../../models/Channel'
import { ChannelPagedQueryResponse } from './../../models/Channel'
import { Channel } from './../../models/Channel'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyChannelsRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    withId(
       childPathArgs: {
           ID: string
       }
    ): ByProjectKeyChannelsByIDRequestBuilder {
       return new ByProjectKeyChannelsByIDRequestBuilder(
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
        }): ApiRequest<ChannelPagedQueryResponse> {
       return new ApiRequest<ChannelPagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/channels',
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
            body: ChannelDraft,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<Channel> {
       return new ApiRequest<Channel>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/channels',
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
