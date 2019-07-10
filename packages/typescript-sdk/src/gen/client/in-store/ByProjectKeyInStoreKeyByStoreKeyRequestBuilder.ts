
import { ByProjectKeyInStoreKeyByStoreKeyCartsRequestBuilder } from './../carts/ByProjectKeyInStoreKeyByStoreKeyCartsRequestBuilder'
import { ByProjectKeyInStoreKeyByStoreKeyOrdersRequestBuilder } from './../orders/ByProjectKeyInStoreKeyByStoreKeyOrdersRequestBuilder'
import { ByProjectKeyInStoreKeyByStoreKeyMeRequestBuilder } from './../me/ByProjectKeyInStoreKeyByStoreKeyMeRequestBuilder'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                storeKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    carts(): ByProjectKeyInStoreKeyByStoreKeyCartsRequestBuilder {
       return new ByProjectKeyInStoreKeyByStoreKeyCartsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    orders(): ByProjectKeyInStoreKeyByStoreKeyOrdersRequestBuilder {
       return new ByProjectKeyInStoreKeyByStoreKeyOrdersRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    me(): ByProjectKeyInStoreKeyByStoreKeyMeRequestBuilder {
       return new ByProjectKeyInStoreKeyByStoreKeyMeRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    

}
