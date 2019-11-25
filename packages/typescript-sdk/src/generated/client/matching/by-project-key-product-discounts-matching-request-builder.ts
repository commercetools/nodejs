
import { ProductDiscount, ProductDiscountMatchQuery } from './../../models/product-discount'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyProductDiscountsMatchingRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          apiRequestExecutor: ApiRequestExecutor;
        }
      ) {}
    public post(
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
                  ...methodArgs?.headers
              },
              body: methodArgs?.body,
           },
           this.args.apiRequestExecutor
       )
    }
    

}
