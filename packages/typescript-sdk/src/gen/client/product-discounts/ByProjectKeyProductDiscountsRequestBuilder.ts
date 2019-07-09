
import { ByProjectKeyProductDiscountsMatchingRequestBuilder } from './../matching/ByProjectKeyProductDiscountsMatchingRequestBuilder'
import { ByProjectKeyProductDiscountsByIDRequestBuilder } from './ByProjectKeyProductDiscountsByIDRequestBuilder'
import { ByProjectKeyProductDiscountsKeyByKeyRequestBuilder } from './ByProjectKeyProductDiscountsKeyByKeyRequestBuilder'
import { ProductDiscountDraft } from './../../models/ProductDiscount'
import { ProductDiscountPagedQueryResponse } from './../../models/ProductDiscount'
import { ProductDiscount } from './../../models/ProductDiscount'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyProductDiscountsRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    matching(): ByProjectKeyProductDiscountsMatchingRequestBuilder {
       return new ByProjectKeyProductDiscountsMatchingRequestBuilder(
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
    ): ByProjectKeyProductDiscountsByIDRequestBuilder {
       return new ByProjectKeyProductDiscountsByIDRequestBuilder(
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
    ): ByProjectKeyProductDiscountsKeyByKeyRequestBuilder {
       return new ByProjectKeyProductDiscountsKeyByKeyRequestBuilder(
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
        }): ApiRequest<ProductDiscountPagedQueryResponse> {
       return new ApiRequest<ProductDiscountPagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/product-discounts',
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
            body: ProductDiscountDraft,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<ProductDiscount> {
       return new ApiRequest<ProductDiscount>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/product-discounts',
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
