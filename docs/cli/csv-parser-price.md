# CSV Parser Price

[![Travis Build Status][travis-icon]][travis]
[![Codecov Coverage Status][codecov-icon]][codecov]
[![David Dependencies Status][david-icon]][david]
[![David devDependencies Status][david-dev-icon]][david-dev]

Convert [commercetools price](https://dev.commercetools.com/http-api-projects-products.html#price) CSV data to JSON. See example below for CSV format and sample response

## Usage
`npm install @commercetools/csv-parser-price --global`

### CLI
```
Usage: csvparserprice [options]
Convert commercetools price CSV data to JSON.

Options:
  --help, -h        Show help text.                                    [boolean]
  --version, -v     Show version number.                               [boolean]
  --inputFile, -i   Path to input CSV file.                   [default: "stdin"]
  --outputFile, -o  Path to output JSON file.                [default: "stdout"]
  --apiUrl          The host URL of the HTTP API service.
                                              [default: "https://api.sphere.io"]
  --authUrl         The host URL of the OAuth API service.
                                             [default: "https://auth.sphere.io"]
  --batchSize, -b   Number of CSV rows to handle simultaneously.  [default: 100]
  --delimiter, -d   Used CSV delimiter.                           [default: ","]
  --accessToken     CTP client access token
  --projectKey, -p  API project key.                                  [required]
  --logLevel        Logging level: error, warn, info or verbose.
                                                               [default: "info"]
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
    accessToken: '<tokenfromapi>'
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


Sample CSV file
```csv
variant-sku,value.currencyCode,value.centAmount,country,customerGroup.groupName,channel.key,validFrom,validUntil,customType,customField.foo,customField.bar,customField.current,customField.name.nl,customField.name.de,customField.status,customField.price,customField.priceset
my-price,EUR,4200,DE,customer-group,my-channel,2016-11-01T08:01:19+0000,2016-12-01T08:03:10+0000,custom-type,12,nac,true,Selwyn,Merkel,Ready,EUR 1200,"1,2,3,5"
my-price2,EUR,4200,DE,customer-group,my-channel,2016-11-01T08:01:19+0000,2016-12-01T08:03:10+0000,custom-type,12,nac,true,Selwyn,Merkel,Ready,EUR 1200,"1,2,3,5"
my-price,EUR,4200,DE,customer-group,my-channel,2016-11-01T08:01:19+0000,2016-12-01T08:03:10+0000,custom-type,12,nac,true,Selwyn,Merkel,Ready,EUR 1200,"1,2,3,5"
```

JSON object returned from the conversion of the CSV file above
```json
{
  "prices": [
    {
      "variant-sku": "my-price",
      "prices": [
        {
          "variant-sku": "my-price",
          "value": {
            "centAmount": 4200
          },
          "country": "DE",
          "customerGroup": {
            "id": "customer-group"
          },
          "channel": {
            "id": "my-channel"
          },
          "validFrom": "2016-11-01T08:01:19+0000",
          "validUntil": "2016-12-01T08:03:10+0000",
          "custom": {
            "type": {},
            "fields": {
              "foo": 12
            }
          }
        },
        {
          "variant-sku": "my-price",
          "value": {
            "centAmount": 4200
          },
          "country": "DE",
          "customerGroup": {
            "id": "customer-group"
          },
          "channel": {
            "id": "my-channel"
          },
          "validFrom": "2016-11-01T08:01:19+0000",
          "validUntil": "2016-12-01T08:03:10+0000",
          "custom": {
            "type": {},
            "fields": {
              "foo": 12
            }
          }
        }
      ]
    },
    {
      "variant-sku": "my-price2",
      "prices": [
        {
          "variant-sku": "my-price2",
          "value": {
            "centAmount": 4200
          },
          "country": "DE",
          "customerGroup": {
            "id": "customer-group"
          },
          "channel": {
            "id": "my-channel"
          },
          "validFrom": "2016-11-01T08:01:19+0000",
          "validUntil": "2016-12-01T08:03:10+0000",
          "custom": {
            "type": {},
            "fields": {
              "foo": 12
            }
          }
        }
      ]
    }
  ]
}
```

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
