[![commercetools logo][commercetools-icon]][commercetools]

# CSV Parser Price
[![Travis Build Status][travis-icon]][travis]
[![Codecov Coverage Status][codecov-icon]][codecov]
[![David Dependencies Status][david-icon]][david]
[![David devDependencies Status][david-dev-icon]][david-dev]

Convert [commercetools price](https://dev.commercetools.com/http-api-projects-products.html#price) CSV data to JSON. See [this CSV with example data](test/helpers/sample.csv) for the expected headers and data.

## Usage
`npm install @commercetools/csv-parser-price --global`

### CLI
```
Usage: csvparserprice [options]
Convert commercetools price CSV data to JSON.

Options:
  --help, -h        Show help text.                                    [boolean]
  --version, -v     Show version number.                               [boolean]
                                                               [default: "info"]
                  REGENERATE THIS
```

### JS
```js
const fs = require('fs');
const CsvParserPrice = require('@commercetools/csv-parser-price');

const csvParserPrice = new CsvParserPrice(
  {
      projectKey: process.env.CT_PROJECT_KEY,
      credentials: {
        clientId: process.env.CT_CLIENT_ID,
        clientSecret: process.env.CT_CLIENT_SECRET,
      },
  },
  {
    error: console.error,
    warn: console.warn,
    info: console.log,
    verbose: console.log,
  },
  {
    delimiter: '^',
  }
);

csvParserPrice.parse(
  fs.createReadStream('./input.csv'),
  fs.createWriteStream('./output.json')
);
```
Errors on the level `error` come from events that are fatal and thus stop the stream of data.

## Configuration
`CsvParserPrice` accepts three objects as arguments:
- API client credentials for the [authentication middleware](https://commercetools.github.io/nodejs/docs/sdk/api/createAuthMiddlewareForClientCredentialsFlow.html) (_required_)
- Logger takes object with four functions (_optional_)
- Config (_optional_)
  - `batchSize`: number of CSV rows to handle simultaneously. (_default_: `100`)
  - `delimiter`: the used CSV delimiter (_default_: `,`)

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for info on contributing.

[commercetools]: https://commercetools.com/
[commercetools-icon]: https://cdn.rawgit.com/commercetools/press-kit/master/PNG/72DPI/CT%20logo%20horizontal%20RGB%2072dpi.png
[travis]: https://travis-ci.org/commercetools/csv-parser-price
[travis-icon]: https://img.shields.io/travis/commercetools/csv-parser-price/master.svg?style=flat-square
[codecov]: https://codecov.io/gh/commercetools/csv-parser-price
[codecov-icon]: https://img.shields.io/codecov/c/github/commercetools/csv-parser-price.svg?style=flat-square
[david]: https://david-dm.org/commercetools/csv-parser-price
[david-icon]: https://img.shields.io/david/commercetools/csv-parser-price.svg?style=flat-square
[david-dev]: https://david-dm.org/commercetools/csv-parser-price?type=dev
[david-dev-icon]: https://img.shields.io/david/dev/commercetools/csv-parser-price.svg?style=flat-square
