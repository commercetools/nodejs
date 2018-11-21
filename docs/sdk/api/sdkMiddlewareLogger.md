# `sdk-middleware-logger`

Middleware to log incoming [request](/sdk/Glossary.md#clientrequest) and [response](/sdk/Glossary.md#clientrequest) objects.

## Install

#### Node.js

```bash
npm install --save @commercetools/sdk-middleware-logger
```

#### Browser

```html
<script src="https://unpkg.com/@commercetools/sdk-middleware-logger/dist/commercetools-sdk-middleware-logger.umd.min.js"></script>
<script>
  // global: CommercetoolsSdkMiddlewareLogger
</script>
```

## `createLoggerMiddleware(options)`

Creates a [middleware](/sdk/Glossary.md#middleware) to log request and response objects being executed.

#### Usage example

```js
import { createClient } from '@commercetools/sdk-client'
import { createLoggerMiddleware } from '@commercetools/sdk-middleware-logger'
import { createAuthMiddleware } from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'

const client = createClient({
  middlewares: [
    createAuthMiddleware({...}),
    // Log the request / response at this point in the middleware chain, before it gets to the http-middleware
    createLoggerMiddleware(),
    createHttpMiddleware({...}),
    // Log the request / response after it's being handled by the http-middleware
    createLoggerMiddleware(),
  ],
})
```
