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

import {
  ClientRequest,
  ClientResponse,
  executeRequest,
} from 'shared/utils/common-types'
import { buildRelativeUri } from 'shared/utils/uri-utils'

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
