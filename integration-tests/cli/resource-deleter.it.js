import fetch from 'node-fetch'
import Promise from 'bluebird'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import ResourceDeleter from '@commercetools/resource-deleter'
import { getCredentials } from '@commercetools/get-credentials'
import { exec } from 'mz/child_process'
import { version } from '@commercetools/resource-deleter/package.json'
import * as resources from './helpers/resource-delete.data'
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

    // create resources on API
    await Promise.each(Object.keys(resources), name => {
      return createData(apiConfig, name, resources[name])
    })
  }, 30000)

  // clear resources on API
  afterAll(async () => {
    await Promise.each(Object.keys(resources), name => {
      clearData(apiConfig, name)
    })
  }, 45000)

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

  describe.each(Object.keys(resources).reverse())(
    'should delete resource',
    resource => {
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
      }, 25000)
    }
  )

  describe('should delete a specific resource', () => {
    const resource = 'channels'
    if (resource === 'channels') {
      beforeEach(() => {
        const options = {
          apiConfig,
          resource,
          logger,
        }
        resourceDeleter = new ResourceDeleter(options)
        return createData(apiConfig, resource, [
          {
            key: 'singleChannel',
            name: {
              en: 'singleChannel',
              de: 'singleChannel',
            },
          },
          {
            key: 'nextChannel',
            name: {
              en: 'nextChannel',
              de: 'nextChannel',
            },
          },
        ])
      })
    }

    it(`The specified ${resource} deleted`, async () => {
      const payload = await getResource(resource)
      expect(payload.body.results.length).toBeGreaterThanOrEqual(1)
      await resourceDeleter.run()
      const newPayload = await getResource(resource)
      expect(newPayload.body.results).toHaveLength(0)
    })
  })

  describe('should delete a specific resource with predicate', () => {
    const resource = 'customerGroups'
    if (resource === 'customerGroups') {
      beforeEach(() => {
        const options = {
          apiConfig,
          resource,
          logger,
          predicate: 'key="CGKey2"',
        }
        resourceDeleter = new ResourceDeleter(options)
        return createData(apiConfig, resource, [
          {
            key: 'CGKey1',
            groupName: 'SampleCGName1',
          },
          {
            key: 'CGKey2',
            groupName: 'SampleCGName2',
          },
          {
            key: 'CGKey3',
            groupName: 'SampleCGName3',
          },
        ])
      })
    }

    it(`The specified ${resource} deleted`, async () => {
      const payload = await getResource(resource)

      // Check the total number of item in the resource.
      expect(payload.body.results).toHaveLength(3)

      // Delete the selected item.
      await resourceDeleter.run()

      // Check that the selected item is deleted
      const newPayload = await getResource(resource)
      expect(newPayload.body.results).toHaveLength(2)
    }, 15000)
  })

  describe('should delete a published product', () => {
    const productType = [
      {
        name: 'sampleProductType',
        key: 'sample-product-123PTKey',
        description: 'Sample Product Type',
        version: 1,
      },
    ]
    const products = [
      {
        key: 'sample-product-123Key',
        name: {
          en: 'sample-product-123',
        },
        slug: {
          en: 'sample-product-123-product-type',
        },
        productType: {
          key: 'sample-product-123PTKey',
          description: 'Sample Product Type',
        },
        version: 1,
        publish: true,
      },
    ]
    const resource = 'products'

    beforeAll(async () => {
      const options = {
        apiConfig,
        resource,
        logger,
      }
      resourceDeleter = new ResourceDeleter(options)
      await createData(apiConfig, 'productTypes', productType)
      await createData(apiConfig, 'products', products)
      return resources
    })
    afterAll(async () => {
      await clearData(apiConfig, 'products')
      return clearData(apiConfig, 'productTypes')
    })

    it(`The published ${resource} deleted`, async () => {
      const payload = await getResource(resource)
      expect(payload.body.results.length).toBe(1)
      await resourceDeleter.run()
      const newPayload = await getResource(resource)
      expect(newPayload.body.results).toHaveLength(0)
    }, 30000)
  })
})
