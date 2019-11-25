
import { ByProjectKeyOrdersEditsByIDRequestBuilder } from './by-project-key-orders-edits-by-id-request-builder'
import { ByProjectKeyOrdersEditsKeyByKeyRequestBuilder } from './by-project-key-orders-edits-key-by-key-request-builder'
import { OrderEdit, OrderEditDraft, OrderEditPagedQueryResponse } from './../../models/order-edit'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyOrdersEditsRequestBuilder {

    
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
    ): ByProjectKeyOrdersEditsKeyByKeyRequestBuilder {
       return new ByProjectKeyOrdersEditsKeyByKeyRequestBuilder(
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
    ): ByProjectKeyOrdersEditsByIDRequestBuilder {
       return new ByProjectKeyOrdersEditsByIDRequestBuilder(
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
    *		Query edits
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
               }): ApiRequest<OrderEditPagedQueryResponse> {
       return new ApiRequest<OrderEditPagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/orders/edits',
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
    *		Create OrderEdit
    */
    public post(
                methodArgs:{
                   
                   queryArgs?: {
                      'expand'?: string | string[]
                   },
                   body: OrderEditDraft,
                   headers?: {
                      [key:string]:string
                   },
                }): ApiRequest<OrderEdit> {
       return new ApiRequest<OrderEdit>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/orders/edits',
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
