# `http-user-agent`

Creates a proper HTTP User-Agent. Can be used everywhere.

## Install

#### Node.js

```bash
npm install --save @commercetools/http-user-agent
```

#### Browser

```html
<script src="https://unpkg.com/@commercetools/http-user-agent/dist/commercetools-http-user-agent.umd.min.js"></script>
<script>// global: CommercetoolsHttpUserAgent</script>
```

## `createHttpUserAgent(options)`

Creates a proper HTTP `User-Agent`.

#### Named arguments (options)

1.  `name` _(String)_: the name of the client sending the request (required)
2.  `version` _(String)_: the version of the client sending the request (optional)
3.  `libraryName` _(String)_: the name of the library / package / application using the SDK (optional)
4.  `libraryVersion` _(String)_: the version of the library / package / application using the SDK (optional)
5.  `contactUrl` _(String)_: the contact URL of the library / package / application using the SDK (optional)
6.  `contactEmail` _(String)_: the contact email of the library / package / application using the SDK (optional)

#### Usage example

```js
import createHttpUserAgent from '@commercetools/http-user-agent'

const userAgent = createHttpUserAgent({
  name: 'commercetools-node-sdk',
  version: '1.0.0',
  libraryName: 'my-awesome-library',
  libraryVersion: '1.0.0',
  contactUrl: 'https://github.com/my-company/my-awesome-library'
  contactEmail: 'helpdesk@commercetools.com'
}),

// The User-Agent will be something like:
// commercetools-node-sdk/1.0.0 Node.js/6.9.0 (darwin; x64) my-awesome-library/1.0.0 (+https://github.com/my-company/my-awesome-library; +helpdesk@commercetools.com)
```
