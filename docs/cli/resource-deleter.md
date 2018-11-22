# Resource Deleter

A package which delete
commercetools resource like

- [carts](https://docs.commercetools.com/http-api-projects-carts#delete-cart)
- [categories](https://docs.commercetools.com/http-api-projects-categories#delete-category)
- [channels](https://docs.commercetools.com/http-api-projects-channels#delete-channel)
- [customers](https://docs.commercetools.com/http-api-projects-customers#delete-customer)
- [customobjects](https://docs.commercetools.com/http-api-projects-custom-objects#delete-customobject-by-id)
- [customergroups](https://docs.commercetools.com/http-api-projects-customerGroups#delete-customergroup)
- [discountcodes](https://docs.commercetools.com/http-api-projects-discountCodes#delete-discountcode)
- [inventoryentries](https://docs.commercetools.com/http-api-projects-inventory#delete-an-inventoryentry)
- [orders](https://docs.commercetools.com/http-api-projects-orders#delete-order),
- [payments](https://docs.commercetools.com/http-api-projects-payments#delete-payment),
- [productdiscounts](https://docs.commercetools.com/http-api-projects-productDiscounts#delete-productdiscount)
- [products](https://docs.commercetools.com/http-api-projects-products#delete-product)
- [producttypes](https://docs.commercetools.com/http-api-projects-productTypes#delete-producttype)
- [reviews](https://docs.commercetools.com/http-api-projects-reviews#delete-review)
- [shippingmethods](https://docs.commercetools.com/http-api-projects-shippingMethods#delete-shippingmethod)
- [states](https://docs.commercetools.com/http-api-projects-states#delete-state)
- [taxcategories](https://docs.commercetools.com/http-api-projects-taxCategories#delete-taxcategory),
- [types](https://docs.commercetools.com/http-api-projects-types#delete-type)
- [zones](https://docs.commercetools.com/http-api-projects-zones#delete-zone)

from the [commercetools platform](https://docs.commercetools.com/).

## Configuration

The constructor accepts two arguments:

- A required object containing the following values:
  - `apiConfig` (Object): `AuthMiddleware` options for authentication on the commercetools platform. (Required. See [here](https://commercetools.github.io/nodejs/sdk/api/sdkMiddlewareAuth.html#named-arguments-options))
  - `accessToken` (String): [Access token] to be used to authenticate requests to API. Requires scope of [`manage_products`, `manage_customers`, `manage_types`]. More info on how to get the access token [here](https://docs.commercetools.com/http-api-authorization.html#authorization-flows)
  - `resource` (Object): [resource] that need to be deleted.
  - `predicate` (String): Query string specifying (where) predicate. More info on predicates [here](https://docs.commercetools.com/http-api.html#predicates) (Optional)
- An optional logger object having four functions (`info`, `warn`, `error` and `debug`)

## Usage

`npm install @commercetools/resource-deleter --global`

### CLI

```
Usage: resource-deleter [options]
Delete resource from the commercetools platform

Options:
  --help                     Show help text.                           [boolean]
  --version                  Show version number                       [boolean]
  --output, -o               Path to output file.            [default: "stdout"]
  --apiUrl                   The host URL of the HTTP API service.
                                              [default: "https://api.sphere.io"]
  --authUrl                  The host URL of the OAuth API service.
                                             [default: "https://auth.sphere.io"]
  --accessToken              CTP client access token
                             Required scopes: ['manage_products', 'manage_customers', 'manage_types'][string]
  --projectKey, -p           API project key.                         [required]

  --resource, -r             Resource that need to be deleted.        [required]
  --where, -w                specify where predicate
  --logLevel                 Logging level: error, warn, info or debug.
                                                               [default: "info"]
  --prettyLogs               Pretty print logs to the terminal         [boolean]
  --logFile                  Path to file where to save logs file.
                                              [default: "resource-deleter.log"]
```

#### Info on flags

- The `--output` flag specifies where to output the deleted resource. Several notes on this flag:
  - The default location for status report logging is the standard output.
  - If no output path is specified, the deleted resource output will be logged to the standard output as a result, status reports will be logged to a `resource-deleter.log` file in the current directory.
- The `where` flag specifies an optional (where) query predicate to be included in the request. This predicate should be wrapped in single quotes ('single quoted predicate'). More info on predicates [here](https://docs.commercetools.com/http-api.html#predicates)

### JS

For more direct usage, it is possible to use this module directly:

```js
import resourceDeleter from '@commercetools/resource-deleter'
import fs from 'fs'

const options = {
    apiConfig: {
      apiUrl: 'https://api.sphere.io'
      host: 'https://auth.sphere.com'
      project_key: 'PROJECT_KEY',
      credentials: {
        clientId: '*********',
        clientSecret: '*********'
      }
    },
    accessToken: '123456yuhgfdwegh675412wefb4rgb',
    resource: 'my-resource'
    predicate: 'key="my-desired-key"'
    logger: {
        error: console.error,
        warn: console.warn,
        info: console.log,
        debug: console.debug,
    }
  }
}

const resourceDeleter = new resourceDeleter(options)

// Register error listener
outputStream.on('error', errorHandler)

outputStream.on('finish', () => console.log('done with delete'))

resourceDeleter.run()
```
