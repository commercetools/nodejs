
import { ByProjectKeyMessagesByIDRequestBuilder } from './by-project-key-messages-by-id-request-builder'
import { MessagePagedQueryResponse } from './../../models/message'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyMessagesRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          apiRequestExecutor: ApiRequestExecutor;
        }
      ) {}
    public withId(
       childPathArgs: {
           ID: string
       }
    ): ByProjectKeyMessagesByIDRequestBuilder {
       return new ByProjectKeyMessagesByIDRequestBuilder(
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
    *		Query messages
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
               }): ApiRequest<MessagePagedQueryResponse> {
       return new ApiRequest<MessagePagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/messages',
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
