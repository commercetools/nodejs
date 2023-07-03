# @commercetools/sdk-middleware-http

## 7.0.3

### Patch Changes

- [#1859](https://github.com/commercetools/nodejs/pull/1859) [`0ffe7243`](https://github.com/commercetools/nodejs/commit/0ffe72433906e74c2b3d287f1d2517b3b69fc382) Thanks [@ajimae](https://github.com/ajimae)! - Fix intermittent unhandled promise rejection error

## 7.0.2

### Patch Changes

- [#1837](https://github.com/commercetools/nodejs/pull/1837) [`21062826`](https://github.com/commercetools/nodejs/commit/21062826e5cf297b6d4959afafff0c1dfef8073d) Thanks [@ajimae](https://github.com/ajimae)! - Fix issues with file uploads when using the @commercetools/sdk-middleware-http package.

## 7.0.1

### Patch Changes

- [#1807](https://github.com/commercetools/nodejs/pull/1807) [`c05f4917`](https://github.com/commercetools/nodejs/commit/c05f4917e119150d8422a09f7be546a7599ff528) Thanks [@ajimae](https://github.com/ajimae)! - Allow @commercetools/middleware-sdk-http to accept `application/graphql` content-type.

## 7.0.0

### Major Changes

- [#1775](https://github.com/commercetools/nodejs/pull/1775) [`35669f30`](https://github.com/commercetools/nodejs/commit/35669f30dbc4b24d59ec3df3f38417b1f2a77837) Thanks [@ajimae](https://github.com/ajimae)! - Drop support for Node `v10` and `v12`. Supported versions now are `v14`, `v16` and `v18`.

## 6.2.0

### Minor Changes

- [#1776](https://github.com/commercetools/nodejs/pull/1776) [`59fead38`](https://github.com/commercetools/nodejs/commit/59fead38f775c63a1c4a070f59f3a25876fda2b6) Thanks [@ajimae](https://github.com/ajimae)! - - Add retry options for specific status code and status message

## 6.1.1

### Patch Changes

- [#1609](https://github.com/commercetools/nodejs/pull/1609) [`34e1bb80`](https://github.com/commercetools/nodejs/commit/34e1bb8010225fcc5ea7459bdd93f330eb7dd37d) Thanks [@renovate](https://github.com/apps/renovate)! - chore(deps): update all dependencies

* [#1751](https://github.com/commercetools/nodejs/pull/1751) [`d392692d`](https://github.com/commercetools/nodejs/commit/d392692d714b87ec04a1a4e2dac59946c713d213) Thanks [@MicheleRezk](https://github.com/MicheleRezk)! - Allow to unset the `content-type` HTTP header by explicitly passing `null` as the value.

  A use case for that is using `FormData` as the request body, for example to perform a file upload. The browser generally sets the `content-type` HTTP header automatically.

- [#1759](https://github.com/commercetools/nodejs/pull/1759) [`6a5b0572`](https://github.com/commercetools/nodejs/commit/6a5b05728f6fcb7e74e752962553870b9a89c1fe) Thanks [@emmenko](https://github.com/emmenko)! - Bump versions of `node-fetch`, `lodash`, and `fast-csv` to fix security vulnerabilities
