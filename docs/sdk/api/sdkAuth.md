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
<script>
  // global: CommercetoolsSdkAuth
</script>
```

## Initialization

Creates an auth client to handle authorization against the commercetools platform API.

#### Named arguments (options)

1.  `host` _(String)_: the host of the OAuth API service
2.  `projectKey` _(String)_: the key of the project to assign the default scope to (optional).
3.  `authType` _(String)_: Auth type performed in the auth request (default `Basic`).
4.  `token` _(String)_: A `token` which will be sent in `Authorization` header. If not provided, we calculate it from credentials.
5.  `disableRefreshToken` _(boolean)_: whether the API should generate a refresh token
6.  `credentials` _(Object)_: the client credentials for authentication (`clientId`, `clientSecret`)
7.  `scopes` _(Array)_: a list of [scopes](https://docs.commercetools.com/http-api-authorization.html#scopes) (default `manage_project:{projectKey}`) to assign to the OAuth token
8.  `fetch` _(Function)_: A `fetch` implementation which can be e.g. `node-fetch` or `unfetch` but also the native browser `fetch` function. Only needs be be passed if not globally available (e.g. through `isomorphic-fetch`)

#### Usage example

```js
import SdkAuth from '@commercetools/sdk-auth'
import fetch from 'node-fetch'

const authClient = new SdkAuth({
  host: 'https://auth.commercetools.com',
  projectKey: 'test',
  disableRefreshToken: false,
  credentials: {
    clientId: '123',
    clientSecret: 'secret',
  },
  scopes: ['view_products:test', 'manage_orders:test'],
  fetch,
})

