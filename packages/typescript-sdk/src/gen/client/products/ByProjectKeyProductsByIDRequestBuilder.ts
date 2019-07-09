
import { ByProjectKeyProductsByIDImagesRequestBuilder } from './../images/ByProjectKeyProductsByIDImagesRequestBuilder'
import { ProductUpdate } from './../../models/Product'
import { Product } from './../../models/Product'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyProductsByIDRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                ID: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    images(): ByProjectKeyProductsByIDImagesRequestBuilder {
       return new ByProjectKeyProductsByIDImagesRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
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
           },
           headers?: {
              [key:string]:string
           },
        }): ApiRequest<Product> {
       return new ApiRequest<Product>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/products/{ID}',
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
            body: ProductUpdate,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<Product> {
       return new ApiRequest<Product>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/products/{ID}',
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
    
    delete(
           methodArgs:{
              
              queryArgs: {
                 priceCurrency?: string
                 priceCountry?: string
                 priceCustomerGroup?: string
                 priceChannel?: string
                 version: number
                 expand?: string
              },
              headers?: {
                 [key:string]:string
              },
           }): ApiRequest<Product> {
       return new ApiRequest<Product>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'DELETE',
              uriTemplate: '/{projectKey}/products/{ID}',
              pathVariables: this.args.pathArgs,
              headers: {
                  ...(methodArgs || {} as any).headers
              },
              queryParams: (methodArgs || {} as any).queryArgs,
           },
           this.args.middlewares
       )
    }
    

}
