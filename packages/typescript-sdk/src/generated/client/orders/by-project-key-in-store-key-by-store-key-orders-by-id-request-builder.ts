
import { Order, OrderUpdate } from './../../models/order'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyOrdersByIDRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                storeKey: string,
                ID: string
           },
          apiRequestExecutor: ApiRequestExecutor;
        }
      ) {}
    /**
    *		Returns an order by its ID from a specific Store. The {storeKey} path parameter maps to a Store’s key.
    *		If the order exists in the commercetools project but does not have the store field,
    *		or the store field references a different store, this method returns a ResourceNotFound error.
    *		
    */
    public get(
               methodArgs?:{
                  
                  queryArgs?: {
                     'expand'?: string | string[]
                  },
                  headers?: {
                     [key:string]:string
                  },
               }): ApiRequest<Order> {
       return new ApiRequest<Order>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/in-store/key={storeKey}/orders/{ID}',
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
    *		Updates an order in the store specified by {storeKey}. The {storeKey} path parameter maps to a Store’s key.
    *		If the order exists in the commercetools project but does not have the store field,
    *		or the store field references a different store, this method returns a ResourceNotFound error.
    *		
    */
    public post(
                methodArgs:{
                   
                   queryArgs?: {
                      'expand'?: string | string[]
                   },
                   body: OrderUpdate,
                   headers?: {
                      [key:string]:string
                   },
                }): ApiRequest<Order> {
       return new ApiRequest<Order>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/in-store/key={storeKey}/orders/{ID}',
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
    /**
    *		Delete Order by ID
    */
    public delete(
                  methodArgs:{
                     
                     queryArgs: {
                        'dataErasure'?: boolean | boolean[]
                        'version': number | number[]
                        'expand'?: string | string[]
                     },
                     headers?: {
                        [key:string]:string
                     },
                  }): ApiRequest<Order> {
       return new ApiRequest<Order>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'DELETE',
              uriTemplate: '/{projectKey}/in-store/key={storeKey}/orders/{ID}',
              pathVariables: this.args.pathArgs,
              headers: {
                  ...methodArgs?.headers
              },
              queryParams: methodArgs?.queryArgs,
           },
           this.args.apiRequestExecutor
       )
    }
    

}
