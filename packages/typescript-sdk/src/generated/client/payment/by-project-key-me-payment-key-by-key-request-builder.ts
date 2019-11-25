
import { MyPaymentUpdate } from './../../models/me'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyMePaymentKeyByKeyRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                key: string
           },
          apiRequestExecutor: ApiRequestExecutor;
        }
      ) {}
    public post(
                methodArgs:{
                   
                   body: MyPaymentUpdate,
                   headers?: {
                      [key:string]:string
                   },
                }): ApiRequest<void> {
       return new ApiRequest<void>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/me/payment/key={key}',
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
