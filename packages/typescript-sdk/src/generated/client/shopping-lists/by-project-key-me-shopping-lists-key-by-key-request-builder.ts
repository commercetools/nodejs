import { MyShoppingListUpdate } from './../../models/me'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyMeShoppingListsKeyByKeyRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
        key: string
      }
      apiRequestExecutor: ApiRequestExecutor
    }
  ) {}

  public post(methodArgs: {
    body: MyShoppingListUpdate
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<void> {
    return new ApiRequest<void>(
      {
        baseURL: 'https://api.sphere.io',
        method: 'POST',
        uriTemplate: '/{projectKey}/me/shopping-lists/key={key}',
        pathVariables: this.args.pathArgs,
        headers: {
          'Content-Type': 'application/json',
          ...(methodArgs || ({} as any)).headers,
        },
        body: (methodArgs || ({} as any)).body,
      },
      this.args.apiRequestExecutor
    )
  }
}
