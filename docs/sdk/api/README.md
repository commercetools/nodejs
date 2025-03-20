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

Core package to enable executing HTTP [request](/sdk/Glossary#clientrequest). To be used together with middlewares.

- [createClient(options)](/sdk/api/sdkClient#createclient)

## Middlewares

It's up to you to pick whatever middleware fits your needs: you can compose them together, create your own custom versions, choose only one of them (_e.g. you might not need authentication, but you need to send http requests_).

### `sdk-middleware-auth`

Middleware to authenticate the [request](/sdk/Glossary#clientrequest) using one of the supported _auth flows_.

- [createAuthMiddlewareForClientCredentialsFlow(options)](/sdk/api/sdkMiddlewareAuth#createauthmiddlewareforclientcredentialsflowoptions)
- [createAuthMiddlewareForPasswordFlow(options)](/sdk/api/sdkMiddlewareAuth#createauthmiddlewareforpasswordflow)
- [createAuthMiddlewareForRefreshTokenFlow(options)](/sdk/api/sdkMiddlewareAuth#createauthmiddlewareforrefreshtokenflow)
- [createAuthMiddlewareForAnonymousSessionFlow(options)](/sdk/api/sdkMiddlewareAuth#createauthmiddlewareforanonymoussessionflow)
- [createAuthMiddlewareWithExistingToken(authorization, options)](/sdk/api/sdkMiddlewareAuth#createauthmiddlewarewithexistingtoken)

### `sdk-middleware-http`

Middleware to send the actual HTTP [request](/sdk/Glossary#clientrequest).

- [createHttpMiddleware(options)](/sdk/api/sdkMiddlewareHttp#createhttpmiddlewareoptions)
- [getErrorByCode(code)](/sdk/api/sdkMiddlewareHttp#geterrorbycode)

### `sdk-middleware-queue`

Middleware to throttle concurrent [request](/sdk/Glossary#clientrequest) to a certain limit. Useful to reduce concurrent HTTP requests.

- [createQueueMiddleware(options)](/sdk/api/sdkMiddlewareQueue#createqueuemiddlewareoptions)

### `sdk-middleware-logger`

Middleware to log incoming [request](/sdk/Glossary#clientrequest) and [response](/sdk/Glossary#clientresponse) objects.

- [createLoggerMiddleware(options)](/sdk/api/sdkMiddlewareLogger#createloggermiddlewareoptions)

### `sdk-middleware-user-agent`

Middleware to automatically set the `User-Agent` to the [request](/sdk/Glossary#clientrequest).

- [createUserAgentMiddleware(options)](/sdk/api/sdkMiddlewareUserAgent#createuseragentmiddlewareoptions)

### `sdk-middleware-correlation-id`

Middleware to add a correlation id to [requests](/sdk/Glossary#clientrequest).

- [createCorrelationIdMiddleware(options)](/sdk/api/sdkMiddlewareCorrelationId)

## Helpers

Those are optional packages that provides help building the final [request](/sdk/Glossary#clientrequest). You can choose to use them but you don't have to.

### `api-request-builder`

Provides an API to construct a URI for the HTTP API endpoints in a declarative way. Useful for building [request](/sdk/Glossary#clientrequest) `uri` for requests.

- [createRequestBuilder(customServices)](/sdk/api/apiRequestBuilder#createrequestbuildercustomservices)

### `http-user-agent`

Creates a proper HTTP User-Agent. Can be used everywhere.

- [createHttpUserAgent(options)](/sdk/api/httpUserAgent#createhttpuseragentoptions)

### `sync-actions`

Provides an API to construct update actions. Useful for building [request](/sdk/Glossary#clientrequest) `body` for updates.

- [createSyncCategories(actionGroups)](/sdk/api/syncActions#createsynccategoriesactiongroups)
- [createSyncCustomers(actionGroups)](/sdk/api/syncActions#createsynccustomersactiongroups)
- [createSyncInventories(actionGroups)](/sdk/api/syncActions#createsyncinventoriesactiongroups)
- [createSyncProducts(actionGroups)](/sdk/api/syncActions#createsyncproductsactiongroups)
- [createSyncOrders(actionGroups)](/sdk/api/syncActions#createsyncordersactiongroups)
- [createSyncDiscountCodes(actionGroups)](/sdk/api/syncActions#createsyncdiscountcodesactiongroups)
- [createSyncProductDiscounts(actionGroups)](/sdk/api/syncActions#createsyncproductdiscountsactiongroups)
- [createSyncCustomerGroup(actionGroups)](/sdk/api/syncActions#createsynccustomergroupactiongroups)
- [createSyncCartDiscounts(actionGroups)](/sdk/api/syncActions#createsynccartdiscountsactiongroups)
