# Category Exporter

A package which exports [Composable Commerce categories](https://docs.commercetools.com/http-api-projects-categories.html) in `JSON` format from the [commercetools Composable Commerce](https://docs.commercetools.com/).

## Configuration

The constructor accepts two arguments:

- A required object containing the following values:
  - `apiConfig` (Object): `AuthMiddleware` options for authentication on commercetools Composable Commerce. (Required. See [here](https://commercetools.github.io/nodejs/sdk/api/sdkMiddlewareAuth.html#named-arguments-options))
  - `accessToken` (String): [Access token] to be used to authenticate requests to API. Requires scope of [`view_products`, `manage_products`]. More info on how to get the access token [here](https://docs.commercetools.com/http-api-authorization.html#authorization-flows)
  - `predicate` (String): Query string specifying (where) predicate. More info on predicates [here](https://docs.commercetools.com/http-api-query-predicates) (Optional)
- An optional logger object having four functions (`info`, `warn`, `error` and `debug`)

## Usage

`npm install @commercetools/category-exporter --global`

### CLI

```
Usage: category-exporter [options]
Export categories from the commercetools Composable Commerce

Options:
  --help                     Show help text.                           [boolean]
  --version                  Show version number                       [boolean]
  --output, -o               Path to output file.            [default: "stdout"]
  --apiUrl                   The host URL of the HTTP API service.
                                              [default: "https://api.europe-west1.gcp.commercetools.com"]
  --authUrl                  The host URL of the OAuth API service.
                                             [default: "https://auth.europe-west1.gcp.commercetools.com"]
  --accessToken              CTP client access token
                             Required scopes: ['view_products', 'manage_products'][string]
  --projectKey, -p           API project key.                         [required]
  --where, -w                specify where predicate
  --logLevel                 Logging level: error, warn, info or debug.
                                                               [default: "info"]
  --prettyLogs               Pretty print logs to the terminal         [boolean]
  --logFile                  Path to file where to save logs.
                                              [default: "category-exporter.log"]
```

#### Info on flags

- The `--output` flag specifies where to output/save the exported categories. Several notes on this flag:
  - If the file specified already exists, it will be overwritten.
  - The default location for status report logging is the standard output.
  - If no output path is specified, the exported categories will be logged to the standard output as a result, status reports will be logged to a `category-exporter.log` file in the current directory.
- The `where` flag specifies an optional (where) query predicate to be included in the request. This predicate should be wrapped in single quotes ('single quoted predicate'). More info on predicates [here](https://docs.commercetools.com/http-api-query-predicates)

### JS

For more direct usage, it is possible to use this module directly:

```js
import CategoryExporter from '@commercetools/category-exporter'
import fs from 'fs'

const options = {
    apiConfig: {
      apiUrl: 'https://api.europe-west1.gcp.commercetools.com'
      host: 'https://auth.europe-west1.gcp.commercetools.com'
      project_key: 'PROJECT_KEY',
      credentials: {
        clientId: '*********',
        clientSecret: '*********'
      }
    },
    accessToken: '123456yuhgfdwegh675412wefb4rgb',
    predicate: 'key="my-desired-key"'
  }
}
const logger = {
  error: console.error,
  warn: console.warn,
  info: console.log,
  debug: console.debug,
}

const categoryExporter = new CategoryExporter(options, logger)

// Register error listener
outputStream.on('error', errorHandler)

outputStream.on('finish', () => console.log('done with export'))

categoryExporter.run(outputStream)
```
