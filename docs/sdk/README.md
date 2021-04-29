# SDK

This section contains all information about the sdk-related packages.

> If you are looking to migrate from the `sphere-node-sdk` package, please read the [migration guide](/sdk/upgrading-from-sphere-node-sdk.md).

## Design architecture

The SDK is now split into multiple little packages, think about it as a _microservice_ architecture. This is by choice and it provides several different advantages:

- flexibility: choose the packages that fits best your use case
- extensibility: developers can potentially build their own packages to extend / replace pieces of the SDK packages (e.g. custom [middlewares](/sdk/Middlewares.md))
- maintainability: easier to maintain each single little package instead of one big library. This is also one of the reasons to use a [monorepo](https://github.com/lerna/lerna)

The core of the SDK lies within its [middlewares](/sdk/Middlewares.md) implementation.
Middlewares do specific things and can be replaced by other middlewares depending on the use case, allowing many possible combinations.

The [SDK _client_](/sdk/api/README.md#sdk-client) itself is in fact really simple and somehow even agnostic of the specific commercetools platform API that can be used as a generic HTTP client.

If we take a step back and look at the general requirement, at the end we simply want to **execute a request**. It just happens to be that we want to make specific requests to the commercetools platform API but it might be as well any other API. That's where the [middlewares](/sdk/Middlewares.md) come in, which provide the _side effects_ of the given request.

## Getting started
This tutorial will show you how to use the middlewares in this commercetools Node SDK to get a simple commercetools Node app running.

### Create a API client
[Create API client](https://docs.commercetools.com/tutorials/getting-started#creating-an-api-client) from Merchant Center. If you not have account [follow the steps to create a free trail account](https://docs.commercetools.com/tutorials/getting-started#first-steps). 
In this guide we’ll be calling a method of commercetools API using Node SDK to get a commercetools project information. The commercetools API is the foundation of the commercetools Platform, and almost every commercetools client app uses it. Aside from get project information, the commercetools API allows client to call methods that can be used for everything from creating a products to updating a order’s status. Before we can call any methods, we need to configure our new app with the proper permissions.

### Getting a client credentails to use the commercetools API
From API client Details page from previous step copy  `project_key`, `API URL`, `scope` and `Auth URL`. The commercetools API uses `clientId` and ``clientSecret` to authenticate the requests your app makes. In a later step, you’ll be asked to use these values in your code.

### Set up your local project
If you don’t already have a project, let’s create a new one. In an empty directory, you can initialize a new project using the following command:

```
$ npm init -y
```

After you’re done, you’ll have a new package.json file in your directory.
Install the `@commercetools/sdk-client`, `@commercetools/sdk-middleware-auth`, `@commercetools/sdk-middleware-http`, `@commercetools/api-request-builder` and `dotenv` packages and save it to your `package.json` dependencies using the following command:

```
$ npm install @commercetools/sdk-client @commercetools/sdk-middleware-auth @commercetools/sdk-middleware-http @commercetools/api-request-builder dotenv
```

Create a new file called project.js in this directory and add the following code:
```js
const { createClient } = require('@commercetools/sdk-client')
const { createRequestBuilder } = require('@commercetools/api-request-builder')
const { createAuthMiddlewareForClientCredentialsFlow } = require('@commercetools/sdk-middleware-auth')
const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http')
const fetch = require('node-fetch')

require('dotenv').config()

console.log('Getting started with commercetools Nodejs SDK');
```

Back at the command line, run the program using the following command:
```
$ node project.js
Getting started with commercetools Nodejs SDK
```
If you see the same output as above, we’re ready to start.

### Get commercetools project information with the commercetools API
In this guide we’ll get a project information. We’ll also follow the best practice of keeping secrets outside of your code (do not hardcode sensitive data).

Store the client id and secret in a new environment variable. Create a new file called .env in this directory and add the following code: 
```
ADMIN_CLIENT_ID=<your_admin_client_id>
ADMIN_CLIENT_SECRET=<your_admin_secret_id>
```
Replace the values with your client id and client sceret that you copied earlier.

Re-open project.js and add the following code:
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

// Create a request builder for the project
const projectService = createRequestBuilder({ projectKey }).project;

// Create a request to get project information
const createGetProjectRequest = {
    uri: projectService.build(),
    method: 'GET',
};


(async () => {
    try {
        // Use the `client.execute` method to send a message from this app
        await client.execute(createGetProjectRequest)
            .then(data => {
                console.log('Project information --->', data);
            })
            .catch(error => {
                console.log('ERROR --->', error);
            })
    } catch (error) {
        console.log('ERROR --->', error);
    }
    console.log('Got project information');
})();
```
Replace the value `<your_project_key>`, `<your_auth_url>`, `<your_client_scope>` and `<your_api_url>` with your client `project_key`, `API URL`, `scope`, and `Auth URL` that you copied earlier.

This code creates a **client**, which uses `authMiddleware` and `httpMiddleware`. The `httpMiddleware` reads the `clientId` and `clientSecret` from environment variables. Then client will **execute** get project information request.

Run the program. The output should look like the following if the request is successful:
```
$ node project.js
Getting started with commercetools Nodejs SDK
Project information ---> {<projectData>}
Got project information
```

## Usage example

In this example (integration test) we are going to make some requests to the `/channels` API endpoint. For that we need to be able to make actual requests (`http` middleware) as well as to authenticate the requests using the API Client Credentials Flow (`auth` middleware).

The `queue` middleware is not really necessary in this simple example but it is usually useful to limit a bit the number of concurrent requests and should be place before the `http` middleware.

The `api-request-builder` package comes in handy to easily construct the request _URI_ but it is not really necessary as the _URI_ could be also typed manually.

```js
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createClient } from '@commercetools/sdk-client'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue'
import omit from 'lodash.omit'

const ignoredResponseKeys = ['id', 'createdAt', 'lastModifiedAt']

const service = createRequestBuilder({ projectKey }).channels

const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
  host: 'https://auth.commercetools.com',
  projectKey: 'test',
  credentials: {
    clientId: '123',
    clientSecret: 'secret',
  },
})
const httpMiddleware = createHttpMiddleware({
  host: 'https://api.commercetools.com',
})
const queueMiddleware = createQueueMiddleware({
  concurrency: 5,
})
const client = createClient({
  middlewares: [authMiddleware, queueMiddleware, httpMiddleware],
})

describe('Channels', () => {
  const key = uniqueId('channel_')
  let channelResponse

  it('create', () => {
    const body = {
      key,
      name: { en: key },
    }
    const createRequest = {
      uri: service.build(),
      method: 'POST',
      body,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }

    return client.execute(createRequest).then((response) => {
      channelResponse = response.body
      expect(omit(response.body, ignoredResponseKeys)).toEqual({
        ...body,
        roles: ['InventorySupply'],
        version: 1,
      })
      expect(response.statusCode).toBe(201)
    })
  })

  it('fetch', () => {
    const fetchRequest = {
      uri: service.where(`key = "${key}"`).build(),
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }

    return client.execute(fetchRequest).then((response) => {
      expect(response.body.results).toHaveLength(1)
      expect(response.statusCode).toBe(200)
    })
  })

  it('update', () => {
    const updateRequest = {
      uri: service.byId(channelResponse.id).build(),
      method: 'POST',
      body: {
        version: channelResponse.version,
        actions: [{ action: 'addRoles', roles: ['OrderImport'] }],
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }

    return client.execute(updateRequest).then((response) => {
      channelResponse = response.body
      expect(omit(response.body, ignoredResponseKeys)).toEqual({
        key,
        name: { en: key },
        roles: ['InventorySupply', 'OrderImport'],
        version: 2,
      })
      expect(response.statusCode).toBe(200)
    })
  })

  it('delete', () => {
    const uri = service
      .byId(channelResponse.id)
      .withVersion(channelResponse.version)
      .build()

    const deleteRequest = {
      uri,
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }

    return client.execute(deleteRequest).then((response) => {
      expect(response.statusCode).toBe(200)
    })
  })
})

let uniqueIdCounter = 0
function uniqueId(prefix) {
  const id = `${Date.now()}_${uniqueIdCounter}`
  uniqueIdCounter += 1
  return prefix ? prefix + id : id
}
```
