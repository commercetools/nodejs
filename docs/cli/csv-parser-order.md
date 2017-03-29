# CSV Parser Order

[![Travis Build Status][travis-icon]][travis]
[![Codecov Coverage Status][codecov-icon]][codecov]
[![David Dependencies Status][david-icon]][david]
[![David devDependencies Status][david-dev-icon]][david-dev]

Convert [commercetools order](https://dev.commercetools.com/http-api-projects-orders.html) CSV data to JSON. See example below for CSV format and sample response.

## Usage
`npm install @commercetools/csv-parser-order --global`

### CLI
```
Usage: csvparserorder [options]
Convert commercetools order CSV data to JSON.

Options:
  --help, -h        Show help text.                                    [boolean]
  --version, -v     Show version number.                               [boolean]
  --type, -t        Predefined type of csv.
                             [required] [choices: "lineitemstate", "returninfo"]
  --inputFile, -i   Path to input CSV file.                       [default: "stdin"]
  --outputFile, -o  Path to output JSON file.                     [default: "stdout"]
  --batchSize, -b   Number of CSV rows to handle simultaneously.  [default: 100]
  --delimiter, -d   Used CSV delimiter.                           [default: ","]
  --strictMode, -s  Parse CSV strictly.                           [default: true]
  --logLevel, -l    Logging level: error, warn, info or verbose.  [default: "info"]
```

#### Usage

**Line item state parser:**
```
# Command:
csvparserorder -t lineitemstate -i data/lineitemstate-input.csv

# Output:
[
  {"orderNumber":"234","lineItems":[{"id":"123","state":[{"quantity":10,"fromState":"order","toState":"shipped","_fromStateQty":100}]}]}
]
```

**Return info parser:**
```
# Command:
csvparserorder -t returninfo -i data/return-info-sample-input.csv

# Indented output:
[{
	"orderNumber": "123",
	"returnInfo": [{
		"returnTrackingId": "aefa34fe",
		"_returnId": "1",
		"returnDate": "2016-11-01T08:01:19+0000",
		"items": [{
			"quantity": 4,
			"lineItemId": "12ae",
			"comment": "yeah",
			"shipmentState": "shipped"
		}, {
			"quantity": 4,
			"lineItemId": "12ae",
			"comment": "yeah",
			"shipmentState": "not-shipped"
		}]
	}, {
		"returnTrackingId": "aefa34fe",
		"_returnId": "2",
		"returnDate": "2016-11-01T08:01:19+0000",
		"items": [{
			"quantity": 4,
			"lineItemId": "12ae",
			"comment": "yeah",
			"shipmentState": "not-shipped"
		}]
	}]
}, {
	"orderNumber": "124",
	"returnInfo": [{
		"returnTrackingId": "aefa34fe",
		"_returnId": "2",
		"returnDate": "2016-11-01T08:01:19+0000",
		"items": [{
			"quantity": 4,
			"lineItemId": "12ae",
			"comment": "yeah",
			"shipmentState": "not-shipped"
		}]
	}]
}]
```

### JS
```js
const fs = require('fs')
const { LineItemStateCsvParser, AddReturnInfoCsvParser } = require('@commercetools/csv-parser-order')

const parser = new LineItemStateCsvParser({
  logger: {
    error: console.error,
    warn: console.warn,
    info: console.log,
    verbose: console.log
  },
  csvConfig: {
    delimiter: ',',
    batchSize: 100,
    strictMode: true
  }
})

// parser._processData(<CSV OBJECT>) // returns parsed Sphere.io order

parser.parse(
  fs.createReadStream('./input.csv'),
  fs.createWriteStream('./output.json')
)
```
Errors on the level `error` come from events that are fatal and thus stop the stream of data.

## Configuration
Both `LineItemStateCsvParser` and `AddReturnInfoCsvParser` classes accept an object with two fields:
- `logger` takes object with four functions (_optional_)
- `csvConfig` takes configuration for CSV parser (_optional_)
  - `batchSize`: number of CSV rows to handle simultaneously. (_default_: `100`)
  - `delimiter`: the used CSV delimiter (_default_: `,`)
  - `strictMode`: require CSV column length to match headers length (_default_: true)


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
[{
	"orderNumber": "123",
	"returnInfo": [{
		"returnTrackingId": "aefa34fe",
		"_returnId": "1",
		"returnDate": "2016-11-01T08:01:19+0000",
		"items": [{
			"quantity": 4,
			"lineItemId": "12ae",
			"comment": "yeah",
			"shipmentState": "shipped"
		}, {
			"quantity": 4,
			"lineItemId": "12ae",
			"comment": "yeah",
			"shipmentState": "not-shipped"
		}]
	}, {
		"returnTrackingId": "aefa34fe",
		"_returnId": "2",
		"returnDate": "2016-11-01T08:01:19+0000",
		"items": [{
			"quantity": 4,
			"lineItemId": "12ae",
			"comment": "yeah",
			"shipmentState": "not-shipped"
		}]
	}]
}, {
	"orderNumber": "124",
	"returnInfo": [{
		"returnTrackingId": "aefa34fe",
		"_returnId": "2",
		"returnDate": "2016-11-01T08:01:19+0000",
		"items": [{
			"quantity": 4,
			"lineItemId": "12ae",
			"comment": "yeah",
			"shipmentState": "not-shipped"
		}]
	}]
}]
```

Sample lineItemState sample CSV file
```csv
orderNumber,lineItemId,quantity,fromState,toState,actualTransitionDate,_fromStateQty
234,123,10,order,shipped,2016-11-01T08:01:19+0000,100
```

JSON object returned from the conversion of the CSV file above
```json
[{
	"orderNumber": "234",
	"lineItems": [{
		"id": "123",
		"state": [{
			"quantity": 10,
			"fromState": "order",
			"toState": "shipped",
			"_fromStateQty": 100
		}]
	}]
}]
```

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
