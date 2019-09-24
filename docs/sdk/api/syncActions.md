# `sync-actions`

Provides an API to construct update actions. Useful for building [request](/sdk/Glossary.md#clientrequest) `body` for updates.

## Install

#### Node.js

```bash
npm install --save @commercetools/sync-actions
```

#### Browser

```html
<script src="https://unpkg.com/@commercetools/sync-actions/dist/commercetools-sync-actions.umd.min.js"></script>
<script>
  // global: CommercetoolsSyncActions
</script>
```

## `createSyncCategories(actionGroups)`

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for _categories_.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.

#### Usage example

```js
import { createSyncCategories } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncCategories = createSyncCategories()
const client = createClient({
  middlewares: [...],
})
const before = {
  name: { en: 'My Category' }
}
const now = {
  name: { en: 'My Category', de: 'Meine Kategorie' }
}
const actions = syncCategories.buildActions(now, before)
const categoriesRequest = {
  url: `/categories/${before.id}`,
  method: 'POST',
  body: JSON.stringify({ version: before.version, actions }),
}

client.execute(categoriesRequest)
.then(result => ...)
.catch(error => ...)
```

## `createSyncCustomers(actionGroups)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for _customers_.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.

#### Usage example

```js
import { createSyncCustomers } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncCustomers = createSyncCustomers()
const client = createClient({
  middlewares: [...],
})
const before = {
  firstName: 'John'
}
const now = {
  firstName: 'John',
  lastName: 'Doe'
}
const actions = syncCustomers.buildActions(now, before)
const customersRequest = {
  url: `/customers/${before.id}`,
  method: 'POST',
  body: JSON.stringify({ version: before.version, actions }),
}

client.execute(customersRequest)
.then(result => ...)
.catch(error => ...)
```

## `createSyncInventories(actionGroups)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for _inventories_.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.

#### Usage example

```js
import { createSyncInventories } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncInventories = createSyncInventories()
const client = createClient({
  middlewares: [...],
})
const before = {
  quantityOnStock: 10
}
const now = {
  quantityOnStock: 5
}
const actions = syncInventories.buildActions(now, before)
const inventoriesRequest = {
  url: `/inventory/${before.id}`,
  method: 'POST',
  body: JSON.stringify({ version: before.version, actions }),
}

client.execute(inventoriesRequest)
.then(result => ...)
.catch(error => ...)
```

## `createSyncOrders(actionGroups)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for _orders_.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.

#### Usage example

```js
import { createSyncOrders } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncOrders = createSyncOrders()
const client = createClient({
  middlewares: [...],
})
const before = {
  orderState: 'Open'
}
const now = {
  orderState: 'Complete'
}
const actions = syncOrders.buildActions(now, before)
const ordersRequest = {
  url: `/orders/${before.id}`,
  method: 'POST',
  body: JSON.stringify({ version: before.version, actions }),
}

client.execute(ordersRequest)
.then(result => ...)
.catch(error => ...)
```

## `createSyncProducts(actionGroups)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for _products_.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.

#### Usage example

```js
import { createSyncProducts } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncProducts = createSyncProducts()
const client = createClient({
  middlewares: [...],
})
const before = {
  name: { en: 'My Product' }
}
const now = {
  name: { en: 'My Product', de: 'Mein Produkt' }
}
const actions = syncProducts.buildActions(now, before)
const productsRequest = {
  url: `/products/${before.id}`,
  method: 'POST',
  body: JSON.stringify({ version: before.version, actions }),
}

client.execute(productsRequest)
.then(result => ...)
.catch(error => ...)
```

## `createSyncProductDiscounts(actionGroups)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for _product-discounts_.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.

#### Usage example

```js
import { createSyncProductDiscounts } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncProductDiscounts = createSyncProductDiscounts()
const client = createClient({
  middlewares: [...],
})
const before = {
  name: { en: 'My Product Discount' }
}
const now = {
  name: { en: 'My Product Discount', de: 'Mein Produkt Rabatt' }
}
const actions = syncProductDiscounts.buildActions(now, before)
const productDiscountsRequests = {
  url: `/product-discounts/${before.id}`,
  method: 'POST',
  body: JSON.stringify({ version: before.version, actions }),
}

client.execute(productDiscountsRequests)
.then(result => ...)
.catch(error => ...)
```

## `createSyncDiscountCodes(actionGroups)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for _discount-codes_.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.

#### Usage example

```js
import { createSyncDiscountCodes } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncDiscountCodes = createSyncDiscountCodes()
const client = createClient({
  middlewares: [...],
})
const before = {
  name: { en: 'My Discount Code' }
}
const now = {
  name: { en: 'My Discount Code', de: 'Mein Rabatt Code' }
}
const actions = syncDiscountCodes.buildActions(now, before)
const discountCodesRequest = {
  url: `/discount-codes/${before.id}`,
  method: 'POST',
  body: JSON.stringify({ version: before.version, actions }),
}

client.execute(discountCodesRequest)
.then(result => ...)
.catch(error => ...)
```

## `createSyncCustomerGroup(actionGroups)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for _customer-groups_.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.

#### Usage example

```js
import { createSyncCustomerGroup } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncCustomerGroups = createSyncCustomerGroup()
const client = createClient({
  middlewares: [...],
})
const before = {
  name: 'My customer group',
  key: 'some-old-key'
}
const now = {
  name: 'My new customer group',
  key: 'some-new-key'
}
const actions = syncCustomerGroups.buildActions(now, before)
const customerGroupRequest = {
  url: `/customer-groups/${before.id}`,
  method: 'POST',
  body: JSON.stringify({ version: before.version, actions }),
}

client.execute(customerGroupRequest)
.then(result => ...)
.catch(error => ...)
```

## `createSyncCartDiscounts(actionGroups)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for _cart-discounts_.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.

#### Usage example

```js
import { createSyncCartDiscounts } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncCartDiscounts = createSyncCartDiscounts()
const client = createClient({
  middlewares: [...],
})
const before = {
  name: { en: 'My Cart Discount' }
}
const now = {
  name: { en: 'My Cart Discount', de: 'Mein Warenkorbrabatt' }
}
const actions = syncCartDiscounts.buildActions(now, before)
const cartDiscountsRequests = {
  url: `/cart-discounts/${before.id}`,
  method: 'POST',
  body: JSON.stringify({ version: before.version, actions }),
}

client.execute(cartDiscountsRequests)
.then(result => ...)
.catch(error => ...)
```

## `createSyncTaxCategories(actionGroups)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for _tax-categories_.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.

#### Usage example

```js
import { createSyncTaxCategories } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncTaxCategories = createSyncTaxCategories()
const client = createClient({
  middlewares: [...],
})
const before = {
  name: 'My Tax Category'
}
const now = {
  name: 'My Updated Tax Category'
}
const actions = syncTaxCategories.buildActions(now, before)
const taxCategoriesRequests = {
  url: `/tax-categories/${before.id}`,
  method: 'POST',
  body: JSON.stringify({ version: before.version, actions }),
}

client.execute(taxCategoriesRequests)
.then(result => ...)
.catch(error => ...)
```

## `createSyncZones(actionGroups)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for _zones_.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.

#### Usage example

```js
import { createSyncZones } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncZones = createSyncZones()
const client = createClient({
  middlewares: [...],
})
const before = {
  name: 'My Zone'
}
const now = {
  name: 'My Other Zone'
}
const actions = syncZones.buildActions(now, before)
const zonesRequests = {
  url: `/zones/${before.id}`,
  method: 'POST',
  body: JSON.stringify({ version: before.version, actions }),
}

client.execute(zonesRequests)
.then(result => ...)
.catch(error => ...)
```

## `createSyncProductTypes(actionGroups, config)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for [_productTypes_](https://docs.commercetools.com/http-api-projects-productTypes.html).

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.
2.  `config` _(Object)_: A configuration object to which has one of the following options:

| Key                     | Type      | Required             | Description                                                                                                            |
| ----------------------- | --------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `shouldOmitEmptyString` | `Boolean` | - (default: `false`) | a flag which determines whether we should treat empty strings as **NOT A VALUE** in addition to `undefined` and `null` |

#### Usage example

```js
import { createSyncProductTypes } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncProductTypes = createSyncProductTypes()
const client = createClient({
  middlewares: [...],
})

const before = {
  id: 'product-type-id',
  name: 'Product Type',
  version: 1,
}

const now = {
  id: 'product-type-id',
  name: 'Other Product Type',
  version: 1,
}

const actions = syncProductTypes.buildActions(now, before)
const productTypesRequest = {
  url: `/product-types/${before.id}`,
  method: 'POST',
  body: JSON.stringify({ version: before.version, actions }),
}

client.execute(productTypesRequest)
.then(result => ...)
.catch(error => ...)
```

## `createSyncStores(actionGroups)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for _stores_.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.

#### Usage example

```js
import { createSyncStores } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncStores = createSyncStores()
const client = createClient({
  middlewares: [...],
})
const before = {
  id: 'store-1',
  version: 2,
  name: { locale: 'en', value: 'Germany' },
  languages: 'en'
}
const now = {
  name: [
    { locale: 'en', value: 'Germany' },
    { locale: 'de', value: 'Deutschland' },
  ],
  languages: ['de', 'en']
}
const actions = syncStores.buildActions(now, before)
const storesRequest = {
  url: `/stores/${before.id}`,
  method: 'POST',
  body: JSON.stringify({ version: before.version, actions }),
}

client.execute(storesRequest)
.then(result => ...)
.catch(error => ...)
```

#### Difference to sync-actions for other resources

Unlike other resources (e.g `createSyncProducts`), `createSyncProductTypes` requires that you apply hints to calculate update actions for nested values such as `attributes` and `enumValues`.

Since a [change in the API](https://docs.commercetools.com/release-notes.html#releases-2018-03-09-product-type-rename-name-and-enum-key), the [previous implementation was not capable for calculating appropiate update-actions](https://github.com/commercetools/nodejs/pull/760#issue-213684712) when an enum-value has changed its `key`, or when an attribute has changed its `name`.

The `key` of an enum value was used as its identifier to calculate correct update-actions. When the intention of a change was `changeEnumKey`, it is discernable for `sync-actions` to appropriately calculate that for you. Same goes for attribute values.

Note: `createSyncProductTypes` does not support `changeAttributeName` nor `changeEnumKey` for the moment, but this is something we will add in, in the near future.

**here is how you apply hints**

```js
const productTypeSync = createProductTypeSync()
const previous = {
  name: 'previous',
}
const next = {
  name: 'next',
}

const updateActions = productTypeSync.buildActions(next, previous, {
  // hints
  nestedValuesChanges: {
    attributeDefinitions: [
      {
        // when previous and next are defined
        // this will generate update actions for __changes__ to an attribute
        previous: { name: 'previous-attribute-name' },
        next: { name: 'next-attribute-name' },
      },
      {
        // when next is defined, but not previous
        // this will generate update actions for __adding__ an attribute
        previous: undefined,
        next: { name: 'next-attribute-name' },
      },
      {
        // when previous is defined, but not next,
        // this will generate update actions for __removing__ an attribute
        previous: { name: 'next-attribute-name' },
        next: undefined,
      },
      // ...
      // any other changes to another attribute...
    ],
    attributeEnumValues: [
      {
        previous: { key: 'previous-enum-key' },
        next: { key: 'next-enum-key' },
        hint: {
          // note the change on attribute above.
          attributeName: 'next-attribute-name',
          // isLocalized is a valuable hint to `sync-actions`, since in the API,
          // we have different update actions on an enum value depending on whether the label is localized or not.
          // read more about `changePlainEnumValueLabel` and `changeLocalizedEnumValueLabel`
          // https://docs.commercetools.com/http-api-projects-productTypes.html#change-the-label-of-an-enumvalue
          isLocalized: false,
        },
      },
      {
        previous: { key: 'previous-enum-key-2' },
        next: undefined,
        hint: {
          // note the change on attribute above.
          attributeName: 'next-attribute-name',
          isLocalized: false,
        },
      },
      // ...
      // any other changes on enum values of another attribute...
    ],
  },
})
console.log(updateActions)
// [
//   // product type changes..
//   {
//     action: 'changeName',
//     name: 'next-attribute-name'
//   },
//
//   // these are calculated separately, only through `nestedValuesChanges` hints
//   // because hint are __explicit__, we don't worry about identifiers such as `key` (enum) or `name` (attribute).
//   // attribute
//   {
//     action: 'changeAttributeName',
//     attributeName: 'next-attribute-name'
//   },
//
//   //  enums
//   {
//     action: 'changeEnumKey',
//     key: 'next-enum-key'
//   },
//   {
//     action: 'removeEnumValues'
//     attributeName: 'next-attribute-name'
//     keys: ['previous-enum-key-2'],
//   }
// ]
```

## `createSyncShippingMethods(actionGroups)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for _zones_.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.

#### Usage example

```js
import { createSyncShippingMethods } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncShippingMethods = createSyncShippingMethods()
const client = createClient({
  middlewares: [...],
})

const before = {
  key: 'Key 1'
}

const now = {
  name: 'Key 2'
}

const actions = syncShippingMethods.buildActions(now, before)
const shippingMethodsRequests = {
  url: `/shipping-methods/${before.id}`,


client.execute(shippingMethodsRequests)
.then(result => ...)
.catch(error => ...)
```

## `createSyncStates(actionGroups)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for _states_.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.

#### Usage example

```js
import { createSyncShippingStates } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncStates = createStates()
const client = createClient({
  middlewares: [...],
})

const before = {
  key: 'Key 1'
}

const now = {
  name: 'Key 2'
}

const actions = syncStates.buildActions(now, before)
const statesRequests = {
  url: `/states/${before.id}`,


client.execute(statesRequests)
.then(result => ...)
.catch(error => ...)
```

## `createSyncTypes(actionGroups, config)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for [_types_](https://docs.commercetools.com/http-api-projects-types.html).

**Please note** that there is no `remove action` for `enum` values. So this package will comply with the [platform](https://docs.commercetools.com/http-api-projects-types.html#add-enumvalue-to-fielddefinition) and only generate `changeOrder` and `add` actions for any `enum`.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.
2.  `config` _(Object)_: A configuration object to which has one of the following options:

| Key                     | Type      | Required             | Description                                                                                                            |
| ----------------------- | --------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `shouldOmitEmptyString` | `Boolean` | - (default: `false`) | a flag which determines whether we should treat empty strings as **NOT A VALUE** in addition to `undefined` and `null` |

#### Usage example

```js
import { createSyncTypes } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncTypes = createSyncTypes()
const client = createClient({
  middlewares: [...],
})

const before = {
  id: 'type-id',
  name: 'Type',
  version: 1,
}

const now = {
  id: 'type-id',
  name: 'Other Type',
  version: 1,
}

const actions = syncTypes.buildActions(now, before)
const typesRequest = {
  url: `/types/${before.id}`,
  method: 'POST',
  body: JSON.stringify({ version: before.version, actions }),
}

client.execute(typesRequest)
.then(result => ...)
.catch(error => ...)
```

## `createSyncChannels(actionGroups)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for _channels_.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.

#### Usage example

```js
import { createSyncChannels } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncChannels = createSyncChannels()
const client = createClient({
  middlewares: [...],
})

const before = {
  key: 'Key 1',
  roles: ['Role 1'],
}

const now = {
  name: 'Key 2',
  roles: ['Role 1', 'Role 2'],
}

const actions = syncChannels.buildActions(now, before)
const channelsRequests = {
  url: `/channels/${before.id}`,
}


client.execute(channelsRequests)
.then(result => ...)
.catch(error => ...)
```

Note that the channels syncer currently generates only `setRoles` actions and not individual `addRoles` and `removeRoles` respectively.

### With `shouldOmitEmptyString=true`

Given that `shouldOmitEmptyString` is provided, we won't generate any `updateAction` in the following cases:

| Before      | Now         | Will generate update action? | Value for the action    |
| ----------- | ----------- | ---------------------------- | ----------------------- |
| `""`        | `null`      | no                           |                         |
| `""`        | `undefined` | no                           |                         |
| `""`        | `"foo"`     | yes                          | `"foo"`                 |
| `null`      | `""`        | no                           |                         |
| `null`      | `undefined` | no                           |                         |
| `null`      | `"foo"`     | yes                          | `"foo"`                 |
| `undefined` | `""`        | no                           |                         |
| `undefined` | `null`      | no                           |                         |
| `undefined` | `"foo"`     | yes                          | `"foo"`                 |
| `"foo"`     | `""`        | yes                          | omitted from the action |
| `"foo"`     | `null`      | yes                          | omitted from the action |
| `"foo"`     | `undefined` | yes                          | omitted from the action |

The final value of the action as displayed above will be given, _regardless if the value of the action is required or not_.

See example below.

```js
const productTypeSync = createSyncProductTypes([], {
  shouldOmitEmptyString: true,
})
const before = { key: '' }
const now = { key: null }
const actions = sync.buildActions(now, before)

// outputs:
// []
```

## `createSyncProjects(actionGroups)`

> From package [@commercetools/sync-actions](/sdk/api/README.md#sync-actions).

Creates a [sync action](/sdk/Glossary.md#syncaction) that allows to build API update actions for _projects_.

#### Arguments

1.  `actionGroups` _(Array)_: A list of [action group](/sdk/Glossary.md#syncaction) in case some actions need to be _blacklisted_ or _whitelisted_.

#### Usage example

```js
import { createSyncProjects } from '@commercetools/sync-actions'
import { createClient } from '@commercetools/sdk-client'

const syncProjects = createSyncProjects()
const client = createClient({
  middlewares: [...],
})

const before = {
  id: 'some-project-uuid',
  name: 'Name 1',
  currencies: ['EUR', 'Dollar']
}

const now = {
  name: 'Name 1',
  currencies: ['EUR']
}

const actions = syncProjects.buildActions(now, before)
const projectsRequests = {
  url: `/projects/${before.id}`,
}


client.execute(projectsRequests)
.then(result => ...)
.catch(error => ...)
```
