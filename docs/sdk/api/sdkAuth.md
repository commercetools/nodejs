# `sdk-auth`

Auth module for different [authorization flows](https://docs.commercetools.com/http-api-authorization.html#authorization-flows) of commercetools platform API

## Install

#### Node.js

```bash
npm install --save @commercetools/sdk-auth
```

#### Browser

```html
<script src="https://unpkg.com/@commercetools/sdk-auth/dist/commercetools-sdk-auth.umd.min.js"></script>
<script>// global: CommercetoolsSdkAuth</script>
```

## Initialization

Creates an auth client to handle authorization against the commercetools platform API.

#### Named arguments (options)

1.  `host` _(String)_: the host of the OAuth API service
2.  `projectKey` _(String)_: the key of the project to assign the default scope to
3.  `credentials` _(Object)_: the client credentials for authentication (`clientId`, `clientSecret`)
4.  `scopes` _(Array)_: a list of [scopes](https://docs.commercetools.com/http-api-authorization.html#scopes) (default `manage_project:{projectKey}`) to assign to the OAuth token

#### Usage example

```js
import SdkAuth from '@commercetools/sdk-auth'

const authClient = new SdkAuth({
  host: 'https://auth.commercetools.com',
  projectKey: 'test',
  credentials: {
    clientId: '123',
    clientSecret: 'secret',
  },
  scopes: ['view_products:test', 'manage_orders:test'],
})
```

## Authorization Flows

### Client Credentials Flow

Fetches access token using [Client Credentials Flow](https://docs.commercetools.com/http-api-authorization.html#client-credentials-flow) from the commercetools platform API.

#### Usage example

```js
await authClient.clientCredentialsFlow()
// {
// 	 "access_token": "...",
// 	 "expires_in": 172800,
// 	 "scope": "manage_project:{projectKey}",
// 	 "token_type": "Bearer",
// }
```

### Password Flow

Fetches access token using [Password Flow](https://docs.commercetools.com/http-api-authorization.html#password-flow) from the commercetools platform API.

#### Named arguments (options)

1.  `username` _(String)_: customer email
2.  `password` _(String)_: customer password

#### Usage example

```js
await authClient.passwordFlow({
  username: '...',
  password: '...',
})
// {
// 	 "access_token": "...",
// 	 "expires_in": 172800,
// 	 "scope": "manage_project:{projectKey}",
// 	 "refresh_token": "...",
// 	 "token_type": "Bearer",
// }
```

### Refresh Token Flow

Fetches a new access token using [Refresh Token Flow](https://docs.commercetools.com/http-api-authorization.html#refresh-token-flow) from the commercetools platform API.

#### Argument

1.  `token` _(String)_: `refresh_token` obtained from previous authorization process

#### Usage example

```js
await authClient.refreshTokenFlow('refreshToken')
// {
// 	 "access_token": "...",
// 	 "token_type": "Bearer",
//   "expires_in": 172800,
// 	 "scope": "manage_project:{projectKey}",
// }
```

### Anonymous Session Flow

Fetches access token using [Anonymous Session Flow](https://docs.commercetools.com/http-api-authorization.html#tokens-for-anonymous-sessions) from the commercetools platform API.

#### Argument

1.  `anonymousId` _(Number)_: Id parameter which will be associated with generated access token. If not provided, API will autogenerate its own id.

#### Usage example

```js
await authClient.anonymousFlow(1)
// {
// 	 "access_token": "...",
// 	 "expires_in": 172800,
// 	 "scope": "manage_project:{projectKey}",
// 	 "refresh_token": "...",
// 	 "token_type": "Bearer"
// }
```

### Token Introspection

Fetches info about `access_token` using [Token Introspection](https://docs.commercetools.com/http-api-authorization.html#oauth2-token-introspection) from the commercetools platform API.

#### Argument

1.  `token` _(Number)_: access token which should be introspected.

#### Usage example

```js
await authClient.introspectToken('valid_token')
// {
// 	 "active": true,
// 	 "scope": "manage_project:{projectKey}",
// 	 "exp": 1539430105805
// }

await authClient.introspectToken('invalid_token')
// {
//   "active":false
// }
```
