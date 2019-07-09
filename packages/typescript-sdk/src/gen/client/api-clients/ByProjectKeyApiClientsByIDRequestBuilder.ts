
import { ApiClient } from './../../models/ApiClient'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyApiClientsByIDRequestBuilder {

    
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
           
           headers?: {
              [key:string]:string
           },
        }): ApiRequest<ApiClient> {
       return new ApiRequest<ApiClient>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/api-clients/{ID}',
              pathVariables: this.args.pathArgs,
              headers: {
                  ...(methodArgs || {} as any).headers
              },
           },
           this.args.middlewares
       )
    }
    
    delete(
           methodArgs?:{
              
              headers?: {
                 [key:string]:string
              },
           }): ApiRequest<ApiClient> {
       return new ApiRequest<ApiClient>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'DELETE',
              uriTemplate: '/{projectKey}/api-clients/{ID}',
              pathVariables: this.args.pathArgs,
              headers: {
                  ...(methodArgs || {} as any).headers
              },
           },
           this.args.middlewares
       )
    }
    

}
