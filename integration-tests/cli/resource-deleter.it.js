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
import logger from '../../packages/resource-deleter/src/utils/silent-logger'
import { createData, clearData } from './helpers/utils'

const projectKey =
  process.env.CI === 'true'
    ? 'resource-deleter-int-test'
    : process.env.npm_config_projectkey

const resourcesOrder = [
  'categories',
  'channels',
  'customerGroups',
  'customers',
  'customObjects',
  'inventory',
  'payments',
  'productDiscounts',
  'productTypes',
  'reviews',
  'taxCategories',
  'types',
  'zones',
  'carts',
  'products',
  'shippingMethods',
]
const resourcesOrderReversed = Object.assign([], resourcesOrder).reverse()

// FIXME: currently it fails, as it seems like there are more resources than expected.
describe('Resource Deleter', () => {
  let apiConfig
  let resourceDeleter
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
      host: 'https://auth.europe-west1.gcp.commercetools.com',
      apiUrl: 'https://api.europe-west1.gcp.commercetools.com',
      projectKey,
      credentials,
    }

    // create resources on API
    await Promise.each(resourcesOrder, (name) => {
      return createData(apiConfig, name, resources[name])
    })
  }, 30000)

  // clear resources on API
  afterAll(async () => {
    await Promise.each(resourcesOrderReversed, (name) => {
      return createData(apiConfig, name, resources[name])
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

  describe.each(resourcesOrderReversed)(
    'should delete resource',
    (resource) => {
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

    it(`The specified ${resource} deleted`, async () => {
      const payload = await getResource(resource)
      expect(payload.body.results.length).toBeGreaterThanOrEqual(1)
      await resourceDeleter.run()
      const newPayload = await getResource(resource)
      expect(newPayload.body.results).toHaveLength(0)
    })
  }, 15000)

  describe('should delete a specific resource with predicate', () => {
    const resource = 'customerGroups'
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

    it(`The specified ${resource} with predicate deleted`, async () => {
      const payload = await getResource(resource)
      expect(payload.body.results).toHaveLength(3)
      await resourceDeleter.run()
      const newPayload = await getResource(resource)
      expect(newPayload.body.results).toHaveLength(2)
    }, 15000)
  })

  describe('should delete categories with its grandchildren', () => {
    const resource = 'categories'
    beforeAll(async () => {
      const options = {
        apiConfig,
        resource,
        logger,
      }

      const parentCategories = [
        {
          name: { en: 'barParentCategory2' },
          key: 'parent2BCNkey',
          slug: { en: 'barParentCategory2-slug' },
        },
      ]

      const childCategories = [
        {
          name: { en: 'barChild1Category' },
          key: 'barChild1BCNkey',
          slug: { en: 'barChild1Category-slug' },
          parent: { key: 'parent2BCNkey', typeId: 'category' },
        },
        {
          name: { en: 'barChild2Category' },
          key: 'barChild2BCNkey',
          slug: { en: 'barChild2Category2-slug' },
          parent: { key: 'parent2BCNkey', typeId: 'category' },
        },
      ]

      const grandChildCategories = [
        {
          name: { en: 'barGrandChild1Category' },
          key: 'b1GCNkey',
          slug: { en: 'barGrandChild1Category-slug' },
          parent: { key: 'barChild1BCNkey', typeId: 'category' },
        },
        {
          name: { en: 'barGrandChild2Category' },
          key: 'b2GCNkey',
          slug: { en: 'barGrandChild2Category-slug' },
          parent: { key: 'barChild1BCNkey', typeId: 'category' },
        },
      ]

      const greatGrandChildCategories = [
        {
          name: { en: 'barGGChild1Category' },
          key: 'b1GGCNkey',
          slug: { en: 'barGGChild1Category-slug' },
          parent: { key: 'b1GCNkey', typeId: 'category' },
        },
        {
          name: { en: 'barGGChild2Category' },
          key: 'b2GGCNkey',
          slug: { en: 'barGGChild2Category-slug' },
          parent: { key: 'b1GCNkey', typeId: 'category' },
        },
      ]

      const greatGreatGrandChildCategories = [
        {
          name: { en: 'barGGGChild1Category' },
          key: 'b1GGGCNkey',
          slug: { en: 'barGGGChild1Category-slug' },
          parent: { key: 'b2GGCNkey', typeId: 'category' },
        },
        {
          name: { en: 'barGGGChild2Category' },
          key: 'b2GGGCNkey',
          slug: { en: 'barGGGChild2Category-slug' },
          parent: { key: 'b2GGCNkey', typeId: 'category' },
        },
      ]

      resourceDeleter = new ResourceDeleter(options)
      await createData(apiConfig, resource, parentCategories)
      await createData(apiConfig, resource, childCategories)
      await createData(apiConfig, resource, grandChildCategories)
      await createData(apiConfig, resource, greatGrandChildCategories)
      return createData(apiConfig, resource, greatGreatGrandChildCategories)
    }, 8000)

    afterAll(async () => {
      return clearData(apiConfig, 'categories')
    })

    it(`The ${resource} grandchildren deleted first before their ancestors deletion`, async () => {
      const payload = await getResource(resource)
      expect(payload.body.results).toHaveLength(9)
      await resourceDeleter.run()
      const newPayload = await getResource(resource)
      expect(newPayload.body.results).toHaveLength(0)
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
