# `createRequestBuilder(customServices)`

Creates a *request builder* that allows to declaratively build a HTTP API request URI for the commercetools platform.

#### Arguments

1. `customServices` *(Object)*: A map of custom services that are not provided by default. This might be useful to build a request for a different API with similar query parameters.

#### Example

```js
import {
  createRequestBuilder,
  features,
} from '@commercetools/api-request-builder'
import { createClient } from '@commercetools/sdk-client'

const requestBuilder = createRequestBuilder()
const client = createClient({
  middlewares: [...],
})
const channelsUri = requestBuilder.channels
  .where('key = "foo"')
  .perPage(1)
  .build({ projectKey: 'my-project-key' })
const channelsRequest = {
  url: channelsUri,
  method: 'GET',
}

client.execute(channelsRequest)
.then(result => ...)
.catch(error => ...)
```
