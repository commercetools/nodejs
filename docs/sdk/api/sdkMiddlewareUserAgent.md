# `sdk-middleware-user-agent`

Middelware to automatically set the `User-Agent` to the [request](/sdk/Glossary.md#clientrequest).

## Install

#### Node.js

```bash
npm install --save @commercetools/sdk-middleware-user-agent
```

#### Browser

```html
<script src="https://unpkg.com/@commercetools/sdk-middleware-user-agent/dist/commercetools-sdk-middleware-user-agent.umd.min.js"></script>
<script>// global: CommercetoolsSdkMiddlewareUserAgent</script>
```

## `createUserAgentMiddleware(options)`

Creates a [middleware](/sdk/Glossary.md#middleware) to append the `User-Agent` HTTP header to the request.

#### Named arguments (options)

1.  `libraryName` _(String)_: the name of the library / package / application using the SDK (optional)
2.  `libraryVersion` _(String)_: the version of the library / package / application using the SDK (optional)
3.  `contactUrl` _(String)_: the contact URL of the library / package / application using the SDK (optional)
4.  `contactEmail` _(String)_: the contact email of the library / package / application using the SDK (optional)

#### Usage example

```js
import { createClient } from '@commercetools/sdk-client'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import { createAuthMiddleware } from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'

const userAgentMiddleware = createUserAgentMiddleware(),
const client = createClient({
  middlewares: [
    createAuthMiddleware({...}),
    createUserAgentMiddleware({
      libraryName: 'my-awesome-library',
      libraryVersion: '1.0.0',
      contactUrl: 'https://github.com/commercetools/my-awesome-library'
      contactEmail: 'helpdesk@commercetools.com'
    }),
    createHttpMiddleware({...}),
  ],
})

// The User-Agent will be something like:
// commercetools-js-sdk Node.js/6.9.0 (darwin; x64) my-awesome-library/1.0.0 (+https://github.com/commercetools/my-awesome-library; +helpdesk@commercetools.com)
```
