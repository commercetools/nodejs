import { ApiRoot } from "../gen/client/ApiRoot";
import { middwareFromCtpClient } from "../necessary-middlewares/ctp_middlware";

export function createApiBuilderFromCtpClient(ctpClient: any): ApiRoot {
  return new ApiRoot({
    middlewares: [middwareFromCtpClient(ctpClient)]
  });
}
