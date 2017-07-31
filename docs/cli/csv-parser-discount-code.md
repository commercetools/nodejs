# CSV Parser Discount Code

Convert [commercetools discount codes](http://dev.commercetools.com/http-api-projects-discountCodes.html) CSV data to JSON. See example below for CSV format, sample response and usage.

## Usage
`npm install @commercetools/csv-parser-discount-code --global`

### CLI
```
Usage: csvparserdiscountcode [options]
Convert commercetools discount codes CSV data to JSON.

Options:
  --help, -h                 Show help text.                                       [boolean]
  --version, -v              Show version number.                                  [boolean]
  --input, -i                Path to CSV file.                            [default: "stdin"]
  --output, -o               Path to output JSON file.                   [default: "stdout"]
  --delimiter, -d            Used CSV delimiter for input and/or output file. [default: ","]
  --multiValueDelimiter, -m  Used CSV delimiter in multiValue
                               fields for input/output file.                  [default: ";"]
  --continueOnProblems, -c   Flag if parsing should continue if module
                               encounters an error.               [boolean] [default: false]
  --logLevel, -l             Logging level: error, warn, info or verbose.  [default: "info"]
```

#### Info on flags
- The `--input` flag specifies the path to the discount codes CSV file. If this flag is omitted, the module will attempt to read the data from the `standard input`.
- The `--output` flag specifies where to output/save the parsed discount codes as JSON file. Several notes on this flag:
  - If the file specified already exists, it will be overwritten.
  - The default location for status report logging is the standard output.
  - If no output path is specified, the generated codes will be logged to the standard output as a result, status reports will be logged to a `csv-parser-discount-code.log` file in the current directory.
- The `--delimiter` flag specifies the delimiter used in the input file. Defaults to `','` if omitted.
- The `--multiValueDelimiter` flag specifies the delimiter for multiValue cells in CSV. Note that only the `cartDiscounts` field if present should contain multiple values. Defaults to `';'` if omitted.
- The `--continueOnProblems` flag specifies if the module should continue parsing discount codes if it encounters an error. Defaults to `false` if omitted.
  - If the module should continue on error, all errors are logged to the logging location (see above).
  - If the module should not continue on error, the failing error is written to the `stderr`, regardless of the output and logging locations

### JS
For more direct usage, it is possible to use this module directly:
```js
const fs = require('fs')
const CsvParserDiscountCode = require('@commercetools/csv-parser-discount-code')

const csvParser = new CsvParserDiscountCode(logger, configuration)

const inputStream = fs.createReadStream('path-to-input-file.csv')
const outputStream = fs.createWriteStream('path-to-destination.json')

csvParser.parse(inputStream, outputStream)

// Listen for events
outputStream
  .on('error', (error) => {
    // <- Handle errors here
  })
  .on('finish', () => {
    // <- Do something here
  })
```
The constructor takes in 2 optional parameters
- A logger object having four functions (`info`, `warn`, `error` and `debug`)
- A configuration object containing any/all of the following values:
  - `delimiter` (String): Used delimeter in the CSV (Default: `','`)
  - `multiValueDelimiter` (String): Used delimeter in multiValue fields in the CSV (Default: `';'`)
  - `continueOnProblems` (Boolean): Option if module should continue on errors (Default: `false`)

### Examples
If we want to parse 3 discount codes from CSV to JSON; with the following as input:
```csv
name.en,name.de,description.en,description.de,cartDiscounts,cartPredicate,isActive,maxApplications,maxApplicationsPerCustomer,code
James,Flo,some description,eine beschreibung,disc1;disc2;disc3,LineItems > "50",true,9,3,WICd36fsdc
Easter,Oster,some description 4,eine beschreibung 4,disc1;disc2;disc3,LineItems > "50",true,9,3,WIC109axn
Ascension,Feiertag,some good description 5,eine gute beschreibung 5,disc1;disc2;disc3,LineItems > "50",true,9,3,WI10sw34
```
Using the CLI, we could run the following command:
```bash
csvparserdiscountcode -i /path-to-input-file.csv -o /path-to-output.json -c true
```
And the following would be written to the JSON file
```json
[{
  "name": {
    "en": "James",
    "de": "Flo"
  },
  "description": {
    "en": "some description",
    "de": "eine beschreibung"
  },
  "cartDiscounts": [
    {
      "typeId": "cart-discount",
      "id": "disc1"
    },
    {
      "typeId": "cart-discount",
      "id": "disc2"
    },
    {
      "typeId": "cart-discount",
      "id": "disc3"
    }
  ],
  "cartPredicate": "LineItems > \"50\"",
  "isActive": "true",
  "maxApplications": "9",
  "maxApplicationsPerCustomer": "3",
  "code": "WICd36fsdc"
},
{
  "name": {
    "en": "Easter",
    "de": "Oster"
  },
  "description": {
    "en": "some description 4",
    "de": "eine beschreibung 4"
  },
  "cartDiscounts": [
    {
      "typeId": "cart-discount",
      "id": "disc1"
    },
    {
      "typeId": "cart-discount",
      "id": "disc2"
    },
    {
      "typeId": "cart-discount",
      "id": "disc3"
    }
  ],
  "cartPredicate": "LineItems > \"50\"",
  "isActive": "true",
  "maxApplications": "9",
  "maxApplicationsPerCustomer": "3",
  "code": "WIC109axn"
},
{
  "name": {
    "en": "Ascension",
    "de": "Feiertag"
  },
  "description": {
    "en": "some good description 5",
    "de": "eine gute beschreibung 5"
  },
  "cartDiscounts": [
    {
      "typeId": "cart-discount",
      "id": "disc1"
    },
    {
      "typeId": "cart-discount",
      "id": "disc2"
    },
    {
      "typeId": "cart-discount",
      "id": "disc3"
    }
  ],
  "cartPredicate": "LineItems > \"50\"",
  "isActive": "true",
  "maxApplications": "9",
  "maxApplicationsPerCustomer": "3",
  "code": "WI10sw34"
}]
```

#### Additional information
- No field in the csv file is mandatory
- the `cartDiscounts` field should contain a string of cart-discount IDs, delimited by the `multiValueDelimiter`
