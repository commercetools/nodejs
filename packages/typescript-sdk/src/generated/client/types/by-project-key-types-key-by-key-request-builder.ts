import { Type, TypeUpdate } from './../../models/type'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyTypesKeyByKeyRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
        key: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  /**
   *	Get Type by key
   */
  public get(methodArgs?: {
    queryArgs?: {
      expand?: string | string[]
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Type> {
    return new ApiRequest<Type>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/types/key={key}',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
      },
      this.args.apiRequestExecutor
    )
  }
  /**
   *	Update Type by key
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
    }
    body: TypeUpdate
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Type> {
    return new ApiRequest<Type>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/types/key={key}',
        pathVariables: this.args.pathArgs,
        headers: {
          'Content-Type': 'application/json',
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
        body: methodArgs?.body,
      },
      this.args.apiRequestExecutor
    )
  }
  /**
   *	Delete Type by key
   */
  public delete(methodArgs: {
    queryArgs: {
      version: number | number[]
      expand?: string | string[]
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Type> {
    return new ApiRequest<Type>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'DELETE',
        uriTemplate: '/{projectKey}/types/key={key}',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
      },
      this.args.apiRequestExecutor
    )
  }
}
