# @commercetools/api-response-normalizer

Helper functions to normalize api responses.

## Install

```bash
npm install --save @commercetools/api-response-normalizer
```

## Details

* Reference expansion descriptors (`{ typeId, id, obj }`) will be kept
* The normalization happens within `obj`
* `Reference` types will not be normalized

## Example

### Querying a single resource

Suppose you queried `/:project-key/customers/:customer-id` and received the
following response:

```json
{
  "id": "9199f748-9d75-448a-8d06-d60a6c126ce6",
  "version": 2,
  "firstName": "Alicia",
  "lastName": "Williams",
  "addresses": [
    {
      "id": "fD2hQNpd",
      "title": "fsdfs",
      "salutation": "ds"
    }
  ],
  "customerGroup": {
    "typeId": "customer-group",
    "id": "0060effa-ee62-4adb-a455-5893dfb5c617",
    "obj": {
      "id": "0060effa-ee62-4adb-a455-5893dfb5c617",
      "version": 1,
      "name": "B2C",
      "createdAt": "2016-08-29T16:25:09.690Z",
      "lastModifiedAt": "2016-08-29T16:25:09.690Z"
    }
  },
  "companyName": "example",
  "createdAt": "2016-09-09T16:08:11.846Z"
}
```

Notice that `customerGroup` was expanded in this request, hence
`customerGroup.obj` exists. To normalize this response you can leverage this
package.

```js
import { normalizeCustomersResponse } from '@commercetools/api-response-normalizer'

const response = {
  /* the response object described above */
}

const normalizedResponse = normalizeCustomersResponse(response)
```

`normalizedResponse`'s value will now be the normalized response:

```json
{
  "entities": {
    "customerGroups": {
      "0060effa-ee62-4adb-a455-5893dfb5c617": {
        "createdAt": "2016-08-29T16:25:09.690Z",
        "id": "0060effa-ee62-4adb-a455-5893dfb5c617",
        "lastModifiedAt": "2016-08-29T16:25:09.690Z",
        "name": "B2C",
        "version": 1
      }
    },
    "customers": {
      "9199f748-9d75-448a-8d06-d60a6c126ce6": {
        "addresses": [
          {
            "id": "fD2hQNpd",
            "salutation": "ds",
            "title": "fsdfs"
          }
        ],
        "companyName": "example",
        "createdAt": "2016-09-09T16:08:11.846Z",
        "customerGroup": {
          "id": "0060effa-ee62-4adb-a455-5893dfb5c617",
          "obj": "0060effa-ee62-4adb-a455-5893dfb5c617",
          "typeId": "customer-group"
        },
        "firstName": "Alicia",
        "id": "9199f748-9d75-448a-8d06-d60a6c126ce6",
        "lastName": "Williams",
        "version": 2
      }
    }
  },
  "result": "9199f748-9d75-448a-8d06-d60a6c126ce6"
}
```

Or, to show it more condensed:

```js
// before
{
  id: 'customer-id-1',
  firstName: 'Alicia',
  customerGroup: { obj: { id: 'customer-group-id-1', name: 'B2C' } }
}

// after
{
  entities: {
    customers: {
      'customer-id-1': {
        firstName: 'Alicia',
        customerGroup: { obj: 'customer-group-id-1' }
      }
    },
    customerGroups: {
      'customer-group-id-1': {
        id: 'customer-group-id-1',
        name: 'B2C'
      }
    }
  },
  result: 'customer-id-1'
}
```

### Querying a list

When querying a list like `/:project-key/customers` the result will be
normalized as well.

```json
{
  "limit": 2,
  "offset": 0,
  "count": 2,
  "total": 105,
  "results": [
    {
      "id": "customer-id-1",
      "version": 2,
      "customerGroup": {
        "typeId": "customer-group",
        "id": "customer-group-id-1",
        "obj": {
          "id": "customer-group-id-1",
          "version": 1,
          "name": "B2C"
        }
      }
    },
    {
      "id": "customer-id-2",
      "version": 40,
      "customerGroup": {
        "typeId": "customer-group",
        "id": "customer-group-id-2",
        "obj": {
          "id": "customer-group-id-2",
          "version": 1,
          "name": "VIP"
        }
      }
    }
  ]
}
```

```js
import { normalizeCustomersResponse } from '@commercetools/api-response-normalizer'

const response = {
  /* the response object described above */
}

const normalizedResponse = normalizeCustomersResponse(response)
```

`normalizedResponse`'s value will now be the normalized response:

```json
{
  "entities": {
    "customers": {
      "customer-id-1": {
        "id": "customer-id-1",
        "version": 2,
        "customerGroup": {
          "typeId": "customer-group",
          "id": "customer-group-id-1",
          "obj": "customer-group-id-1"
        }
      },
      "customer-id-2": {
        "id": "customer-id-2",
        "version": 40,
        "customerGroup": {
          "typeId": "customer-group",
          "id": "customer-group-id-2",
          "obj": "customer-group-id-2"
        }
      }
    },
    "customerGroups": {
      "customer-group-id-1": {
        "id": "customer-group-id-1",
        "version": 1,
        "name": "B2C"
      },
      "customer-group-id-2": {
        "id": "customer-group-id-2",
        "version": 1,
        "name": "VIP"
      }
    }
  },
  "result": {
    "limit": 2,
    "offset": 0,
    "count": 2,
    "total": 105,
    "results": ["customer-id-1", "customer-id-2"]
  }
}
```

## Supported endpoints

These endpoints are supported by each exported function:

* `normalizeProductsResponse`
  * `/products`
  * `/products/:id`
* `normalizeCustomersResponse`
  * `/customers`
  * `/customers/:id`
* `normalizeProductTypesResponse`
  * `/product-types`
  * `/product-types/:id`
* `normalizeCartDiscountsResponse`
  * `/cart-discounts`
  * `/cart-discounts/:id`
* `normalizeProductDiscountsResponse`
  * `/product-discounts`
  * `/product-discounts/:id`

## Entities and Types

These entities are supported

* ✅ Product
* ✅ ProductCatalogData
* ✅ ProductData
* ✅ ProductVariant
* ✅ Category
* ✅ Price
* ✅ DiscountedPrice
* ✅ ProductDiscount
* ✅ ScopedPrince
* ✅ Channel
* ✅ Asset
* ✅ Type
* ✅ Customer
* ✅ Address
* ✅ ProductType
* ✅ CartDiscount
* ✅ ProductDiscount
