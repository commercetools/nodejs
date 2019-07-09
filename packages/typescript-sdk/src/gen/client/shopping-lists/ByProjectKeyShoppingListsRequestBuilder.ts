
import { ByProjectKeyShoppingListsKeyByKeyRequestBuilder } from './ByProjectKeyShoppingListsKeyByKeyRequestBuilder'
import { ByProjectKeyShoppingListsByIDRequestBuilder } from './ByProjectKeyShoppingListsByIDRequestBuilder'
import { ShoppingListDraft } from './../../models/ShoppingList'
import { ShoppingListPagedQueryResponse } from './../../models/ShoppingList'
import { ShoppingList } from './../../models/ShoppingList'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyShoppingListsRequestBuilder {

    
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
    ): ByProjectKeyShoppingListsKeyByKeyRequestBuilder {
       return new ByProjectKeyShoppingListsKeyByKeyRequestBuilder(
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
    ): ByProjectKeyShoppingListsByIDRequestBuilder {
       return new ByProjectKeyShoppingListsByIDRequestBuilder(
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
        }): ApiRequest<ShoppingListPagedQueryResponse> {
       return new ApiRequest<ShoppingListPagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/shopping-lists',
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
            body: ShoppingListDraft,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<ShoppingList> {
       return new ApiRequest<ShoppingList>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/shopping-lists',
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
