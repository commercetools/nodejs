import fs from 'fs'
import tmp from 'tmp'
import { exec } from 'child_process'
import { getCredentials } from '@commercetools/get-credentials'
import { version } from '@commercetools/product-json-to-csv/package.json'
import {
  sampleProductType,
  anotherSampleProductType,
  sampleState,
  sampleTaxCategory,
  sampleParentCategory,
  createChildCategory,
  createProducts,
} from './helpers/product-json2csv.data'
import { createData, clearData } from './helpers/utils'

let projectKey
if (process.env.CI === 'true') projectKey = 'product-export-integration-test'
else projectKey = process.env.npm_config_projectkey

describe('CSV and CLI Tests', () => {
  let apiConfig
  const binPath = './integration-tests/node_modules/.bin/product-json-to-csv'
  const tmpFile = tmp.fileSync({ postfix: '.json' })

  beforeAll(async () => {
    const credentials = await getCredentials(projectKey)
    apiConfig = {
      host: 'https://auth.sphere.io',
      apiUrl: 'https://api.sphere.io',
      projectKey,
      credentials,
    }

    // Clear all data
    await clearData(apiConfig, 'products')

    await Promise.all([
      clearData(apiConfig, 'productTypes'),
      clearData(apiConfig, 'categories'),
      clearData(apiConfig, 'states'),
      clearData(apiConfig, 'taxCategories'),
    ])

    // Create data on API
    await createData(apiConfig, 'productTypes', [
      sampleProductType,
      anotherSampleProductType,
    ])

    const state = await createData(apiConfig, 'states', [sampleState])
    const taxCategory = await createData(apiConfig, 'taxCategories', [
      sampleTaxCategory,
    ])

    const parentCategory = await createData(apiConfig, 'categories', [
      sampleParentCategory,
    ])
    const parentRef = {
      typeId: 'category',
      id: parentCategory[0].body.id,
    }
    const stateRef = {
      typeId: 'tax-category',
      id: state[0].body.id,
    }
    const taxCategoryRef = {
      typeId: 'tax-category',
      id: taxCategory[0].body.id,
    }
    await createData(apiConfig, 'categories', [createChildCategory(parentRef)])

    const sampleProducts = createProducts(stateRef, taxCategoryRef)
    const products = await createData(apiConfig, 'products', sampleProducts)

    // Write created products to temp file
    fs.writeFileSync(tmpFile.name, JSON.stringify(products))
  }, 10000)

  afterAll(async () => {
    await clearData(apiConfig, 'products')
    await Promise.all([
      clearData(apiConfig, 'productTypes'),
      clearData(apiConfig, 'categories'),
      clearData(apiConfig, 'states'),
      clearData(apiConfig, 'taxCategories'),
    ])
  })

  describe('CLI basic functionality', () => {
    test('should print usage information given the help flag', done => {
      exec(`${binPath} --help`, (error, stdout, stderr) => {
        expect(String(stdout)).toMatch(/help/)
        expect(error && stderr).toBeFalsy()
        done()
      })
    })

    test('should print the module version given the version flag', done => {
      exec(`${binPath} --version`, (error, stdout, stderr) => {
        expect(stdout).toBe(`${version}\n`)
        expect(error && stderr).toBeFalsy()
        done()
      })
    })
  })
})
