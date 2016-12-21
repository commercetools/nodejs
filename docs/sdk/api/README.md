# API Reference

This section documents the SDK packages APIs.

### `sdk-client`

* [createClient(options)](createClient.md)

### `sdk-middleware-auth`

* [createAuthMiddlewareForClientCredentialsFlow(options)](createAuthMiddlewareForClientCredentialsFlow.md)
* [createAuthMiddlewareForPasswordFlow(options)](createAuthMiddlewareForPasswordFlow.md)
* [createAuthMiddlewareForRefreshTokenFlow(options)](createAuthMiddlewareForRefreshTokenFlow.md)
* [createAuthMiddlewareForAnonymousSessionFlow(options)](createAuthMiddlewareForAnonymousSessionFlow.md)

### `sdk-middleware-http`

* [createHttpMiddleware(options)](createHttpMiddleware.md)
* [getErrorByCode(code)](getErrorByCode.md)

### `sdk-middleware-queue`

* [createQueueMiddleware(options)](createQueueMiddleware.md)

### `api-request-builder`

* [createRequestBuilder(options)](createRequestBuilder.md)


## Importing

Every function described above is a top-level export. You can import any of them like this:

#### ES6

```js
import { createClient } from '@commercetools/sdk-client'
```

#### ES5 (CommonJS)

```js
var createClient = require('@commercetools/sdk-client').createClient
```

#### ES5 (UMD build)

```js
var createClient = CommercetoolsSdkClient.createClient
