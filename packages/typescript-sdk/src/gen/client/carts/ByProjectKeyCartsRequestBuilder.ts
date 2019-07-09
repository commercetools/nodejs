
import { ByProjectKeyCartsReplicateRequestBuilder } from './../replicate/ByProjectKeyCartsReplicateRequestBuilder'
import { ByProjectKeyCartsByIDRequestBuilder } from './ByProjectKeyCartsByIDRequestBuilder'
import { CartDraft } from './../../models/Cart'
import { Cart } from './../../models/Cart'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCartsRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    replicate(): ByProjectKeyCartsReplicateRequestBuilder {
       return new ByProjectKeyCartsReplicateRequestBuilder(
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
    ): ByProjectKeyCartsByIDRequestBuilder {
       return new ByProjectKeyCartsByIDRequestBuilder(
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
              customerId?: string
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
        }): ApiRequest<object> {
       return new ApiRequest<object>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/carts',
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
            body: CartDraft,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<Cart> {
       return new ApiRequest<Cart>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/carts',
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
