# Custom Objects Importer

This package helps with importing [commercetools custom objects](https://docs.commercetools.com/http-api-projects-custom-objects.html) in JSON format to the [commercetools platform](https://docs.commercetools.com/).
The package is built to be used in conjunction with [sphere-node-cli](https://github.com/sphereio/sphere-node-cli)

## Configuration

The constructor accepts five arguments:

- A required object containing the following values:
  - `apiConfig` (Object): `AuthMiddleware` options for authentication on the commercetools platform. (Required. See [here](https://commercetools.github.io/nodejs/sdk/api/sdkMiddlewareAuth.html#named-arguments-options))
  - `accessToken` (String): Access token to be used to authenticate requests to API. Requires scope of [`view_products`, `view_orders`, `view_customers`, `manage_products`, `manage_orders`, `manage_customers`].
  - `batchSize` (Number): Amount of custom objects to process concurrently (Optional. Default: 50)
  - `continueOnProblems` (Boolean): Flag whether to continue processing if an error occurs (Optional. Default: false)
  - An optional logger object having four functions (`info`, `warn`, `error` and `debug`)

## Usage with `sphere-node-cli`

You can use this package from the [`sphere-node-cli`](https://github.com/sphereio/sphere-node-cli). In order for the cli to import custom objects, the file to import from must be a valid JSON and follow the following structure:

```json
[{
		"container": "Ludus",
		"key": "copperKey",
		"value": {
			"paymentMethod": "Cash",
			"paymentID": "1",
			"whateverElse": {
				"number": 1000
			}
		}
	},
	{
		"container": "Frobozz",
		"key": "jadeKey",
		"value": {
			"paymentMethod": "cc",
			"paymentID": "2",
			"whateverElse": {
				"digits": [1, 2, 3]
			}
		}
	},
	{
		"container": "Syrinx",
		"key": "crystalKey",
		"value": {
			"paymentMethod": "new",
			"paymentID": "3",
			"whateverElse": {
				"true": true
			}
		}
	}
  ...
]
```

Then you can import this file using the cli:

```bash
sphere import -t customObject -p my-project-key --host 'https://api.europe-west1.gcp.commercetools.com' --authHost 'https://auth.europe-west1.gcp.commercetools.com' -f /path/to/file.json -c
'{"continueOnProblems": true}'
```

## Direct Usage

You can also use this module directly in your Javascript project. To do this, you need to install it:

```bash
npm install @commercetools/custom-objects-importer
```

Then you can use it to import custom objects:

```js
import CustomObjectsImport from '@commercetools/custom-objects-importer'

const customObjectsToImport = [
  {
    container: 'Ludus',
    key: 'copperKey',
    value: {
      paymentMethod: 'Cash',
      paymentID: '1',
      whateverElse: {
        number: 1000
      }
    },
  },
  {
    container: 'Frobozz',
    key: 'jadeKey',
    value: {
      paymentMethod: 'cc',
      paymentID: '2',
      whateverElse: {
        digits: [1,2,3]
      }
    },
  },
  {
    container: 'Syrinx',
    key: 'crystalKey',
    value: {
      paymentMethod: 'new',
      paymentID: '3',
      whateverElse: {
        true: false
      }
    },
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

const customObjectsImport = new CustomObjectsImport(options, logger)

customObjectsImport.run(customObjectsToImport)
  .then(() => {
    customObjectsImport.summaryReport()
    // handle successful import
  })
  .catch((error) => {
    // handle error
  })
```

On successful completion, a call to the `.summaryReport()` method returns a report in the following format:

```js
{
  reportMessage: 'Summary: there were 4 successfully imported custom objects. 2 were newly created, 2 were updated and 0 were unchanged.)',
  detailedSummary: {
    createErrorCount: 0,
    created: 2,
    errors: [],
    unchanged: 0,
    updateErrorCount: 0,
    updated: 2
  }
}
```

**Note:** By default, if a custom object exists, the module tries to build an update action for it, and if no update action can be built, the custom object will be ignored
