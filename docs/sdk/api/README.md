# API Reference

This section documents the SDK packages APIs.

## Core

### `sdk-client`
Core package to enable executing HTTP [request](/docs/sdk/Glossary.md#clientrequest). To be used together with middlewares.

* [createClient(options)](createClient.md)


## Middlewares
It's up to you to pick whatever middleware fits your needs: you can compose them together, create your own custom versions, choose only one of them (_e.g. you might not need authentication, but you need to send http requests_).

### `sdk-middleware-auth`
Middelware to authenticate the [request](/docs/sdk/Glossary.md#clientrequest) using one of the supported _auth flows_.

* [createAuthMiddlewareForClientCredentialsFlow(options)](createAuthMiddlewareForClientCredentialsFlow.md)
* [createAuthMiddlewareForPasswordFlow(options)](createAuthMiddlewareForPasswordFlow.md)
* [createAuthMiddlewareForRefreshTokenFlow(options)](createAuthMiddlewareForRefreshTokenFlow.md)
* [createAuthMiddlewareForAnonymousSessionFlow(options)](createAuthMiddlewareForAnonymousSessionFlow.md)

### `sdk-middleware-http`
Middelware to send the actual HTTP [request](/docs/sdk/Glossary.md#clientrequest).

* [createHttpMiddleware(options)](createHttpMiddleware.md)
* [getErrorByCode(code)](getErrorByCode.md)

### `sdk-middleware-queue`
Middelware to throttle concurrent [request](/docs/sdk/Glossary.md#clientrequest) to a certain limit. Useful to reduce concurrent HTTP requests.

* [createQueueMiddleware(options)](createQueueMiddleware.md)

### `sdk-middleware-logger`
Middelware to log incoming [request](/docs/sdk/Glossary.md#clientrequest) and [response](/docs/sdk/Glossary.md#clientrequest) objects.

* [createLoggerMiddleware(options)](createLoggerMiddleware.md)

### `sdk-middleware-user-agent`
Middelware to automatically set the `User-Agent` to the [request](/docs/sdk/Glossary.md#clientrequest).

* [createUserAgentMiddleware(options)](createUserAgentMiddleware.md)


## Helpers
Those are optional packages that provides help building the final [request](/docs/sdk/Glossary.md#clientrequest). You can choose to use them but you don't have to.

### `api-request-builder`
Provides an API to construct a URI for the HTTP API endpoints in a declarative way. Useful for building [request](/docs/sdk/Glossary.md#clientrequest) `uri` for requests.

* [createRequestBuilder(customServices)](createRequestBuilder.md)

### `http-user-agent`
Creates a proper HTTP User-Agent. Can be used everywhere.

* [createHttpUserAgent(options)](createHttpUserAgent.md)

### `sync-actions`
Provides an API to construct update actions. Useful for building [request](/docs/sdk/Glossary.md#clientrequest) `body` for updates.

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
