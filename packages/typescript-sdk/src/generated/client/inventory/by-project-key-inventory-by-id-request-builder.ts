
import { InventoryEntry, InventoryEntryUpdate } from './../../models/inventory'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyInventoryByIDRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                ID: string
           },
          apiRequestExecutor: ApiRequestExecutor;
        }
      ) {}
    /**
    *		Get InventoryEntry by ID
    */
    public get(
               methodArgs?:{
                  
                  queryArgs?: {
                     'expand'?: string | string[]
                  },
                  headers?: {
                     [key:string]:string
                  },
               }): ApiRequest<InventoryEntry> {
       return new ApiRequest<InventoryEntry>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/inventory/{ID}',
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
    *		Update InventoryEntry by ID
    */
    public post(
                methodArgs:{
                   
                   queryArgs?: {
                      'expand'?: string | string[]
                   },
                   body: InventoryEntryUpdate,
                   headers?: {
                      [key:string]:string
                   },
                }): ApiRequest<InventoryEntry> {
       return new ApiRequest<InventoryEntry>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/inventory/{ID}',
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
    *		Delete InventoryEntry by ID
    */
    public delete(
                  methodArgs:{
                     
                     queryArgs: {
                        'version': number | number[]
                        'expand'?: string | string[]
                     },
                     headers?: {
                        [key:string]:string
                     },
                  }): ApiRequest<InventoryEntry> {
       return new ApiRequest<InventoryEntry>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'DELETE',
              uriTemplate: '/{projectKey}/inventory/{ID}',
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
