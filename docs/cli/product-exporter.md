# Product Exporter

A package that helps with exporting [commercetools products](https://docs.commercetools.com/http-api-projects-productProjections.html#productprojection) from the [commercetools platform](http://dev.commercetools.com/).
The products can be exported in JSON format, or as chunks that can be piped to a parser for more export formats.

## Configuration

The constructor accepts four arguments:
- `apiConfig` (Object): `AuthMiddleware` options for authentication on the commercetools platform. (Required. See [here](https://commercetools.github.io/nodejs/sdk/api/sdkMiddlewareAuth.html#named-arguments-options))
- `exportConfig` (Object): Internal Export configurations
  - `batch` (Number): Amount of products to fetch for each API call
  - `expand` (Array): An array of strings signifying reference fields to expand in the returned product
  - `json` (Boolean): Specify if products returned should be in JSON file format. If set to false, the products will be output in chunks (Default: true)
  - `predicate` (String): Query string specifying (where) predicate. More info on predicates [here](https://docs.commercetools.com/http-api.html#predicates) (Optional)
  - `staged` (Boolean): Specify if prices should be fetched from all products (true) or only published products (false) (Optional. Default: false)
  - `total` (Number): The total number of products to fetch
- An optional logger object having four methods (`info`, `warn`, `error` and `debug`)
- `accessToken` (String): Access token to be used to authenticate requests to API. Requires scope of [`view_products`, `view_customers`]


## Usage
`npm install @commercetools/product-exporter --global`

### CLI
```
Usage: product-exporter [options]
Export products from the commercetools platform

Options:
  --help, -h        Show help text.                                    [boolean]
  --version, -v     Show version number                                [boolean]
  --projectKey, -p  API project key                          [string] [required]
  --apiUrl          The host URL of the HTTP API service
                             [string] [default: "https://api.commercetools.com"]
  --authUrl         The host URL of the OAuth API service
                            [string] [default: "https://auth.commercetools.com"]
  --accessToken     CTP client access token
                    Required scopes: ['view_products', 'view_customers'][string]
  --output, -o      Path to output                  [string] [default: "stdout"]
  --batchSize, -b   Amount of products to fetch for each API call (max: 500)
                                                          [number] [default: 20]
  --expand, -e      Reference field or fields to expand in the returned products
                                                                        [array]
  --exportType, -e  Flag if products should be exported as `JSON` strings or
                    chunks [string] [choices: "json", "chunk"] [default: "json"]
  --predicate       `Predicate` specifying characteristics of products to fetch
                                                                        [string]
  --staged, -s      Specify if all or published products should be fetched
                                                                       [boolean]
  --total, -t       Total number of products to fetch                   [number]
  --logLevel        Logging level: error, warn, info or debug
                                                      [string] [default: "info"]
  --prettyLogs      Pretty print logs to the terminal                  [boolean]
  --logFile         Path to file where logs should be saved
                                      [string] [default: "product-exporter.log"]
```

#### Info on flags
- The `--output` flag specifies where to output/save the exported products.
  - If the file specified already exists, it will be overwritten.
  - The default location for status report logging is the standard output.
  - If no output path is specified, the exported products will be logged to the standard output.
- The `predicate` flag specifies an optional (where) query predicate to be included in the request. This predicate should be wrapped in single quotes ('single quoted predicate'). More info on predicates [here](https://docs.commercetools.com/http-api.html#predicates)
- The `--expand` flag specifies the Reference or References to expand in the returned products. The required references for expansion should be passed in as normal strings separated by a space. More information about reference expansion can be found [here](https://docs.commercetools.com/http-api.html#reference-expansion)
- The `--exportType` flag specifies if products returned should be in JSON file format or chunks. The chunk output is particularly useful if a different output format is desired (such as CSV), in which case, the chunks can be piped to a parser to get the desired format.
- The `--staged` flag specifies the projection of the products to be fetched.
  - If passed `true`, published and unpublished products are retrieved
  - If passed `false` (or omitted), only published products are retrieved

### JS
For more direct usage, it is possible to use this module directly:
```js
import ProductExporter from '@commercetools/product-exporter'
import fs from 'fs'

const apiConfig = {
  host: 'https://auth.commercetools.com',
  apiUrl: 'https://api.commercetools.com',
  projectKey: 'node-test-project',
  credentials: {
    clientId: '123456hgfds',
    clientSecret: '123456yuhgfdwegh675412wefb3rgb',
  },
}
const exportConfig = {
  batch: 20,
  expand: ['productType', 'masterVariant.prices[*].customerGroup']
  json: true,
  predicate: 'description="new stocks"',
  staged: true,
  total: 100,
}
const logger = {
  error: console.error,
  warn: console.warn,
  info: console.log,
  debug: console.debug,
}
const accessToken = 'my-unique-access-token'

const productExporter = new ProductExporter(
  apiConfig,
  exportConfig,
  logger,
  accessToken,
)

// Register error listener
outputStream.on('error', errorHandler)

outputStream.on('finish', () => process.stdout.write('done with export'))

productExporter.run(outputStream)
```
