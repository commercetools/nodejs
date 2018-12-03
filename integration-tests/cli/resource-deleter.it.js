import fs from 'mz/fs'
import tmp from 'tmp'
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
      clearData(apiConfig, 'productDiscounts'),
      clearData(apiConfig, 'reviews'),
      clearData(apiConfig, 'shippingMethods'),
      clearData(apiConfig, 'taxCategories'),
      clearData(apiConfig, 'types'),
      clearData(apiConfig, 'zones'),
      clearData(apiConfig, 'productTypes'),
      clearData(apiConfig, 'categories'),
      clearData(apiConfig, 'carts'),
      clearData(apiConfig, 'products'),
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

  describe('when deleting carts', () => {
    let filePath
    let stdout
    let stderr
    const resource = 'carts'

    beforeAll(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(
        `${bin} -o ${filePath} -p ${projectKey} -r ${resource}`
      )
    })

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout)
        .toMatch(/Starting to delete fetched carts/)
        .toMatch(/All deleted/)
    })

    it('should delete carts', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      expect(data)
        .toBeDefined()
        .toEqual('')
        .toHaveLength(0)
    })
  })

  describe('when deleting categories', () => {
    let filePath
    let stdout
    let stderr
    const resource = 'categories'

    beforeAll(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(
        `${bin} -o ${filePath} -p ${projectKey} -r ${resource}`
      )
    })

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout)
        .toMatch(/Starting to delete fetched categories/)
        .toMatch(/All deleted/)
    })

    it('should delete categories', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      expect(data)
        .toBeDefined()
        .toEqual('')
        .toHaveLength(0)
    })
  })

  describe('when deleting channels', () => {
    let filePath
    let stdout
    let stderr
    const resource = 'channels'

    beforeAll(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(
        `${bin} -o ${filePath} -p ${projectKey} -r ${resource}`
      )
    })

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout)
        .toMatch(/Starting to delete fetched channels/)
        .toMatch(/All deleted/)
    })

    it('should delete channels', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      expect(data)
        .toBeDefined()
        .toEqual('')
        .toHaveLength(0)
    })
  })

  describe('when deleting customerGroups', () => {
    let filePath
    let stdout
    let stderr
    const resource = 'customerGroups'

    beforeAll(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(
        `${bin} -o ${filePath} -p ${projectKey} -r ${resource}`
      )
    })

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout)
        .toMatch(/Starting to delete fetched customerGroups/)
        .toMatch(/All deleted/)
    })

    it('should delete customerGroups', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      expect(data)
        .toBeDefined()
        .toEqual('')
        .toHaveLength(0)
    })
  })

  describe('when deleting customers', () => {
    let filePath
    let stdout
    let stderr
    const resource = 'customers'

    beforeAll(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(
        `${bin} -o ${filePath} -p ${projectKey} -r ${resource}`
      )
    })

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout)
        .toMatch(/Starting to delete fetched customers/)
        .toMatch(/All deleted/)
    })

    it('should delete customers', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      expect(data)
        .toBeDefined()
        .toEqual('')
        .toHaveLength(0)
    })
  })

  describe('when deleting customObjects', () => {
    let filePath
    let stdout
    let stderr
    const resource = 'customObjects'

    beforeAll(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(
        `${bin} -o ${filePath} -p ${projectKey} -r ${resource}`
      )
    })

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout)
        .toMatch(/Starting to delete fetched customObjects/)
        .toMatch(/All deleted/)
    })

    it('should delete customObjects', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      expect(data)
        .toBeDefined()
        .toEqual('')
        .toHaveLength(0)
    })
  })

  describe('when deleting inventoryEntries', () => {
    let filePath
    let stdout
    let stderr
    const resource = 'inventory'

    beforeAll(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(
        `${bin} -o ${filePath} -p ${projectKey} -r ${resource}`
      )
    })

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout)
        .toMatch(/Starting to delete fetched inventory/)
        .toMatch(/All deleted/)
    })

    it('should delete inventoryEntries', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      expect(data)
        .toBeDefined()
        .toEqual('')
        .toHaveLength(0)
    })
  })

  describe('when deleting payments', () => {
    let filePath
    let stdout
    let stderr
    const resource = 'payments'

    beforeAll(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(
        `${bin} -o ${filePath} -p ${projectKey} -r ${resource}`
      )
    })

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout)
        .toMatch(/Starting to delete fetched payments/)
        .toMatch(/All deleted/)
    })

    it('should delete payments', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      expect(data)
        .toBeDefined()
        .toEqual('')
        .toHaveLength(0)
    })
  })

  describe('when deleting productDiscounts', () => {
    let filePath
    let stdout
    let stderr
    const resource = 'productDiscounts'

    beforeAll(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(
        `${bin} -o ${filePath} -p ${projectKey} -r ${resource}`
      )
    })

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout)
        .toMatch(/Starting to delete fetched productDiscounts/)
        .toMatch(/All deleted/)
    })

    it('should delete productDiscounts', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      expect(data)
        .toBeDefined()
        .toEqual('')
        .toHaveLength(0)
    })
  })

  describe('when deleting products', () => {
    let filePath
    let stdout
    let stderr
    const resource = 'products'

    beforeAll(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(
        `${bin} -o ${filePath} -p ${projectKey} -r ${resource}`
      )
    })

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout)
        .toMatch(/Starting to delete fetched products/)
        .toMatch(/All deleted/)
    })

    it('should delete products', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      expect(data)
        .toBeDefined()
        .toEqual('')
        .toHaveLength(0)
    })
  })

  describe('when deleting productTypes', () => {
    let filePath
    let stdout
    let stderr
    const resource = 'productTypes'

    beforeAll(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(
        `${bin} -o ${filePath} -p ${projectKey} -r ${resource}`
      )
    })

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout)
        .toMatch(/Starting to delete fetched productTypes/)
        .toMatch(/All deleted/)
    })

    it('should delete productTypes', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      expect(data)
        .toBeDefined()
        .toEqual('')
        .toHaveLength(0)
    })
  })

  describe('when deleting reviews', () => {
    let filePath
    let stdout
    let stderr
    const resource = 'reviews'

    beforeAll(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(
        `${bin} -o ${filePath} -p ${projectKey} -r ${resource}`
      )
    })

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout)
        .toMatch(/Starting to delete fetched reviews/)
        .toMatch(/All deleted/)
    })

    it('should delete reviews', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      expect(data)
        .toBeDefined()
        .toEqual('')
        .toHaveLength(0)
    })
  })

  describe('when deleting shippingMethods', () => {
    let filePath
    let stdout
    let stderr
    const resource = 'shippingMethods'

    beforeAll(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(
        `${bin} -o ${filePath} -p ${projectKey} -r ${resource}`
      )
    })

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout)
        .toMatch(/Starting to delete fetched shippingMethods/)
        .toMatch(/All deleted/)
    })

    it('should delete shippingMethods', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      expect(data)
        .toBeDefined()
        .toEqual('')
        .toHaveLength(0)
    })
  })

  describe('when deleting taxCategories', () => {
    let filePath
    let stdout
    let stderr
    const resource = 'taxCategories'

    beforeAll(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(
        `${bin} -o ${filePath} -p ${projectKey} -r ${resource}`
      )
    })

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout)
        .toMatch(/Starting to delete fetched taxCategories/)
        .toMatch(/All deleted/)
    })

    it('should delete taxCategories', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      expect(data)
        .toBeDefined()
        .toEqual('')
        .toHaveLength(0)
    })
  })

  describe('when deleting types', () => {
    let filePath
    let stdout
    let stderr
    const resource = 'types'

    beforeAll(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(
        `${bin} -o ${filePath} -p ${projectKey} -r ${resource}`
      )
    })

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout)
        .toMatch(/Starting to delete fetched types/)
        .toMatch(/All deleted/)
    })

    it('should delete types', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      expect(data)
        .toBeDefined()
        .toEqual('')
        .toHaveLength(0)
    })
  })

  describe('when deleting zones', () => {
    let filePath
    let stdout
    let stderr
    const resource = 'zones'

    beforeAll(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(
        `${bin} -o ${filePath} -p ${projectKey} -r ${resource}`
      )
    })

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout)
        .toMatch(/Starting to delete fetched zones/)
        .toMatch(/All deleted/)
    })

    it('should delete zones', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      expect(data)
        .toBeDefined()
        .toEqual('')
        .toHaveLength(0)
    })
  })
})
