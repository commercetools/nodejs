# `createSyncInventories(actionGroups)`

> From package [@commercetools/sync-actions](/docs/sdk/api/README.md#sync-actions).

Creates a [sync action](/docs/sdk/Glossary.md#sync-action) that allows to build API update actions for _inventories_.

#### Arguments

1. `actionGroups` *(Array)*: An list of [action group](/docs/sdk/Glossary.md#sync-action) in case some actions need to be _blacklisted_ or _whitelisted_.

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
