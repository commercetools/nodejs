
import { ByProjectKeyPaymentsKeyByKeyRequestBuilder } from './ByProjectKeyPaymentsKeyByKeyRequestBuilder'
import { ByProjectKeyPaymentsByIDRequestBuilder } from './ByProjectKeyPaymentsByIDRequestBuilder'
import { PaymentDraft } from './../../models/Payment'
import { PaymentPagedQueryResponse } from './../../models/Payment'
import { Payment } from './../../models/Payment'
import { Middleware } from './../../base/common-types'
import { ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyPaymentsRequestBuilder {

    
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
    ): ByProjectKeyPaymentsKeyByKeyRequestBuilder {
       return new ByProjectKeyPaymentsKeyByKeyRequestBuilder(
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
    ): ByProjectKeyPaymentsByIDRequestBuilder {
       return new ByProjectKeyPaymentsByIDRequestBuilder(
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
        }): ApiRequest<PaymentPagedQueryResponse> {
       return new ApiRequest<PaymentPagedQueryResponse>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'GET',
              uriTemplate: '/{projectKey}/payments',
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
            body: PaymentDraft,
            headers?: {
               [key:string]:string
            },
         }): ApiRequest<Payment> {
       return new ApiRequest<Payment>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/payments',
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
