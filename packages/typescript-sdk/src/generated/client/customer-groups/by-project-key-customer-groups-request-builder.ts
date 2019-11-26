import { ByProjectKeyCustomerGroupsByIDRequestBuilder } from './by-project-key-customer-groups-by-id-request-builder'
import { ByProjectKeyCustomerGroupsKeyByKeyRequestBuilder } from './by-project-key-customer-groups-key-by-key-request-builder'
import {
  CustomerGroup,
  CustomerGroupDraft,
  CustomerGroupPagedQueryResponse,
} from './../../models/customer-group'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyCustomerGroupsRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}
  public withKey(childPathArgs: {
    key: string
  }): ByProjectKeyCustomerGroupsKeyByKeyRequestBuilder {
    return new ByProjectKeyCustomerGroupsKeyByKeyRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }
  public withId(childPathArgs: {
    ID: string
  }): ByProjectKeyCustomerGroupsByIDRequestBuilder {
    return new ByProjectKeyCustomerGroupsByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      apiRequestExecutor: this.args.apiRequestExecutor,
    })
  }

  /**
   *	Query customer-groups
   */
  public get(methodArgs?: {
    queryArgs?: {
      expand?: string | string[]
      where?: string | string[]
      sort?: string | string[]
      limit?: number | number[]
      offset?: number | number[]
      withTotal?: boolean | boolean[]
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<CustomerGroupPagedQueryResponse> {
    return new ApiRequest<CustomerGroupPagedQueryResponse>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'GET',
        uriTemplate: '/{projectKey}/customer-groups',
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
   *	Create CustomerGroup
   */
  public post(methodArgs: {
    queryArgs?: {
      expand?: string | string[]
    }
    body: CustomerGroupDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<CustomerGroup> {
    return new ApiRequest<CustomerGroup>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/customer-groups',
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
}
