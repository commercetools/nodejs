
import { Product } from './../../models/Product'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyProductsByIDImagesRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                ID: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    post(
         methodArgs:{
            
            queryArgs?: {
               filename?: string
               variant?: number
               sku?: string
               staged?: boolean
            },
            body: Buffer,
            headers: {
               'Content-Type': 'image/jpeg' | 'image/png' | 'image/gif'
               [key:string]:string
            },
         }): ApiRequest<Product> {
       return new ApiRequest<Product>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/products/{ID}/images',
              pathVariables: this.args.pathArgs,
              headers: {
                  ...(methodArgs || {} as any).headers
              },
              queryParams: (methodArgs || {} as any).queryArgs,
              body: (methodArgs || {} as any).body,
           },
           this.args.middlewares
       )
    }
    

}
