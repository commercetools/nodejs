# CSV Parser Orders

[![Travis Build Status][travis-icon]][travis]
[![Codecov Coverage Status][codecov-icon]][codecov]
[![David Dependencies Status][david-icon]][david]
[![David devDependencies Status][david-dev-icon]][david-dev]

Convert [commercetools order](https://docs.commercetools.com/http-api-projects-orders.html) CSV data to JSON. See examples below for supported CSV format and sample responses.

## Usage

`npm install @commercetools/csv-parser-orders --global`

### CLI

```
Usage: csvparserorder [options]
Convert commercetools order CSV data to JSON.

Options:
  --help, -h        Show help text.                              [boolean]
  --version, -v     Show version number.                         [boolean]
  --type, -t        Predefined type of csv.                      [required] [choices: "lineitemstate", "returninfo", "deliveries"]
  --inputFile, -i   Path to input CSV file.                      [default: "stdin"]
  --outputFile, -o  Path to output JSON file.                    [default: "stdout"]
  --batchSize, -b   Number of CSV rows to handle simultaneously. [default: 100]
  --delimiter, -d   Used CSV delimiter.                          [default: ","]
  --encoding, -e    Encoding used in the CSV.                    [default: "utf8"]
  --strictMode, -s  Parse CSV strictly.                          [default: true]
  --logLevel, -l    Logging level: error, warn, info or verbose. [default: "info"]
  --logFile         Path to file where to save logs.             [default: "csvparserorder.log"]
```

#### Usage

##### Line item state parser:

**Command:**

```bash
$ csvparserorder -t lineitemstate -i data/lineitemstate-input.csv
```

**Output:**

```json
[
  {
    "orderNumber": "234",
    "lineItems": [
      {
        "id": "123",
        "state": [
          {
            "quantity": 10,
            "fromState": "order",
            "toState": "shipped",
            "_fromStateQty": 100
          }
        ]
      }
    ]
  }
]
```

##### Return info parser:

**Command:**

```bash
$ csvparserorder -t returninfo -i data/return-info-sample-input.csv
```

**Output:**

```json
[
  {
    "orderNumber": "123",
    "returnInfo": [
      {
        "returnTrackingId": "aefa34fe",
        "_returnId": "1",
        "returnDate": "2016-11-01T08:01:19+0000",
        "items": [
          {
            "quantity": 4,
            "lineItemId": "12ae",
            "comment": "yeah",
            "shipmentState": "shipped"
          },
          {
            "quantity": 4,
            "lineItemId": "12ae",
            "comment": "yeah",
            "shipmentState": "not-shipped"
          }
        ]
      },
      {
        "returnTrackingId": "aefa34fe",
        "_returnId": "2",
        "returnDate": "2016-11-01T08:01:19+0000",
        "items": [
          {
            "quantity": 4,
            "lineItemId": "12ae",
            "comment": "yeah",
            "shipmentState": "not-shipped"
          }
        ]
      }
    ]
  },
  {
    "orderNumber": "124",
    "returnInfo": [
      {
        "returnTrackingId": "aefa34fe",
        "_returnId": "2",
        "returnDate": "2016-11-01T08:01:19+0000",
        "items": [
          {
            "quantity": 4,
            "lineItemId": "12ae",
            "comment": "yeah",
            "shipmentState": "not-shipped"
          }
        ]
      }
    ]
  }
]
```

##### Deliveries parser:

**Command:**

```bash
$ csvparserorder.js -t deliveries -i data/deliveries/delivery.csv
```

**Output:**

```json
[
  {
    "orderNumber": "222",
    "shippingInfo": {
      "deliveries": [
        {
          "id": "1",
          "items": [
            {
              "id": "1",
              "quantity": 100
            },
            {
              "id": "1",
              "quantity": 100
            },
            {
              "id": "2",
              "quantity": 200
            }
          ]
        },
        {
          "id": "2",
          "items": [
            {
              "id": "3",
              "quantity": 300
            }
          ]
        },
        {
          "id": "3",
          "items": [
            {
              "id": "4",
              "quantity": 400
            },
            {
              "id": "5",
              "quantity": 400
            },
            {
              "id": "5",
              "quantity": 400
            },
            {
              "id": "1",
              "quantity": 100
            }
          ]
        }
      ]
    }
  },
  {
    "orderNumber": "100",
    "shippingInfo": {
      "deliveries": [
        {
          "id": "1",
          "items": [
            {
              "id": "4",
              "quantity": 400
            }
          ]
        }
      ]
    }
  }
]
```

### JS

```js
const fs = require('fs')
const {
  LineItemStateCsvParser,
  AddReturnInfoCsvParser,
  DeliveriesCsvParser,
} = require('@commercetools/csv-parser-orders')

const parser = new LineItemStateCsvParser({
  logger: {
    error: console.error,
    warn: console.warn,
    info: console.log,
    verbose: console.log,
  },
  csvConfig: {
    delimiter: ',',
    batchSize: 100,
    strictMode: true,
  },
})

// parser._processData(<CSV OBJECT>) // returns parsed order

parser.parse(
  fs.createReadStream('./input.csv'),
  fs.createWriteStream('./output.json')
)
```

Errors on the level `error` come from events that are fatal and thus stop the stream of data.

## Configuration

All `LineItemStateCsvParser`, `AddReturnInfoCsvParser` and `DeliveriesCsvParser` classes accept an object with two fields:

* `logger` takes object with four functions (_optional_)
* `csvConfig` takes configuration for CSV parser (_optional_)
  * `batchSize`: number of CSV rows to handle simultaneously. (_default_: `100`)
  * `delimiter`: the used CSV delimiter (_default_: `,`)
  * `strictMode`: require CSV column length to match headers length (_default_: true)

## CSV formats

### Return info

Sample returnInfo sample CSV file

```csv
orderNumber,lineItemId,quantity,comment,shipmentState,returnDate,returnTrackingId,_returnId
123,12ae,4,yeah,shipped,2016-11-01T08:01:19+0000,aefa34fe,1
123,12ae,4,yeah,not-shipped,2016-11-01T08:01:19+0000,aefa34fe,1
123,12ae,4,yeah,not-shipped,2016-11-01T08:01:19+0000,aefa34fe,2
124,12ae,4,yeah,not-shipped,2016-11-01T08:01:19+0000,aefa34fe,2
```

JSON object returned from the conversion of the CSV file above

```json
[
  {
    "orderNumber": "123",
    "returnInfo": [
      {
        "returnTrackingId": "aefa34fe",
        "_returnId": "1",
        "returnDate": "2016-11-01T08:01:19+0000",
        "items": [
          {
            "quantity": 4,
            "lineItemId": "12ae",
            "comment": "yeah",
            "shipmentState": "shipped"
          },
          {
            "quantity": 4,
            "lineItemId": "12ae",
            "comment": "yeah",
            "shipmentState": "not-shipped"
          }
        ]
      },
      {
        "returnTrackingId": "aefa34fe",
        "_returnId": "2",
        "returnDate": "2016-11-01T08:01:19+0000",
        "items": [
          {
            "quantity": 4,
            "lineItemId": "12ae",
            "comment": "yeah",
            "shipmentState": "not-shipped"
          }
        ]
      }
    ]
  },
  {
    "orderNumber": "124",
    "returnInfo": [
      {
        "returnTrackingId": "aefa34fe",
        "_returnId": "2",
        "returnDate": "2016-11-01T08:01:19+0000",
        "items": [
          {
            "quantity": 4,
            "lineItemId": "12ae",
            "comment": "yeah",
            "shipmentState": "not-shipped"
          }
        ]
      }
    ]
  }
]
```

### Line item state

Sample lineItemState sample CSV file

```csv
orderNumber,lineItemId,quantity,fromState,toState,actualTransitionDate,_fromStateQty
234,123,10,order,shipped,2016-11-01T08:01:19+0000,100
```

JSON object returned from the conversion of the CSV file above

```json
[
  {
    "orderNumber": "234",
    "lineItems": [
      {
        "id": "123",
        "state": [
          {
            "quantity": 10,
            "fromState": "order",
            "toState": "shipped",
            "_fromStateQty": 100
          }
        ]
      }
    ]
  }
]
```

### Deliveries

CSV file with deliveries have the following format:

```csv
orderNumber,delivery.id,_itemGroupId,item.id,item.quantity,parcel.id,parcel.length,parcel.height,parcel.width,parcel.weight,parcel.trackingId,parcel.carrier,parcel.provider,parcel.providerTransaction,parcel.isReturn,parcel.items
111,1,1,123,1,1,100,200,200,500,123456789,DHL,provider,transaction provider,0,123:1;222:1
111,1,2,222,3,1,100,200,200,500,123456789,DHL,provider,transaction provider,0,123:1;222:1
111,1,1,123,1,2,100,200,200,500,2222222,,abcd,dcba,true,222:2
```

Where CSV fields `orderNumber, delivery.id, _itemGroupId, item.id, item.quantity` are mandatory because every delivery has to have at least one delivery item.

If the CSV file contains measurement fields (`parcel.length, parcel.height, parcel.width, parcel.weight`) all of them has to be provided or the parser returns an error `All measurement fields are mandatory`.

Because an API allows us to save multiple delivery items with same `id` and `quantity` there is `_itemGroupId` field which helps us to distinguish different delivery items. This field has to have a unique value for different delivery items (in example above CSV rows 2 and 3 belongs to one delivery which has 2 delivery items - two different \_itemGroupIds).

Example provided above will be parsed into following JSON:

```json
[
  {
    "orderNumber": "111",
    "shippingInfo": {
      "deliveries": [
        {
          "id": "1",
          "items": [
            {
              "id": "123",
              "quantity": 1
            },
            {
              "id": "222",
              "quantity": 3
            }
          ],
          "parcels": [
            {
              "id": "1",
              "measurements": {
                "heightInMillimeter": 200,
                "lengthInMillimeter": 100,
                "weightInGram": 500,
                "widthInMillimeter": 200
              },
              "trackingData": {
                "carrier": "DHL",
                "isReturn": false,
                "provider": "provider",
                "providerTransaction": "transaction provider",
                "trackingId": "123456789"
              },
              "items": [
                {
                  "id": "123",
                  "quantity": 1
                },
                {
                  "id": "222",
                  "quantity": 1
                }
              ]
            },
            {
              "id": "2",
              "measurements": {
                "heightInMillimeter": 200,
                "lengthInMillimeter": 100,
                "widthInMillimeter": 200,
                "weightInGram": 500
              },
              "trackingData": {
                "isReturn": true,
                "provider": "abcd",
                "providerTransaction": "dcba",
                "trackingId": "2222222"
              },
              "items": [
                {
                  "id": "222",
                  "quantity": 2
                }
              ]
            }
          ]
        }
      ]
    }
  }
]
```

More delivery examples can be seen [here](https://github.com/commercetools/nodejs/tree/master/packages/csv-parser-orders/test/data/deliveries).

[commercetools]: https://commercetools.com/
[commercetools-icon]: https://cdn.rawgit.com/commercetools/press-kit/master/PNG/72DPI/CT%20logo%20horizontal%20RGB%2072dpi.png
[travis]: https://travis-ci.org/commercetools/csv-parser-orders
[travis-icon]: https://img.shields.io/travis/commercetools/csv-parser-orders/master.svg?style=flat-square
[codecov]: https://codecov.io/gh/commercetools/csv-parser-orders
[codecov-icon]: https://img.shields.io/codecov/c/github/commercetools/csv-parser-orders.svg?style=flat-square
[david]: https://david-dm.org/commercetools/csv-parser-orders
[david-icon]: https://img.shields.io/david/commercetools/csv-parser-orders.svg?style=flat-square
[david-dev]: https://david-dm.org/commercetools/csv-parser-orders?type=dev
[david-dev-icon]: https://img.shields.io/david/dev/commercetools/csv-parser-orders.svg?style=flat-square
