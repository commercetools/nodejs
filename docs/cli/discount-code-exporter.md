# Discount Code Exporter

A package that helps with exporting [commercetools discount codes](https://docs.commercetools.com/http-api-projects-discountCodes.html) in `JSON` or `CSV` format from the [commercetools platform](https://docs.commercetools.com/).

## Configuration

The constructor accepts two arguments:

- A required object containing the following values:
  - `apiConfig` (Object): `AuthMiddleware` options for authentication on the commercetools platform. (Required. See [here](https://commercetools.github.io/nodejs/sdk/api/sdkMiddlewareAuth.html#named-arguments-options))
  - `batchSize` (Number): Amount of codes not more than 500 to process concurrently (Optional. Default: 500)
  - `language` (String): Language used for localised fields if no template is given (Optional. Default: `'en'`)
  - `accessToken` (String): Access token to be used to authenticate requests to API. Requires scope of [`view_orders`]
  - `delimiter` (String): CSV delimiter (Optional. Default: `','`)
  - `multiValueDelimiter` (String): CSV delimiter used in multivalue fields (Optional. Default: `';'`)
  - `exportFormat` (String): Export format ['csv', 'json'] (Optional. Default: 'json')
  - `predicate` (String): Query string specifying (where) predicate. More info on predicates [here](https://docs.commercetools.com/http-api-query-predicates) (Optional)
  - `fields` (Array<String>): An array of column names the exported CSV file should contain. This fields array should contain the required columns of the CSV file (Optional. If omitted, a default set of column fields is used. Currently, these fields are: `name`, `description`, `code`, `cartDiscounts`,`cartPredicate`,`groups`,`isActive`,`validFrom`,`validUntil`,`references`,`maxApplications`,`maxApplicationsPerCustomer`.
    The localised fields (`name` and `description` default to the language specified in the `language` value above.
    This is synonymous with the `--template` flag in the CLI)
- An optional logger object having four functions (`info`, `warn`, `error` and `verbose`)

## Usage

`npm install @commercetools/discount-code-exporter --global`

### CLI

```
Usage: bin/discount-code-exporter.js [options]
Export discount codes from the commercetools platform.

Options:
  --help, -h                 Show help text.                           [boolean]
  --version                  Show version number                       [boolean]
  --template, -t             Path to CSV template.
  --language, -l             Language used for localised fields (such as `name`
                             and `description`) when exporting without template.
                             This field is ignored for exports with template
                                                                 [default: "en"]
  --output, -o               Path to output file.            [default: "stdout"]
  --apiUrl                   The host URL of the HTTP API service.
                                              [default: "https://api.sphere.io"]
  --authUrl                  The host URL of the OAuth API service.
                                             [default: "https://auth.sphere.io"]
  --delimiter, -d            Used CSV delimiter.                  [default: ","]
  --multiValueDelimiter, -m  Used CSV delimiter in multiValue fields.
                                                                  [default: ";"]
  --accessToken              CTP client access token
  --projectKey, -p           API project key.                         [required]
  --where, -w                specify where predicate
  --exportFormat, -f         Format for export
                                      [choices: "csv", "json"] [default: "json"]
  --batchSize, -b            Number of codes to exports in a chunk[default: 500]
  --logLevel                 Logging level: error, warn, info or verbose.
                                                               [default: "info"]
  --logFile                  Path to file where to save logs.
                                           [default: "discount-code-export.log"]
```

#### Info on flags

- The `--output` flag specifies where to output/save the exported discount codes. Several notes on this flag:
  - If the file specified already exists, it will be overwritten.
  - The default location for status report logging is the standard output.
  - If no output path is specified, the exported codes will be logged to the standard output as a result, status reports will be logged to a `discount-code-export.log` file in the current directory.
- The `--delimiter` flag specifies the delimiter used in the output file if CSV. Defaults to `','` if omitted.
- The `--multiValueDelimiter` flag specifies the delimiter for multiValue cells in the output file if CSV. Defaults to `';'` if omitted.
- The `where` flag specifies an optional (where) query predicate to be included in the request. This predicate should be wrapped in single quotes ('single quoted predicate'). More info on predicates [here](https://docs.commercetools.com/http-api-query-predicates)

### JS

For more direct usage, it is possible to use this module directly:

```js
import DiscountCodeExport from '@commercetools/discount-code-exporter'
import fs from 'fs'

const options = {
    apiConfig: {
      apiUrl: 'https://api.sphere.io'
      host: 'https://auth.sphere.com'
      project_key: <PROJECT_KEY>,
      credentials: {
        clientId: '*********',
        clientSecret: '*********'
      }
    },
    batchSize: 100,
    accessToken: '123456yuhgfdwegh675412wefb3rgb',
    delimiter: ',',
    multiValueDelimiter: ';',
    exportFormat: 'csv',
    predicate: 'cartDiscounts(id="desired-cart-discount-id")',
    fields: ['code', 'name.en', 'name.de', 'cartDiscounts']
  }
}
const logger = {
  error: console.error,
  warn: console.warn,
  info: console.log,
  verbose: console.debug,
}

const discountCodeExport = new DiscountCodeExport(options, logger)

// Register error listener
outputStream.on('error', errorHandler)

outputStream.on('finish', () => console.log('done with export'))

discountCodeExport.run(outputStream)
```
