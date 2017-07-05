# `sdk-middleware-http`
Middelware to send the actual HTTP [request](/sdk/Glossary.md#clientrequest).

## Install

#### Node.js
```bash
npm install --save @commercetools/sdk-middleware-http
```

#### Browser
```html
<script src="https://unpkg.com/@commercetools/sdk-middleware-http/dist/commercetools-sdk-middleware-http.min.js"></script>
<script>// global: CommercetoolsSdkMiddlewareHttp</script>
```

## `createHttpMiddleware(options)`

Creates a [middleware](/sdk/Glossary.md#middleware) to handle HTTP requests for the commercetools platform API.

#### Named arguments (options)

1. `host` *(String)*: the host of the HTTP API service
2. `includeResponseHeaders` *(Boolean)*: flag whether to include the response headers in the response, if omitted headers is omitted from response
3. `includeOriginalRequest` *(Boolean)*: flag whether to include the original request sent in the response. Can be useful if you want to see the final request being sent.
4. `maskSensitiveHeaderData` *(Boolean)*: flag to mask sensitie data in the header. e.g. Authorization token
5. `enableRetry` *(Boolean)*: flag to enable retry on network errors and `500` response. (Default: false)
6. `retryConfig` *(Object)*: Field required in the object listed below
  1. `maxRetries` *(Number)*: number of times to retry the request before failing the request. (Default: 50)
  2. `retryDelay` *(Number)*: amount of milliseconds to wait before retrying the next request. (Default: 200)
  3. `backoff` *(Boolean)*: activates exponential backoff. Recommended to prevent spamming of the server. (Default: true)
  4. `maxDelay` *(Number)*: The maximum duration (milliseconds) to wait before retrying, useful if the delay time grew exponentially more than reasonable

#### Retrying requests
This modules have a retrying ability incase of network failures or 503 response errors. To enable this behavior, pass the `enableRetry` flag in the options and also set the maximum number of retries (`maxRetries`) and amount of milliseconds to wait before retrying a request (`retryDelay`).

The repeater implements an exponential delay, meaning the wait time is not constant and it grows on every retry.

#### Usage example

```js
import { createClient } from '@commercetools/sdk-client'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'

const client = createClient({
  middlewares: [
    createHttpMiddleware({
      host: 'https://api.commercetools.com',
      includeResponseHeaders: true,
      includeOriginalRequest: true,
      maskSensitiveHeaderData: true,
      enableRetry: true,
      retryConfig: {
        maxRetries: 2,
        retryDelay: 300, //milliseconds
        maxDelay: 5000 //milliseconds
      }
    }),
  ],
})
```

## `getErrorByCode(code)`

Returns a [custom error type](/sdk/Glossary.md#httperrortype) given its status *code*.

#### Arguments

1. `code` *(Number)*: the HTTP status code

#### Returns

(*Error* or *undefined*): A custom error type (e.g. `BadRequest`, `Unauthorized`) if the *code* matches, otherwise `undefined`.

#### Usage example

```js
import { getErrorByCode } from '@commercetools/sdk-middleware-http'

const ErrorType = getErrorByCode(400)
const error = new ErrorType('Oops')
```
