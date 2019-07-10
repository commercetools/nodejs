
import { ByProjectKeyMeEmailRequestBuilder } from './../email/ByProjectKeyMeEmailRequestBuilder'
import { ByProjectKeyMePasswordRequestBuilder } from './../password/ByProjectKeyMePasswordRequestBuilder'
import { ByProjectKeyMeSignupRequestBuilder } from './../signup/ByProjectKeyMeSignupRequestBuilder'
import { ByProjectKeyMeLoginRequestBuilder } from './../login/ByProjectKeyMeLoginRequestBuilder'
import { ByProjectKeyMeActiveCartRequestBuilder } from './../active-cart/ByProjectKeyMeActiveCartRequestBuilder'
import { ByProjectKeyMeCartsRequestBuilder } from './../carts/ByProjectKeyMeCartsRequestBuilder'
import { ByProjectKeyMeOrdersRequestBuilder } from './../orders/ByProjectKeyMeOrdersRequestBuilder'
import { Update } from './../../models/Common'
import { Customer } from './../../models/Customer'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyMeRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    email(): ByProjectKeyMeEmailRequestBuilder {
       return new ByProjectKeyMeEmailRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    password(): ByProjectKeyMePasswordRequestBuilder {
       return new ByProjectKeyMePasswordRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    signup(): ByProjectKeyMeSignupRequestBuilder {
       return new ByProjectKeyMeSignupRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    login(): ByProjectKeyMeLoginRequestBuilder {
       return new ByProjectKeyMeLoginRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    activeCart(): ByProjectKeyMeActiveCartRequestBuilder {
       return new ByProjectKeyMeActiveCartRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    carts(): ByProjectKeyMeCartsRequestBuilder {
       return new ByProjectKeyMeCartsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    orders(): ByProjectKeyMeOrdersRequestBuilder {
       return new ByProjectKeyMeOrdersRequestBuilder(
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
              where?: string
              sort?: string
              limit?: number
              offset?: number
              withTotal?: boolean
              expand?: string
           },
           headers?: {
              [key:string]:string
           },
        }): ApiRequest<Customer> {
       return new ApiRequest<Customer>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/me',
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
            
            body: Update,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<Customer> {
       return new ApiRequest<Customer>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/me',
              pathVariables: this.args.pathArgs,
              headers: {
                  'Content-Type': 'application/json',
                  ...(methodArgs || {} as any).headers
              },
              body: (methodArgs || {} as any).body,
           },
           this.args.middlewares
       )
    }
    
    delete(
           methodArgs:{
              
              queryArgs: {
                 version: number
              },
              headers?: {
                 [key:string]:string
              },
           }): ApiRequest<Customer> {
       return new ApiRequest<Customer>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'DELETE',
              uriTemplate: '/{projectKey}/me',
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
