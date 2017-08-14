# Price Exporter

A package that helps with exporting [commercetools price](https://dev.commercetools.com/http-api-projects-products.html#price) in `JSON` or `CSV` format from the [commercetools platform](http://dev.commercetools.com/).

## Configuration

The constructor accepts two arguments:
- A required object containing the following values:
  - `apiConfig` (Object): `AuthMiddleware` options for authentication on the commercetools platform. (Required. See [here](https://commercetools.github.io/nodejs/sdk/api/sdkMiddlewareAuth.html#named-arguments-options))
  - `accessToken` (String): Access token to be used to authenticate requests to API. Requires scope of [`view_orders`]
  - `delimiter` (String): CSV delimiter (Optional. Default: `','`)
  - `exportFormat` (String): Export format ['csv', 'json'] (Optional. Default: 'json')
  - `predicate` (String): Query string specifying (where) predicate. More info on predicates [here](http://dev.commercetools.com/http-api.html#predicates) (Optional)
  - `staged` (Boolean): Specify if prices should be fetched from all products (true) or only published products (false) (Optional. Default: false)
  - `csvHeaders` (Array<String>): Array containing headers for the returned CSV price data. If omitted, all headers will be turned. (Optional)
- An optional logger object having four functions (`info`, `warn`, `error` and `verbose`)

## Usage
`npm install @commercetools/price-exporter --global`

### CLI
```
Usage: price-exporter [options]
Export prices from the commercetools platform.

Options:
  --help, -h          Show help text.                                  [boolean]
  --version           Show version number                              [boolean]
  --input, -i         Path to CSV template.                           [required]
  --output, -o        Path to output file.                   [default: "stdout"]
  --apiUrl            The host URL of the HTTP API service.
                                              [default: "https://api.sphere.io"]
  --authUrl           The host URL of the OAuth API service.
                                             [default: "https://auth.sphere.io"]
  --projectKey, -p    API project key.                                [required]
  --accessToken       CTP client access token. Required scopes: ['view_products', 'view_customers']
  --delimiter, -d     Used CSV delimiter for template and output. [default: ","]
  --where, -w         Where predicate for products from which to fetch prices.
  --exportFormat, -f  Format for export.
                                      [choices: "csv", "json"] [default: "json"]
  --staged, -s        Specify if prices should be from all or published
                      products.                                        [boolean]
  --logLevel          Logging level: error, warn, info or verbose.
                                                               [default: "info"]
  --logFile           Path to file where to save logs.
                                                 [default: "price-exporter.log"]
```

#### Info on flags
- The `--input` flag specifies the path to the [CSV template file](#csv-headers).
  - Only the first line is read and subsequent lines (if present) will be ignored
  - The delimiter must match the delimiter passed in by `--delimiter` (or the default delimiter)
- The `--output` flag specifies where to output/save the exported prices.
  - If the file specified already exists, it will be overwritten.
  - The default location for status report logging is the standard output.
  - If no output path is specified, the exported prices will be logged to the standard output.
- The `--delimiter` flag specifies the delimiter used in the input and output file if CSV. Defaults to `','` if omitted.
- The `where` flag specifies an optional (where) query predicate to be included in the request. This predicate is on the products containing the prices (`product-proections` endpoint) and not on the prices themselves. This predicate should be wrapped in single quotes ('single quoted predicate'). More info on predicates [here](http://dev.commercetools.com/http-api.html#predicates)
- The `--staged` flag specifies the projection of the products from which the prices should be fetched.
  - If passed `true`, prices from published and unpublished products are retrieved
  - If passed `false` (or omitted), only prices from published products are retrieved

#### CSV headers
To export price in CSV format, the header file is required. This file should contain the desired headers that will be exported. The [price-exporter](https://commercetools.github.io/nodejs/cli/price-exporter.html) writes data to the CSV file base on the header. This can also be used as a means to filter out undesired data in the CSV file.

Example of the content of a header file
```
variant-sku,value.currencyCode,value.centAmount,country,customerGroup.groupName,channel.key,validFrom,validUntil,customType,customField.foo,customField.bar,customField.current,customField.name.nl,customField.name.de,customField.status,customField.price,customField.priceset
```

The `variant-sku` header is required. It contains the `sku` of the variant where the price belongs to.

For custom fields, the `customType` header is required, it contains the key of the custom type. It is important if you want to parse the csv file via the [csv-parser-price](https://commercetools.github.io/nodejs/cli/csv-parser-price.html) module. Also to export any field in the custom object, the format is like this => `customField.[key of field]`

So if you have a price object like below
```js
{
  ...
  custom: {
    type: {
      key: "my-type"
    }
    fields: {
      foo: "bar",
      localized: {
        de: "Hundefutter",
        en: "dog food"
      }
    }
  }
}
```

You can export the custom field by passing in a header file like below
```
customType,customField.foo,customField.localized.de,customField.localized.en
```

The CSV exported is compatible with the [csv-parser-price](https://commercetools.github.io/nodejs/cli/csv-parser-price.html) module, and can be used to import exported prices to the CTP platform.

### JS
For more direct usage, it is possible to use this module directly:
```js
import PriceExporter from '@commercetools/price-exporter'
import fs from 'fs'

const headers = ['variant-sku', 'value.currencyCode', 'value.centAmount', 'id']
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
    accessToken: '123456yuhgfdwegh675412wefb3rgb',
    delimiter: ',',
    exportFormat: 'csv',
    staged: true,
    csvHeaders: headers,
    predicate: 'productType(id="desired-product-type-id")'
  }
}
const logger = {
  error: console.error,
  warn: console.warn,
  info: console.log,
  verbose: console.debug,
}

const priceExporter = new PriceExporter(options, logger)

// Register error listener
outputStream.on('error', errorHandler)

outputStream.on('finish', () => process.stdout.write('done with export'))

priceExporter.run(outputStream)
```
