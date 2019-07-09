
import { CustomerCreateEmailToken } from './../../models/Customer'
import { CustomerToken } from './../../models/Customer'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCustomersEmailTokenRequestBuilder {

    
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
            
            body: CustomerCreateEmailToken,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<CustomerToken> {
       return new ApiRequest<CustomerToken>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/customers/email-token',
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
