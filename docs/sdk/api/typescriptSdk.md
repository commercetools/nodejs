# `typescript`

We provide a packages written in typescript for using our API

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
[Create API client](https://docs.commercetools.com/tutorials/getting-started#creating-an-api-client) from Merchant Center. If you do not have account [follow the steps to create a free trial account](https://docs.commercetools.com/tutorials/getting-started#first-steps). 
In this guide we’ll be calling a method of commercetools API using TypeScript SDK to get the settings of a commercetools project. The commercetools API is the foundation of the commercetools Platform, and almost every commercetools client app uses it. Aside from getting project information, the commercetools API allows clients to call methods that can be used for everything from creating products to updating an order’s status. Before we can call any methods, we need to configure our new app to obtain an access token.

### Set up your local project
If you don’t already have a project, let’s create a new one. In an empty directory, you can initialize a new project using the following command:

```
$ npm init -y
```

After you’re done, you’ll have a new package.json file in your directory.

#### Getting a client credentials to use the commercetools API
Create a new file called `.env` in this directory. Select **Environment Variables (.env)** in the dropdown on the API client details page mentioned in the previous step and copy client credentails to `.env` file. Should have values these variables `CTP_PROJECT_KEY`, `CTP_CLIENT_SECRET`, `CTP_CLIENT_ID`, `CTP_AUTH_URL`, `CTP_API_URL` and `CTP_SCOPES`.

Create a new file called `project.js` in this directory and add the following code:
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

Install the `@commercetools/sdk-client`, `@commercetools/sdk-middleware-auth`, `@commercetools/sdk-middleware-http`, `@commercetools/typescript-sdk` and `dotenv` packages and save it to your `package.json` dependencies using the following command:

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
In this guide we’ll get project settings information. Re-open `project.js` and add the following code:
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
Then client will **execute** get project information request from `apiRoot` using **TypeScript SDK**.
Run the program. The output should look like the following if the request is successful:
```
$ node project.js
Getting started with commercetools Typescript SDK
Project information ---> {
  body: {
    <projectData>
  },
  statusCode: 200
}
```

#### Usage example

```ts
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
