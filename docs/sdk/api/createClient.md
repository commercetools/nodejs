# `createClient(options)`

> From package [@commercetools/sdk-client](/docs/sdk/api/README.md#sdk-client).

Creates a [client](/docs/sdk/Glossary.md#client) instance.

#### Named arguments (options)

1. `middlewares` *(Array)*: A list of [middlewares](/docs/sdk/Middlewares.md) to be used within this client. **The order of the middlewares is really important!** (e.g. it does not make sense to put the `http` middleware *before* the `auth` middleware).

#### Usage example

```js
import { createClient } from '@commercetools/sdk-client'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'

const client = createClient({
  middlewares: [
    createHttpMiddleware(),
  ],
})
const request = {
  uri: '/foo/bar',
  method: 'GET',
  headers: {
    Authorization: 'Bearer xxx',
  },
}

client.execute(request)
.then(result => ...)
.catch(error => ...)
```
