
import { Order } from './../../models/Order'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyMeOrdersByIDRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                storeKey: string,
                ID: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    get(
        methodArgs?:{
           
           queryArgs?: {
              expand?: string
           },
           headers?: {
              [key:string]:string
           },
        }): ApiRequest<Order> {
       return new ApiRequest<Order>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/in-store/key={storeKey}/me/orders/{ID}',
              pathVariables: this.args.pathArgs,
              headers: {
                  ...(methodArgs || {} as any).headers
              },
              queryParams: (methodArgs || {} as any).queryArgs,
           },
           this.args.middlewares
       )
    }
    

}
