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

### `sdk-middleware-logger`

* [createLoggerMiddleware(options)](createLoggerMiddleware.md)

### `sdk-middleware-user-agent`

* [createUserAgentMiddleware(options)](createUserAgentMiddleware.md)

### `api-request-builder`

* [createRequestBuilder(customServices)](createRequestBuilder.md)

### `http-user-agent`

* [createHttpUserAgent(options)](createHttpUserAgent.md)

### `sync-actions`

* [createSyncCategories(actionGroups)](createSyncCategories.md)
* [createSyncCustomers(actionGroups)](createSyncCustomers.md)
* [createSyncInventories(actionGroups)](createSyncInventories.md)
* [createSyncProducts(actionGroups)](createSyncProducts.md)
* [createSyncOrders(actionGroups)](createSyncOrders.md)


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
```
