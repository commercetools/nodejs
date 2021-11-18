# `typescript`

We provide a packages written in typescript for using our API

#### Note:

Please checkout the new [TypeScript Client](#typescript-sdk-client-v2) that is more updated and actively maintained and also consider migrating.

![example usage](typescript_tutorial.gif)

The source code for these packages are located in the [typescript](https://github.com/commercetools/commercetools-sdk-typescript/) repository.

## Install

#### Node.js

```bash
npm install --save @commercetools/platform-sdk
npm install --save @commercetools/importapi-sdk
npm install --save @commercetools/ml-sdk
```

#### Browser

```html
<script src="https://unpkg.com/@commercetools/platform-sdk/dist/platform-sdk.umd.js"></script>
<script>
  // global: TypescriptSdk
</script>
```

## Getting started
This tutorial will show you how to use the middlewares in this **[commercetools TypeScript SDK](https://github.com/commercetools/commercetools-sdk-typescript/)** to get a simple commercetools JavaScript app running.

### Create a API client
[Create an API client](https://docs.commercetools.com/tutorials/getting-started#creating-an-api-client) from the Merchant Center.

If you do not have account [follow these steps to create a free trial account](https://docs.commercetools.com/tutorials/getting-started#first-steps). 

When you have set up your API Client, ensure that you save your **project_key**, **client_id**, **secret**, **scope**, **API URL**, and **Auth URL**. We recommend using the drop-down list to save your API Client details as an **Environment Variables (.env)** file.

In this guide we call a method of the commercetools API using the TypeScript SDK to get the settings of a commercetools project.

The commercetools API is the foundation of the commercetools Platform, and almost every commercetools client app uses it.

Aside from retrieving project information, the commercetools API allows clients to call methods that can be used for everything from creating products to updating an order’s status.

Before we can call any methods, we need to configure a new app to obtain an access token.

### Set up your local project
1. Open a terminal window.
2. Create a new directory for the project.
3. Open the new directory and create a new project using the following command: ```npm init -y```
4. The project will be created and a package.json file will be created in the directory.
5. Enter the following command to open this folder in your code editor ```code .````

```


### Setting up API client credentials to use the commercetools API
If you downloaded the **Environment Variables (.env)** when creating your API Client, then you should save it as `.env` in the project directory.

If you did not download the Environment Variables file, then create a new file called `.env` in the project directory. Open it in your code editor and insert the following, replacing the values with those from your API client.

`
CTP_PROJECT_KEY=your_project_key
CTP_CLIENT_SECRET=your_client_secret
CTP_CLIENT_ID=your_client_id
CTP_AUTH_URL=your_auth_url
CTP_API_URL=your_api_url
CTP_SCOPES=your_scopes
`


### Setting up example code 

Create a new file called `project.js` in the project directory and add the following code:
```js
  const { createClient } = require('@commercetools/sdk-client')
  const { createAuthMiddlewareForClientCredentialsFlow } = require('@commercetools/sdk-middleware-auth')
  const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http')
  const { createApiBuilderFromCtpClient } = require("@commercetools/typescript-sdk")
  const fetch = require('node-fetch')
  require('dotenv').config()

  //reference API client credentials from environment variables
  const {
    CTP_PROJECT_KEY,
    CTP_CLIENT_SECRET,
    CTP_CLIENT_ID,
    CTP_AUTH_URL,
    CTP_API_URL,
    CTP_SCOPES,
  } = process.env

  const projectKey = CTP_PROJECT_KEY

  const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: CTP_AUTH_URL,
    projectKey,
    credentials: {
      clientId: CTP_CLIENT_ID,
      clientSecret: CTP_CLIENT_SECRET,
    },
    scopes: [CTP_SCOPES],
    fetch,
  })
  const httpMiddleware = createHttpMiddleware({
    host: CTP_API_URL,
    fetch,
  })
  const client = createClient({
    middlewares: [authMiddleware, httpMiddleware],
  })

  // Create an API root from API builder of commercetools platform client
  const apiRoot = createApiBuilderFromCtpClient(client);

console.log('Getting started with commercetools Typescript SDK');
```

You must now install the following packages: `@commercetools/sdk-client`, `@commercetools/sdk-middleware-auth`, `@commercetools/sdk-middleware-http`, `@commercetools/typescript-sdk` and `dotenv`.

You can do so by using the following command:

```
$ npm install @commercetools/sdk-client @commercetools/sdk-middleware-auth @commercetools/sdk-middleware-http @commercetools/typescript-sdk dotenv
```

This code creates a **client**, which uses `authMiddleware` and `httpMiddleware`. The `httpMiddleware` reads the `clientId` and `clientSecret` from environment variables.

Run the program using the following command:
```
$ node project.js
Getting started with commercetools Typescript SDK
```
If you see the same output as above, we’re ready to start.

### Get commercetools project settings with the commercetools API
Add the following code to the end of your `project.js` file:
```js
(async () => {
    try {
        await apiRoot.withProjectKey({projectKey}).get().execute()
            .then(data => {
                console.log('Project information --->', data);
            })
            .catch(error => {
                console.log('ERROR --->', error);
            })
    } catch (error) {
        console.log('ERROR --->', error);
    }
})();
```
The client will **execute** and retrieve the project information from `apiRoot` using the **TypeScript SDK**.
Run the program and your output should look like the following if the request is successful:
```
$ node project.js
Getting started with commercetools Typescript SDK
Project information ---> {
  body: {
    key: '<project_key>',
    name: '<project_name>',
    countries: [ ... ],
    currencies: [ ... ],
    languages: [ ... ],
    createdAt: '...',
  },
  statusCode: 200
}
```

#### Usage example

```typescript
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createClient } from '@commercetools/sdk-client'
import {
  createApiBuilderFromCtpClient,
  ApiRoot,
} from '@commercetools/platform-sdk'
import fetch from 'node-fetch'

const projectKey = 'some_project_key'

const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey,
  credentials: {
    clientId: 'some_id',
    clientSecret: 'some_secret',
  },
  fetch,
})

const httpMiddleware = createHttpMiddleware({
  host: 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
})

const ctpClient = createClient({
  middlewares: [authMiddleware, httpMiddleware],
})

const apiRoot: ApiRoot = createApiBuilderFromCtpClient(ctpClient)

apiRoot
  .withProjectKey({
    projectKey,
  })
  .get()
  .execute()
  .then((x) => {
    /*...*/
  })

apiRoot
  .withProjectKey({ projectKey })
  .productTypes()
  .post({
    body: { name: 'product-type-name', description: 'some description' },
  })
  .execute()
  .then((x) => {
    /*...*/
  })

apiRoot
  .withProjectKey({ projectKey })
  .products()
  .post({
    body: {
      name: { en: 'our-great-product-name' },
      productType: {
        typeId: 'product-type',
        id: 'some-product-type-id',
      },
      slug: { en: 'some-slug' },
    },
  })
  .execute()
  .then((x) => {
    /*...*/
  })
```

# TypeScript SDK Client v2

The **@commercetools/sdk-client-v2** is the TypeScript package that facilitates HTTP [requests](https://commercetools.github.io/nodejs/sdk/Glossary.html#clientrequest) to the Platform, ML or History API by using a predefined set of middlewares.

Unlike the Node.js client, the TypeScript client is a little different in its usage however, they are both very similar in every other way and backwards compatible with the Nodejs client.

### Install

```bash
npm install --save @commercetools/sdk-client-v2
or
yarn add @commercetools/sdk-client-v2
```

<!-- ### Browser
```js
<script src="https://unpkg.com/@commercetools/platform-sdk/dist/platform-sdk.umd.js"></script>
<script>
  // global: TypescriptSdk
</script>
``` -->

### Usasge example

Example on how to build a client using only the `defaultClient` class method. The default client enables client creation using very minimal configuratioin.

```typescript
// ClientBuilder.js
import { ClientBuilder, Client } from '@commercetools/sdk-client-v2'

const projectKey = 'demo-key'
const oauthUri = 'https://auth.europe-west1.gcp.commercetools.com'
const baseUri = 'https://api.europe-west1.gcp.commercetools.com'
const credentials = {
  clientId: 'clientID12345',
  clientSecret: 'clientSecret12345',
}

const client: Client = new ClientBuilder()
  .defaultClient(baseUri, credentials, oauthUri, projectKey)
  .build()
```

It is also important to note that we can chain other middlewares or further configure the default client to suit the specific need of the client being built.

Example

```typescript
const client: Client = new ClientBuilder()
  .defaultClient(baseUri, credentials, oauthUri, projectKey)
  .withUserAgentMiddleware()
  .build()

or

const client: Client = new ClientBuilder()
  .defaultClient(baseUri, credentials, oauthUri, projectKey)
  .withUserAgentMiddleware()
  .withLoggerMiddleware()
  .build()
```

Example on how to build a client using only the **withClientCredentialsFlow** and **withHttpMiddleware**

```typescript
// ClientBuilder.js

import fetch from 'node-fetch'
import {
  ClientBuilder,
  Client,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2'
// create the authMiddlewareOptions object
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey: 'demo-key',
  credentials: {
    clientId: 'clientID12345',
    clientSecret: 'clientSecret12345',
  },
  oauthUri: 'adminAuthUrl',
  scopes: ['manage_project:demo-key'],
  fetch,
}

// create the httpMiddlewareOptions object also
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
}

export const client: Client = new ClientBuilder()
  .withProjectKey(projectKey) // not necessary if the projectKey was already passed in the authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build()
```

Now the Client object is ready to be used to make HTTP calls.

Example

```typescript
import { client } from './ClientBuilder'
import {
  ApiRoot,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk'

const apiRoot: ApiRoot = createApiBuilderFromCtpClient(client)

// to get a project details
const getProject = () => {
  return apiRoot.withProjectKey({ projectKey }).get().execute()
}

getProject().then(console.log).catch(console.error)
```

`-`

# Middleware Creator Methods

Below is a list of all the class methods that can be invoked to add the functionality of a given middleware.

1. The authMiddleware creator methods
   - withAnonymousSessionFlow
   - withClientCredentialsFlow
   - withExistingTokenFlow
   - withPasswordFlow
   - withRefreshToken
2. Other middleware creator methods
   - withHttpMiddleware
   - withUserAgentMiddleware
   - withCorrelationIdMiddleware
   - withQueueMiddlewareware
   - withLoggerMiddleware
   - withMiddleware

### 1. The authMiddleware creator methods

These are class methods that creates auth middlewares using different authentication flows or method.

#### withAnonymousSessionFlow(options: _AnonymousAuthMiddlewareOptions_)

Creates a [middleware](https://commercetools.github.io/nodejs/sdk/Glossary.html#middleware) to handle authentication for the [Anonymous Session](https://docs.commercetools.com/http-api-authorization.html#tokens-for-anonymous-sessions) flow of the commercetools Platform API.

#### Named arguments (options)

1. `host` (_String_): the host of the OAuth API service
2. `projectKey` (_String_): the key of the project to assign the default scope to
3. `credentials` (_Object_): the client credentials for authentication (`clientId`, `clientSecret`, `anonymousId`)
4. `scopes` (_Array_): a list of scopes (default manage_project:{projectKey}) to assign to the OAuth token
5. `fetch` (_Function_): A fetch implementation which can be e.g. node-fetch or unfetch but also the native browser fetch function. Only needs be be passed if not globally available (e.g. through isomorphic-fetch)

#### Usage Example

```typescript
import fetch from 'node-fetch'
import { ClientBuilder, Client, AnonymousAuthMiddlewareOptions } from "@commercetools/sdk-client-v2"

const options: AnonymousAuthMiddlewareOptions = {
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey: 'demo-key',
  credentials: {
    clientId: 'clientID12345',
    clientSecret: 'clientSecret12345',
    anonymousId: 'client-anonymousId',
  },
  scopes: ['manage_project:demo-key'],
  fetch,
}

const client: Client = new ClientBuilder()
  .withAnonymousSessionFlow(options)
  ...
```

`-`

#### withClientCredentialsFlow(options: _AuthMiddlewareOptions_)

Creates a [middleware](https://commercetools.github.io/nodejs/sdk/Glossary.html#middleware) to handle authentication for the Client [Credentials Flow](https://docs.commercetools.com/http-api-authorization.html#client-credentials-flow) of the commercetools platform API.

#### Named arguments (options)

1. `host` (_String_): the host of the OAuth API service
2. `projectKey` (_String_): the key of the project to assign the default scope to
3. `credentials` (_Object_): the client credentials for authentication (`clientId`, `clientSecret`)
4. `oauthUri` (_String_): optional oauthUri string
5. `scopes` (_Array_): a list of scopes (default manage_project:{projectKey}) to assign to the OAuth token
6. `fetch` (_Function_): A fetch implementation which can be e.g. node-fetch or unfetch but also the native browser fetch function. Only needs be be passed if not globally available (e.g. through isomorphic-fetch)

#### Usage Example

```typescript
import fetch from 'node-fetch'
import { ClientBuilder, Client, AuthMiddlewareOptions } from "@commercetools/sdk-client-v2"

const options: AuthMiddlewareOptions = {
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey: 'demo-key',
  credentials: {
    clientId: 'clientID12345',
    clientSecret: 'clientSecret12345',
  },
  oauthUri: 'admin-authUrl',
  scopes: ['manage_project:demo-key'],
  fetch: fetch
}

const client: Client = new ClientBuilder()
  .withClientCredentialsFlow(options)
  ...
```

`-`

#### withExistingTokenFlow(authorization: _string_, options: _ExistingTokenMiddlewareOptions_)

Creates a [middleware](https://commercetools.github.io/nodejs/sdk/Glossary.html#middleware) that attaches a provided access token `Authorization` header.

#### Named arguments (authorization, options)

1. `authorization` (_String_): the value for the Authorization header. For example, you may pass the scheme "Bearer" ("Bearer 1234") or "Basic" ("Basic 134") and so on, depending on your authentication mechanism.
2. `options` is an optional (_Object_), having the following properties:

- `force` (_Boolean_): if set to true, existing Authorization header (if any) in the request will be overridden with the supplied access token (Default: _true_)

#### Usage Example

```typescript
import fetch from "node-fetch"
import { ClientBuilder, Client, ExistingTokenMiddlewareOptions } from "@commercetools/sdk-client-v2"

const accessToken = 'my-access-token'
const options: ExistingTokenMiddlewareOptions = {
  force: true
}

const client: Client = new ClientBuilder()
  .withExistingTokenFlow(accessToken, options)
  ...
```

`-`

#### withPasswordFlow(options: _PasswordAuthMiddlewareOptions_)

Creates a [middleware](https://commercetools.github.io/nodejs/sdk/Glossary.html#middleware) to handle authentication for the [Password Flow](https://docs.commercetools.com/http-api-authorization.html#password-flow) of the commercetools platform API.

#### Named arguments (options)

1. `host` (_String_): the host of the OAuth API service
2. `projectKey` (_String_): the key of the project to assign the default scope to
3. `credentials` (_Object_): the client credentials for authentication (clientId, clientSecret, user)

- The `user` field is an object containing `username` and `password` see sample below

4. `scopes` (_Array_): a list of scopes to assign to the OAuth token. No default scope is sent
5. `fetch` (_Function_): A fetch implementation which can be e.g. `node-fetch` or `unfetch` but also the native browser fetch function. Only needs be be passed if not globally available (e.g. through isomorphic-fetch)

#### Usage Example

```typescript
import fetch from "node-fetch"
import { ClientBuilder, Client, PasswordAuthMiddlewareOptions } from "@commercetools/sdk-client-v2"

const options: PasswordAuthMiddlewareOptions = {
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey: 'demo-key'
  credentials: {
  clientId: 'myClientID12345,'
  clientSecret: 'myClientSecret12345,'
    user: {
      username: 'my-username',
      password: 'my-password',
    },
  },
  fetch,
}

const client: Client = new ClientBuilder()
  .withPasswordFlow(options)
  ...
```

`-`

#### withRefreshTokenFlow(options: _RefreshAuthMiddlewareOptions_)

Creates a [middleware](https://commercetools.github.io/nodejs/sdk/Glossary.html#middleware) to handle authentication for the Refresh Token Flow of the commercetools platform API.

#### Named arguments (options)

1. `host` (_String_): the host of the OAuth API service
2. `projectKey` (_String_): the key of the project to assign the default scope to
3. `credentials` (_Object_): the client credentials for authentication (clientId, clientSecret)
4. `refreshToken` (_String_): refreshToken from the API to use to fetch new token.
5. `fetch` (_Function_): A fetch implementation which can be e.g. node-fetch or unfetch but also the native browser fetch function. Only needs be be passed if not globally available (e.g. through isomorphic-fetch)

#### Usage Example

```typescript
import fetch from "node-fetch"
import { ClientBuilder, Client, RefreshAuthMiddlewareOptions } from "@commercetools/sdk-client-v2"

const options: RefreshAuthMiddlewareOptions = {
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey: 'demo-key',
  credentials: {
    clientId: 'clientID12345',
    clientSecret: 'clientSecret12345',
  },
  refreshToken: 'my-refreshToken',
  fetch,
}

const client: Client = new ClientBuilder()
  .withRefreshTokenFlow(options)
  ...
```

`-`

### 2. Other middleware creator methods

There are also other class methods that creates middlewares used to fully cusotmize and control the client, they are described in details below.

#### withHttpMiddleware(options: _HttpMiddlewareOptions_)

Creates a [middleware](https://commercetools.github.io/nodejs/sdk/Glossary.html#middleware) to handle HTTP requests for the commercetools platform API.

The HTTP middleware can run in either a browser or Node.js environment. For Node.js environments it is important to either have a fetch implementation either globally available via e.g. [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) or to pass it in as an argument (see below) via e.g. [node-fetch](https://github.com/bitinn/node-fetch). In browsers without a native fetch implementation any well known fetch polyfill should be compatible with the middleware such as [whatwg-fetch](https://github.com/whatwg/fetch) or [unfetch](https://github.com/developit/unfetch).

#### Named arguments (options)

1. `host` (_String_): the host of the HTTP API service
2. `credentialsMode` (_String_): one of the supported credentials modes (`omit`, `same-origin`, `include`), useful when working with HTTP Cookies. (_optional_)
3. `includeResponseHeaders` (_Boolean_): flag whether to include the response headers in the response, if omitted headers is omitted from response
4. `includeOriginalRequest` (_Boolean_): flag whether to include the original request sent in the response. Can be useful if you want to see the final request being sent.
5. `maskSensitiveHeaderData` (_Boolean_): flag to mask sensitie data in the header. e.g. Authorization token
6. `enableRetry` (_Boolean_): flag to enable retry on network errors and 500 response. (Default: false)
7. `retryConfig` (_Object_): Field required in the object listed below
8. - `maxRetries` (_Number_): number of times to retry the request before failing the request. (Default: 50)
9. - `retryDelay` (_Number_): amount of milliseconds to wait before retrying the next request. (Default: 200)
10. - `backoff` (_Boolean_): activates exponential backoff. Recommended to prevent spamming of the server. (Default: true)
11. - `maxDelay` (_Number_): The maximum duration (milliseconds) to wait before retrying, useful if the delay time grew exponentially more than reasonable
12. `fetch` (_Function_): A fetch implementation which can be e.g. `node-fetch` or `unfetch` but also the native browser `fetch` function
13. `timeout` (_Number_): Request/response timeout in ms. Must have globally available or passed in AbortController
14. `getAbortController` depending on you chose to handle the timeout (`abortController`): This property accepts the `AbortController` instance. Could be [abort-controller](https://www.npmjs.com/package/abort-controller) or globally available one.

#### Note:

The `arbortController` property is deprecated, use the `getAbortController` property instead.

#### Retrying requests

This modules have a retrying ability incase of network failures or 503 response errors. To enable this behavior, pass the `enableRetry` flag in the options and also set the maximum number of retries (`maxRetries`) and amount in milliseconds to wait before retrying a request (`retryDelay`).

The repeater implements an `exponential` delay, meaning the wait time is not constant and it grows on every retry.

#### retryConfig

This is an object that defines the properties needed to properly configure the retry logic. This configuration only works if the `enableRetries` property is set to `true`

- _maxRetries_ - This property is used to set the number of times the request should retry in an event the previous request failed, the default retries is 50.
- _retryDelay_ - This set the delay (time in milliseconds) between retries, it is important to choose a number that allow the previous request to fully complete before initiating the next retry assuming the previous request failed.
- _backoff_ - This is used to configure how the retries should be carried out, setting this property to `true` means the request will backoff for a while before retrying. Assuming the previous retry was done in a 2 seconds (2000 milliseconds) delay, the next retry will be say 4 seconds (4000 milliseconds) and the next 8 seconds (8 milliseconds) etc. It is also advisable to set the `maxDelay` property so delay doesn't grow too large.
- _maxDelay_ - Used to set the delay time limit for the backoff property, so as to prevent the backoff delay from increasing exponentially to infinity.

#### timeout

For setting the timeout (in milliseconds) for all http requests or responses in a situation where a request or response might take too long to be processed or completed respectively.

#### Token caching

The token is retrieved and cached upon the first request made by the client. Then, it gets refreshed when it expires. To utilize this, please make sure you use the same client instance and do not create new ones.

#### Usage example

```typescript
import fetch from "node-fetch"
import { ClientBuilder, Client, HttpMiddlewareOptions } from "@commercetools/sdk-client-v2"

const options: HttpMiddlewareOptions = {
  host: 'https://api.commercetools.com',
  includeResponseHeaders: true,
  includeOriginalRequest: true,
  maskSensitiveHeaderData: true,
  enableRetry: true,
  retryConfig: {
    maxRetries: 2,
    retryDelay: 300, //milliseconds
    backoff: false,
    maxDelay: 5000, //milliseconds
  },
  fetch,
}

const client: Client = new ClientBuilder()
  .withHttpMiddleware(options)
  ...
```

##### getAbortController

This is used to signal the retry module to retry the request in an event of a request timeout or service outage.

#### Usage example

```typescript
import AbortController from 'abort-controller'
// Use default options
const options: HttpMiddlewareOptions = {
  host: testHost,
  timeout: 1000, // time out after 1s
  fetch,
  getAbortController: () => new AbortController(),
}
```

This is to ensure that a new instance of the AbortController is always created and is independent of each other. Unlike the former (abortController) which only creates a single abortController instance for the middleware, in this very case, if a single request times out, it will propagate to all other http requests that is using the AbortController instance. This is useful when a bunch of sent out requests needs to timeout if at least one within the bunch times out.

##### getErrorByCode(code)

Returns a [custom error](https://commercetools.github.io/nodejs/sdk/Glossary.html#httperrortype) type given its status code.

Arguments
`code` (_Number_): the HTTP status code
Returns
(`Error` or `undefined`): A [custom error](https://commercetools.github.io/nodejs/sdk/Glossary.html#httperrortype) type (e.g. `BadRequest`, `Unauthorized`) if the code matches, otherwise `undefined`.

#### Usage example

```typescript
import { getErrorByCode } from '@commercetools/sdk-client-v2'

const ErrorType = getErrorByCode(400)
const error = new ErrorType('Oops')
```

`-`

#### withUserAgentMiddleware()

Creates a [middleware](https://commercetools.github.io/nodejs/sdk/Glossary.html#middleware) to append the `User-Agent` HTTP header to the request.

#### Usage example

```typescript
import { ClientBuilder, Client } from "@commercetools/sdk-client-v2"

const client: Client = new ClientBuilder()
  .withUserAgentMiddleware()
  ...

// The User-Agent will be something like:
// commercetools-js-sdk Node.js/6.9.0 (darwin; x64) my-awesome-library/1.0.0 (+https://github.com/commercetools/my-awesome-library; +helpdesk@commercetools.com)
```

`-`

#### withCorrelationIdMiddleware(options: _CorrelationIdMiddlewareOptions_)

Creates a middleware to add a correlation ID to executed [requests](https://commercetools.github.io/nodejs/sdk/Glossary.html#clientrequest).

#### Usage example

```typescript
import uuid from 'uuid'
import { ClientBuilder, Client, CorrelationIdMiddlewareOptions } from "@commercetools/sdk-client-v2"

const options: CorrelationIdMiddlewareOptions = {
  generate: `prefix/${uuid()}/postifx`
}

const client: Client = new ClientBuilder()
  .withCorrelationIdMiddleware(options)
  ...
```

`-`

#### withQueueMiddleware(options: _QueueMiddlewareOptions_)

Creates a [middleware](https://commercetools.github.io/nodejs/sdk/Glossary.html#middleware) to handle concurrent requests.

#### Named arguments (options)

1. `concurrency` (_Number_): the max number of concurrent requests (default 20)

#### Usage example

```typescript
import { ClientBuilder, Client, QueueMiddlewareOptions } from "@commercetools/sdk-client-v2"

const options: QueueMiddlewareOptions = {
  concurrency: 5 // default is 20
}

const client: Client = new ClientBuilder()
  .withQueueMiddleware(options)
  ...
```

`-`

#### withLoggerMiddleware()

Creates a [middleware](https://commercetools.github.io/nodejs/sdk/Glossary.html#middleware) to log request and response objects being executed.

#### Usage Example

```typescript
import { ClientBuilder, Client } from "@commercetools/sdk-client-v2"

cont client: Client = new ClientBuilder()
  .withClientCredentialsFlow(...)
  .withLoggerMiddleware() // Log the request / response at this point in the middleware chain, before it gets to the http-middleware
  .withHttpMiddleware(...)
  .withLoggerMiddleware() // Log the request / response after it's being handled by the http-middleware
  ...
```

`-`

#### withMiddleware(middleware: Middleware)

A custom class method that accepts a middleware as a argument which is used to further configure the client. Notice how we called the underlying middleware creator function `createHttpClient` and `createAuthForClientCredentialsFlow` to create the middlewares here. With this one can easily use a custom middleware that serve a specific need.

#### Usage Example

```typescript
// ClientBuilder.js

import fetch from 'node-fetch'
import {
  ClientBuilder,
  Client,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
  createAuthForClientCredentialsFlow,
  createHttpClient
} from '@commercetools/sdk-client-v2'
// create the authMiddlewareOptions object
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey: 'demo-key',
  credentials: {
    clientId: 'clientID12345',
    clientSecret: 'clientSecret12345',
  },
  oauthUri: 'adminAuthUrl',
  scopes: ['manage_project:demo-key'],
  fetch,
}

// create the httpMiddlewareOptions object also
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
}

const Client: client = new clientBuilder()
  .withMiddleware(createAuthForClientCredentialsFlow(authMiddlewareOptions))
  .withMiddleware(createHttpClient(httpMiddlewareOptions))
  ...
```

`-`

#### buid()

To build the client after calling the class methods of choice that adds the middleware, we invoke the `build()` as the last method on the `new ClientBuilder()` class instance.

#### Usage Example

```typescript
...
const client: Client = new ClientBuilder()
  .withClientCredentialsFlow(...)
  .withHttpMiddleware(...)
  .withLoggerMiddleware()
  ...
  .build()
```
