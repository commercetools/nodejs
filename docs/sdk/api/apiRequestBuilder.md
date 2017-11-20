# `api-request-builder`
Provides an API to construct a URI for the HTTP API endpoints in a declarative way. Useful for building [request](/sdk/Glossary.md#clientrequest) `uri` for requests.

## Install

#### Node.js
```bash
npm install --save @commercetools/api-request-builder
```

#### Browser
```html
<script src="https://unpkg.com/@commercetools/api-request-builder/dist/commercetools-api-request-builder.umd.min.js"></script>
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
- `queryOne`: allows to query a single resource (`byId`, `byKey`, `byCustomerId`)
- `queryExpand`: allows to use reference expansion (`expand`)
- `search`: allows to use search capabilities (`text`, `fuzzy`, `fuzzyLevel`, `facet`, `markMatchingVariants`, `filter`, `filterByQuery`, `filterByFacets`)
- `projection`: allows to use projections capabilities (`staged`, `priceCurrency`, `priceCountry`, `priceCustomerGroup`, `priceChannel`)
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

Note that `markMatchingVariants` is set by default to `false` which turns off this feature on the API.

#### Version

It is also possible to append the version of a resource to the uri when making a request that requires this (for example a `DELETE` request). This can be done by passing the required version to the `.withVersion()` method.

```js
const service = createRequestBuilder(options)
const uri = service.channels.withVersion(2).build()
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
  .withVersion(3)
  .build()
const channelsRequest = {
  url: channelsUri,
  method: 'GET',
}

client.execute(channelsRequest)
.then(result => ...)
.catch(error => ...)
```

#### Declarative Usage

A declarative API exists as an alternative to the imperative API (shown in the example above).

```js
// same imports and instantiation as above
const channelsUri = requestBuilder.channels
  .parse({
    where: ['key = "foo"'],
    perPage: 1,
    version: 3,
  })
  .build()
```

**Type of Params**
This declarative `parse` API accepts an object of the following shape:

```js
{
  // query-expand
  expand?: Array<string>;

  // query-id
  id?: ?string;
  key?: ?string;
  customerId?: ?string;

  // query-page
  sort: Array<{ by: string, direction: 'asc' | 'desc' }>;
  page: ?number;
  perPage: ?number;

  // query-projection
  staged?: boolean;
  priceCurrency?: string;
  priceCountry?: string;
  priceCustomerGroup?: string;
  priceChannel?: string;

  // query-search
  text?: ?{
    language?: string;
    value?: string;
  };
  fuzzy?: boolean;
  fuzzyLevel?: number;
  markMatchingVariants?: boolean;
  facet?: Array<string>;
  filter?: Array<string>;
  filterByQuery?: Array<string>;
  filterByFacets?: Array<string>;

  // query-suggest
  searchKeywords?: Array<{language: string; value: string;}>;

  // query
  where?: Array<string>;
  whereOperator?: 'and' | 'or';

  // version
  version?: string;
}
```

**Mixed usage**

The imperative API can be mixed with the declarative one.

```js
// these both lead to the same result
requestBuilder.channels.parse({ page: 5 }).perPage(10).build()
requestBuilder.channels.perPage(10).parse({ page: 5 }).build()
```
