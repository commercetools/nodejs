
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyMeEmailConfirmRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    post(
         methodArgs?:{
            
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<void> {
       return new ApiRequest<void>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/me/email/confirm',
              pathVariables: this.args.pathArgs,
              headers: {
                  ...(methodArgs || {} as any).headers
              },
           },
           this.args.middlewares
       )
    }
    

}
