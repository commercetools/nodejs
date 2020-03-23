# Customer Groups Exporter

A package which exports [commercetools customer groups](https://docs.commercetools.com/http-api-projects-customerGroups.html) in `JSON` format from the [commercetools platform](https://docs.commercetools.com/).

## Configuration

The constructor accepts two arguments:

- A required object containing the following values:
  - `apiConfig` (Object): `AuthMiddleware` options for authentication on the commercetools platform. (Required. See [here](https://commercetools.github.io/nodejs/sdk/api/sdkMiddlewareAuth.html#named-arguments-options))
  - `accessToken` (String): [Access token] to be used to authenticate requests to API. Requires scope of [`view_customers`]. More info on how to get the access token [here](https://docs.commercetools.com/http-api-authorization.html#authorization-flows)
  - `predicate` (String): Query string specifying (where) predicate. More info on predicates [here](https://docs.commercetools.com/http-api-query-predicates) (Optional)
- An optional logger object having four functions (`info`, `warn`, `error` and `debug`)

## Usage

`npm install @commercetools/customer-groups-exporter --global`

### CLI

```
Usage: customer-groups-exporter [options]
Export customer groups from the commercetools platform

Options:
  --help                     Show help text.                           [boolean]
  --version                  Show version number                       [boolean]
  --output, -o               Path to output file.            [default: "stdout"]
  --apiUrl                   The host URL of the HTTP API service.
                                              [default: "https://api.europe-west1.gcp.commercetools.com"]
  --authUrl                  The host URL of the OAuth API service.
                                             [default: "https://auth.europe-west1.gcp.commercetools.com"]
  --accessToken              CTP client access token
  --projectKey, -p           API project key.                         [required]
  --where, -w                specify where predicate
  --logLevel                 Logging level: error, warn, info or debug.
                                                               [default: "info"]
  --prettyLogs               Pretty print logs to the terminal         [boolean]
  --logFile                  Path to file where to save logs.
                                           [default: "customer-groups-export.log"]
```

#### Info on flags

- The `--output` flag specifies where to output/save the exported customer groups. Several notes on this flag:
  - If the file specified already exists, it will be overwritten.
  - The default location for status report logging is the standard output.
  - If no output path is specified, the exported groups will be logged to the standard output as a result, status reports will be logged to a `customer-groups-export.log` file in the current directory.
- The `where` flag specifies an optional (where) query predicate to be included in the request. This predicate should be wrapped in single quotes ('single quoted predicate'). More info on predicates [here](https://docs.commercetools.com/http-api-query-predicates)

### JS

For more direct usage, it is possible to use this module directly:

```js
import CustomerGroupsExport from '@commercetools/customer-groups-exporter'
import fs from 'fs'

const options = {
    apiConfig: {
      apiUrl: 'https://api.europe-west1.gcp.commercetools.com'
      host: 'https://auth.sphere.com'
      project_key: <PROJECT_KEY>,
      credentials: {
        clientId: '*********',
        clientSecret: '*********'
      }
    },
    accessToken: '123456yuhgfdwegh675412wefb3rgb',
    predicate: 'key="desired-key"'
  }
}
const logger = {
  error: console.error,
  warn: console.warn,
  info: console.log,
  debug: console.debug,
}

const CustomerGroupsExport = new CustomerGroupsExport(options, logger)

// Register error listener
outputStream.on('error', errorHandler)

outputStream.on('finish', () => console.log('done with export'))

CustomerGroupsExport.run(outputStream)
```
