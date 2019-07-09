
import { ByProjectKeyInStoreKeyByStoreKeyMeOrdersByIDRequestBuilder } from './ByProjectKeyInStoreKeyByStoreKeyMeOrdersByIDRequestBuilder'
import { MyOrderFromCartDraft } from './../../models/Me'
import { OrderPagedQueryResponse } from './../../models/Order'
import { Order } from './../../models/Order'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyMeOrdersRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                storeKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    withId(
       childPathArgs: {
           ID: string
       }
    ): ByProjectKeyInStoreKeyByStoreKeyMeOrdersByIDRequestBuilder {
       return new ByProjectKeyInStoreKeyByStoreKeyMeOrdersByIDRequestBuilder(
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
              uriTemplate: '/{projectKey}/in-store/key={storeKey}/me/orders',
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
            body: MyOrderFromCartDraft,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<Order> {
       return new ApiRequest<Order>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/in-store/key={storeKey}/me/orders',
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
