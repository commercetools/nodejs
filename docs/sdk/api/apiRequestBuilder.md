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
<script>
  // global: CommercetoolsApiRequestBuilder
</script>
```

## `createRequestBuilder(options)`

Creates a _request builder_ that allows to declaratively build a HTTP API request URI for the commercetools platform.

#### Arguments

The `options` argument must be an object with a `projectKey` property, and optionally a `customServices` property

```js
    options -> { projectKey, customServices }
```

1.  `projectKey` _(String)_: A required string specifying the project key to use for the request. Even though this is required, the project key can be omitted from the URI by passing `{withProjectKey: false}` to `.build()`
2.  `customServices` _(Object)_: A map of custom services that are not provided by default. This might be useful to build a request for a different API with similar query parameters.

A _service_ is created by defining its `features`. Features give a service specific _characteristics_ to correctly build URIs. For example, if a service can query a resource by ID you would include `queryOne`. Available features types are:

- `query`: allows to use standard query capabilities (`page`, `perPage`, `sort`, `where`, `whereOperator`)
- `queryOne`: allows to query a single resource (`byId`, `byKey`, `byCustomerId`, `byCartId`)
- `queryLocation`: allows to query resources by location (`byCountry`, `byCurrency`, `byState`)
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
      features: [features.query, features.queryOne],
    },
  },
}
const requestBuilder = createRequestBuilder(options)
```

#### Default Services

```js
const requestBuilder = createRequestBuilder(options)
const uri = requestBuilder.productProjections.build()
// uri = "/project-key/product-projections"
```

Default services match the commercetools API using a camel-case convention.

| Endpoints                    | Service                         | Features                                                         |
| ---------------------------- | ------------------------------- | ---------------------------------------------------------------- |
| /login                       | login                           | create                                                           |
| /cart-discounts              | cartDiscounts                   | create, update, del, query, queryOne, queryExpand                |
| /carts                       | carts                           | create, update, del, query, queryOne, queryExpand                |
| /categories                  | categories                      | create, update, del, query, queryOne, queryExpand                |
| /channels                    | channels                        | create, update, del, query, queryOne, queryExpand                |
| /customer-groups             | customerGroups                  | create, update, del, query, queryOne, queryExpand                |
| /customers                   | customers                       | create, update, del, query, queryOne, queryExpand                |
| /customers/password          | customersPassword               | create                                                           |
| /customers/password-token    | customersPasswordToken          | create, queryOne                                                 |
| /customers/password/reset    | customersPasswordReset          | create                                                           |
| /customers/email-token       | customersEmailVerificationToken | create, queryOne                                                 |
| /customers/email/confirm     | customersEmailVerification      | create                                                           |
| /custom-objects              | customObjects                   | create, update, del, query, queryOne                             |
| /discount-codes              | discountCodes                   | create, update, del, query, queryOne, queryExpand                |
| /extensions                  | extensions                      | create, update, del, query, queryOne, queryExpand                |
| /inventory                   | inventory                       | create, update, del, query, queryOne, queryExpand                |
| /messages                    | messages                        | query, queryOne, queryExpand                                     |
| /me/active-cart              | myActiveCart                    | queryOne                                                         |
| /me/carts                    | myCarts                         | create, update, del, query, queryOne, queryExpand                |
| /me/orders                   | myOrders                        | create, update, del, query, queryOne, queryExpand                |
| /orders                      | orders                          | create, update, del, query, queryOne, queryExpand                |
| /orders/edits                | orderEdits                      | create, update, del, query, queryOne, queryExpand                |
| /orders/import               | orderImport                     | create, query                                                    |
| /payments                    | payments                        | create, update, del, query, queryOne, queryExpand                |
| /product-discounts           | productDiscounts                | create, update, del, query, queryOne, queryExpand                |
| /product-projections         | productProjections              | query, queryOne, queryExpand, projection                         |
| /product-projections/search  | productProjectionsSearch        | search, queryOne, queryExpand, projection                        |
| /product-projections/suggest | productProjectionsSuggest       | search, suggest, queryOne, projection                            |
| /products                    | products                        | create, update, del, query, queryOne, queryExpand                |
| /product-types               | productTypes                    | create, update, del, query, queryOne, queryExpand                |
| /                            | project                         | update, query                                                    |
| /reviews                     | reviews                         | create, update, del, query, queryOne, queryExpand                |
| /shipping-methods            | shippingMethods                 | create, update, del, query, queryOne, queryExpand, queryLocation |
| /shopping-lists              | shoppingLists                   | create, update, del, query, queryOne, queryExpand                |
| /states                      | states                          | create, update, del, query, queryOne, queryExpand                |
| /subscriptions               | subscriptions                   | create, update, del, query, queryOne, queryExpand                |
| /tax-categories              | taxCategories                   | create, update, del, query, queryOne, queryExpand                |
| /types                       | types                           | create, update, del, query, queryOne, queryExpand                |
| /zones                       | zones                           | create, update, del, query, queryOne, queryExpand                |

Note that `markMatchingVariants` is set by default to `false` which turns off this feature on the API.

#### Staged

It is possible to add the `staged` boolean option to the uri. This decides wether to query the `current` or `staged` projections, for example in [Product Projections](https://docs.commercetools.com/api/projects/productProjections). (Defaults to **false**)

```js
const service = createRequestBuilder(options)
const uri = service.productProjections.staged(true).build()
```

#### Version

It is also possible to append the version of a resource to the uri when making a request that requires this (for example a `DELETE` request). This can be done by passing the required version to the `.withVersion()` method.

```js
const service = createRequestBuilder(options)
const uri = service.channels.withVersion(2).build()
```

#### QueryOne

It is also possible to query for just one resource. QueryOne consists of `byId`, `byKey`, `byCustomerId`, `byCartId`.

When retrieving a resource using it's own ID, use `byId` or `byKey`.

```js
const requestBuilder = createRequestBuilder(options)
const uri = requestBuilder.carts.byId('cartId').build()
```

When retrieving a resource by a customer or cart reference use `byCustomerId` or `byCartId`.

```js
const requestBuilder = createRequestBuilder(options)
const uri = requestBuilder.carts.byCustomerId('customerId').build()
```

#### dataErasure

You can also append the `dataErasure` option to the uri when making a delete request if you want to make sure all related data is deleted. For example, regarding the GDPR, this means that all personal data related to the particular object, including invisible data, is erased. [More info here](https://docs.commercetools.com/api/releases/2018-05-24-data-erasure)

This can be done by using the `.withFullDataErasure()` method.

```js
const service = createRequestBuilder(options)
const deleteUri = service.payments
  .byId(12345)
  .withVersion(3)
  .withFullDataErasure()
  .build()
```

#### withTotal

You can also append the `withTotal` option to the uri when making a query. [More info here](https://docs.commercetools.com/api/general-concepts#pagedqueryresult).

This can be done by using the `.withTotal(false)` method.

```js
const service = createRequestBuilder(options)
const getUri = service.orders.withTotal(false).build()
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
  uri: channelsUri,
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
  cartId?: ?string;

  // query-location
  country?: ?string;
  currency?: ?string;
  state?: ?string;

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

  // dataErasure
  dataErasure?: string;

  // params
  orderNumber?: number;
}
```

**Mixed usage**

The imperative API can be mixed with the declarative one.

```js
// these both lead to the same result
requestBuilder.channels.parse({ page: 5 }).perPage(10).build()
requestBuilder.channels.perPage(10).parse({ page: 5 }).build()
```
