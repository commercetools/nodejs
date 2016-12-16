# commercetools-sdk-middlware-http

Auth middlewares collection for usage with `@commercetools/sdk-client`

## Usage

```js
import { createClient } from '@commercetools/sdk-client'
import {
  createHttpMiddleware,
} from '@commercetools/sdk-middleware-http'

const middlewareOptions = {
  host: 'https://api.commercetools.co', // default https://api.sphere.io
}
const httpMiddleware = createHttpMiddleware(
  middlewareOptions,
)

const client = createClient({
  middlewares: [httpMiddleware],
})
```
