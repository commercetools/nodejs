# `sdk-middleware-queue`
Middelware to throttle concurrent [request](/sdk/Glossary.md#clientrequest) to a certain limit. Useful to reduce concurrent HTTP requests.

## Install

#### Node.js
```bash
npm install --save @commercetools/sdk-middleware-queue
```

#### Browser
```html
<script src="https://unpkg.com/@commercetools/sdk-middleware-queue/dist/commercetools-sdk-middleware-queue.min.js"></script>
<script>// global: CommercetoolsSdkMiddlewareQueue</script>
```

## `createQueueMiddleware(options)`

Creates a [middleware](/sdk/Glossary.md#middleware) to handle concurrent requests.

#### Named arguments (options)

1. `concurrency` *(Number)*: the max number of concurrent requests (default `20`)

#### Usage example

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
