
import { ByProjectKeyInStoreKeyByStoreKeyMeCartsRequestBuilder } from './../carts/ByProjectKeyInStoreKeyByStoreKeyMeCartsRequestBuilder'
import { ByProjectKeyInStoreKeyByStoreKeyMeOrdersRequestBuilder } from './../orders/ByProjectKeyInStoreKeyByStoreKeyMeOrdersRequestBuilder'
import { ByProjectKeyInStoreKeyByStoreKeyMeActiveCartRequestBuilder } from './../active-cart/ByProjectKeyInStoreKeyByStoreKeyMeActiveCartRequestBuilder'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyMeRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                storeKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    carts(): ByProjectKeyInStoreKeyByStoreKeyMeCartsRequestBuilder {
       return new ByProjectKeyInStoreKeyByStoreKeyMeCartsRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    orders(): ByProjectKeyInStoreKeyByStoreKeyMeOrdersRequestBuilder {
       return new ByProjectKeyInStoreKeyByStoreKeyMeOrdersRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    activeCart(): ByProjectKeyInStoreKeyByStoreKeyMeActiveCartRequestBuilder {
       return new ByProjectKeyInStoreKeyByStoreKeyMeActiveCartRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    

}
