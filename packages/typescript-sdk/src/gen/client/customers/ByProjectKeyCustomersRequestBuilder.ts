
import { ByProjectKeyCustomersPasswordTokenByPasswordTokenRequestBuilder } from './ByProjectKeyCustomersPasswordTokenByPasswordTokenRequestBuilder'
import { ByProjectKeyCustomersEmailTokenByEmailTokenRequestBuilder } from './ByProjectKeyCustomersEmailTokenByEmailTokenRequestBuilder'
import { ByProjectKeyCustomersEmailTokenRequestBuilder } from './../email-token/ByProjectKeyCustomersEmailTokenRequestBuilder'
import { ByProjectKeyCustomersEmailRequestBuilder } from './../email/ByProjectKeyCustomersEmailRequestBuilder'
import { ByProjectKeyCustomersPasswordRequestBuilder } from './../password/ByProjectKeyCustomersPasswordRequestBuilder'
import { ByProjectKeyCustomersPasswordTokenRequestBuilder } from './../password-token/ByProjectKeyCustomersPasswordTokenRequestBuilder'
import { ByProjectKeyCustomersByIDRequestBuilder } from './ByProjectKeyCustomersByIDRequestBuilder'
import { CustomerDraft } from './../../models/Customer'
import { CustomerSignInResult } from './../../models/Customer'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCustomersRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    withPasswordToken(
       childPathArgs: {
           passwordToken: string
       }
    ): ByProjectKeyCustomersPasswordTokenByPasswordTokenRequestBuilder {
       return new ByProjectKeyCustomersPasswordTokenByPasswordTokenRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                   ...childPathArgs
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    withEmailToken(
       childPathArgs: {
           emailToken: string
       }
    ): ByProjectKeyCustomersEmailTokenByEmailTokenRequestBuilder {
       return new ByProjectKeyCustomersEmailTokenByEmailTokenRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                   ...childPathArgs
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    emailToken(): ByProjectKeyCustomersEmailTokenRequestBuilder {
       return new ByProjectKeyCustomersEmailTokenRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    email(): ByProjectKeyCustomersEmailRequestBuilder {
       return new ByProjectKeyCustomersEmailRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    password(): ByProjectKeyCustomersPasswordRequestBuilder {
       return new ByProjectKeyCustomersPasswordRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    passwordToken(): ByProjectKeyCustomersPasswordTokenRequestBuilder {
       return new ByProjectKeyCustomersPasswordTokenRequestBuilder(
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
    ): ByProjectKeyCustomersByIDRequestBuilder {
       return new ByProjectKeyCustomersByIDRequestBuilder(
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
              token?: string
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
              uriTemplate: '/{projectKey}/customers',
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
            body: CustomerDraft,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<CustomerSignInResult> {
       return new ApiRequest<CustomerSignInResult>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/customers',
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
