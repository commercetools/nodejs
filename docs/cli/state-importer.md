# State Importer

A package that helps with importing [commercetools states](https://docs.commercetools.com/http-api-projects-states.html) in JSON format to the [commercetools platform](https://docs.commercetools.com/).
This package is built to be used in conjunction with [sphere-node-cli](https://github.com/sphereio/sphere-node-cli)

## Configuration

The constructor accepts three arguments:
- A required object containing the following values:
  - `apiConfig` (Object): `AuthMiddleware` options for authentication on the commercetools platform. (Required. See [here](https://commercetools.github.io/nodejs/sdk/api/sdkMiddlewareAuth.html#named-arguments-options))
  - `continueOnProblems` (Boolean): Flag whether to continue processing if an error occurs (Optional. Default: false)
- `accessToken` (String): Access token to be used to authenticate requests to API. Requires scope of [`manage_project`] to create and/or update states or [`manage_orders`] to update states
- An optional logger object having four functions (`info`, `warn`, `error` and `verbose`)

## Usage with `sphere-node-cli`
You can use this package from the [`sphere-node-cli`](https://github.com/sphereio/sphere-node-cli). In order for the cli to import states, the file to import from must be a valid JSON and follow this structure:
```json
[
  {
    "key": "foobar",
    "type": "ReviewState",
    "name": {
      "en": "chancellor"
    },
    "description": {
      "en": "Some state used for reviews"
    },
    "initial": false
  },
  {
    "key": "Wubalubadubdub",
    "type": "LineItemState",
    "name": {
      "en": "science"
    },
    "initial": true
  },
  {
    "key": "Meeseeks",
    "type": "LineItemState",
    "name": {
      "en": "can do!"
    },
    "initial": true
  },
  {
    "key": "new-product-state",
    "type": "ProductState",
    "name": {
      "en": "new-sample-product-state",
      "de": "neue-beispiele-product-state"
    },
    "description": {
      "en": "john and jane doe",
      "de": "Denkt euch daran"
    },
    "initial": true
  },
  ...
]
```
Then you can import this file using the cli:
```bash
sphere import -t state -p my-project-key --host 'https://api.sphere.io' --authHost 'https://auth.sphere.io' -f /path/to/file.json -c
 '{"continueOnProblems": true}'
```

## Direct Usage
If you would like to have more control, you can also use this module directly in Javascript. To do this, you need to install it:
```bash
npm install @commercetools/state-importer
```
Then you can use it to import states:
```js
import StateImport from '@commercetools/state-importer'

const states = [
  {
    key: 'foobar',
    type: 'ReviewState',
    name: {
      en: 'chancellor'
    },
    description: {
      en: 'Some state used for reviews'
    },
    initial: false
  },
  {
    key: 'Wubalubadubdub',
    type: 'LineItemState',
    name:{
      en: 'science'
    },
    initial: true
  },
  {
    key: 'Meeseeks',
    type: 'LineItemState',
    name: {
      en: 'can do!'
    },
    initial: true
  },
  {
    key: 'new-product-state',
    type: 'ProductState',
    name: {
      en: 'new-sample-product-state',
      de: 'neue-beispiele-product-state'
    },
    description: {
      en: 'john and jane doe',
      de: 'Denkt euch daran'
    },
    initial: true
  },
  ...
]

const options = {
    apiConfig: {
      host: 'https://auth.commercetools.com'
      projectKey: <PROJECT_KEY>,
      credentials: {
        clientId: '*********',
        clientSecret: '*********'
      }
    },
    accessToken: '123456yuhgfdwegh675412wefb3rgb',
    continueOnProblems: false
  }
}

const logger = {
  error: console.error,
  warn: console.warn,
  info: console.log,
  debug: console.debug,
}

const stateImport = new StateImport(options, logger)

stateImport.run(states)
  .then(() => {
    stateImport.summaryReport()
    // handle successful import
  })
  .catch((error) => {
    // handle error
  })
```

On successful completion, a call to the `.summaryReport()` method returns a report in the following format:
```js
{
  reportMessage: 'Summary: there were 5 successfully states (3 were newly created, 2 were updated and 0 were unchanged).',
  detailedSummary: {
    created: 3,
    updated: 2,
    unchanged: 0,
    errors: {
      create: []
      update: []
    }
  }
}
```
**Note:** By default, if a state exists, the module tries to build update actions for it, and if no update actions can be built, the states will be ignored
