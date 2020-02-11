import {
  ClientResponse,
  VariableMap,
  executeRequest,
  ClientRequest,
} from 'shared/utils/common-types'
import { buildRelativeUri } from 'shared/utils/uri-utils'
import { stringify } from 'querystring'

export class ApiRequest<O> {
  private request: ClientRequest
  constructor(
    request: ClientRequest,
    private readonly requestExecutor: executeRequest
  ) {
    this.request = {
      ...request,
      uri: buildRelativeUri(request),
    }
  }

  public execute(): Promise<ClientResponse<O>> {
    return this.requestExecutor(this.request)
  }
}
