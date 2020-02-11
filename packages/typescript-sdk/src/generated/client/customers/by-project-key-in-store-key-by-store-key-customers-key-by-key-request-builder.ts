/**
 *
 *    Generated file, please do not change!!!
 *    From http://www.vrap.io/ with love
 *
 *                ,d88b.d88b,
 *                88888888888
 *                `Y8888888Y'
 *                  `Y888Y'
 *                    `Y'
 *
 */
import { Update } from 'models/common'
import { Customer } from 'models/customer'
import { QueryParam, executeRequest } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyInStoreKeyByStoreKeyCustomersKeyByKeyRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
        storeKey: string
        key: string
      }
      executeRequest: executeRequest
      baseUri?: string
    }
  ) {}
  /**
   *	Returns a customer by its Key from a specific Store. The {storeKey} path parameter maps to a Store’s key.
   *	It also considers customers that do not have the stores field.
   *	If the customer exists in the commercetools project but the stores field references different stores,
   *	this method returns a ResourceNotFound error.
   *
   */
  public get(methodArgs?: {
    queryArgs?: {
      expand?: string | string[]
      [key: string]: QueryParam
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Customer> {
    return new ApiRequest<Customer>(
      {
        baseUri: this.args.baseUri,
        method: 'GET',
        uriTemplate:
          '/{projectKey}/in-store/key={storeKey}/customers/key={key}',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
      },
      this.args.executeRequest
    )
  }
  /**
   *	If the customer exists in the commercetools project but the stores field references a different store,
   *	this method returns a ResourceNotFound error.
   *
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
      [key: string]: QueryParam
    }
    body: Update
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Customer> {
    return new ApiRequest<Customer>(
      {
        baseUri: this.args.baseUri,
        method: 'POST',
        uriTemplate:
          '/{projectKey}/in-store/key={storeKey}/customers/key={key}',
        pathVariables: this.args.pathArgs,
        headers: {
          'Content-Type': 'application/json',
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
        body: methodArgs?.body,
      },
      this.args.executeRequest
    )
  }
  /**
   *	Delete Customer by key
   */
  public delete(methodArgs: {
    queryArgs: {
      dataErasure?: boolean | boolean[]
      version: number | number[]
      expand?: string | string[]
      [key: string]: QueryParam
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Customer> {
    return new ApiRequest<Customer>(
      {
        baseUri: this.args.baseUri,
        method: 'DELETE',
        uriTemplate:
          '/{projectKey}/in-store/key={storeKey}/customers/key={key}',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
      },
      this.args.executeRequest
    )
  }
}
