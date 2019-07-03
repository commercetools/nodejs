## commercetools-sdk changed artefact generation

## @commercetools/sync-actions@3.5.0 (2019-07-03)

#### :rocket: New Feature

- [#1353](https://github.com/commercetools/nodejs/pull/1353) Add ability to use `key` as a resource identifier in setting custom fields/types.

## @commercetools/sdk-middleware-auth@5.1.1, @commercetools/sdk-auth@2.1.1 (2019-05-23)

#### :bug: Bug Fix

- `sdk-auth`, `sdk-middleware-auth`
  - [#1334](https://github.com/commercetools/nodejs/pull/1334) Correctly encode tokens with non-ascii characters.

#### :rocket: New Feature (2019-05-21)

- Now replaces Node.js globals (such as `Buffer`) in UMD builds to allow direct consumption in browsers without requiring a separate build step (e.g. webpack). This helps smaller projects to get started quicker.

## @commercetools/sync-actions@3.0.0, @commercetools/state-importer@2.0.0, @commercetools/sdk-middleware-user-agent@2.0.0, @commercetools/sdk-middleware-queue@2.0.0, @commercetools/sdk-middleware-logger@2.0.0, @commercetools/sdk-middleware-http@5.0.0, @commercetools/sdk-middleware-correlation-id@2.0.0, @commercetools/sdk-middleware-auth@5.0.0, @commercetools/sdk-client@2.0.0, @commercetools/sdk-auth@2.0.0, @commercetools/product-json-to-xlsx@2.0.0, @commercetools/product-json-to-csv@3.0.0, @commercetools/product-exporter@2.0.0, @commercetools/price-exporter@2.0.0, @commercetools/personal-data-erasure@2.0.0, @commercetools/inventories-exporter@2.0.0, @commercetools/http-user-agent@2.0.0, @commercetools/get-credentials@3.0.0, @commercetools/discount-code-importer@2.0.0, @commercetools/discount-code-generator@2.0.0, @commercetools/discount-code-exporter@3.0.0, @commercetools/customer-groups-exporter@2.0.0, @commercetools/custom-objects-importer@2.0.0, @commercetools/custom-objects-exporter@2.0.0, @commercetools/csv-parser-state@2.0.0, @commercetools/csv-parser-price@3.0.0, @commercetools/csv-parser-orders@2.0.0, @commercetools/csv-parser-discount-code@2.0.0, @commercetools/category-exporter@2.0.0, @commercetools/api-request-builder@5.0.0 (2019-01-15)

#### :boom: Breaking Change

Dropped support for Node < 8

## @commercetools/sync-actions@2.0.0 (2018-09-21)

#### :boom: Breaking Change

[#789](https://github.com/commercetools/nodejs/pull/789). Rewrote implementation for `product-types` to use `hints` to calculate update actions.

## @commercetools/api-request-builder@4.0.0 (2018-07-11)

#### :boom: Breaking Change

[#654](https://github.com/commercetools/nodejs/pull/654). Removed default addition of `staged=true` to built uri's.

## @commercetools/sdk-middleware-auth@4.0.0 (2018-05-10)

#### :boom: Breaking Change

The package is not bundled anymore with `isomorphic-fetch`. Whenever no global `fetch` implementation is availble you will have to pass in a `fetch` implementation as an argument to `createAuthMiddlewareForClientCredentialsFlow`, `createAuthMiddlewareForPasswordFlow`, `createAuthMiddlewareForRefreshTokenFlow`, `createAuthMiddlewareForAnonymousSessionFlow`. More information is also available in the [docs](https://github.com/commercetools/nodejs/blob/master/docs/sdk/api/sdkMiddlewareAuth.md).

## @commercetools/sdk-middleware-http@4.0.0 (2018-05-10)

#### :boom: Breaking Change

The package is not bundled anymore with `isomorphic-fetch`. Whenever no global `fetch` implementation is availble you will have to pass in a `fetch` implementation as an argument to `createHttpMiddleware`. More information is also available in the [docs](https://github.com/commercetools/nodejs/blob/master/docs/sdk/api/sdkMiddlewareHttp.md).

## @commercetools/http-user-agent@1.0.1 (2017-01-29)

#### :bug: Bug Fix

- `http-user-agent`, `sdk-middleware-auth`
  - [#58](https://github.com/commercetools/nodejs/pull/58) Safely check for browser env when accessing global.window. ([@emmenko](https://github.com/emmenko))

#### Committers: 1

- Nicola Molinari ([emmenko](https://github.com/emmenko))

## @commercetools/sdk-middleware-auth@2.0.1 (2017-01-29)

#### :bug: Bug Fix

- `http-user-agent`, `sdk-middleware-auth`
  - [#58](https://github.com/commercetools/nodejs/pull/58) Safely check for browser env when accessing global.window. ([@emmenko](https://github.com/emmenko))

#### Committers: 1

- Nicola Molinari ([emmenko](https://github.com/emmenko))

## @commercetools/sdk-middleware-user-agent@1.1.1 (2017-01-29)

#### :bug: Bug Fix

- `http-user-agent`, `sdk-middleware-auth`
  - [#58](https://github.com/commercetools/nodejs/pull/58) Safely check for browser env when accessing global.window. ([@emmenko](https://github.com/emmenko))

#### Committers: 1

- Nicola Molinari ([emmenko](https://github.com/emmenko))

## @commercetools/sdk-middleware-http@2.0.0 (2017-01-28)

#### :boom: Breaking Change

- `sdk-middleware-http`
  - [#56](https://github.com/commercetools/nodejs/pull/56) refactor(middleware-http): make host option required. ([@emmenko](https://github.com/emmenko))

#### :memo: Documentation

- `sdk-client`, `sdk-middleware-auth`, `sdk-middleware-http`, `sdk-middleware-logger`, `sdk-middleware-queue`, `sdk-middleware-user-agent`
  - [#57](https://github.com/commercetools/nodejs/pull/57) refactor(sdk): use more specific types for middlewares args. ([@emmenko](https://github.com/emmenko))

#### Committers: 1

- Nicola Molinari ([emmenko](https://github.com/emmenko))

### Migrating from @commercetools/sdk-middleware-http@1.1.1 to @commercetools/sdk-middleware-http@2.0.0

When creating the _http middleware_, the `host` option is now required.

```js
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
const httpMiddleware = createHttpMiddleware({
  host: 'https://api.commercetools.com',
})
```

## @commercetools/sdk-middleware-auth@2.0.0 (2017-01-27)

#### :boom: Breaking Change

- `sdk-middleware-auth`
  - [#53](https://github.com/commercetools/nodejs/pull/53) fix(middleware-auth): fix usage of cached token, no default options. ([@emmenko](https://github.com/emmenko))

#### :bug: Bug Fix

- `sdk-middleware-auth`
  - [#53](https://github.com/commercetools/nodejs/pull/53) fix(middleware-auth): fix usage of cached token, no default options. ([@emmenko](https://github.com/emmenko))

#### Committers: 1

- Nicola Molinari ([emmenko](https://github.com/emmenko))

### Migrating from @commercetools/sdk-middleware-auth@1.1.0 to @commercetools/sdk-middleware-auth@2.0.0

When creating the _auth middleware_, the `host` option is now required.

```js
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
  host: 'https://auth.commercetools.com',
})
```

## @commercetools/sdk-middleware-http@1.1.1 (2017-01-26)

#### :memo: Bug Fix

- `sdk-middleware-http`
  - [#37](https://github.com/commercetools/nodejs/pull/37) fix(middleware-http): set options parameter to an object. ([@Siilwyn](https://github.com/Siilwyn))

#### Committers: 1

- Selwyn ([Siilwyn](https://github.com/Siilwyn))

## @commercetools/api-request-builder@1.6.0 (2017-01-21)

#### :rocket: New Feature

- `api-request-builder`
  - [#33](https://github.com/commercetools/nodejs/pull/33) feat(api-request-builder): add missing services to cover all API endpoints. ([@emmenko](https://github.com/emmenko))

#### :house: Maintenance

- Other
  - [#31](https://github.com/commercetools/nodejs/pull/31) build(travis): fail fast and avoid running it tests for PRs coming from forks. ([@emmenko](https://github.com/emmenko))

#### Committers: 1

- Nicola Molinari ([emmenko](https://github.com/emmenko))

## @commercetools/api-request-builder@1.4.0 (2017-01-19)

#### :rocket: New Feature

- `api-request-builder`
  - [#29](https://github.com/commercetools/nodejs/pull/29) feat(api-request-builder): add the payments service. ([@nkuehn](https://github.com/nkuehn))

#### Committers: 1

- Nikolaus Kühn ([nkuehn](https://github.com/nkuehn))

## @commercetools/sync-actions@1.1.0 (2017-01-19)

#### :house: Maintenance

- `sync-actions`
  - [#25](https://github.com/commercetools/nodejs/pull/25) refactor(sync-actions): upgrade jsondiffpatch and properly import it. ([@emmenko](https://github.com/emmenko))

#### Committers: 1

- Nicola Molinari ([emmenko](https://github.com/emmenko))

## @commercetools/sdk-client@1.2.0 (2017-01-13)

#### :rocket: New Feature

- `sdk-client`
  - [#18](https://github.com/commercetools/nodejs/pull/18) feat(sdk-client): implement process function to iterate through pages. ([@emmenko](https://github.com/emmenko))
  - [Documentation](https://commercetools.github.io/nodejs/docs/sdk/api/createClient.html#processrequest-processfn-options)

#### Committers: 1

- Nicola Molinari ([emmenko](https://github.com/emmenko))

## @commercetools/sdk-middleware-user-agent@1.1.0 (2017-01-12)

#### :nail_care: Enhancement

- `sdk-middleware-user-agent`
  - [#17](https://github.com/commercetools/nodejs/pull/17) Use http-user-agent as dependency in middleware-user-agent. ([@emmenko](https://github.com/emmenko))

#### Committers: 1

- Nicola Molinari ([emmenko](https://github.com/emmenko))

## @commercetools/http-user-agent@1.0.0 (2017-01-12)

#### :rocket: New Feature

- `http-user-agent`
  - [#16](https://github.com/commercetools/nodejs/pull/16) Add standalone package for creating a proper HTTP user-agent. ([@emmenko](https://github.com/emmenko))
  - [Documentation](https://commercetools.github.io/nodejs/docs/sdk/api/#http-user-agent)

#### Committers: 1

- Nicola Molinari ([emmenko](https://github.com/emmenko))

## @commercetools/sdk-middleware-user-agent@1.0.0 (2017-01-10)

#### :rocket: New Feature

- `sdk-middleware-user-agent`
  - [#15](https://github.com/commercetools/nodejs/pull/15) Add middleware to define the user-agent for http requests. ([@emmenko](https://github.com/emmenko))
  - [Documentation](https://commercetools.github.io/nodejs/docs/sdk/api/#sdk-middleware-user-agent)

#### Committers: 1

- Nicola Molinari ([emmenko](https://github.com/emmenko))

## @commercetools/api-request-builder@1.2.0 (2017-01-08)

#### :rocket: New Feature

- `sync-actions`
  - [#12](https://github.com/commercetools/nodejs/pull/12) feat(sync-actions): migrate over sync-actions package. ([@emmenko](https://github.com/emmenko))
  - [Documentation](https://commercetools.github.io/nodejs/docs/sdk/api/#sync-actions)

#### Committers: 1

- Nicola Molinari ([emmenko](https://github.com/emmenko))

## @commercetools/sdk-middleware-logger@1.0.0 (2016-12-23)

#### :rocket: New Feature

- `sdk-middleware-logger`
  - [#4](https://github.com/commercetools/nodejs/pull/4) feat(sdk-middleware-logger): add package for middleware-logger. ([@emmenko](https://github.com/emmenko))
  - [Documentation](https://commercetools.github.io/nodejs/docs/sdk/api/#sdk-middleware-logger)

#### Committers: 1

- Nicola Molinari ([emmenko](https://github.com/emmenko))
