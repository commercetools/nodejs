# `createHttpUserAgent(options)`

> From package [@commercetools/http-user-agent](/docs/sdk/api/README.md#http-user-agent).

Creates a proper HTTP `User-Agent`.

#### Named arguments (options)

1. `name` *(String)*: the name of the client sending the request (required)
2. `version` *(String)*: the version of the client sending the request (optional)
3. `libraryName` *(String)*: the name of the library / package / application using the SDK (optional)
4. `libraryVersion` *(String)*: the version of the library / package / application using the SDK (optional)
5. `contactUrl` *(String)*: the contact URL of the library / package / application using the SDK (optional)
6. `contactEmail` *(String)*: the contact email of the library / package / application using the SDK (optional)


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
