import { middlewareFromCtpClient } from './ctp-middleware';
import { ApiRoot } from '../generated/client/api-root';
export function createApiBuilderFromCtpClient(ctpClient) {
    return new ApiRoot({
        middlewares: [middlewareFromCtpClient(ctpClient)],
    });
}
//# sourceMappingURL=ctp-client.js.map