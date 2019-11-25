
import { ByProjectKeyInStoreKeyByStoreKeyMeCartsByIDRequestBuilder } from './by-project-key-in-store-key-by-store-key-me-carts-by-id-request-builder'
import { Cart, CartPagedQueryResponse } from './../../models/cart'
import { MyCartDraft } from './../../models/me'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyMeCartsRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                storeKey: string
           },
          apiRequestExecutor: ApiRequestExecutor;
        }
      ) {}
    public withId(
       childPathArgs: {
           ID: string
       }
    ): ByProjectKeyInStoreKeyByStoreKeyMeCartsByIDRequestBuilder {
       return new ByProjectKeyInStoreKeyByStoreKeyMeCartsByIDRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                   ...childPathArgs
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    
    /**
    *		Query carts
    */
    public get(
               methodArgs?:{
                  
                  queryArgs?: {
                     'expand'?: string | string[]
                     'where'?: string | string[]
                     'sort'?: string | string[]
                     'limit'?: number | number[]
                     'offset'?: number | number[]
                     'withTotal'?: boolean | boolean[]
                  },
                  headers?: {
                     [key:string]:string
                  },
               }): ApiRequest<CartPagedQueryResponse> {
       return new ApiRequest<CartPagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/in-store/key={storeKey}/me/carts',
              pathVariables: this.args.pathArgs,
              headers: {
                  ...methodArgs?.headers
              },
              queryParams: methodArgs?.queryArgs,
           },
           this.args.apiRequestExecutor
       )
    }
    /**
    *		Create Cart
    */
    public post(
                methodArgs:{
                   
                   queryArgs?: {
                      'expand'?: string | string[]
                   },
                   body: MyCartDraft,
                   headers?: {
                      [key:string]:string
                   },
                }): ApiRequest<Cart> {
       return new ApiRequest<Cart>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/in-store/key={storeKey}/me/carts',
              pathVariables: this.args.pathArgs,
              headers: {
                  'Content-Type': 'application/json',
                  ...methodArgs?.headers
              },
              queryParams: methodArgs?.queryArgs,
              body: methodArgs?.body,
           },
           this.args.apiRequestExecutor
       )
    }
    

}
