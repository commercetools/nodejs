# Customer Erasure

A package which deletes or exports [commercetools customer data](#list-of-customer-data) in `JSON` format from the [commercetools platform](https://docs.commercetools.com/).

## List of customer data

* [Customers](https://docs.commercetools.com/http-api-projects-customers.html)
* [Orders](https://docs.commercetools.com/http-api-projects-orders.html)
* [Carts](https://docs.commercetools.com/http-api-projects-carts.html)
* [Payments](https://docs.commercetools.com/http-api-projects-payments.html)
* [ShoppingLists](https://docs.commercetools.com/http-api-projects-shoppingLists.html)
* [Reviews](https://docs.commercetools.com/http-api-projects-reviews.html)

## Configuration

The constructor accepts two arguments:

* A required object containing the following values:
  * `apiConfig` (Object): `AuthMiddleware` options for authentication on the commercetools platform. (Required. See [here](https://commercetools.github.io/nodejs/sdk/api/sdkMiddlewareAuth.html#named-arguments-options))
  * `accessToken` (String): [Access token] to be used to authenticate requests to API. Requires scope of [`view_products`, `view_orders`, `view_customers`]. More info on how to get the access token [here](https://docs.commercetools.com/http-api-authorization.html#authorization-flows)
* An optional logger object having four functions (`info`, `warn`, `error` and `debug`)

## Usage

`npm install @commercetools/customer-erasure --global`

### CLI

```
Usage: customer-erasure.js [options]
Export and delete all data related to a single customer

Options:
  --help            Show help text.                                    [boolean]
  --version         Show version number                                [boolean]
  --output, -o      Path to output file.                     [default: "stdout"]
  --customerId, -c  Customer to fetch or delete.                      [required]
  --apiUrl          The host URL of the HTTP API service.
                                              [default: "https://api.sphere.io"]
  --authUrl         The host URL of the OAuth API service.
                                             [default: "https://auth.sphere.io"]
  --accessToken     CTP client access token.
  --projectKey, -p  API project key.                                  [required]
  --deleteAll, -D   Delete all data related to customer.               [boolean]
  --logLevel        Logging level: error, warn, info or debug. [default: "info"]
  --prettyLogs      Pretty print logs to the terminal                  [boolean]
  --logFile         Path to where to save logs file.
                                      [string] [default: "customer-erasure.log"]
```

#### Info on flags

* The `--deleteAll` flag deletes all information related to the customer and can not be undone.
* The `--output` flag specifies where to output/save the exported customer data. Several notes on this flag:
  * If the file specified already exists, it will be overwritten.
  * The default location for status report logging is the standard output.
  * If no output path is specified, the exported data will be logged to the standard output as a result, status reports will be logged to a `customer-erasure.log` file in the current directory.

### JS

For more direct usage, it is possible to use this module directly:

```js
import CustomerErasure from '@commercetools/customer-erasure'
import fs from 'fs'

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
  }
}
const logger = {
  error: console.error,
  warn: console.warn,
  info: console.log,
  debug: console.debug,
}

const CustomerErasure = new CustomerErasure(options, logger)

// function to get all data related to customer
CustomerErasure.getCustomerData(outputStream)

// function to delete all data related to customer
CustomerErasure.deleteAll(outputStream)
```
