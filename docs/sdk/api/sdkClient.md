# `sdk-client`
Core package to enable executing HTTP [request](/sdk/Glossary.md#clientrequest). To be used together with middlewares.

## Install

#### Node.js
```bash
npm install --save @commercetools/sdk-client
```

#### Browser
```html
<script src="https://unpkg.com/@commercetools/sdk-client/dist/commercetools-sdk-client.min.js"></script>
<script>// global: CommercetoolsSdkClient</script>
```

## `createClient(options)`

Creates a [client](/sdk/Glossary.md#client) instance.

#### Named arguments (options)

1. `middlewares` *(Array)*: A list of [middlewares](/sdk/Middlewares.md) to be used within this client. **The order of the middlewares is really important!** (e.g. it does not make sense to put the `http` middleware *before* the `auth` middleware).

### Client API

#### `execute(request)`
Returns a `Promise` which gets resolved after all the provided middlewares have done their job with the given [request / response](/sdk/Middlewares.md). _This is the primary method to use_.

- `request` *(Object)*: A [request object](/sdk/Glossary.md#clientrequest)

#### Usage example

```js
import { createClient } from '@commercetools/sdk-client'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'

const client = createClient({
  middlewares: [
    createHttpMiddleware(),
  ],
})
const request = {
  uri: '/foo/bar',
  method: 'GET',
  headers: {
    Authorization: 'Bearer xxx',
  },
}

client.execute(request)
.then(result => ...)
.catch(error => ...)
```


#### `process(request, processFn, options)`
This function should be used to _iterate_ through all the pages of a HTTP Rest API endpoint. Given the [request object](/sdk/Glossary.md#clientrequest), the first page result of the request query will be passed to the `processFn`. This function does whatever it needs to do with the data and returns itself a promise which will trigger fetching a new page. This goes on and on until all available pages of the request query have being fetched and processed.
Returns a `Promise` with the accumulated result of each `processFn` calls.

- `request` *(Object)*: A [request object](/sdk/Glossary.md#clientrequest)
- `processFn` *(Function)*: A function that gets called on each API page iteration. The function gets as an argument the response of the API request and should return a `Promise` which will trigger the next iteration.
- `options` *(Object)*
  - `accumulate` *(Boolean)*: (default `true`) a flag to indicate whether all the results of the iterations should be accumulated. This is useful if you want to e.g. fetch all the entities of an API endpoint and do something with it at the end. _Be careful that this might lead to memory problems if the fetched data gets too big. If it's not necessary to have all the data when the process function resolves, it's recommended to disable this option_.

#### Usage example

```js
import { createClient } from '@commercetools/sdk-client'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createRequestBuilder } from '@commercetools/api-request-builder'

const requestBuilder = createRequestBuilder({ projectKey: 'foo' })
const productProjectionsService = requestBuilder.productProjections
const productsService = requestBuilder.products

const client = createClient({
  middlewares: [
    createHttpMiddleware(),
  ],
})
const uri = productProjectionsService
  .where('masterData(published = "false")')
  .where('masterData(hasStagedChanges = "true")')
  .build()

const request = {
  uri,
  method: 'GET',
  headers: {
    Authorization: 'Bearer xxx',
  },
}

// 1. We want to publish all products that are not published yet
client.process(
  request,
  (payload) => {
    const results = payload.body.results
    return Promise.all(
      results.map(product =>
        client.execute({
          uri: productsService.byId(product.id).build(),
          method: 'POST',
          body: JSON.stringify({
            version: product.version,
            actions: [{ action: 'publish' }]
          }),
          headers: request.headers,
        })
      ),
    )
  },
  { accumulate: false },
)
.then(result => ...)
.catch(error => ...)
```
