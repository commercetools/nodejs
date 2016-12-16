# commercetools-api-request-builder

Helper functions collection to easily construct API requests URI in a declarative way, for usage with `@commercetools/sdk-client`.

## Usage

```js
import createRequestBuilder, { features } from '@commercetools/api-request-builder'
import { createClient } from '@commercetools/sdk-client'

const requestBuilder = createRequestBuilder()
const client = createClient({
  middlewares: [...],
})
const channelsUri = requestBuilder.channels.where('key = "foo"').perPage(1).build()
const channelsRequest = {
  url: `/my-project-key${channelsUri}`,
  method: 'GET',
}

client.execute(channelsRequest)
```
