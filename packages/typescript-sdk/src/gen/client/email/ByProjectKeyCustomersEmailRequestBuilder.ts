
import { ByProjectKeyCustomersEmailConfirmRequestBuilder } from './../confirm/ByProjectKeyCustomersEmailConfirmRequestBuilder'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCustomersEmailRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    confirm(): ByProjectKeyCustomersEmailConfirmRequestBuilder {
       return new ByProjectKeyCustomersEmailConfirmRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    

}
