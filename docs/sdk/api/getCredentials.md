# `get-credentials`
Retrieve commercetools platform credentials from environment variables or file system.

## Install

```bash
npm install --save @commercetools/get-credentials
```

## Usage

First `get-credentials` will try to load the credentials from a file `ct-credentials.env` in the current directory and then from the `/etc` directory. If a project's credentials exist in both files the values from the current directory are used. Secondly credentials will be retrieved from an environment variable containing the project key: `CT_<project key>` containing `<client id>:<client secret>`. Notice that a project key will be uppercased and dashes will be replaced by an underscore. So for example: `my-projectkey` becomes `MY_PROJECTKEY`.

Example `ct-credentials.env` file:
```dosini
CT_MY_PROJECTKEY=myclientid:mysecret
CT_OTHER_PROJECTKEY=myclientid:mysecret
```

## `getCredentials(projectKey)`

Set environment variables from a [dotenv](https://github.com/motdotla/dotenv) file and load the credentials from an environment variable based on the passed project key.

### Arguments

1. `projectKey` *(String)*: The project key to get the client ID and client secret for.

### Returns

The function returns a promise which if the credentials are found resolves to an object like this:
```js
{
  clientId: 'id',
  clientSecret: 'secret',
}
```
When no credentials are found for the given project key an array of errors is rejected.

### Usage example
```js
import { getCredentials } from '@commercetools/get-credentials'

getCredentials('my-project-key')
  .then(console.log)
  .catch(errors => errors.forEach(console.error))
```
