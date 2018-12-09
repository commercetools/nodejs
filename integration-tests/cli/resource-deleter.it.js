import fetch from 'node-fetch'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import ResourceDeleter from '@commercetools/resource-deleter'
import { getCredentials } from '@commercetools/get-credentials'
import { exec } from 'mz/child_process'
import { version } from '@commercetools/resource-deleter/package.json'
import {
  carts,
  categories,
  channels,
  customerGroups,
  customers,
  customObjects,
  inventoryEntries,
  payments,
  productDiscounts,
  products,
  productTypes,
  reviews,
  shippingMethods,
  taxCategories,
  types,
  zones,
} from './helpers/resource-delete.data'
import { createData, clearData } from './helpers/utils'

let projectKey
if (process.env.CI === 'true') projectKey = 'resource-deleter-int-test'
else projectKey = process.env.npm_config_projectkey

describe('Resource Deleter', () => {
  let apiConfig
  let resourceDeleter
  let logger: {
    error: () => {},
    warn: () => {},
    info: () => {},
    debug: () => {},
  }
  const bin = './integration-tests/node_modules/.bin/resource-deleter'

  function getResource(resource) {
    const client = createClient({
      middlewares: [
        createAuthMiddlewareForClientCredentialsFlow({ ...apiConfig, fetch }),
        createHttpMiddleware({ host: apiConfig.apiUrl, fetch }),
      ],
    })

    const service = createRequestBuilder({
      projectKey: apiConfig.projectKey,
    })[resource]

    const request = {
      uri: service.build(),
      method: 'GET',
    }

    return client.execute(request)
  }

  beforeAll(async () => {
    // Get test credentials
    const credentials = await getCredentials(projectKey)
    apiConfig = {
      host: 'https://auth.sphere.io',
      apiUrl: 'https://api.sphere.io',
      projectKey,
      credentials,
    }

    // Create resources on API
    await Promise.all([
      await Promise.all([
        createData(apiConfig, 'productTypes', productTypes),
        createData(apiConfig, 'categories', categories),
        createData(apiConfig, 'taxCategories', taxCategories),
        createData(apiConfig, 'channels', channels),
        createData(apiConfig, 'customers', customers),
        createData(apiConfig, 'inventory', inventoryEntries),
        createData(apiConfig, 'customObjects', customObjects),
        createData(apiConfig, 'payments', payments),
        createData(apiConfig, 'customerGroups', customerGroups),
        createData(apiConfig, 'reviews', reviews),
        createData(apiConfig, 'productDiscounts', productDiscounts),
        createData(apiConfig, 'zones', zones),
        createData(apiConfig, 'types', types),
      ]),
      createData(apiConfig, 'products', products),
      createData(apiConfig, 'shippingMethods', shippingMethods),
      createData(apiConfig, 'carts', carts),
    ])
  }, 30000)

  // clear resources on API
  afterAll(async () => {
    await Promise.all([
      await Promise.all([
        clearData(apiConfig, 'products'),
        clearData(apiConfig, 'shippingMethods'),
        clearData(apiConfig, 'carts'),
      ]),
      clearData(apiConfig, 'productDiscounts'),
      clearData(apiConfig, 'reviews'),
      clearData(apiConfig, 'taxCategories'),
      clearData(apiConfig, 'types'),
      clearData(apiConfig, 'zones'),
      clearData(apiConfig, 'productTypes'),
      clearData(apiConfig, 'categories'),
      clearData(apiConfig, 'channels'),
      clearData(apiConfig, 'customerGroups'),
      clearData(apiConfig, 'customers'),
      clearData(apiConfig, 'customObjects'),
      clearData(apiConfig, 'inventory'),
      clearData(apiConfig, 'payments'),
    ])
  })

  describe('CLI basic functionality', () => {
    it('should print usage information given the help flag', async () => {
      const [stdout, stderr] = await exec(`${bin} --help`)
      expect(stderr).toBeFalsy()
      expect(stdout).toMatchSnapshot()
    })

    it('should print the module version given the version flag', async () => {
      const [stdout, stderr] = await exec(`${bin} --version`)
      expect(stderr).toBeFalsy()
      expect(stdout).toBe(`${version}\n`)
    })
  })

  describe.each([
    'carts',
    'products',
    'shippingMethods',
    'productDiscounts',
    'reviews',
    'taxCategories',
    'types',
    'zones',
    'productTypes',
    'categories',
    'channels',
    'customerGroups',
    'customers',
    'customObjects',
    'inventory',
    'payments',
  ])('should delete resource', resource => {
    beforeEach(() => {
      const options = {
        apiConfig,
        resource,
        logger,
      }
      resourceDeleter = new ResourceDeleter(options)
    })

    it(`${resource} deleted`, async () => {
      // Check that resource exists
      const payload = await getResource(resource)
      expect(payload.body.results.length).toBeGreaterThanOrEqual(1)

      // Delete resource
      await resourceDeleter.run()

      // Check that resource is deleted
      const newPayload = await getResource(resource)
      expect(newPayload.body.results).toHaveLength(0)
    })
  })
})
