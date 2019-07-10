
import { ByProjectKeyMePasswordResetRequestBuilder } from './../reset/ByProjectKeyMePasswordResetRequestBuilder'
import { Customer } from './../../models/Customer'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyMePasswordRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    reset(): ByProjectKeyMePasswordResetRequestBuilder {
       return new ByProjectKeyMePasswordResetRequestBuilder(
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
            
            body: void,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<Customer> {
       return new ApiRequest<Customer>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/me/password',
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
