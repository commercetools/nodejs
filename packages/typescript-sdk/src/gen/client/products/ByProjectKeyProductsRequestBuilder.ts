
import { ByProjectKeyProductsKeyByKeyRequestBuilder } from './ByProjectKeyProductsKeyByKeyRequestBuilder'
import { ByProjectKeyProductsByIDRequestBuilder } from './ByProjectKeyProductsByIDRequestBuilder'
import { ProductDraft } from './../../models/Product'
import { ProductPagedQueryResponse } from './../../models/Product'
import { Product } from './../../models/Product'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyProductsRequestBuilder {

    
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
    ): ByProjectKeyProductsKeyByKeyRequestBuilder {
       return new ByProjectKeyProductsKeyByKeyRequestBuilder(
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
    ): ByProjectKeyProductsByIDRequestBuilder {
       return new ByProjectKeyProductsByIDRequestBuilder(
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
              priceCurrency?: string
              priceCountry?: string
              priceCustomerGroup?: string
              priceChannel?: string
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
        }): ApiRequest<ProductPagedQueryResponse> {
       return new ApiRequest<ProductPagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/products',
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
               priceCurrency?: string
               priceCountry?: string
               priceCustomerGroup?: string
               priceChannel?: string
               expand?: string
            },
            body: ProductDraft,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<Product> {
       return new ApiRequest<Product>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/products',
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
