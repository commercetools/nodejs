
import { CustomerSignInResult } from './../../models/Customer'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyMeLoginRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    post(
         methodArgs:{
            
            body: void,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<CustomerSignInResult> {
       return new ApiRequest<CustomerSignInResult>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/me/login',
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
