# `api-request-builder`
Provides an API to construct a URI for the HTTP API endpoints in a declarative way. Useful for building [request](/sdk/Glossary.md#clientrequest) `uri` for requests.

## Install

#### Node.js
```bash
npm install --save @commercetools/api-request-builder
```

#### Browser
```html
<script src="https://unpkg.com/@commercetools/api-request-builder/dist/commercetools-api-request-builder.min.js"></script>
<script>// global: CommercetoolsApiRequestBuilder</script>
```

## `createRequestBuilder(options)`

Creates a *request builder* that allows to declaratively build a HTTP API request URI for the commercetools platform.

#### Arguments

The `options` argument must be an object with a `projectKey` property, and optionally a `customServices` property
```js
    options -> { projectKey, customServices }
```

1. `projectKey` *(String)*: A required string specifying the project key to use for the request. Even though this is required, the project key can be omitted from the URI by passing `{withProjectKey: false}` to `.build()`
2. `customServices` *(Object)*: A map of custom services that are not provided by default. This might be useful to build a request for a different API with similar query parameters.

A _service_ is created by defining its `features`. Features give a service specific _characteristics_ to correctly build URIs. For example, if a service can query a resource by ID you would include `queryOne`. Available features types are:

- `query`: allows to use standard query capabilities (`page`, `perPage`, `sort`, `where`, `whereOperator`)
- `queryOne`: allows to query a single resource (`byId`)
- `queryExpand`: allows to use reference expansion (`expand`)
- `search`: allows to use search capabilities (`text`, `fuzzy`, `fuzzyLevel`, `facet`, `markMatchingVariants`, `filter`, `filterByQuery`, `filterByFacets`)
- `projection`: allows to use projections capabilities (`staged`)
- `suggest`: allows to use suggest capabilities (`searchKeywords`)

```js
import {
  createRequestBuilder,
  features,
} from '@commercetools/api-request-builder'
const options = {
  projectKey: 'my-project',
  customServices: {
    users: {
      type: 'users',
      endpoint: '/users',
      features: [
        features.query,
        features.queryOne,
      ],
    },
  },
}
const requestBuilder = createRequestBuilder(options)
```

#### Usage example

```js
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createClient } from '@commercetools/sdk-client'

const requestBuilder = createRequestBuilder({ projectKey: 'my-project-key' })
const client = createClient({
  middlewares: [...],
})
const channelsUri = requestBuilder.channels
  .where('key = "foo"')
  .perPage(1)
  .build()
const channelsRequest = {
  url: channelsUri,
  method: 'GET',
}

client.execute(channelsRequest)
.then(result => ...)
.catch(error => ...)
```
