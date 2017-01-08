# `createSyncCategories(actionGroups)`

> From package [@commercetools/sync-actions](/docs/sdk/api/README.md#sync-actions).

Creates a [sync action](/docs/sdk/Glossary.md#sync-action) that allows to build API update actions for _categories_.

#### Arguments

1. `actionGroups` *(Array)*: An list of [action group](/docs/sdk/Glossary.md#sync-action) in case some actions need to be _blacklisted_ or _whitelisted_.

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
