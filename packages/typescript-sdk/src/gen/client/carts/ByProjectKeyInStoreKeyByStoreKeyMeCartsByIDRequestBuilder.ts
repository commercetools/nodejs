
import { Update } from './../../models/Common'
import { Cart } from './../../models/Cart'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyMeCartsByIDRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                storeKey: string,
                ID: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    get(
        methodArgs?:{
           
           queryArgs?: {
              expand?: string
           },
           headers?: {
              [key:string]:string
           },
        }): ApiRequest<Cart> {
       return new ApiRequest<Cart>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/in-store/key={storeKey}/me/carts/{ID}',
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
            body: Update,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<Cart> {
       return new ApiRequest<Cart>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/in-store/key={storeKey}/me/carts/{ID}',
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
                 version: number
                 expand?: string
              },
              headers?: {
                 [key:string]:string
              },
           }): ApiRequest<Cart> {
       return new ApiRequest<Cart>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'DELETE',
              uriTemplate: '/{projectKey}/in-store/key={storeKey}/me/carts/{ID}',
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
