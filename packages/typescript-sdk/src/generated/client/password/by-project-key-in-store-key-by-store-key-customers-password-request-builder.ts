
import { ByProjectKeyInStoreKeyByStoreKeyCustomersPasswordResetRequestBuilder } from './../reset/by-project-key-in-store-key-by-store-key-customers-password-reset-request-builder'
import { Customer, CustomerChangePassword } from './../../models/customer'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyCustomersPasswordRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                storeKey: string
           },
          apiRequestExecutor: ApiRequestExecutor;
        }
      ) {}
    public reset(): ByProjectKeyInStoreKeyByStoreKeyCustomersPasswordResetRequestBuilder {
       return new ByProjectKeyInStoreKeyByStoreKeyCustomersPasswordResetRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    
    /**
    *		Change a customers password
    */
    public post(
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
              uriTemplate: '/{projectKey}/in-store/key={storeKey}/customers/password',
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
