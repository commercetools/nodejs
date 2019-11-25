
import { CustomerCreatePasswordResetToken, CustomerToken } from './../../models/customer'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCustomersPasswordTokenRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          apiRequestExecutor: ApiRequestExecutor;
        }
      ) {}
    /**
    *		The token value is used to reset the password of the customer with the given email. The token is
    *		valid only for 10 minutes.
    *		
    */
    public post(
                methodArgs:{
                   
                   body: CustomerCreatePasswordResetToken,
                   headers?: {
                      [key:string]:string
                   },
                }): ApiRequest<CustomerToken> {
       return new ApiRequest<CustomerToken>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/customers/password-token',
              pathVariables: this.args.pathArgs,
              headers: {
                  'Content-Type': 'application/json',
                  ...methodArgs?.headers
              },
              body: methodArgs?.body,
           },
           this.args.apiRequestExecutor
       )
    }
    

}
