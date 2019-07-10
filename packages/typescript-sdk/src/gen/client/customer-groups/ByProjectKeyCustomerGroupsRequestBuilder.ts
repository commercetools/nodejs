
import { ByProjectKeyCustomerGroupsKeyByKeyRequestBuilder } from './ByProjectKeyCustomerGroupsKeyByKeyRequestBuilder'
import { ByProjectKeyCustomerGroupsByIDRequestBuilder } from './ByProjectKeyCustomerGroupsByIDRequestBuilder'
import { CustomerGroupDraft } from './../../models/CustomerGroup'
import { CustomerGroupPagedQueryResponse } from './../../models/CustomerGroup'
import { CustomerGroup } from './../../models/CustomerGroup'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCustomerGroupsRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string
           },
          middlewares: Middleware[];
        }
      ) {}
    
    withKey(
       childPathArgs: {
           key: string
       }
    ): ByProjectKeyCustomerGroupsKeyByKeyRequestBuilder {
       return new ByProjectKeyCustomerGroupsKeyByKeyRequestBuilder(
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
    ): ByProjectKeyCustomerGroupsByIDRequestBuilder {
       return new ByProjectKeyCustomerGroupsByIDRequestBuilder(
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
        }): ApiRequest<CustomerGroupPagedQueryResponse> {
       return new ApiRequest<CustomerGroupPagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/customer-groups',
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
            body: CustomerGroupDraft,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<CustomerGroup> {
       return new ApiRequest<CustomerGroup>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/customer-groups',
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
