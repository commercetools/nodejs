# `createSyncCustomers(actionGroups)`

> From package [@commercetools/sync-actions](/docs/sdk/api/README.md#sync-actions).

Creates a [sync action](/docs/sdk/Glossary.md#sync-action) that allows to build API update actions for _customers_.

#### Arguments

1. `actionGroups` *(Array)*: An list of [action group](/docs/sdk/Glossary.md#sync-action) in case some actions need to be _blacklisted_ or _whitelisted_.

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
