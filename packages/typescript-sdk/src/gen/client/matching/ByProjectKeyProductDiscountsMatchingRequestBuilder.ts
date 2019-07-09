
import { ProductDiscountMatchQuery } from './../../models/ProductDiscount'
import { ProductDiscount } from './../../models/ProductDiscount'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyProductDiscountsMatchingRequestBuilder {

    
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
            
            body: ProductDiscountMatchQuery,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<ProductDiscount> {
       return new ApiRequest<ProductDiscount>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/product-discounts/matching',
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
