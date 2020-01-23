import { middlewareFromCtpClient } from '~/ctp/ctp-middleware'
import { ApiRoot } from '~/generated/index'

export function createApiBuilderFromCtpClient(ctpClient: any): ApiRoot {
  return new ApiRoot({
    middlewares: [middlewareFromCtpClient(ctpClient)],
  })
}
