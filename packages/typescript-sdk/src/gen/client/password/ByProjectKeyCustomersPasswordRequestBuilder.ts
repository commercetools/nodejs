
import { ByProjectKeyCustomersPasswordResetRequestBuilder } from './../reset/ByProjectKeyCustomersPasswordResetRequestBuilder'
import { CustomerChangePassword } from './../../models/Customer'
import { Customer } from './../../models/Customer'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCustomersPasswordRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    reset(): ByProjectKeyCustomersPasswordResetRequestBuilder {
       return new ByProjectKeyCustomersPasswordResetRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    
    post(
         methodArgs:{
            
            body: CustomerChangePassword,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<Customer> {
       return new ApiRequest<Customer>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/customers/password',
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
    

}
