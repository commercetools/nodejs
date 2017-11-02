import fs from 'fs'
import tmp from 'tmp'
import { getCredentials } from '@commercetools/get-credentials'
import { exec } from 'child_process'
import { version } from '@commercetools/product-exporter/package.json'
import {
  sampleProductType,
  sampleTaxCategory,
  createProducts,
  expectedProducts,
} from './helpers/products-export.data'
import { createData, clearData } from './helpers/utils'

let projectKey
if (process.env.CI === 'true') projectKey = 'product-export-integration-test'
else projectKey = process.env.npm_config_projectkey

describe('Product Exporter', () => {
  let apiConfig
  const bin = './integration-tests/node_modules/.bin/product-exporter'

  beforeAll(async () => {
    const credentials = await getCredentials(projectKey)
    apiConfig = {
      host: 'https://auth.sphere.io',
      apiUrl: 'https://api.sphere.io',
      projectKey,
      credentials,
    }
    await clearData(apiConfig, 'products')

    await Promise.all([
      clearData(apiConfig, 'productTypes'),
      clearData(apiConfig, 'taxCategories'),
    ])

    const createdProductType = await createData(apiConfig, 'productTypes', [
      sampleProductType,
    ])
    const createdTaxCategory = await createData(apiConfig, 'taxCategories', [
      sampleTaxCategory,
    ])

    const productType = {
      typeId: 'product-type',
      id: createdProductType[0].body.id,
    }
    const taxCategory = {
      typeId: 'tax-category',
      id: createdTaxCategory[0].body.id,
    }

    const sampleProducts = createProducts(productType, taxCategory)

    await createData(apiConfig, 'products', sampleProducts)
  }, 10000)

  afterAll(async () => {
    await clearData(apiConfig, 'products')
    await Promise.all([
      clearData(apiConfig, 'productTypes'),
      clearData(apiConfig, 'taxCategories'),
    ])
  })

  describe('CLI basic functionality', () => {
    it('should print usage information given the help flag', done => {
      exec(`${bin} --help`, (error, stdout, stderr) => {
        expect(error).toBeFalsy()
        expect(stderr).toBeFalsy()
        expect(String(stdout)).toMatch(/help/)
        done()
      })
    })

    it('should print the module version given the version flag', done => {
      exec(`${bin} --version`, (error, stdout, stderr) => {
        expect(error).toBeFalsy()
        expect(stderr).toBeFalsy()
        expect(stdout).toBe(`${version}\n`)
        done()
      })
    })
  })

  describe('export function', () => {
    it('should export products from the CTP', done => {
      const filePath = tmp.fileSync().name
      exec(
        `${bin} -o ${filePath} -p ${projectKey} --staged`,
        (cliError, stdout, stderr) => {
          expect(cliError).toBeFalsy()
          expect(stderr).toBeFalsy()
          expect(stdout).toMatch(/Export operation completed successfully/)
          fs.readFile(filePath, { encoding: 'utf8' }, (error, data) => {
            expect(error).toBeFalsy()
            const actual = JSON.parse(data)
            expect(actual).toBeInstanceOf(Array)
            expect(actual.length).toBe(2)
            // Assert that the 2 created products are the products returned
            expect(actual).toContainEqual(
              expect.objectContaining(expectedProducts[0])
            )
            expect(actual).toContainEqual(
              expect.objectContaining(expectedProducts[1])
            )
            done()
          })
        }
      )
    })
  })
})
