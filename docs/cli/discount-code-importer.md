# Discount Code Importer

A package that helps with importing [commercetools discount codes](http://dev.commercetools.com/http-api-projects-discountCodes.html) in JSON format to the [commercetools platform](http://dev.commercetools.com/).
This package is built to be used in conjunction with [sphere-node-cli](https://github.com/sphereio/sphere-node-cli)

## Configuration

The constructor may be passed in 2 parameters:
- A required object containing the following values:
  - `apiConfig` (Object): `AuthMiddleware` options for authentication on the commercetools platform. (Required. See [here](https://commercetools.github.io/nodejs/sdk/api/sdkMiddlewareAuth.html#named-arguments-options))
  - `batchSize` (Number): Amount of codes not more than 500 to process concurrently (Optional. Default: 50)
  - `continueOnProblems` (Boolean): Flag whether to continue processing if an error occurs (Optional. Default: false)
- An optional logger object having four functions (`info`, `warn`, `error` and `debug`)

## Usage with `sphere-node-cli`
You can use this package from the [`sphere-node-cli`](https://github.com/sphereio/sphere-node-cli). In order for the cli to import discount codes, the file to import from must be a valid JSON and follow this structure:
```json
[
 {
  "name": {
   "en": "Sammuy",
   "de": "Valerian"
  },
  "description": {
   "en": "some new promo",
   "de": "super Angebot"
  },
  "cartDiscounts": [
   {
    "typeId": "cart-discount",
    "id": "some-cart-discount-id"
   }
  ],
  "cartPredicate": "lineItemTotal(1 = 1) >  \"10.00 USD\"",
  "isActive": true,
  "maxApplications": 10,
  "maxApplicationsPerCustomer": 2,
  "code": "MyDiscountCode1"
 },
 {
  "name": {
   "en": "Sammuy",
   "de": "Valerian"
  },
  "description": {
   "en": "some new promo",
   "de": "super Angebot"
  },
  "cartDiscounts": [
   {
    "typeId": "cart-discount",
    "id": "some-cart-discount-id"
   }
  ],
  "cartPredicate": "lineItemTotal(1 = 1) >  \"20.00 USD\"",
  "isActive": false,
  "maxApplications": 10,
  "maxApplicationsPerCustomer": 2,
  "code": "MyDiscountCode2"
 },
 {
  "name": {
   "en": "Sammuy",
   "de": "Valerian"
  },
  "description": {
   "en": "some new promo",
   "de": "super Angebot"
  },
  "cartDiscounts": [
   {
    "typeId": "cart-discount",
    "id": "some-cart-discount-id"
   }
  ],
  "cartPredicate": "lineItemTotal(1 = 1) >  \"50.00 USD\"",
  "isActive": false,
  "maxApplications": 10,
  "maxApplicationsPerCustomer": 2,
  "code": "MyDiscountCode3"
 },
 ...
]
```
Then you can import this file using the cli:
```bash
sphere-node-cli -t discountCode -p my-project-key -f /sample_dir/codes.json
```
Custom optional configuration can be passed in as described above using the `-c` flag
```bash
sphere-node-cli -t discountCode -p my-project-key -f /sample_dir/codes.json -b 20 -c '{ "continueOnProblems": true }'
```

## Direct Usage
If you would like to have more control, you can also use this module directly in Javascript. To do this, you need to install it:
```bash
npm install @commercetools/discount-code-importer
```
Then you can use it to import discount codes:
```js
import DiscountCodeImport from '@commercetools/discount-code-importer'

const codes = [
 {
  name: {
   en: 'Sammuy',
   de: 'Valerian'
  },
  description: {
   en: 'some new promo',
   de: 'super Angebot'
  },
  cartDiscounts: [
   {
    typeId: 'cart-discount',
    id: 'some-cart-discount-id'
   }
  ],
  cartPredicate: 'lineItemTotal(1 = 1) > "10.00 USD"',
  isActive: true,
  maxApplications: 10,
  maxApplicationsPerCustomer: 2,
  code: 'MyDiscountCode1'
 },
 {
  name: {
   en: 'Sammuy',
   de: 'Valerian'
  },
  description: {
   en: 'some new promo',
   de: 'super Angebot'
  },
  cartDiscounts: [
   {
    typeId: 'cart-discount',
    id: 'some-cart-discount-id'
   }
  ],
  cartPredicate: 'lineItemTotal(1 = 1) > "20.00 USD"',
  isActive: false,
  maxApplications: 10,
  maxApplicationsPerCustomer: 2,
  code: 'MyDiscountCode2'
 },
 {
  name: {
   en: 'Sammuy',
   de: 'Valerian'
  },
  description: {
   en: 'some new promo',
   de: 'super Angebot'
  },
  cartDiscounts: [
   {
    typeId: 'cart-discount',
    id: 'some-cart-discount-id'
   }
  ],
  cartPredicate: 'lineItemTotal(1 = 1) > "50.00 USD"',
  isActive: false,
  maxApplications: 10,
  maxApplicationsPerCustomer: 2,
  code: 'MyDiscountCode3'
 },
 ...
]

const options = {
    apiConfig: {
      host: 'https://auth.commercetools.com'
      project_key: <PROJECT_KEY>,
      credentials: {
        clientId: '*********',
        clientSecret: '*********'
      }
    },
    batchSize: 20,
    continueOnProblems: true
  }
}
const discountCodeImport = new DiscountCodeImport(options)

discountCodeImport.run(codes)
  .then(() => {
  // handle successful import
  })
  .catch((error) => {
  // handle error
  })
```

**Note:** By default, if a discount code already exists, the module tries to build update actions for it, and if no update actions can be built, the code will be ignored
