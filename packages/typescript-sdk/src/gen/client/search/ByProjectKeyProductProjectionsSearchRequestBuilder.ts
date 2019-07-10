
import { ProductProjectionPagedSearchResponse } from './../../models/Product'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyProductProjectionsSearchRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    post(
         methodArgs?:{
            
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<void> {
       return new ApiRequest<void>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/product-projections/search',
              pathVariables: this.args.pathArgs,
              headers: {
                  ...(methodArgs || {} as any).headers
              },
           },
           this.args.middlewares
       )
    }
    
    get(
        methodArgs?:{
           
           queryArgs?: {
              fuzzy?: boolean
              fuzzyLevel?: number
              staged?: boolean
              filter?: string
              facets?: string
              query?: string
              facet?: string
              text?: string
              sort?: string
              limit?: number
              offset?: number
              withTotal?: boolean
              priceCurrency?: string
              priceCountry?: string
              priceCustomerGroup?: string
              priceChannel?: string
              expand?: string
           },
           headers?: {
              [key:string]:string
           },
        }): ApiRequest<ProductProjectionPagedSearchResponse> {
       return new ApiRequest<ProductProjectionPagedSearchResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/product-projections/search',
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
