import { middlewareFromCtpClient } from './ctp-middleware'
import { ApiRoot } from '../generated/client/api-root'

export function createApiBuilderFromCtpClient(ctpClient: any): ApiRoot {
  return new ApiRoot({
    middlewares: [middlewareFromCtpClient(ctpClient)],
  })
}
