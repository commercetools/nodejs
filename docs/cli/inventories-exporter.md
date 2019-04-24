# Inventories Exporter

This package helps in exporting [inventories](https://docs.commercetools.com/http-api-projects-inventory.html) from the commercetools platform in `csv` and `json` format

## Configuration

The constructor accepts four arguments:

- `apiConfig` (Object): `AuthMiddleware` options for authentication on the commercetools platform. (Required. See [here](https://commercetools.github.io/nodejs/sdk/api/sdkMiddlewareAuth.html#named-arguments-options))
- An optional logger object having four methods (`info`, `warn`, `error` and `verbose`)
- `exportConfig` (Object): Internal Export configurations
  - `delimiter` (Object): CSV delimiter
  - `format` (Object): Export format ['csv', 'json'](Default: 'json')
  - `channelKey` (String): Channel key to use as filter for results to export. Useful if you have channel key but not `id` to build your queryString
  - `queryString` (String): Predicate to use to filter inventories to export
- `accessToken` (String): Access token to be used to authenticate requests to API. Requires scope of [`view_products`]

## Usage

```
npm install @commercetools/inventories-exporter --global
```

### CLI

```
Usage: inventoriesexporter [options]
Export inventories from the commercetools platform.

Options:
  --help, -h        Show help text.                                    [boolean]
  --version         Show version number                                [boolean]
  --outputFile, -o  Path to output file.                     [default: "stdout"]
  --apiUrl          The host URL of the HTTP API service.
                                              [default: "https://api.sphere.io"]
  --authUrl         The host URL of the OAuth API service.
                                             [default: "https://auth.sphere.io"]
  --delimiter, -d   Used CSV delimiter.                           [default: ","]
  --accessToken     CTP client access token
  --projectKey, -p  API project key.                                  [required]
  --channelKey, -c  Channel key to use as filter for result to export.
                    Useful if you only have channel key but not id.
                    Can be used with the query flag

  --query, -q       Filter query for stocks:
                    https://docs.commercetools.com/http-api-projects-inventory.html#query-inventory
                    can be used with channelKey flag

  --template, -t    Path to a CSV template file with headers which should be
                    exported.
  --format, -f      Format for export [choices: "csv", "json"] [default: "json"]
  --logLevel        Logging level: error, warn, info or verbose.
                                                               [default: "info"]
  --logFile         Path to file where to save logs.
                                           [default: "inventories-exporter.log"]
```

### JS

For direct usage

```
import InventoryExporter from '@commercetools/inventories-exporter'
import fs from 'fs'

const apiConfig = {
  host: 'https://api.sphere.io',
  apiUrl: 'https://api.sphere.io',
  projectKey: 'node-test-project',
  credentials: {
    clientId: '123456hgfds',
    clientSecret: '123456yuhgfdwegh675412wefb3rgb',
  },
}
const accessToken = args.accessToken
const logger = {
  error: console.error,
  warn: console.warn,
  info: console.log,
  verbose: console.debug,
}
const exportConfig = {
  headerFields: null, // can contain an array of header fields which should be exported
  delimiter: ',',
  format: 'csv,
  queryString: 'description="new stocks"',
}
const inventoryExporter = new InventoryExporter(
  apiConfig,
  logger,
  exportConfig,
  accessToken,
)

const outputStream = fs.createWriteStream('inventories.csv')

// Register error listener
outputStream.on('error', errorHandler)

outputStream.on('finish', () => console.log('done with export'))

inventoryExporter.run(outputStream)
```
