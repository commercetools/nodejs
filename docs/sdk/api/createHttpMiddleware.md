# `createHttpMiddleware(options)`

Creates a [middleware](/docs/sdk/Glossary,md#middleware) to handle HTTP requests for the commercetools platform API.

#### Named arguments (options)

1. `host` *(String)*: the host of the HTTP API service (default `https://api.sphere.io`)

#### Example

```js
import { createClient } from '@commercetools/sdk-client'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'

const client = createClient({
  middlewares: [
    createHttpMiddleware({
      host: 'https://api.commercetools.com',
    }),
  ],
})
```