const token = await authClient.clientCredentialsFlow()
```

**NOTE:** All auth flow methods can accept also an additional configuration for overriding config properties which were set during object creation.

```js
const token = await authClient.clientCredentialsFlow({
  scopes: ['view_products:test', 'manage_orders:test'],
})
```

## Authorization Flows

### Client Credentials Flow

Fetches access token using [Client Credentials Flow](https://docs.commercetools.com/http-api-authorization.html#client-credentials-flow) from the commercetools platform API.

#### Argument

1.  `config` _(Object)_: Optional configuration which can override config properties given when building `authClient` object.

#### Usage example

```js
await authClient.clientCredentialsFlow()
// {
// 	 "access_token": "...",
// 	 "expires_in": 172800, // lifetime of access_token in seconds
// 	 "expires_at": 1542287072875, // UTC datetime in unix timestamp format when the token expires
// 	 "scope": "manage_project:{projectKey}",
// 	 "token_type": "Bearer",
// }
```

### Customer Password Flow

Fetches access token using [Password Flow](https://docs.commercetools.com/http-api-authorization.html#password-flow) from the commercetools platform API.

#### Argument

1.  `credentials` _(Object)_: Object with named arguments containing user credentials
    - `username` _(String)_: customer email
    - `password` _(String)_: customer password
2.  `config` _(Object)_: Optional configuration which can override config properties given when building `authClient` object.

#### Usage example

```js
await authClient.customerPasswordFlow(
  {
    username: '...',
    password: '...',
  },
  {
    disableRefreshToken: false,
  }
)
// {
// 	 "access_token": "...",
// 	 "expires_in": 172800,
// 	 "expires_at": 1542287072875,
// 	 "scope": "manage_project:{projectKey}",
// 	 "token_type": "Bearer",
//
// 	 "refresh_token" is missing because it was disabled in configuration
//
// }
```

### Client Password Flow

Same as `customerPasswordFlow` but performs auth request against `/oauth/token` endpoint instead.

#### Argument

1.  `credentials` _(Object)_: Object with named arguments containing user credentials
    - `username` _(String)_: client email
    - `password` _(String)_: client password
2.  `config` _(Object)_: Optional configuration which can override config properties given when building `authClient` object.

#### Usage example

```js
await authClient.clientPasswordFlow({
  username: '...',
  password: '...',
})
// {
// 	 "access_token": "...",
// 	 "expires_in": 172800,
// 	 "expires_at": 1542287072875,
// 	 "scope": "manage_project:{projectKey}",
// 	 "refresh_token": "...",
// 	 "token_type": "Bearer",
// }
```

### Refresh Token Flow

Fetches a new access token using [Refresh Token Flow](https://docs.commercetools.com/http-api-authorization.html#refresh-token-flow) from the commercetools platform API.

#### Argument

1.  `token` _(String)_: `refresh_token` obtained from previous authorization process
2.  `config` _(Object)_: Optional configuration which can override config properties given when building `authClient` object.

#### Usage example

```js
await authClient.refreshTokenFlow('refreshToken')
// {
// 	 "access_token": "...",
// 	 "token_type": "Bearer",
//   "expires_in": 172800,
// 	 "expires_at": 1542287072875,
// 	 "scope": "manage_project:{projectKey}",
// }
```

### Anonymous Session Flow

Fetches access token using [Anonymous Session Flow](https://docs.commercetools.com/http-api-authorization.html#tokens-for-anonymous-sessions) from the commercetools platform API.

#### Argument

1.  `anonymousId` _(Number)_: Id parameter which will be associated with generated access token. If not provided, API will autogenerate its own id.
2.  `config` _(Object)_: Optional configuration which can override config properties given when building `authClient` object.

#### Usage example

```js
await authClient.anonymousFlow(1)
// {
// 	 "access_token": "...",
// 	 "expires_in": 172800,
// 	 "expires_at": 1542287072875,
// 	 "scope": "manage_project:{projectKey}",
// 	 "refresh_token": "...",
// 	 "token_type": "Bearer"
// }
```

### Custom Flow

Runs a custom request based on given configuration.

#### Argument

1.  `host` _(String)_: the host of the OAuth API service
2.  `uri` _(String)_: path to login endpoint
3.  `credentials` _(Object)_: Optional object containing username and password for password authentication
4.  `body` _(String)_: request body formatted as `application/x-www-form-urlencoded` content type, see example [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST#Example).
5.  `authType` _(String)_: Auth type performed in the auth request (default `Basic`).
6.  `token` _(String)_: A `token` which will be sent in `Authorization` header. If not provided, we calculate it from credentials.
7.  `headers` _(Object)_: Optional object containing headers which should be sent in auth request.

#### Usage example

```js
await authClient.customFlow({
  host: 'https://custom.url',
  uri: '/login',
  body: JSON.stringify({
    username: 'username',
    password: 'password',
  }),
  headers: {
    'Content-Type': 'application/json',
  },
})
// {
// 	 ...API response
// }
```

### Token Introspection

Fetches info about `access_token` using [Token Introspection](https://docs.commercetools.com/http-api-authorization.html#oauth2-token-introspection) from the commercetools platform API.

#### Argument

1.  `token` _(Number)_: access token which should be introspected.
2.  `config` _(Object)_: Optional configuration which can override config properties given when building `authClient` object.

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

### Token Provider

Token provider is a special class which watches over `access_token` and refreshes it using `sdkAuth.refreshTokenFlow()` method if it is expired.

#### Constructor argument

1.  `options` _(Object)_: Configuration object
    - `sdkAuth` - SdkAuth object initialized with project credentials
    - `onTokenInfoChanged` - Optional function which is being called when the tokenInfo gets changed (manually or by refresh process)
    - `onTokenInfoRefreshed` - Optional function which is being called when the tokenInfo gets refreshed
2.  `tokenInfo` _(Object)_: Optional parameter containing token information loaded from one of auth flows (`{ access_token, refresh_token, expires_at }`)

#### Usage example

```js
import SdkAuth, { TokenProvider } from '@commercetools/sdk-auth'

const authClient = new SdkAuth({
  // .. init SdkAuth
})

// get tokenInfo from authorization flow
const tokenInfo = await authClient.clientPasswordFlow({
  username: '...',
  password: '...',
})

// initiate TokenProvider
const tokenProvider = new TokenProvider(
  {
    sdkAuth,
    onTokenInfoChanged: newTokenInfo =>
      console.log('Token info was changed', newTokenInfo),
  },
  tokenInfo
)

// tokenInfo can be provided also later using "setTokenInfo()" function
// tokenProvider.setTokenInfo(tokenInfo)

// get currently used token info
// const usedTokenInfo = tokenProvider.getTokenInfo()

// check access_token validity, refresh if needed and return it
const accessToken = await tokenProvider.getToken()
```
