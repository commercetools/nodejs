# `createAuthMiddlewareForClientCredentialsFlow(options)`

> From package [@commercetools/sdk-middleware-auth](/docs/sdk/api/README.md#sdk-middleware-auth).

Creates a [middleware](/docs/sdk/Glossary.md#middleware) to handle authentication for the [Client Credentials Flow](http://dev.commercetools.com/http-api-authorization.html#client-credentials-flow) of the commercetools platform API.

#### Named arguments (options)

1. `host` *(String)*: the host of the OAuth API service (default `https://auth.sphere.io`)
2. `projectKey` *(String)*: the key of the project to assign the default scope to
3. `credentials` *(Object)*: the client credentials for authentication (`clientId`, `clientSecret`)
4. `scopes` *(Array)*: a list of [scopes](http://dev.commercetools.com/http-api-authorization.html#scopes) (default `manage_project:{projectKey}`) to assign to the OAuth token


#### Usage example

```js
import { createClient } from '@commercetools/sdk-client'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'

const client = createClient({
  middlewares: [
    createAuthMiddlewareForClientCredentialsFlow({
      host: 'https://auth.commercetools.com',
      projectKey: 'test',
      credentials: {
        clientId: '123',
        clientSecret: 'secret',
      },
      scopes: [
        'view_products:test',
        'manage_orders:test',
      ],
    }),
  ],
})
```
