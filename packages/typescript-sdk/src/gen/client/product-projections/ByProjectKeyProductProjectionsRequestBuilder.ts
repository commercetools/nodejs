
import { ByProjectKeyProductProjectionsSearchRequestBuilder } from './../search/ByProjectKeyProductProjectionsSearchRequestBuilder'
import { ByProjectKeyProductProjectionsSuggestRequestBuilder } from './../suggest/ByProjectKeyProductProjectionsSuggestRequestBuilder'
import { ByProjectKeyProductProjectionsKeyByKeyRequestBuilder } from './ByProjectKeyProductProjectionsKeyByKeyRequestBuilder'
import { ByProjectKeyProductProjectionsByIDRequestBuilder } from './ByProjectKeyProductProjectionsByIDRequestBuilder'
import { ProductProjectionPagedQueryResponse } from './../../models/Product'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyProductProjectionsRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    search(): ByProjectKeyProductProjectionsSearchRequestBuilder {
       return new ByProjectKeyProductProjectionsSearchRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    suggest(): ByProjectKeyProductProjectionsSuggestRequestBuilder {
       return new ByProjectKeyProductProjectionsSuggestRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    withKey(
       childPathArgs: {
           key: string
       }
    ): ByProjectKeyProductProjectionsKeyByKeyRequestBuilder {
       return new ByProjectKeyProductProjectionsKeyByKeyRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                   ...childPathArgs
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    withId(
       childPathArgs: {
           ID: string
       }
    ): ByProjectKeyProductProjectionsByIDRequestBuilder {
       return new ByProjectKeyProductProjectionsByIDRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                   ...childPathArgs
                },
                middlewares: this.args.middlewares
             }
       )
    }
    
    
    get(
        methodArgs?:{
           
           queryArgs?: {
              staged?: boolean
              priceCurrency?: string
              priceCountry?: string
              priceCustomerGroup?: string
              priceChannel?: string
              expand?: string
              where?: string
              sort?: string
              limit?: number
              offset?: number
              withTotal?: boolean
           },
           headers?: {
              [key:string]:string
           },
        }): ApiRequest<ProductProjectionPagedQueryResponse> {
       return new ApiRequest<ProductProjectionPagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/product-projections',
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
