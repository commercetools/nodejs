
import { ByProjectKeyMeEmailConfirmRequestBuilder } from './../confirm/ByProjectKeyMeEmailConfirmRequestBuilder'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyMeEmailRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    confirm(): ByProjectKeyMeEmailConfirmRequestBuilder {
       return new ByProjectKeyMeEmailConfirmRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    

}
