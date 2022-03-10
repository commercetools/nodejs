# @commercetools/sdk-middleware-http

## 6.2.0

### Minor Changes

- [#1776](https://github.com/commercetools/nodejs/pull/1776) [`59fead38`](https://github.com/commercetools/nodejs/commit/59fead38f775c63a1c4a070f59f3a25876fda2b6) Thanks [@ajimae](https://github.com/ajimae)! - - Add retry options for specific status code and status message

## 6.1.1

### Patch Changes

- [#1609](https://github.com/commercetools/nodejs/pull/1609) [`34e1bb80`](https://github.com/commercetools/nodejs/commit/34e1bb8010225fcc5ea7459bdd93f330eb7dd37d) Thanks [@renovate](https://github.com/apps/renovate)! - chore(deps): update all dependencies

* [#1751](https://github.com/commercetools/nodejs/pull/1751) [`d392692d`](https://github.com/commercetools/nodejs/commit/d392692d714b87ec04a1a4e2dac59946c713d213) Thanks [@MicheleRezk](https://github.com/MicheleRezk)! - Allow to unset the `content-type` HTTP header by explicitly passing `null` as the value.

  A use case for that is using `FormData` as the request body, for example to perform a file upload. The browser generally sets the `content-type` HTTP header automatically.

- [#1759](https://github.com/commercetools/nodejs/pull/1759) [`6a5b0572`](https://github.com/commercetools/nodejs/commit/6a5b05728f6fcb7e74e752962553870b9a89c1fe) Thanks [@emmenko](https://github.com/emmenko)! - Bump versions of `node-fetch`, `lodash`, and `fast-csv` to fix security vulnerabilities
