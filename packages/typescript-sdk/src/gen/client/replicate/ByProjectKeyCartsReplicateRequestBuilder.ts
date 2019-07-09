
import { ReplicaCartDraft } from './../../models/Cart'
import { Cart } from './../../models/Cart'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCartsReplicateRequestBuilder {

    
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
            
            body: ReplicaCartDraft,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<Cart> {
       return new ApiRequest<Cart>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/carts/replicate',
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
