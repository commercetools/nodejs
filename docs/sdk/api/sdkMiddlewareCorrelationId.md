# `sdk-middleware-correlation-id`

Middleware add a correlation id to [requests](/sdk/Glossary.md#clientrequest).

## Install

#### Node.js

```bash
npm install --save @commercetools/sdk-middleware-correlation-id
```

#### Browser

```html
<script src="https://unpkg.com/@commercetools/sdk-middleware-correlation-id/dist/commercetools-sdk-middleware-correlation-id.umd.min.js"></script>
<script>
  // global: CommercetoolsSdkMiddlewareCorrelationId
</script>
```

## `createCorrelationIdMiddleware(options)`

Creates a [middleware](/sdk/Glossary.md#middleware) to add a correlation id to executed requests.

#### Usage example

```js
import { createClient } from '@commercetools/sdk-client'
import { createCorrelationIdMiddleware } from '@commercetools/sdk-middleware-correlation-id'
import { createAuthMiddleware } from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'

const client = createClient({
  middlewares: [
    createAuthMiddleware({...}),
    createCorrelationIdMiddleware({
      generate: () => `prefix/${uuid()}/postifx`
    }),
    createHttpMiddleware({...}),
  ],
})
```
