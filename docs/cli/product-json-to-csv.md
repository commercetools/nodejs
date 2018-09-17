# Product JSON to CSV Parser

A package that parses [commercetools products](https://docs.commercetools.com/http-api-projects-products.html#product) JSON data to CSV.
The products to be parsed can either be read from a `.json` file or directly [piped in](http://www.gnu.org/software/bash/manual/bash.html#Pipelines) from the [product exporter](https://commercetools.github.io/nodejs/cli/product-exporter.html).

## Usage

`npm install @commercetools/product-json-to-csv --global`

### CLI

```
Usage: product-json-to-csv [options]
Convert commercetools products from JSON to CSV

Options:
  --help, -h                       Show help                                   [boolean]
  --version, -v                    Show version number                         [boolean]
  --projectKey, -p                 API project key                   [string] [required]
  --apiUrl                         The host URL of the HTTP API service         [string]
                                              [default: "https://api.commercetools.com"]
  --authUrl                        The host URL of the OAuth API service        [string]
                                             [default: "https://auth.commercetools.com"]
  --accessToken                    CTP client access token
                                   Required scopes: ['view_products']           [string]
  --template, -t                   CSV file containing your header that defines what you
                                                                          want to export
  --input, -i                      Path from which to read product chunks.
                                                                      [default: "stdin"]
  --output, -o                     Path to output           [string] [default: "stdout"]
  --referenceCategoryBy            Define which identifier should be used for the
                                   categories column. [choices: "name", "key", "externalId",
                                                          "namedPath"] [default: "name"]
  --referenceCategoryOrderHintBy   Define which identifier should be used for the
                                   categoryOrderHints column. [choices: "name", "key",
                                   "externalId", "namedPath"] [default: "name"]
  --fillAllRows                    Define if product attributes like name should be
                                   added to each variant row.                  [boolean]
  --onlyMasterVariants             Export only masterVariants from products.   [boolean]
  --language, -l                   Language used for localised attributes such as
                                   category names.              [string] [default: "en"]
  --delimiter, -d                  Used CSV delimiter.                    [default: ","]
  --multiValueDelimiter, -m        Used CSV delimiter in multiValue fields. [default: ";"]
  --encoding, -e                   Encoding used when saving data to output file
                                                              [string] [default: "utf8"]
  --logLevel                       Logging level: error, warn, info or debug    [string]
                                                                       [default: "info"]
  --prettyLogs                     Pretty print logs to the terminal           [boolean]
  --logFile                        Path to file where logs should be saved      [string]
                                                    [default: "product-json-to-csv.log"]
```

The products to be parsed from JSON to CSV can be passed to this module in one of two ways:

- From a pipe
- From a file

#### Pass products through a pipe

Piping products in JSON to be parsed. This ideally works with the commercetools product exporter. In this scenario, the products are parsed directly after export. More information on pipe streams can be found [here](http://www.gnu.org/software/bash/manual/bash.html#Pipelines)

##### Example

```
$ @commercetools/product-exporter --projectKey <project_key> | @commercetools/product-json-to-csv \
--projectKey <project_key> --template <path_to_template_file> --output <path_to_output_file>
```

#### Pass products from a file

This module also accepts products to be read from a JSON file. This can be done by specifying the `--input` flag

##### Example

```
$ @commercetools@commercetools/product-json-to-csv --projectKey <project_key> --input <path_to_JSON_file> --template <path_to_template_file> --output <path_to_output_file>
```

#### CSV Parser Template

A parser template defines the content of the resulting parsed CSV file, by listing wanted product attribute names as header row. The header column values will be parsed and the resulting CSV file will contain corresponding attribute values of the exported products.

```
# only productType.name, the variant id and localized name (english) will be exported
productType,name.en,variantId
```

For more information about the template, and how to generate a template for products, see [here](https://github.com/sphereio/sphere-node-product-csv-sync#template)

#### Parse without CSV template

Products can however be parsed to CSV without the need to provide a template. In this situation, a zip archive should be passed to the `--output` flag.
If no template file is passed in, one CSV file will be created for each product type.

##### Example

```
$ @commercetools@commercetools/product-json-to-csv --projectKey <project_key> --input <path_to_JSON_file> --output <path_to_zip_archive>.zip
```

---

### JS

For more direct usage, it is possible to use this module directly

#### Configuration

The constructor accepts four arguments:

- `apiConfig` (Object): `AuthMiddleware` options for authentication on the commercetools platform. (Required. See [here](https://commercetools.github.io/nodejs/sdk/api/sdkMiddlewareAuth.html#named-arguments-options))
- `parserConfig` (Object): Internal Parse configurations
  - `categoryBy` (String): Specify which identifier should be used to reference the categories (Options: `name`, `key`, `externalId` and `namedPath`. Default: `name`)
  - `categoryOrderHintBy` (String): Specify which identifier should be used to reference the categoryOrderHints (Options: `name`, `key`, `externalId` and `namedPath`. Default: `name`)
  - `delimiter` (String): Delimiter used to separate cells in the output file (Default: `;`)
  - `fillAllRows` (Boolean): Specify if product attributes like name should be added to each variant row (Default: `false`)
  - `headerFields` (Array<String>): An array of header fields to be passed to CSV. This headerFields array should contain the required columns of the CSV file(Optional. If omitted, a `.zip` file containing one csv file per product type will be created. This is synonymous with the `--template` flag in the CLI)
  - `language` (String): Default language used in resolving localised attributes (except lenums) and category names (Default: `en`)
- `multiValueDelimiter` (String): Delimiter used to separate multivalue items in cells in the output file (Default: `;`)
- An optional logger object having four methods (`info`, `warn`, `error` and `debug`)
- `accessToken` (String): Access token to be used to authenticate requests to API. Requires scope of [`view_products`, `view_customers`]

#### Example

```js
import ProductJsonToCsv from '@commercetools/product-json-to-csv'
import fs from 'fs'

const inputStream = fs.createWriteStream('path_to_JSON_file')
const outputStream = fs.createWriteStream('path_to_CSV_file') // <- or zip file if no headers

const apiConfig = {
  host: 'https://auth.commercetools.com',
  apiUrl: 'https://api.commercetools.com',
  projectKey: 'node-test-project',
  credentials: {
    clientId: '123456hgfds',
    clientSecret: '123456yuhgfdwegh675412wefb3rgb',
  },
}

const headerFields = ['name.en', 'key', 'sku']

const parserConfig = {
  headerFields,
  categoryBy: 'namedPath',
  categoryOrderHintBy: key,
  delimiter: ',',
  fillAllRows: true,
  language: 'en',
  multiValueDelimiter: ';',
}
const logger = {
  error: console.error,
  warn: console.warn,
  info: console.log,
  debug: console.debug,
}
const accessToken = 'my-unique-access-token'

const parser = new ProductJsonToCsv(
  apiConfig,
  exportConfig,
  logger,
  accessToken
)

// Register error listener
outputStream.on('error', errorHandler)

outputStream.on('finish', () => process.stdout.write('Parsing completed'))

parser.run(inputStream, outputStream)
```
