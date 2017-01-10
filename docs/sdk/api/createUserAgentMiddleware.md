# `createUserAgentMiddleware(options)`

> From package [@commercetools/sdk-middleware-user-agent](/docs/sdk/api/README.md#sdk-middleware-user-agent).

Creates a [middleware](/docs/sdk/Glossary.md#middleware) to append the `User-Agent` HTTP header to the request.

#### Named arguments (options)

1. `name` *(String)*: the name of the library / package / application using the SDK (optional)
2. `version` *(String)*: the version of the library / package / application using the SDK (optional)
3. `url` *(String)*: the url of the library / package / application using the SDK (optional)


#### Usage example

```js
import { createClient } from '@commercetools/sdk-client'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import { createAuthMiddleware } from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'

const userAgentMiddleware = createUserAgentMiddleware(),
const client = createClient({
  middlewares: [
    createAuthMiddleware({...}),
    createUserAgentMiddleware({
      name: 'my-awesome-library',
      version: '1.0.0',
      url: 'https://github.com/my-company/my-awesome-library'
    }),
    createHttpMiddleware({...}),
  ],
})
```
