# commercetools-sdk-middlware-queue

Middleware for queueing requests for usage with `@commercetools/sdk-client`

## Usage

```js
import { createClient } from '@commercetools/sdk-client'
import {
  createQueueMiddleware,
} from '@commercetools/sdk-middleware-queue'

const middlewareOptions = {
  concurrency: 10, // default 20
}
const queueMiddleware = createQueueMiddleware(
  middlewareOptions,
)

const client = createClient({
  middlewares: [queueMiddleware],
})
```
