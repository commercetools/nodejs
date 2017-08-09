# `sync-actions`
Provides an API to construct update actions. Useful for building [request](/sdk/Glossary.md#clientrequest) `body` for updates.

## Install

#### Node.js
```bash
npm install --save @commercetools/sync-actions
```

#### Browser
```html
<script src="https://unpkg.com/@commercetools/sync-actions/dist/commercetools-sync-actions.min.js"></script>
<script>// global: CommercetoolsSyncActions</script>
```

## `createSyncCategories(actionGroups)`

Creates a [sync action](/sdk/Glossary.md#sync-action) that allows to build API update actions for _categories_.

#### Arguments

1. `actionGroups` *(Array)*: A list of [action group](/sdk/Glossary.md#sync-action) in case some actions need to be _blacklisted_ or _whitelisted_.

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
const actions = syncCategories.buildActions(before, now)
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

Creates a [sync action](/sdk/Glossary.md#sync-action) that allows to build API update actions for _customers_.

#### Arguments

1. `actionGroups` *(Array)*: A list of [action group](/sdk/Glossary.md#sync-action) in case some actions need to be _blacklisted_ or _whitelisted_.

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
const actions = syncCustomers.buildActions(before, now)
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

Creates a [sync action](/sdk/Glossary.md#sync-action) that allows to build API update actions for _inventories_.

#### Arguments

1. `actionGroups` *(Array)*: A list of [action group](/sdk/Glossary.md#sync-action) in case some actions need to be _blacklisted_ or _whitelisted_.

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
const actions = syncInventories.buildActions(before, now)
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

Creates a [sync action](/sdk/Glossary.md#sync-action) that allows to build API update actions for _orders_.

#### Arguments

1. `actionGroups` *(Array)*: A list of [action group](/sdk/Glossary.md#sync-action) in case some actions need to be _blacklisted_ or _whitelisted_.

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
const actions = syncOrders.buildActions(before, now)
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

Creates a [sync action](/sdk/Glossary.md#sync-action) that allows to build API update actions for _products_.

#### Arguments

1. `actionGroups` *(Array)*: A list of [action group](/sdk/Glossary.md#sync-action) in case some actions need to be _blacklisted_ or _whitelisted_.

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
const actions = syncProducts.buildActions(before, now)
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

Creates a [sync action](/sdk/Glossary.md#sync-action) that allows to build API update actions for _product-discounts_.

#### Arguments

1. `actionGroups` *(Array)*: A list of [action group](/sdk/Glossary.md#sync-action) in case some actions need to be _blacklisted_ or _whitelisted_.

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
const actions = syncProductDiscounts.buildActions(before, now)
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

Creates a [sync action](/sdk/Glossary.md#sync-action) that allows to build API update actions for _discount-codes_.

#### Arguments

1. `actionGroups` *(Array)*: A list of [action group](/sdk/Glossary.md#sync-action) in case some actions need to be _blacklisted_ or _whitelisted_.

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
const actions = syncDiscountCodes.buildActions(before, now)
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

Creates a [sync action](/sdk/Glossary.md#sync-action) that allows to build API update actions for _customer-groups_.

#### Arguments

1. `actionGroups` *(Array)*: A list of [action group](/sdk/Glossary.md#sync-action) in case some actions need to be _blacklisted_ or _whitelisted_.

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
const actions = syncCustomerGroups.buildActions(before, now)
const customerGroupRequest = {
  url: `/customer-groups/${before.id}`,
  method: 'POST',
  body: JSON.stringify({ version: before.version, actions }),
}

client.execute(customerGroupRequest)
.then(result => ...)
.catch(error => ...)
```
