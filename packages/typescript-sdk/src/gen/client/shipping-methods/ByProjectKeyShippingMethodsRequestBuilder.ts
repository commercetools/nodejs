
import { ByProjectKeyShippingMethodsKeyByKeyRequestBuilder } from './ByProjectKeyShippingMethodsKeyByKeyRequestBuilder'
import { ByProjectKeyShippingMethodsByIDRequestBuilder } from './ByProjectKeyShippingMethodsByIDRequestBuilder'
import { ShippingMethodDraft } from './../../models/ShippingMethod'
import { ShippingMethodPagedQueryResponse } from './../../models/ShippingMethod'
import { ShippingMethod } from './../../models/ShippingMethod'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyShippingMethodsRequestBuilder {

    
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
    ): ByProjectKeyShippingMethodsKeyByKeyRequestBuilder {
       return new ByProjectKeyShippingMethodsKeyByKeyRequestBuilder(
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
    ): ByProjectKeyShippingMethodsByIDRequestBuilder {
       return new ByProjectKeyShippingMethodsByIDRequestBuilder(
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
              cartId?: string
              country?: string
              state?: string
              currency?: string
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
        }): ApiRequest<ShippingMethodPagedQueryResponse> {
       return new ApiRequest<ShippingMethodPagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/shipping-methods',
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
            body: ShippingMethodDraft,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<ShippingMethod> {
       return new ApiRequest<ShippingMethod>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/shipping-methods',
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
