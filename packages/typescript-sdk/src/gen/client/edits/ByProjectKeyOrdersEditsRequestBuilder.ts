
import { ByProjectKeyOrdersEditsKeyByKeyRequestBuilder } from './ByProjectKeyOrdersEditsKeyByKeyRequestBuilder'
import { ByProjectKeyOrdersEditsByIDRequestBuilder } from './ByProjectKeyOrdersEditsByIDRequestBuilder'
import { OrderEditDraft } from './../../models/OrderEdit'
import { OrderEditPagedQueryResponse } from './../../models/OrderEdit'
import { OrderEdit } from './../../models/OrderEdit'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyOrdersEditsRequestBuilder {

    
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
    ): ByProjectKeyOrdersEditsKeyByKeyRequestBuilder {
       return new ByProjectKeyOrdersEditsKeyByKeyRequestBuilder(
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
    ): ByProjectKeyOrdersEditsByIDRequestBuilder {
       return new ByProjectKeyOrdersEditsByIDRequestBuilder(
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
        }): ApiRequest<OrderEditPagedQueryResponse> {
       return new ApiRequest<OrderEditPagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/orders/edits',
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
            body: OrderEditDraft,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<OrderEdit> {
       return new ApiRequest<OrderEdit>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/orders/edits',
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
