
import { ByProjectKeyStoresByIDRequestBuilder } from './by-project-key-stores-by-id-request-builder'
import { ByProjectKeyStoresKeyByKeyRequestBuilder } from './by-project-key-stores-key-by-key-request-builder'
import { Store, StoreDraft, StorePagedQueryResponse } from './../../models/store'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyStoresRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          apiRequestExecutor: ApiRequestExecutor;
        }
      ) {}
    public withKey(
       childPathArgs: {
           key: string
       }
    ): ByProjectKeyStoresKeyByKeyRequestBuilder {
       return new ByProjectKeyStoresKeyByKeyRequestBuilder(
             {
                pathArgs: {
                   ...this.args.pathArgs,
                   ...childPathArgs
                },
                apiRequestExecutor: this.args.apiRequestExecutor
             }
       )
    }
    public withId(
       childPathArgs: {
           ID: string
       }
    ): ByProjectKeyStoresByIDRequestBuilder {
       return new ByProjectKeyStoresByIDRequestBuilder(
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
    *		Query stores
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
               }): ApiRequest<StorePagedQueryResponse> {
       return new ApiRequest<StorePagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/stores',
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
    *		Create Store
    */
    public post(
                methodArgs:{
                   
                   queryArgs?: {
                      'expand'?: string | string[]
                   },
                   body: StoreDraft,
                   headers?: {
                      [key:string]:string
                   },
                }): ApiRequest<Store> {
       return new ApiRequest<Store>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/stores',
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
