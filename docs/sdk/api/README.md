# API Reference

This section documents the SDK packages APIs.

## Importing

Every function described in each package below is a top-level export. You can import any of them like this:

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
// We recommend to use https://unpkg.com as CDN
var createClient = CommercetoolsSdkClient.createClient
```

## Core

### `sdk-client`

Core package to enable executing HTTP [request](/sdk/Glossary.md#clientrequest). To be used together with middlewares.

* [createClient(options)](/sdk/api/sdkClient.md#createclient)

## Middlewares

It's up to you to pick whatever middleware fits your needs: you can compose them together, create your own custom versions, choose only one of them (_e.g. you might not need authentication, but you need to send http requests_).

### `sdk-middleware-auth`

Middelware to authenticate the [request](/sdk/Glossary.md#clientrequest) using one of the supported _auth flows_.

* [createAuthMiddlewareForClientCredentialsFlow(options)](/sdk/api/sdkMiddlewareAuth.md#createauthmiddlewareforclientcredentialsflowoptions)
* [createAuthMiddlewareForPasswordFlow(options)](/sdk/api/sdkMiddlewareAuth.md#createauthmiddlewareforpasswordflow)
* [createAuthMiddlewareForRefreshTokenFlow(options)](/sdk/api/sdkMiddlewareAuth.md#createauthmiddlewareforrefreshtokenflow)
* [createAuthMiddlewareForAnonymousSessionFlow(options)](/sdk/api/sdkMiddlewareAuth.md#createauthmiddlewareforanonymoussessionflow)
* [createAuthMiddlewareWithExistingToken(authorization, options)](/sdk/api/sdkMiddlewareAuth.md#createauthmiddlewarewithexistingtoken)

### `sdk-middleware-http`

Middelware to send the actual HTTP [request](/sdk/Glossary.md#clientrequest).

* [createHttpMiddleware(options)](/sdk/api/sdkMiddlewareHttp.md#createhttpmiddlewareoptions)
* [getErrorByCode(code)](/sdk/api/sdkMiddlewareHttp.md#geterrorbycode)

### `sdk-middleware-queue`

Middelware to throttle concurrent [request](/sdk/Glossary.md#clientrequest) to a certain limit. Useful to reduce concurrent HTTP requests.

* [createQueueMiddleware(options)](/sdk/api/sdkMiddlewareQueue.md#createqueuemiddlewareoptions)

### `sdk-middleware-logger`

Middelware to log incoming [request](/sdk/Glossary.md#clientrequest) and [response](/sdk/Glossary.md#clientrequest) objects.

* [createLoggerMiddleware(options)](/sdk/api/sdkMiddlewareLogger.md#createloggermiddlewareoptions)

### `sdk-middleware-user-agent`

Middelware to automatically set the `User-Agent` to the [request](/sdk/Glossary.md#clientrequest).

* [createUserAgentMiddleware(options)](/sdk/api/sdkMiddlewareUserAgent.md#createuseragentmiddlewareoptions)

### `sdk-middleware-correlation-id`

Middelware to add a correlation id to [requests](/sdk/Glossary.md#clientrequest).

* [createCorrelationIdMiddleware(options)](/sdk/api/sdkMiddlewareCorrelationId.md)

## Helpers

Those are optional packages that provides help building the final [request](/sdk/Glossary.md#clientrequest). You can choose to use them but you don't have to.

### `api-request-builder`

Provides an API to construct a URI for the HTTP API endpoints in a declarative way. Useful for building [request](/sdk/Glossary.md#clientrequest) `uri` for requests.

* [createRequestBuilder(customServices)](/sdk/api/apiRequestBuilder.md#createrequestbuildercustomservices)

### `http-user-agent`

Creates a proper HTTP User-Agent. Can be used everywhere.

* [createHttpUserAgent(options)](/sdk/api/httpUserAgent.md#createhttpuseragentoptions)

### `sync-actions`

Provides an API to construct update actions. Useful for building [request](/sdk/Glossary.md#clientrequest) `body` for updates.

* [createSyncCategories(actionGroups)](/sdk/api/syncActions.md#createsynccategoriesactiongroups)
* [createSyncCustomers(actionGroups)](/sdk/api/syncActions.md#createsynccustomersactiongroups)
* [createSyncInventories(actionGroups)](/sdk/api/syncActions.md#createsyncinventoriesactiongroups)
* [createSyncProducts(actionGroups)](/sdk/api/syncActions.md#createsyncproductsactiongroups)
* [createSyncOrders(actionGroups)](/sdk/api/syncActions.md#createsyncordersactiongroups)
* [createSyncDiscountCodes(actionGroups)](/sdk/api/syncActions.md#createsyncdiscountcodesactiongroups)
* [createSyncProductDiscounts(actionGroups)](/sdk/api/syncActions.md#createsyncproductdiscountsactiongroups)
* [createSyncCustomerGroup(actionGroups)](/sdk/api/syncActions.md#createsynccustomergroupactiongroups)
* [createSyncCartDiscounts(actionGroups)](/sdk/api/syncActions.md#createsynccartdiscountsactiongroups)
