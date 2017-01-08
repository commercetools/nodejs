# `createSyncOrders(actionGroups)`

> From package [@commercetools/sync-actions](/docs/sdk/api/README.md#sync-actions).

Creates a [sync action](/docs/sdk/Glossary.md#sync-action) that allows to build API update actions for _orders_.

#### Arguments

1. `actionGroups` *(Array)*: An list of [action group](/docs/sdk/Glossary.md#sync-action) in case some actions need to be _blacklisted_ or _whitelisted_.

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
