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

### Getting a client credentials to use the commercetools API
From the API client Details page mentioned in the previous step copy  `project_key`, `clientId`, `clientSecret`, `API URL`, `scope` and `Auth URL`. The commercetools API uses `clientId` and `clientSecret` to authenticate the requests your app makes. In a later step, you’ll be asked to use these values in your code.

### Set up your local project
If you don’t already have a project, let’s create a new one. In an empty directory, you can initialize a new project using the following command:

```
$ npm init -y
```

After you’re done, you’ll have a new package.json file in your directory.
Install the `@commercetools/sdk-client`, `@commercetools/sdk-middleware-auth`, `@commercetools/sdk-middleware-http`, `@commercetools/typescript-sdk` and `dotenv` packages and save it to your `package.json` dependencies using the following command:

```
$ npm install @commercetools/sdk-client @commercetools/sdk-middleware-auth @commercetools/sdk-middleware-http @commercetools/typescript-sdk dotenv
```

Create a new file called `project.js` in this directory and add the following code:
```js
const { createClient } = require('@commercetools/sdk-client')
const { createAuthMiddlewareForClientCredentialsFlow } = require('@commercetools/sdk-middleware-auth')
const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http')
const { createApiBuilderFromCtpClient } = require("@commercetools/typescript-sdk");
  
const fetch = require('node-fetch')
require('dotenv').config()

console.log('Getting started with commercetools Typescript SDK');
```

Back at the command line, run the program using the following command:
```
$ node project.js
Getting started with commercetools Typescript SDK
```
If you see the same output as above, we’re ready to start.

### Get commercetools project settings with the commercetools API
In this guide we’ll get project settings information. We’ll also follow the best practice of keeping secrets outside of your code (do not hardcode sensitive data).

Store the **client id** and **secret** in a new environment variable. Create a new file called `.env` in this directory and add the following code: 

```
ADMIN_CLIENT_ID=<your_admin_client_id>
ADMIN_CLIENT_SECRET=<your_admin_secret_id>
```
Replace the values with your client id and client secret that you copied earlier.

Re-open `project.js` and add the following code:
```js
const { 
    ADMIN_CLIENT_ID,
    ADMIN_CLIENT_SECRET,
} = process.env;

const projectKey = '<your_project_key>'

// Create a httpMiddleware for the your project AUTH URL
const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: '<your_auth_url>',
    projectKey,
    credentials: {
        clientId: ADMIN_CLIENT_ID,
        clientSecret: ADMIN_CLIENT_SECRET,
    },
    scopes: ['<your_client_scope>'],
    fetch,
})

// Create a httpMiddleware for the your project API URL
const httpMiddleware = createHttpMiddleware({
    host: '<your_api_url>',
    fetch,
})

// Create a client using authMiddleware and httpMiddleware
const client = createClient({
    middlewares: [authMiddleware, httpMiddleware],
})

// Create a API root from API builder of commercetools platform client
const apiRoot = createApiBuilderFromCtpClient(client);

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
Replace the value `<your_project_key>`, `<your_auth_url>`, `<your_client_scope>` and `<your_api_url>` with your client `project_key`, `API URL`, `scope`, and `Auth URL` that you copied earlier.

This code creates a **client**, which uses `authMiddleware` and `httpMiddleware`. The `httpMiddleware` reads the `clientId` and `clientSecret` from environment variables. Then client will **execute** get project information request from `apiRoot` using **TypeScript SDK**.

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
