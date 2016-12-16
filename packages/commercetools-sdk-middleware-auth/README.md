# commercetools-sdk-middlware-auth

Auth middlewares collection for usage with `@commercetools/sdk-client`

## Supported middleware types
- `client-credentials-flow` ([link](http://dev.commercetools.com/http-api-authorization.html#client-credentials-flow))
- `password-flow` ([link](http://dev.commercetools.com/http-api-authorization.html#password-flow)) _(TBD)_
- `refresh-token-flow` ([link](http://dev.commercetools.com/http-api-authorization.html#refresh-token-flow)) _(TBD)_
- `anonymous-session-flow` ([link](http://dev.commercetools.com/http-api-authorization.html#tokens-for-anonymous-sessions)) _(TBD)_

## Usage

```js
import { createClient } from '@commercetools/sdk-client'
import {
  createAuthMiddlewareForClientCredentialsFlow,
} from '@commercetools/sdk-middleware-auth'

const middlewareOptions = {
  host: 'https://auth.commercetools.co', // default https://auth.sphere.io
  projectKey: 'test', // required
  credentials: {
    clientId: '123', // required
    clientSecret: 'secret', // required
  },
  scopes: [ // default `manage_project:${projectKey}`
    'view_products:test',
    'manage_types:test',
  ],
}
const authMiddleware = createAuthMiddlewareForClientCredentialsFlow(
  middlewareOptions,
)

const client = createClient({
  middlewares: [authMiddleware],
})
```
