# `sdk-middleware-auth`

Middelware to authenticate the [request](/sdk/Glossary.md#clientrequest) using one of the supported _auth flows_.

## Install

#### Node.js

```bash
npm install --save @commercetools/sdk-middleware-auth
```

#### Browser

```html
<script src="https://unpkg.com/@commercetools/sdk-middleware-auth/dist/commercetools-sdk-middleware-auth.umd.min.js"></script>
<script>// global: CommercetoolsSdkMiddlewareAuth</script>
```

## `createAuthMiddlewareForClientCredentialsFlow(options)`

Creates a [middleware](/sdk/Glossary.md#middleware) to handle authentication for the [Client Credentials Flow](https://docs.commercetools.com/http-api-authorization.html#client-credentials-flow) of the commercetools platform API.

#### Named arguments (options)

1. `host` _(String)_: the host of the OAuth API service
2. `projectKey` _(String)_: the key of the project to assign the default scope to
3. `credentials` _(Object)_: the client credentials for authentication (`clientId`, `clientSecret`)
4. `scopes` _(Array)_: a list of [scopes](https://docs.commercetools.com/http-api-authorization.html#scopes) (default `manage_project:{projectKey}`) to assign to the OAuth token

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
      scopes: ['view_products:test', 'manage_orders:test'],
    }),
  ],
})
```

## `createAuthMiddlewareForPasswordFlow(options)`

Creates a [middleware](/sdk/Glossary.md#middleware) to handle authentication for the [Password Flow](https://docs.commercetools.com/http-api-authorization.html#password-flow) of the commercetools platform API.

#### Named arguments (options)

1. `host` _(String)_: the host of the OAuth API service
2. `projectKey` _(String)_: the key of the project to assign the default scope to
3. `credentials` _(Object)_: the client credentials for authentication (`clientId`, `clientSecret`, `user`)
  * The `user` field is an object containing `username` and `password`. [Sample below](#usage-example-1)
4. `scopes` _(Array)_: a list of [scopes](https://docs.commercetools.com/http-api-authorization.html#scopes) to assign to the OAuth token. _No default scope is sent_

#### Usage example

```js
import { createClient } from '@commercetools/sdk-client'
import { createAuthMiddlewareForPasswordFlow } from '@commercetools/sdk-middleware-auth'

const client = createClient({
  middlewares: [
    createAuthMiddlewareForPasswordFlow({
      host: 'https://auth.commercetools.com',
      projectKey: 'test',
      credentials: {
        clientId: '123',
        clientSecret: 'secret',
        user: {
          username: string,
          password: string,
        },
      },
      scopes: ['view_products:test', 'manage_orders:test'],
    }),
  ],
})
```

## `createAuthMiddlewareForAnonymousSessionFlow(options)`

Creates a [middleware](/sdk/Glossary.md#middleware) to handle authentication for the [Anonymous Session Flow](https://docs.commercetools.com/http-api-authorization.html#tokens-for-anonymous-sessions) of the commercetools platform API.

#### Named arguments (options)

1. `host` _(String)_: the host of the OAuth API service
2. `projectKey` _(String)_: the key of the project to assign the default scope to
3. `credentials` _(Object)_: the client credentials for authentication (`clientId`, `clientSecret`, `anonymousId`)
4. `scopes` _(Array)_: a list of [scopes](https://docs.commercetools.com/http-api-authorization.html#scopes) (default `manage_project:{projectKey}`) to assign to the OAuth token

#### Usage example

```js
import { createClient } from '@commercetools/sdk-client'
import { createAuthMiddlewareForAnonymousSessionFlow } from '@commercetools/sdk-middleware-auth'

const client = createClient({
  middlewares: [
    createAuthMiddlewareForAnonymousSessionFlow({
      host: 'https://auth.commercetools.com',
      projectKey: 'test',
      credentials: {
        clientId: '123',
        clientSecret: 'secret',
        anonymousId: 'unique-id-of-customer-not-required',
      },
      scopes: ['view_products:test', 'manage_orders:test'],
    }),
  ],
})
```

## `createAuthMiddlewareForRefreshTokenFlow(options)`

Creates a [middleware](/sdk/Glossary.md#middleware) to handle authentication for the [Refresh Token Flow](https://docs.commercetools.com/http-api-authorization.html#refresh-token-flow) of the commercetools platform API.

#### Named arguments (options)

1. `host` _(String)_: the host of the OAuth API service
2. `projectKey` _(String)_: the key of the project to assign the default scope to
3. `credentials` _(Object)_: the client credentials for authentication (`clientId`, `clientSecret`)
4. `refreshToken` _(String)_: refreshToken from the API to use to fetch new token.

#### Usage example

```js
import { createClient } from '@commercetools/sdk-client'
import { createAuthMiddlewareForRefreshTokenFlow } from '@commercetools/sdk-middleware-auth'

const client = createClient({
  middlewares: [
    createAuthMiddlewareForRefreshTokenFlow({
      host: 'https://auth.commercetools.com',
      projectKey: 'test',
      credentials: {
        clientId: '123',
        clientSecret: 'secret',
      },
      refreshToken: 'foobar123',
    }),
  ],
})
```

## `createAuthMiddlewareWithExistingToken(options)`

Creates a [middleware](/sdk/Glossary.md#middleware) that attaches a known access token `Authorization` header.

#### Named arguments (options)

`options` can be a string or an object. If `options` is a _(String)_, it is treated as the access token with other possible options set to their defaults. If `options` is an _(Object)_, it can have the following properties:

1. `token` _(String)_: the access token to be attached to the request
2. `tokenType` _(String)_: the type of the access token (Default: `Bearer`)
3. `force` _(Boolean)_: if set to true, existing Authorization header (if any) in the request will be overridden with the supplied access token (Default: `true`)

```js
import { createClient } from '@commercetools/sdk-client'
import { createAuthMiddlewareWithExistingToken } from '@commercetools/sdk-middleware-auth'

const client = createClient({
  middlewares: [
    createAuthMiddlewareWithExistingToken({
      token: 'my-access-token',
      tokenType: 'Bearer',
      force: true,
    }),
  ],
})
```
