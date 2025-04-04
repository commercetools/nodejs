# `sdk-middleware-queue`

Middleware to throttle concurrent [request](/sdk/Glossary#clientrequest) to a certain limit. Useful to reduce concurrent HTTP requests.

## ⚠️ In Maintenance Mode ⚠️

This package has been replaced by the <a href="https://docs.commercetools.com/sdk/typescript-sdk">TypeScript SDK</a> is in maintenance mode as such this tool will no longer receive new features or bug fixes.

We recommend to use the <a href="https://docs.commercetools.com/sdk/typescript-sdk">TypeScript SDK</a> for any new implementation and plan migrating to it.

## Install

#### Node.js

```bash
npm install --save @commercetools/sdk-middleware-queue
```

#### Browser

```html
<script src="https://unpkg.com/@commercetools/sdk-middleware-queue/dist/commercetools-sdk-middleware-queue.umd.min.js"></script>
<script>
  // global: CommercetoolsSdkMiddlewareQueue
</script>
```

## `createQueueMiddleware(options)`

Creates a [middleware](/sdk/Glossary#middleware) to handle concurrent requests.

#### Named arguments (options)

1.  `concurrency` _(Number)_: the max number of concurrent requests (default `20`)

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
