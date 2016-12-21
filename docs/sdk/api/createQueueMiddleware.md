# `createQueueMiddleware(options)`

Creates a [middleware](/docs/sdk/Glossary,md#middleware) to handle concurrent requests.

#### Named arguments (options)

1. `concurrency` *(Number)*: the max number of concurrent requests (default `20`)

#### Example

```js
import { createClient } from '@commercetools/sdk-client'
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue'

const client = createClient({
  middlewares: [
    createQueueMiddleware({
      concurrency: 5,
    }),
  ],
})
```
