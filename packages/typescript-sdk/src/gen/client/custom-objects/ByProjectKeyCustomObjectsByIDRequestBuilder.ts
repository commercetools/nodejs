
import { CustomObject } from './../../models/CustomObject'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCustomObjectsByIDRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                ID: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    get(
        methodArgs?:{
           
           queryArgs?: {
              expand?: string
           },
           headers?: {
              [key:string]:string
           },
        }): ApiRequest<CustomObject> {
       return new ApiRequest<CustomObject>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/custom-objects/{ID}',
              pathVariables: this.args.pathArgs,
              headers: {
                  ...(methodArgs || {} as any).headers
              },
              queryParams: (methodArgs || {} as any).queryArgs,
           },
           this.args.middlewares
       )
    }
    
    delete(
           methodArgs?:{
              
              queryArgs?: {
                 version?: number
                 dataErasure?: boolean
                 expand?: string
              },
              headers?: {
                 [key:string]:string
              },
           }): ApiRequest<CustomObject> {
       return new ApiRequest<CustomObject>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'DELETE',
              uriTemplate: '/{projectKey}/custom-objects/{ID}',
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
