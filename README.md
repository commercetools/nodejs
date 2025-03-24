<p align="center">
  <a href="https://commercetools.com/">
    <img alt="commercetools logo" src="http://cdn.rawgit.com/commercetools/press-kit/master/PNG/72DPI/CT%20logo%20chrom%20black%20horizontal%20RGB%2072dpi.png">
  </a>
  <b>Node.js commercetools ecosystem.</b>
</p>

<p align="center">
  <a href="https://circleci.com/gh/commercetools/nodejs">
    <img alt="CircleCI Status" src="https://circleci.com/gh/commercetools/nodejs.svg?style=shield&circle-token=5eae5720e32669bf981a19603a7b8007821687e1">
  </a>
  <a href="https://codecov.io/gh/commercetools/nodejs">
    <img alt="Codecov Coverage Status" src="https://img.shields.io/codecov/c/github/commercetools/nodejs.svg?style=flat-square">
  </a>
  <a href="https://waffle.io/commercetools/nodejs-tasks-board">
    <img alt="Waffle.io Board" src="https://img.shields.io/badge/Waffle-board-yellow.svg?style=flat-square">
  </a>
</p>

The **commercetools nodejs** repo is managed as a [monorepo](https://github.com/lerna/lerna) and contains different npm packages.

## Documentation

https://commercetools.github.io/nodejs/

## Support

If you have any urgent issues regarding this repository please create a support request over our [official support channel](http://support.commercetools.com).

## Contributing

We'd love to have your helping hand on this ecosystem! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for more information on our guidelines.

## Packages

### SDK

> [!WARNING]  
> These packages have been replaced by the <a href="https://docs.commercetools.com/sdk/typescript-sdk">TypeScript SDK</a> is in maintenance mode as such this tool will no longer receive bug fixes, security patches, or new features.

| Package                                                            | Version                                                                                                   | Dependencies                                                                                                                            |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [`sdk-auth`](/packages/sdk-auth)                                   | [![sdk-auth Version][sdk-auth-icon]][sdk-auth-version]                                                    | [![sdk-auth Dependencies Status][sdk-auth-dependencies-icon]][sdk-auth-dependencies]                                                    |
| [`sdk-client`](/packages/sdk-client)                               | [![sdk-client Version][sdk-client-icon]][sdk-client-version]                                              | [![sdk-client Dependencies Status][sdk-client-dependencies-icon]][sdk-client-dependencies]                                              |
| [`sdk-middleware-auth`](/packages/sdk-middleware-auth)             | [![sdk-middleware-auth Version][sdk-middleware-auth-icon]][sdk-middleware-auth-version]                   | [![sdk-middleware-auth Dependencies Status][sdk-middleware-auth-dependencies-icon]][sdk-middleware-auth-dependencies]                   |
| [`sdk-middleware-http`](/packages/sdk-middleware-http)             | [![sdk-middleware-http Version][sdk-middleware-http-icon]][sdk-middleware-http-version]                   | [![sdk-middleware-http Dependencies Status][sdk-middleware-http-dependencies-icon]][sdk-middleware-http-dependencies]                   |
| [`sdk-middleware-logger`](/packages/sdk-middleware-logger)         | [![sdk-middleware-logger Version][sdk-middleware-logger-icon]][sdk-middleware-logger-version]             | [![sdk-middleware-logger Dependencies Status][sdk-middleware-logger-dependencies-icon]][sdk-middleware-logger-dependencies]             |
| [`sdk-middleware-queue`](/packages/sdk-middleware-queue)           | [![sdk-middleware-queue Version][sdk-middleware-queue-icon]][sdk-middleware-queue-version]                | [![sdk-middleware-queue Dependencies Status][sdk-middleware-queue-dependencies-icon]][sdk-middleware-queue-dependencies]                |
| [`sdk-middleware-user-agent`](/packages/sdk-middleware-user-agent) | [![sdk-middleware-user-agent Version][sdk-middleware-user-agent-icon]][sdk-middleware-user-agent-version] | [![sdk-middleware-user-agent Dependencies Status][sdk-middleware-user-agent-dependencies-icon]][sdk-middleware-user-agent-dependencies] |

[sdk-auth-version]: https://www.npmjs.com/package/@commercetools/sdk-auth
[sdk-auth-icon]: https://img.shields.io/npm/v/@commercetools/sdk-auth.svg?style=flat-square
[sdk-auth-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/sdk-auth
[sdk-auth-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/sdk-auth&style=flat-square
[sdk-client-version]: https://www.npmjs.com/package/@commercetools/sdk-client
[sdk-client-icon]: https://img.shields.io/npm/v/@commercetools/sdk-client.svg?style=flat-square
[sdk-client-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/sdk-client
[sdk-client-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/sdk-client&style=flat-square
[sdk-middleware-auth-version]: https://www.npmjs.com/package/@commercetools/sdk-middleware-auth
[sdk-middleware-auth-icon]: https://img.shields.io/npm/v/@commercetools/sdk-middleware-auth.svg?style=flat-square
[sdk-middleware-auth-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/sdk-middleware-auth
[sdk-middleware-auth-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/sdk-middleware-auth&style=flat-square
[sdk-middleware-http-version]: https://www.npmjs.com/package/@commercetools/sdk-middleware-http
[sdk-middleware-http-icon]: https://img.shields.io/npm/v/@commercetools/sdk-middleware-http.svg?style=flat-square
[sdk-middleware-http-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/sdk-middleware-http
[sdk-middleware-http-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/sdk-middleware-http&style=flat-square
[sdk-middleware-logger-version]: https://www.npmjs.com/package/@commercetools/sdk-middleware-logger
[sdk-middleware-logger-icon]: https://img.shields.io/npm/v/@commercetools/sdk-middleware-logger.svg?style=flat-square
[sdk-middleware-logger-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/sdk-middleware-logger
[sdk-middleware-logger-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/sdk-middleware-logger&style=flat-square
[sdk-middleware-queue-version]: https://www.npmjs.com/package/@commercetools/sdk-middleware-queue
[sdk-middleware-queue-icon]: https://img.shields.io/npm/v/@commercetools/sdk-middleware-queue.svg?style=flat-square
[sdk-middleware-queue-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/sdk-middleware-queue
[sdk-middleware-queue-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/sdk-middleware-queue&style=flat-square
[sdk-middleware-user-agent-version]: https://www.npmjs.com/package/@commercetools/sdk-middleware-user-agent
[sdk-middleware-user-agent-icon]: https://img.shields.io/npm/v/@commercetools/sdk-middleware-user-agent.svg?style=flat-square
[sdk-middleware-user-agent-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/sdk-middleware-user-agent
[sdk-middleware-user-agent-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/sdk-middleware-user-agent&style=flat-square

### CLI tools

The CLI tools have been deprecated starting March 31st 2025.

### Other

| Package                                                | Version                                                                                 | Dependencies                                                                                                          |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [`api-request-builder`](/packages/api-request-builder) | [![api-request-builder Version][api-request-builder-icon]][api-request-builder-version] | [![api-request-builder Dependencies Status][api-request-builder-dependencies-icon]][api-request-builder-dependencies] |
| [`sync-actions`](/packages/sync-actions)               | [![sync-actions Version][sync-actions-icon]][sync-actions-version]                      | [![sync-actions Dependencies Status][sync-actions-dependencies-icon]][sync-actions-dependencies]                      |

[api-request-builder-version]: https://www.npmjs.com/package/@commercetools/api-request-builder
[api-request-builder-icon]: https://img.shields.io/npm/v/@commercetools/api-request-builder.svg?style=flat-square
[api-request-builder-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/api-request-builder
[api-request-builder-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/api-request-builder&style=flat-square
[resource-deleter-version]: https://www.npmjs.com/package/@commercetools/resource-deleter
[resource-deleter-icon]: https://img.shields.io/npm/v/@commercetools/resource-deleter.svg?style=flat-square
[resource-deleter-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/resource-deleter
[resource-deleter-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/resource-deleter&style=flat-square
[sync-actions-version]: https://www.npmjs.com/package/@commercetools/sync-actions
[sync-actions-icon]: https://img.shields.io/npm/v/@commercetools/sync-actions.svg?style=flat-square
[sync-actions-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/sync-actions
[sync-actions-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/sync-actions&style=flat-square
[personal-data-erasure-version]: https://www.npmjs.com/package/@commercetools/personal-data-erasure
[personal-data-erasure-icon]: https://img.shields.io/npm/v/@commercetools/personal-data-erasure.svg?style=flat-square
[personal-data-erasure-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/personal-data-erasure
[personal-data-erasure-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/personal-data-erasure&style=flat-square
