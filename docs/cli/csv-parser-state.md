# CSV Parser State

Convert [commercetools states](https://docs.commercetools.com/http-api-projects-states.html#state) CSV data to JSON. See example below for CSV format, sample response and usage.

## Usage
`npm install @commercetools/csv-parser-state --global`

### CLI
```
Usage: csv-parser-state.js [options]
Package to parse states from CSV to JSON

Options:
  --help, -h                 Show help                                 [boolean]
  --version, -v              Show version number                       [boolean]
  --projectKey, -p           API project key                            [string]
  --apiUrl                   The host URL of the HTTP API service
                             [string] [default: "https://api.commercetools.com"]
  --authUrl                  The host URL of the OAuth API service
                            [string] [default: "https://auth.commercetools.com"]
  --accessToken              CTP client access token
                             Required scopes: ['view_orders']         [string]
  --input, -i                Path to CSV file.                [default: "stdin"]
  --output, -o               Path to output JSON file
                                                    [string] [default: "stdout"]
  --delimiter, -d            Used CSV delimiter.                  [default: ","]
  --multiValueDelimiter, -m  Used CSV delimiter in multiValue fields.
                                                                  [default: ";"]
  --continueOnProblems, -c   Flag if parsing should continue if module
                             encounters an error.     [boolean] [default: false]
  --logLevel                 Logging level: error, warn, info or debug
                                                      [string] [default: "info"]
  --prettyLogs               Pretty print logs to the terminal         [boolean]
  --logFile                  Path to file where logs should be saved
                                   [string] [default: "csv-parser-state.log"]
```

#### Info on flags
- The `--projectKey` is only required if states have a `transitions` field containing one or more states that need to be resolved, otherwise it can be omitted. More info in the **Examples** below
- The `--input` flag specifies the path to the states CSV file. If this flag is omitted, the module will attempt to read the data from the `standard input`.
- The `--output` flag specifies where to output/save the parsed states as JSON file. Several notes on this flag:
  - If the file specified already exists, it will be overwritten.
  - If no output path is specified, the parsed states will be written to the standard output. As a result, status reports will be logged to a `csv-parser-state.log` file in the current directory.
- The `--delimiter` flag specifies the delimiter used in the input file. Defaults to `','` if omitted.
- The `--multiValueDelimiter` flag specifies the delimiter for multiValue cells in CSV. Note that only the `transitions` and `roles` fields if present should contain multiple values. Defaults to `';'` if omitted.
- The `--continueOnProblems` flag specifies if the module should continue parsing states if it encounters an error. Defaults to `false` if omitted.
  - If the module should continue on error, all errors are logged to the logging location (see above).
  - If the module should not continue on error, the failing error is written to the `stderr`, regardless of the output and logging locations

### JS
For more direct usage, it is possible to use this module directly:
```js
const fs = require('fs')
const CsvParserState = require('@commercetools/csv-parser-state')

const csvParser = new CsvParserState(configuration, logger)

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
- A configuration object containing any/all of the following values:
  - `apiConfig` (Object): `AuthMiddleware` options for authentication on the commercetools platform. (only required if states have a `transitions` field containing one or more states that need to be resolved. See [here](https://commercetools.github.io/nodejs/sdk/api/sdkMiddlewareAuth.html#named-arguments-options))
  - `csvConfig` (Object): A configuration object for describing the CSV file:
    - `delimiter` (String): Used delimiter in the CSV (Default: `','`)
    - `multiValueDelimiter` (String): Used delimiter in multiValue fields in the CSV (Default: `';'`)
  - `accessToken` (String): Access token to be used to authenticate requests to API. Requires scope of [`view_orders`]
  - `continueOnProblems` (Boolean): Option if module should continue on errors (Default: `false`)
- A logger object having four functions (`info`, `warn`, `error` and `debug`)

### CSV Notes
The CSV **transitions** in the CSV file should contain the list of state keys that can be transitioned to. This keys should be separated by the supplied `multiValueDelimiter`. A valid CSV file with valid transitions using the default `multiValueDelimiter` (`;`) is given below:
```csv
name.en,key,type,initial,transitions
James,state-key,OrderState,true,Initial;some-state-key;another-state-key
```

### Examples
If we want to parse 3 states from CSV to JSON; with the following as input:
```csv
name.en,name.de,description.en,description.de,key,type,initial,transitions
James,Flo,some description,eine beschreibung,state-key-1,OrderState,true,Initial
Easter,Oster,some description 4,eine beschreibung 4,state-key-2,ProductState,false,Initial;some-state-key;another-state-key
Ascension,Feiertag,some good description 5,eine gute beschreibung 5,state-key-3,LineItemState,false,
```
Using the CLI, we could run the following command:
```bash
csv-parser-state -p my-project-key -i /path-to-input-file.csv -o /path-to-output.json
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
  "key": "state-key-1",
  "type": "OrderState",
  "initial": true,
  "transitions": [
    {
      "typeId": "state",
      "id": "<Initial-state-id>"
    }
  ]
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
  "key": "state-key-2",
  "type": "ProductState",
  "initial": false,
  "transitions": [
    {
      "typeId": "state",
      "id": "<Initial-state-id>"
    },
    {
      "typeId": "state",
      "id": "<some-state-id>"
    },
    {
      "typeId": "state",
      "id": "<another-state-id>"
    }
  ]
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
  "key": "state-key-3",
  "type": "LineItemState",
  "initial": false
}]
```
