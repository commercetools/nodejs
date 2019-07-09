
import { ByProjectKeyRequestBuilder } from './ByProjectKeyRequestBuilder'
import { Middleware } from './../base/common-types'
import { ApiRequest } from './../base/requests-utils'

export class ApiRoot {

  constructor(
    protected readonly args: {
      middlewares: Middleware[];
    }
  ) {}

  
  withProjectKeyValue(
     childPathArgs: {
         projectKey: string
     }
  ): ByProjectKeyRequestBuilder {
     return new ByProjectKeyRequestBuilder(
           {
              pathArgs: {
                 ...childPathArgs
              },
              middlewares: this.args.middlewares
           }
     )
  }
  

}
