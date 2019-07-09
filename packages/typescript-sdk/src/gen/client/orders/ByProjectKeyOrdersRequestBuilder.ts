
import { ByProjectKeyOrdersImportRequestBuilder } from './../import/ByProjectKeyOrdersImportRequestBuilder'
import { ByProjectKeyOrdersOrderNumberByOrderNumberRequestBuilder } from './ByProjectKeyOrdersOrderNumberByOrderNumberRequestBuilder'
import { ByProjectKeyOrdersEditsRequestBuilder } from './../edits/ByProjectKeyOrdersEditsRequestBuilder'
import { ByProjectKeyOrdersByIDRequestBuilder } from './ByProjectKeyOrdersByIDRequestBuilder'
import { OrderFromCartDraft } from './../../models/Order'
import { OrderPagedQueryResponse } from './../../models/Order'
import { Order } from './../../models/Order'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyOrdersRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    import(): ByProjectKeyOrdersImportRequestBuilder {
       return new ByProjectKeyOrdersImportRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    withOrderNumber(
       childPathArgs: {
           orderNumber: string
       }
    ): ByProjectKeyOrdersOrderNumberByOrderNumberRequestBuilder {
       return new ByProjectKeyOrdersOrderNumberByOrderNumberRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                   ...childPathArgs
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    edits(): ByProjectKeyOrdersEditsRequestBuilder {
       return new ByProjectKeyOrdersEditsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    withId(
       childPathArgs: {
           ID: string
       }
    ): ByProjectKeyOrdersByIDRequestBuilder {
       return new ByProjectKeyOrdersByIDRequestBuilder(
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
        }): ApiRequest<OrderPagedQueryResponse> {
       return new ApiRequest<OrderPagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/orders',
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
            body: OrderFromCartDraft,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<Order> {
       return new ApiRequest<Order>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/orders',
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
