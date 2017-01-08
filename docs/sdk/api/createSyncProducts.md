# `createSyncProducts(actionGroups)`

> From package [@commercetools/sync-actions](/docs/sdk/api/README.md#sync-actions).

Creates a [sync action](/docs/sdk/Glossary.md#sync-action) that allows to build API update actions for _products_.

#### Arguments

1. `actionGroups` *(Array)*: An list of [action group](/docs/sdk/Glossary.md#sync-action) in case some actions need to be _blacklisted_ or _whitelisted_.

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
