
import { ByProjectKeyCustomObjectsByContainerByKeyRequestBuilder } from './ByProjectKeyCustomObjectsByContainerByKeyRequestBuilder'
import { ByProjectKeyCustomObjectsByIDRequestBuilder } from './ByProjectKeyCustomObjectsByIDRequestBuilder'
import { CustomObjectDraft } from './../../models/CustomObject'
import { CustomObjectPagedQueryResponse } from './../../models/CustomObject'
import { CustomObject } from './../../models/CustomObject'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCustomObjectsRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    withContainerAndKey(
       childPathArgs: {
           container: string
           key: string
       }
    ): ByProjectKeyCustomObjectsByContainerByKeyRequestBuilder {
       return new ByProjectKeyCustomObjectsByContainerByKeyRequestBuilder(
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
    ): ByProjectKeyCustomObjectsByIDRequestBuilder {
       return new ByProjectKeyCustomObjectsByIDRequestBuilder(
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
        }): ApiRequest<CustomObjectPagedQueryResponse> {
       return new ApiRequest<CustomObjectPagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/custom-objects',
              pathVariables: this.args.pathArgs,
              headers: {
                  ...(methodArgs || {} as any).headers
              },
              queryParams: (methodArgs || {} as any).queryArgs,
           },
           this.args.middlewares
       )
    }
    
    post(
         methodArgs:{
            
            queryArgs?: {
               expand?: string
            },
            body: CustomObjectDraft,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<CustomObject> {
       return new ApiRequest<CustomObject>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/custom-objects',
              pathVariables: this.args.pathArgs,
              headers: {
                  'Content-Type': 'application/json',
                  ...(methodArgs || {} as any).headers
              },
              queryParams: (methodArgs || {} as any).queryArgs,
              body: (methodArgs || {} as any).body,
           },
           this.args.middlewares
       )
    }
    

}
