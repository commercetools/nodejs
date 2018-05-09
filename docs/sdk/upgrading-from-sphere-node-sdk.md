# Upgrading from `sphere-node-sdk`

If you're still using the [sphere-node-sdk](https://github.com/sphereio/sphere-node-sdk), this guide will help you migrating to the new SDK. Overall it's a completely new _library_, although some of APIs didn't change much.

> The SDK officially supports `node --version` starting from `4`.
> Older versions might still work but we don't support them. Use them at your own risk or _upgrade_ node version as well.

## Table of Contents

* [Dependencies](#dependencies)
  * [Example migration](#example-migration)
* [API differences](#api-differences)
  * [Sync actions](#sync-actions)
  * [Request builder](#request-builder)
  * [SphereClient options](#sphereclient-options)
* [Implicit benefits](#implicit-benefits)
  * [Auth flows](#auth-flows)
  * [Always 100% compatibility with new API features](#always-100-compatibility-with-new-api-features)

### Dependencies

The SDK is _not a single package_ anymore, it's [composed of different packages](/sdk/api/README.md).
It's up to you to _pick only the packages that you need_, many of them are optional and can also be replaced with custom implementations.

> All new packages are now [scoped](https://docs.npmjs.com/misc/scope) to `@commercetools`. This is mainly to have better package names and to have them all under _commercetools_ organization.

The _core_ package is the `@commercetools/sdk-client`. **Using it alone is useless**, you need to provide at least a [middleware](/sdk/api/README.md#middlewares) (e.g. `@commercetools/sdk-middleware-http`).

If you aim to have all the functionalities of the `sphere-node-sdk`, you probably need the following packages:

* `@commercetools/sdk-client`
* `@commercetools/sdk-middleware-auth`
* `@commercetools/sdk-middleware-http`
* `@commercetools/sdk-middleware-queue`
* `@commercetools/sdk-middleware-logger`
* `@commercetools/sdk-middleware-user-agent`
* `@commercetools/api-request-builder`
* `@commercetools/sync-actions`

#### Example migration

```js
// before
import SphereClient, { ProductSync } from 'sphere-node-sdk'
const client = new SphereClient({
  config: {
    project_key: 'my-project',
    client_id: '123',
    client_secret: 'secret',
  },
  user_agent: 'sphere-node-sdk',
  host: 'api.commercetools.com',
  protocol: 'https',
  oauth_host: 'auth.commercetools.com',
  oauth_protocol: 'https',
})
const sync = new ProductSync()
const updateActions = sync.buildActions(/* newProduct, existingProduct */)
client.products
  .byId('1')
  .expand('productType')
  .update({ version: 1, actions: updateActions })
  .then(/* result */)
  .catch(/* error */)

// after
import { createClient } from '@commercetools/sdk-client'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createSyncProducts } from '@commercetools/sync-actions'

const client = createClient({
  // The order of the middlewares is important !!!
  middlewares: [
    createAuthMiddlewareForClientCredentialsFlow({
      host: 'https://auth.commercetools.com',
      projectKey: 'my-project',
      credentials: {
        clientId: '123',
        clientSecret: 'secret',
      },
    }),
    createQueueMiddleware({ concurrency: 10 }),
    createHttpMiddleware({ host: 'https://api.commercetools.com' }),
    createHttpUserAgent({
      libraryName: 'my-library',
      libraryVersion: '1.0.0',
      contactUrl: 'https://github.com/commercetools/nodejs',
      contactEmail: 'npmjs@commercetools.com',
    }),
  ],
})
const service = createRequestBuilder({ projectKey: 'my-project' }).products
const uri = service
  .byId('1')
  .expand('productType')
  .build()
const sync = createSyncProducts()
const updateActions = sync.buildActions(/* newProduct, existingProduct */)
const updateRequest = {
  uri,
  method: 'POST',
  body: { version: 1, actions: updateActions },
}
client
  .execute(updateRequest)
  .then(/* result */)
  .catch(/* error */)
```

### API differences

#### Sync actions

In the `sphere-node-sdk` the sync utils were exported within the same package.<br/>
In the new SDK they are scoped in their own module and they implement only 1 main function: `buildActions`.

```js
// before
import { ProductSync } from 'sphere-node-sdk'
const sync = new ProductSync()
const payload = sync.buildActions(...).getUpdatePayload()

// after
import { createSyncProducts } from '@commercetools/sync-actions'
const sync = createSyncProducts()
const actions = sync.buildActions(...)
const payload = { version: 1, actions }
```

#### Request builder

In the `sphere-node-sdk` you were building the request for each service by chaining different commands and executing `fetch`, `update`, etc at the end.<br/>
In the new SDK, we saw that the [`sdk-client`](/sdk/api/README.md#sdk-client) simply accepts a [request object](/sdk/Glossary.md#clientrequest). The `uri` parameter can be simply defined manually or can be generated using the _request builder_. This has basically the same API as the `sphere-node-sdk`.

```js
// before
import SphereClient from 'sphere-node-sdk'
const client = new SphereClient({ config: { projectKey: 'my-project' } })
client.channels.perPage(10).fetch()


// after
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
const client = createClient({ middlewares: [...] })
client.execute({
  // manually define the request URI
  uri: '/my-project/channels?limit=10',
  method: 'GET',
})

const channels = createRequestBuilder({ projectKey: 'my-project' }).channels
client.execute({
  // define the request URI using the request builder
  uri: channels.perPage(10).build(),
  method: 'GET',
})
```

Additionally, all _services_ provided by the _request builder_ are defined using [features](/sdk/api/apiRequestBuilder.md#arguments). This allows to configure a service with only the _features_ or _functions_ that the service supports.
The package allows also to pass [custom services](/sdk/api/apiRequestBuilder.md#createrequestbuildercustomservices).

```js
import {
  createRequestBuilder,
  features,
} from '@commercetools/api-request-builder'
const customServices = {
  users: {
    type: 'users',
    endpoint: '/users',
    features: [features.query, features.queryOne],
  },
}
const requestBuilder = createRequestBuilder(
  { projectKey: 'my-project' },
  customServices
)
requestBuilder.users.byId('1').build()
```

#### SphereClient options

In the `sphere-node-sdk` all sorts of configuration options were passed as a big object to the `SphereClient` contructor.<br/>
In the new SDK all those options are split across the [middlewares](/sdk/api/README.md#middlewares). See [example](#example-migration) above.

### Implicit benefits

#### Auth flows

In the `sphere-node-sdk` the way of getting an _access_token_ was restricted to the **client credentials flow** and it wasn't possible to define the **scopes** for the token.<br/>
In the new SDK, because of the flexibility that the [middlewares](/sdk/Middlewares.md) provide, it's possible to have [all sorts of different auth flows](/sdk/api/sdkMiddlewareAuth.md).

#### Always 100% compatibility with new API features

In the `sphere-node-sdk` requests for a service had to be defined using the methods that the service provided. If the commercetools HTTP API would release new endpoints or new request options, the SDK had to be adjusted in order to support those new features.<br/>
In the new SDK _this problem becomes obsolete_ because the [request](/sdk/Glossary.md#clientrequest) URI can simply be provided manually. The [request builder](/sdk/api/apiRequestBuilder.md) is just a helper to construct the URI for a given service but the URI can be typed manually as well.

```js
client.execute({
  uri: '/my-project/some-new-endpoint?wow=this-is-a-new-query-option',
})
```
