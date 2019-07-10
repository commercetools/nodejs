import { ApiRoot } from "../gen/client/ApiRoot";
import { middlewareFromCtpClient } from "../necessary-middlewares/ctp_middlware";

export function createApiBuilderFromCtpClient(ctpClient: any): ApiRoot {
  return new ApiRoot({
    middlewares: [middlewareFromCtpClient(ctpClient)]
  });
}
