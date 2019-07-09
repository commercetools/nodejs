
import { ProductProjection } from './../../models/Product'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyProductProjectionsKeyByKeyRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                key: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    get(
        methodArgs?:{
           
           queryArgs?: {
              staged?: boolean
              priceCurrency?: string
              priceCountry?: string
              priceCustomerGroup?: string
              priceChannel?: string
              expand?: string
           },
           headers?: {
              [key:string]:string
           },
        }): ApiRequest<ProductProjection> {
       return new ApiRequest<ProductProjection>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/product-projections/key={key}',
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
