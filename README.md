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

We'd love to have your helping hand on this ecosystem! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for more information on our guidelines. We also have a [TODO list](TODOS.md) that may contain various tasks in addition to the [issues list](https://github.com/commercetools/nodejs/issues).

## Packages

### SDK

| Package                                                            | Version                                                                                                   | Dependencies                                                                                                                            |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [`sdk-auth`](/packages/sdk-auth)                                   | [![sdk-auth Version][sdk-auth-icon]][sdk-auth-version]                                                    | [![sdk-auth Dependencies Status][sdk-auth-dependencies-icon]][sdk-auth-dependencies]                                                    |
| [`sdk-client`](/packages/sdk-client)                               | [![sdk-client Version][sdk-client-icon]][sdk-client-version]                                              | [![sdk-client Dependencies Status][sdk-client-dependencies-icon]][sdk-client-dependencies]                                              |
| [`sdk-middleware-auth`](/packages/sdk-middleware-auth)             | [![sdk-middleware-auth Version][sdk-middleware-auth-icon]][sdk-middleware-auth-version]                   | [![sdk-middleware-auth Dependencies Status][sdk-middleware-auth-dependencies-icon]][sdk-middleware-auth-dependencies]                   |
| [`sdk-middleware-http`](/packages/sdk-middleware-http)             | [![sdk-middleware-http Version][sdk-middleware-http-icon]][sdk-middleware-http-version]                   | [![sdk-middleware-http Dependencies Status][sdk-middleware-http-dependencies-icon]][sdk-middleware-http-dependencies]                   |
| [`sdk-middleware-logger`](/packages/sdk-middleware-logger)         | [![sdk-middleware-logger Version][sdk-middleware-logger-icon]][sdk-middleware-logger-version]             | [![sdk-middleware-logger Dependencies Status][sdk-middleware-logger-dependencies-icon]][sdk-middleware-logger-dependencies]             |
| [`sdk-middleware-queue`](/packages/sdk-middleware-queue)           | [![sdk-middleware-queue Version][sdk-middleware-queue-icon]][sdk-middleware-queue-version]                | [![sdk-middleware-queue Dependencies Status][sdk-middleware-queue-dependencies-icon]][sdk-middleware-queue-dependencies]                |
| [`sdk-middleware-user-agent`](/packages/sdk-middleware-user-agent) | [![sdk-middleware-user-agent Version][sdk-middleware-user-agent-icon]][sdk-middleware-user-agent-version] | [![sdk-middleware-user-agent Dependencies Status][sdk-middleware-user-agent-dependencies-icon]][sdk-middleware-user-agent-dependencies] |
| [`typescript-sdk`](/packages/typescript-sdk)                       | [![typescript-sdk Version][typescript-sdk-icon]][typescript-sdk-version]                                  | [![typescript-sdk Dependencies Status][typescript-sdk-dependencies-icon]][typescript-sdk-dependencies]                                  |

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
[typescript-sdk-version]: https://www.npmjs.com/package/@commercetools/typescript-sdk
[typescript-sdk-icon]: https://img.shields.io/npm/v/@commercetools/typescript-sdk.svg?style=flat-square
[typescript-sdk-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/typescript-sdk
[typescript-sdk-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/typescript-sdk&style=flat-square

### CLI tools

| Package                                                          | Version                                                                                                | Dependencies                                                                                                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| [`category-exporter`](/packages/category-exporter)               | [![category-exporter Version][category-exporter-icon]][category-exporter-version]                      | [![category-exporter Dependencies Status][category-exporter-dependencies-icon]][category-exporter-dependencies]                      |
| [`csv-parser-discount-code`](/packages/csv-parser-discount-code) | [![csv-parser-discount-code Version][csv-parser-discount-code-icon]][csv-parser-discount-code-version] | [![csv-parser-discount-code Dependencies Status][csv-parser-discount-code-dependencies-icon]][csv-parser-discount-code-dependencies] |
| [`csv-parser-orders`](/packages/csv-parser-orders)               | [![csv-parser-orders Version][csv-parser-orders-icon]][csv-parser-orders-version]                      | [![csv-parser-orders Dependencies Status][csv-parser-orders-dependencies-icon]][csv-parser-orders-dependencies]                      |
| [`csv-parser-price`](/packages/csv-parser-price)                 | [![csv-parser-price Version][csv-parser-price-icon]][csv-parser-price-version]                         | [![csv-parser-price Dependencies Status][csv-parser-price-dependencies-icon]][csv-parser-price-dependencies]                         |
| [`csv-parser-state`](/packages/csv-parser-state)                 | [![csv-parser-state Version][csv-parser-state-icon]][csv-parser-state-version]                         | [![csv-parser-state Dependencies Status][csv-parser-state-dependencies-icon]][csv-parser-state-dependencies]                         |
| [`custom-objects-exporter`](/packages/custom-objects-exporter)   | [![custom-objects-exporter Version][custom-objects-exporter-icon]][custom-objects-exporter-version]    | [![custom-objects-exporter Dependencies Status][custom-objects-exporter-dependencies-icon]][custom-objects-exporter-dependencies]    |
| [`custom-objects-importer`](/packages/custom-objects-importer)   | [![custom-objects-importer Version][custom-objects-importer-icon]][custom-objects-importer-version]    | [![custom-objects-importer Dependencies Status][custom-objects-importer-dependencies-icon]][custom-objects-importer-dependencies]    |
| [`customer-groups-exporter`](/packages/customer-groups-exporter) | [![customer-groups-exporter Version][customer-groups-exporter-icon]][customer-groups-exporter-version] | [![customer-groups-exporter Dependencies Status][customer-groups-exporter-dependencies-icon]][customer-groups-exporter-dependencies] |
| [`personal-data-erasure`](/packages/personal-data-erasure)       | [![personal-data-erasure Version][personal-data-erasure-icon]][personal-data-erasure-version]          | [![personal-data-erasure Dependencies Status][personal-data-erasure-dependencies-icon]][personal-data-erasure-dependencies]          |
| [`discount-code-exporter`](/packages/discount-code-exporter)     | [![discount-code-exporter Version][discount-code-exporter-icon]][discount-code-exporter-version]       | [![discount-code-exporter Dependencies Status][discount-code-exporter-dependencies-icon]][discount-code-exporter-dependencies]       |
| [`discount-code-generator`](/packages/discount-code-generator)   | [![discount-code-generator Version][discount-code-generator-icon]][discount-code-generator-version]    | [![discount-code-generator Dependencies Status][discount-code-generator-dependencies-icon]][discount-code-generator-dependencies]    |
| [`discount-code-importer`](/packages/discount-code-importer)     | [![discount-code-importer Version][discount-code-importer-icon]][discount-code-importer-version]       | [![discount-code-importer Dependencies Status][discount-code-importer-dependencies-icon]][discount-code-importer-dependencies]       |
| [`inventories-exporter`](/packages/inventories-exporter)         | [![inventories-exporter Version][inventories-exporter-icon]][inventories-exporter-version]             | [![inventories-exporter Dependencies Status][inventories-exporter-dependencies-icon]][inventories-exporter-dependencies]             |
| [`price-exporter`](/packages/price-exporter)                     | [![price-exporter Version][price-exporter-icon]][price-exporter-version]                               | [![price-exporter Dependencies Status][price-exporter-dependencies-icon]][discount-code-importer-dependencies]                       |
| [`product-exporter`](/packages/product-exporter)                 | [![product-exporter Version][product-exporter-icon]][product-exporter-version]                         | [![product-exporter Dependencies Status][product-exporter-dependencies-icon]][product-exporter-dependencies]                         |
| [`product-json-to-csv`](/packages/product-json-to-csv)           | [![product-json-to-csv Version][product-json-to-csv-icon]][product-json-to-csv-version]                | [![product-json-to-csv Dependencies Status][product-json-to-csv-dependencies-icon]][product-json-to-csv-dependencies]                |
| [`state-importer`](/packages/state-importer)                     | [![state-importer Version][state-importer-icon]][state-importer-version]                               | [![state-importer Dependencies Status][state-importer-dependencies-icon]][state-importer-dependencies]                               |

### Other

| Package                                                | Version                                                                                 | Dependencies                                                                                                          |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [`api-request-builder`](/packages/api-request-builder) | [![api-request-builder Version][api-request-builder-icon]][api-request-builder-version] | [![api-request-builder Dependencies Status][api-request-builder-dependencies-icon]][api-request-builder-dependencies] |
| [`sync-actions`](/packages/sync-actions)               | [![sync-actions Version][sync-actions-icon]][sync-actions-version]                      | [![sync-actions Dependencies Status][sync-actions-dependencies-icon]][sync-actions-dependencies]                      |

[api-request-builder-version]: https://www.npmjs.com/package/@commercetools/api-request-builder
[api-request-builder-icon]: https://img.shields.io/npm/v/@commercetools/api-request-builder.svg?style=flat-square
[api-request-builder-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/api-request-builder
[api-request-builder-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/api-request-builder&style=flat-square
[category-exporter-version]: https://www.npmjs.com/package/@commercetools/category-exporter
[category-exporter-icon]: https://img.shields.io/npm/v/@commercetools/category-exporter.svg?style=flat-square
[category-exporter-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/category-exporter
[category-exporter-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/category-exporter&style=flat-square
[csv-parser-discount-code-version]: https://www.npmjs.com/package/@commercetools/csv-parser-discount-code
[csv-parser-discount-code-icon]: https://img.shields.io/npm/v/@commercetools/csv-parser-discount-code.svg?style=flat-square
[csv-parser-discount-code-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/csv-parser-discount-code
[csv-parser-discount-code-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/csv-parser-discount-code&style=flat-square
[csv-parser-orders-version]: https://www.npmjs.com/package/@commercetools/csv-parser-orders
[csv-parser-orders-icon]: https://img.shields.io/npm/v/@commercetools/csv-parser-orders.svg?style=flat-square
[csv-parser-orders-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/csv-parser-orders
[csv-parser-orders-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/csv-parser-orders&style=flat-square
[csv-parser-price-version]: https://www.npmjs.com/package/@commercetools/csv-parser-price
[csv-parser-price-icon]: https://img.shields.io/npm/v/@commercetools/csv-parser-price.svg?style=flat-square
[csv-parser-price-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/csv-parser-price
[csv-parser-price-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/csv-parser-price&style=flat-square
[csv-parser-state-version]: https://www.npmjs.com/package/@commercetools/csv-parser-state
[csv-parser-state-icon]: https://img.shields.io/npm/v/@commercetools/csv-parser-state.svg?style=flat-square
[csv-parser-state-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/csv-parser-state
[csv-parser-state-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/csv-parser-state&style=flat-square
[custom-objects-exporter-version]: https://www.npmjs.com/package/@commercetools/custom-objects-exporter
[custom-objects-exporter-icon]: https://img.shields.io/npm/v/@commercetools/custom-objects-exporter.svg?style=flat-square
[custom-objects-exporter-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/custom-objects-exporter
[custom-objects-exporter-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/custom-objects-exporter&style=flat-square
[custom-objects-importer-version]: https://www.npmjs.com/package/@commercetools/custom-objects-importer
[custom-objects-importer-icon]: https://img.shields.io/npm/v/@commercetools/custom-objects-importer.svg?style=flat-square
[custom-objects-importer-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/custom-objects-importer
[custom-objects-importer-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/custom-objects-importer&style=flat-square
[customer-groups-exporter-version]: https://www.npmjs.com/package/@commercetools/customer-groups-exporter
[customer-groups-exporter-icon]: https://img.shields.io/npm/v/@commercetools/customer-groups-exporter.svg?style=flat-square
[customer-groups-exporter-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/customer-groups-exporter
[customer-groups-exporter-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/customer-groups-exporter&style=flat-square
[discount-code-exporter-version]: https://www.npmjs.com/package/@commercetools/discount-code-exporter
[discount-code-exporter-icon]: https://img.shields.io/npm/v/@commercetools/discount-code-exporter.svg?style=flat-square
[discount-code-exporter-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/discount-code-exporter
[discount-code-exporter-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/discount-code-exporter&style=flat-square
[discount-code-generator-version]: https://www.npmjs.com/package/@commercetools/discount-code-generator
[discount-code-generator-icon]: https://img.shields.io/npm/v/@commercetools/discount-code-generator.svg?style=flat-square
[discount-code-generator-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/discount-code-generator
[discount-code-generator-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/discount-code-generator&style=flat-square
[discount-code-importer-version]: https://www.npmjs.com/package/@commercetools/discount-code-importer
[discount-code-importer-icon]: https://img.shields.io/npm/v/@commercetools/discount-code-importer.svg?style=flat-square
[discount-code-importer-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/discount-code-importer
[discount-code-importer-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/discount-code-importer&style=flat-square
[inventories-exporter-version]: https://www.npmjs.com/package/@commercetools/inventories-exporter
[inventories-exporter-icon]: https://img.shields.io/npm/v/@commercetools/inventories-exporter.svg?style=flat-square
[inventories-exporter-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/inventories-exporter
[inventories-exporter-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/inventories-exporter&style=flat-square
[price-exporter-version]: https://www.npmjs.com/package/@commercetools/price-exporter
[price-exporter-icon]: https://img.shields.io/npm/v/@commercetools/price-exporter.svg?style=flat-square
[price-exporter-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/price-exporter
[price-exporter-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/price-exporter&style=flat-square
[product-exporter-version]: https://www.npmjs.com/package/@commercetools/product-exporter
[product-exporter-icon]: https://img.shields.io/npm/v/@commercetools/product-exporter.svg?style=flat-square
[product-exporter-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/product-exporter
[product-exporter-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/product-exporter&style=flat-square
[product-json-to-csv-version]: https://www.npmjs.com/package/@commercetools/product-json-to-csv
[product-json-to-csv-icon]: https://img.shields.io/npm/v/@commercetools/product-json-to-csv.svg?style=flat-square
[product-json-to-csv-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/product-json-to-csv
[product-json-to-csv-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/product-json-to-csv&style=flat-square
[resource-deleter-version]: https://www.npmjs.com/package/@commercetools/resource-deleter
[resource-deleter-icon]: https://img.shields.io/npm/v/@commercetools/resource-deleter.svg?style=flat-square
[resource-deleter-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/resource-deleter
[resource-deleter-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/resource-deleter&style=flat-square
[state-importer-version]: https://www.npmjs.com/package/@commercetools/state-importer
[state-importer-icon]: https://img.shields.io/npm/v/@commercetools/state-importer.svg?style=flat-square
[state-importer-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/state-importer
[state-importer-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/state-importer&style=flat-square
[sync-actions-version]: https://www.npmjs.com/package/@commercetools/sync-actions
[sync-actions-icon]: https://img.shields.io/npm/v/@commercetools/sync-actions.svg?style=flat-square
[sync-actions-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/sync-actions
[sync-actions-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/sync-actions&style=flat-square
[personal-data-erasure-version]: https://www.npmjs.com/package/@commercetools/personal-data-erasure
[personal-data-erasure-icon]: https://img.shields.io/npm/v/@commercetools/personal-data-erasure.svg?style=flat-square
[personal-data-erasure-dependencies]: https://david-dm.org/commercetools/nodejs?path=packages/personal-data-erasure
[personal-data-erasure-dependencies-icon]: https://img.shields.io/david/commercetools/nodejs.svg?path=packages/personal-data-erasure&style=flat-square

### SDK as an AWS Lambda Layer

We also a publish an [AWS Lambda Layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html#configuration-layers-using) with the packages [`sdk-client`](/packages/sdk-client), [`sdk-middleware-auth`](/packages/sdk-middleware-auth), [`sdk-middleware-http`](/packages/sdk-middleware-http), [`sdk-middleware-logger`](/packages/sdk-middleware-logger),[`sdk-middleware-queue`](/packages/sdk-middleware-queue), [`sdk-middleware-user-agent`](/packages/sdk-middleware-user-agent) and [`api-request-builder`](/packages/api-request-builder). Find the ARN for your region [here](lambdaLayerArns.md).
