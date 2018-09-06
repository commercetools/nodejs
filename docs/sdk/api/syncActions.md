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
<script>// global: CommercetoolsSyncActions</script>
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
const productSync = createSyncProducts([], {
  shouldOmitEmptyString: true,
})
const before = { key: '' }
const now = { key: null }
const actions = sync.buildActions(now, before)

// outputs:
// []
```
