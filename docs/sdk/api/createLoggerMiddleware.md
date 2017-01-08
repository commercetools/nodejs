# `createLoggerMiddleware(options)`

> From package [@commercetools/sdk-middleware-logger](/docs/sdk/api/README.md#sdk-middleware-logger).

Creates a [middleware](/docs/sdk/Glossary.md#middleware) to log request and response objects being executed.

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
