import fs from 'mz/fs'
import tmp from 'tmp'
import { getCredentials } from '@commercetools/get-credentials'
import { exec } from 'mz/child_process'
import { version } from '@commercetools/resource-deleter/package.json'
import {
  cart,
  categories,
  customer,
  sampleProductType,
  anotherSampleProductType,
} from './helpers/resource-delete.data'
import { createData, clearData } from './helpers/utils'

let projectKey
if (process.env.CI === 'true') projectKey = 'resource-deleter-int-test'
else projectKey = process.env.npm_config_projectkey

describe('Resource Deleter', () => {
  let apiConfig
  const bin = './integration-tests/node_modules/.bin/resource-deleter'

  beforeAll(async () => {
    // Get test credentials
    const credentials = await getCredentials(projectKey)
    apiConfig = {
      host: 'https://auth.sphere.io',
      apiUrl: 'https://api.sphere.io',
      projectKey,
      credentials,
    }

    await clearData(apiConfig, 'carts')
    await clearData(apiConfig, 'categories')
    await clearData(apiConfig, 'customers')
    await clearData(apiConfig, 'productTypes')

    // Create resources on API
    await createData(apiConfig, 'carts', cart)
    await createData(apiConfig, 'categories', categories)
    await createData(apiConfig, 'customers', customer)
    await createData(apiConfig, 'productTypes', [
      sampleProductType,
      anotherSampleProductType,
    ])
  }, 30000)

  afterAll(async () => {
    await clearData(apiConfig, 'carts')
    await clearData(apiConfig, 'categories')
    await clearData(apiConfig, 'customers')
    await clearData(apiConfig, 'productTypes')
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
})
