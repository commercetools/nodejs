
import { Customer } from './../../models/Customer'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCustomersEmailTokenByEmailTokenRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                emailToken: string
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
        }): ApiRequest<Customer> {
       return new ApiRequest<Customer>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/customers/email-token={emailToken}',
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
