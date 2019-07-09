
import { Cart } from './../../models/Cart'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyMeActiveCartRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    get(
        methodArgs?:{
           
           headers?: {
              [key:string]:string
           },
        }): ApiRequest<Cart> {
       return new ApiRequest<Cart>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/me/active-cart',
              pathVariables: this.args.pathArgs,
              headers: {
                  ...(methodArgs || {} as any).headers
              },
           },
           this.args.middlewares
       )
    }
    

}
