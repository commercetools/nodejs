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

#### Usage example

```js
import { createClient } from '@commercetools/sdk-client'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'

const client = createClient({
  middlewares: [
    createHttpMiddleware({
      host: 'https://api.commercetools.com',
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
