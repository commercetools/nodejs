import { ApiRoot } from '~/generated/index'

export function createApiBuilderFromCtpClient(ctpClient: any): ApiRoot {
  return new ApiRoot({
    executeRequest: ctpClient.execute,
  })
}
