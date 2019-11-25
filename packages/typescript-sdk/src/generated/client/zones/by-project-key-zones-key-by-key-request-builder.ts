
import { Zone, ZoneUpdate } from './../../models/zone'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyZonesKeyByKeyRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                key: string
           },
          apiRequestExecutor: ApiRequestExecutor;
        }
      ) {}
    /**
    *		Get Zone by key
    */
    public get(
               methodArgs?:{
                  
                  queryArgs?: {
                     'expand'?: string | string[]
                  },
                  headers?: {
                     [key:string]:string
                  },
               }): ApiRequest<Zone> {
       return new ApiRequest<Zone>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/zones/key={key}',
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
    *		Update Zone by key
    */
    public post(
                methodArgs:{
                   
                   queryArgs?: {
                      'expand'?: string | string[]
                   },
                   body: ZoneUpdate,
                   headers?: {
                      [key:string]:string
                   },
                }): ApiRequest<Zone> {
       return new ApiRequest<Zone>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/zones/key={key}',
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
    *		Delete Zone by key
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
                  }): ApiRequest<Zone> {
       return new ApiRequest<Zone>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'DELETE',
              uriTemplate: '/{projectKey}/zones/key={key}',
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
