# `sdk-middleware-http`

Middleware to send the actual HTTP [request](/sdk/Glossary.md#clientrequest).

## Install

#### Node.js

```bash
npm install --save @commercetools/sdk-middleware-http
```

#### Browser

```html
<script src="https://unpkg.com/@commercetools/sdk-middleware-http/dist/commercetools-sdk-middleware-http.umd.min.js"></script>
<script>
  // global: CommercetoolsSdkMiddlewareHttp
</script>
```

## `createHttpMiddleware(options)`

Creates a [middleware](/sdk/Glossary.md#middleware) to handle HTTP requests for the commercetools platform API.

The HTTP middleware can run in either a browser or Node.js environment. For Node.js environments it is important to either have a `fetch` implementation either globally available via e.g. [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) or to pass it in as an argument (see below) via e.g. [node-fetch](https://github.com/bitinn/node-fetch). In browsers without a native `fetch` implementation any well known `fetch` polyfill should be compatible with the middleware such as [whatwg-fetch](https://github.com/whatwg/fetch) or [unfetch](https://github.com/developit/unfetch).

#### Named arguments (options)

1.  `host` _(String)_: the host of the HTTP API service
2.  `credentialsMode` _(String)_: one of the supported `credentials` modes (`omit`, `same-origin`, `include`), useful when working with HTTP Cookies. (optional)
3.  `includeResponseHeaders` _(Boolean)_: flag whether to include the response headers in the response, if omitted headers is omitted from response
4.  `includeOriginalRequest` _(Boolean)_: flag whether to include the original request sent in the response. Can be useful if you want to see the final request being sent.
5.  `maskSensitiveHeaderData` _(Boolean)_: flag to mask sensitie data in the header. e.g. Authorization token
6.  `enableRetry` _(Boolean)_: flag to enable retry on network errors and `500` response. (Default: false)
7.  `retryConfig` _(Object)_: Field required in the object listed below
8.  `maxRetries` _(Number)_: number of times to retry the request before failing the request. (Default: 50)
9.  `retryDelay` _(Number)_: amount of milliseconds to wait before retrying the next request. (Default: 200)
10. `backoff` _(Boolean)_: activates exponential backoff. Recommended to prevent spamming of the server. (Default: true)
11. `maxDelay` _(Number)_: The maximum duration (milliseconds) to wait before retrying, useful if the delay time grew exponentially more than reasonable
12. `fetch` _(Function)_: A `fetch` implementation which can be e.g. `node-fetch` or `unfetch` but also the native browser `fetch` function
13. `timeout` _(Number)_: Request/response timeout in ms. Must have globally available or passed in `AbortController`
14. `abortController` or `getAbortController` depending on you chose to handle the timeout (_abortController_): This property accepts the `AbortController` instance. Could be [abort-controller](https://www.npmjs.com/package/abort-controller) or globally available one.

#### Retrying requests

This modules have a retrying ability incase of network failures or 503 response errors. To enable this behavior, pass the `enableRetry` flag in the options and also set the maximum number of retries (`maxRetries`) and amount of milliseconds to wait before retrying a request (`retryDelay`).

The repeater implements an exponential delay, meaning the wait time is not constant and it grows on every retry.

#### Token caching

The token is retrieved and cached upon the first request made by the client. Then, it gets refreshed when it expires. To utilize this, please make sure you use the same client instance and do not create new ones.

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
        maxDelay: 5000, //milliseconds
      },

      // Optional if not globally available
      fetch,
    }),
  ],
})
```

## `abortController` | `getAbortController`

This is used to signal the retry module to retry the request in an event of a request timeout or service outage.

#### Usage example

```js
// Use default options
const httpMiddleware = createHttpMiddleware({
  host: testHost,
  timeout: 1000, // time out after 1s
  fetch,
  abortController: new AbortController(),
})
```

Note however the slight difference in usage of the `getAbortController` property of the http middleware.

```js
// Use default options
const httpMiddleware = createHttpMiddleware({
  host: testHost,
  timeout: 1000, // time out after 1s
  fetch,
  getAbortController: () => new AbortController(),
})
```

This is to ensure that a new instance of the AbortController is always created and is independent of each other. Unlike the former (abortController) which only creates a single abortController instance for the middleware, in this very case, if a single request times out, it will propagate to all other http requests that is using the `AbortController` instance. This is useful when a bunch of sent out requests needs to timeout if at least one within the bunch times out.

## `getErrorByCode(code)`

Returns a [custom error type](/sdk/Glossary.md#httperrortype) given its status _code_.

#### Arguments

1.  `code` _(Number)_: the HTTP status code

#### Returns

(_Error_ or _undefined_): A custom error type (e.g. `BadRequest`, `Unauthorized`) if the _code_ matches, otherwise `undefined`.

#### Usage example

```js
import { getErrorByCode } from '@commercetools/sdk-middleware-http'

const ErrorType = getErrorByCode(400)
const error = new ErrorType('Oops')
```
