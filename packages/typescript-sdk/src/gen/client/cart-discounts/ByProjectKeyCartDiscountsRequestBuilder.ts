
import { ByProjectKeyCartDiscountsByIDRequestBuilder } from './ByProjectKeyCartDiscountsByIDRequestBuilder'
import { ByProjectKeyCartDiscountsKeyByKeyRequestBuilder } from './ByProjectKeyCartDiscountsKeyByKeyRequestBuilder'
import { CartDiscountDraft } from './../../models/CartDiscount'
import { CartDiscountPagedQueryResponse } from './../../models/CartDiscount'
import { CartDiscount } from './../../models/CartDiscount'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCartDiscountsRequestBuilder {

    
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
    ): ByProjectKeyCartDiscountsByIDRequestBuilder {
       return new ByProjectKeyCartDiscountsByIDRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                   ...childPathArgs
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    withKey(
       childPathArgs: {
           key: string
       }
    ): ByProjectKeyCartDiscountsKeyByKeyRequestBuilder {
       return new ByProjectKeyCartDiscountsKeyByKeyRequestBuilder(
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
        }): ApiRequest<CartDiscountPagedQueryResponse> {
       return new ApiRequest<CartDiscountPagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/cart-discounts',
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
            body: CartDiscountDraft,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<CartDiscount> {
       return new ApiRequest<CartDiscount>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/cart-discounts',
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
