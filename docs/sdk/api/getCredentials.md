# `get-credentials`

Retrieve commercetools project credentials from environment variables or file system.

## Install

```bash
npm install --save @commercetools/get-credentials
```

## Usage

Getting the credentials in comes in two ways where the environment variable has priority:

### From environment variables

Read the credentials from an environment variable named after the project key like: `CT_<project key>`. The contained credentials are expected like this: `<client id>:<client secret>`. Notice that the given project key will be uppercased and dashes will be replaced by an underscore. So for example: `my-projectkey` becomes `MY_PROJECTKEY`.

### From a file

Read the credentials from a [`dotenv`](https://github.com/motdotla/dotenv) file in the following locations, descending priority:

- `./.ct-credentials.env` _Current directory_
- `/etc/.ct-credentials.env`

Example `ct-credentials.env` file:

```dosini
CT_MY_PROJECTKEY=myclientid:mysecret
CT_OTHER_PROJECTKEY=myclientid:mysecret
```

## `getCredentials(projectKey)`

Set environment variables from a [`dotenv`](https://github.com/motdotla/dotenv) file and load the credentials from an environment variable based on the passed project key.

### Arguments

1.  `projectKey` _(String)_: The project key to retrieve the associated client credentials for.

### Returns

Returns a `Promise` which resolves to `{ clientId, clientSecret }`. When no credentials are found for the given project key an error is rejected.

### Usage example

```js
import { getCredentials } from '@commercetools/get-credentials'

getCredentials('my-project-key').then(console.log).catch(console.error)
```
