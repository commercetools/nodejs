import fs from 'mz/fs'
import tmp from 'tmp'
import Promise from 'bluebird'
import path from 'path'
import unzipper from 'unzipper'
import Excel from 'exceljs'
import zipObject from 'lodash.zipobject'
import cloneDeep from 'lodash.clonedeep'
import { exec } from 'mz/child_process'
import { getCredentials } from '@commercetools/get-credentials'
import { version } from '@commercetools/product-json-to-xlsx/package.json'
import {
  sampleProductType,
  anotherSampleProductType,
  sampleState,
  sampleTaxCategory,
  sampleParentCategory,
  sampleCategory,
  samplePriceChannel,
  createProducts,
} from './helpers/product-json2csv.data'
import { createData, clearData } from './helpers/utils'

let projectKey
if (process.env.CI === 'true') projectKey = 'product-json2xlsx-integration-test'
else projectKey = process.env.npm_config_projectkey

async function cleanup(apiConfig) {
  // Clear all data
  await clearData(apiConfig, 'products')
  await Promise.all([
    clearData(apiConfig, 'productTypes'),
    clearData(apiConfig, 'categories'),
    clearData(apiConfig, 'states'),
    clearData(apiConfig, 'taxCategories'),
    clearData(apiConfig, 'channels'),
  ])
}

function mapRowsToProducts(rows) {
  const _rows = cloneDeep(rows)
  // first line contains header
  const header = _rows.shift()
  return _rows.map(row => zipObject(header, row))
}

function analyzeExcelWorkbook(workbook) {
  const rows = []
  const worksheet = workbook.getWorksheet('Products')

  worksheet.eachRow(row => rows.push(row.values))
  // remove first column containing null values
  rows.forEach(row => row.shift())

  return {
    workbook,
    worksheet,
    rows,
  }
}

function analyzeExcelStream(stream) {
  const workbook = new Excel.Workbook()
  const readStream = workbook.xlsx.createInputStream()
  stream.pipe(readStream)

  return new Promise((resolve, reject) => {
    readStream.on('error', reject)
    readStream.on('done', () => resolve(analyzeExcelWorkbook(workbook)))
  })
}

async function analyzeExcelFile(filePath) {
  const workbook = new Excel.Workbook()
  await workbook.xlsx.readFile(filePath)
  return {
    filePath,
    ...(await analyzeExcelWorkbook(workbook)),
  }
}

describe('XLSX and CLI Tests', () => {
  let apiConfig
  const binPath = './integration-tests/node_modules/.bin/product-json-to-xlsx'

  beforeAll(async () => {
    const credentials = await getCredentials(projectKey)
    apiConfig = {
      host: 'https://https://docs.commercetools.com/http-api-authorization#http-api---authorization',
      apiUrl: 'https://api.europe-west1.gcp.commercetools.com',
      projectKey,
      credentials,
    }

    await cleanup(apiConfig)

    // Create data on API
    await createData(apiConfig, 'productTypes', [
      sampleProductType,
      anotherSampleProductType,
    ])

    await createData(apiConfig, 'categories', [sampleParentCategory])
    await createData(apiConfig, 'categories', [sampleCategory])

    const priceChannel = await createData(apiConfig, 'channels', [
      samplePriceChannel,
    ])
    const state = await createData(apiConfig, 'states', [sampleState])
    const taxCategory = await createData(apiConfig, 'taxCategories', [
      sampleTaxCategory,
    ])

    const stateRef = {
      typeId: 'state',
      id: state[0].body.id,
    }
    const taxCategoryRef = {
      typeId: 'tax-category',
      id: taxCategory[0].body.id,
    }

    const sampleProducts = createProducts(stateRef, taxCategoryRef)
    sampleProducts[0].masterVariant.prices[0].channel = {
      typeId: 'channel',
      id: priceChannel[0].body.id,
    }

    await createData(apiConfig, 'products', sampleProducts)
  }, 20000)

  afterAll(() => cleanup(apiConfig))

  describe('CLI basic functionality', () => {
    it('should print usage information given the help flag', async () => {
      const [stdout, stderr] = await exec(`${binPath} --help`)
      expect(stdout).toMatchSnapshot()
      expect(stderr).toBeFalsy()
    })

    it('should print the module version given the version flag', async () => {
      const [stdout, stderr] = await exec(`${binPath} --version`)
      expect(stdout).toBe(`${version}\n`)
      expect(stderr).toBeFalsy()
    })
  })

  describe('Parser', () => {
    const exporter = './integration-tests/node_modules/.bin/product-exporter'
    describe('From product exporter', () => {
      describe('WITHOUT HEADERS:: write products to `zip` file', () => {
        let product1
        let product2
        let stdout
        let stderr
        const fileNames = []

        beforeAll(async done => {
          const zipFile = tmp.fileSync({ postfix: '.zip' }).name
          ;[stdout, stderr] = await exec(
            `${exporter} -p ${projectKey} -s | ${binPath} -p ${projectKey} --referenceCategoryBy namedPath --fillAllRows -o ${zipFile}`
          )

          fs.createReadStream(zipFile)
            .pipe(unzipper.Parse())
            .on('entry', async entry => {
              const excelInfo = await analyzeExcelStream(entry)
              fileNames.push(entry.path)

              if (entry.path.includes('productTypeForProductParse'))
                product1 = mapRowsToProducts(excelInfo.rows)
              else product2 = mapRowsToProducts(excelInfo.rows)

              // unzipper module fires done event before we finish async operations
              if (fileNames.length === 2) done()
            })
        }, 15000)

        it('should successfully export and map products', () => {
          expect(stdout).toBeTruthy()
          expect(stderr).toBeFalsy()
        })

        describe('File 1', () => {
          let product
          beforeAll(() => {
            product = product1
          })

          it('zip folder contains file named `productType`', () => {
            const fileName = ['products/productTypeForProductParse.xlsx']
            expect(fileNames).toEqual(expect.arrayContaining(fileName))
          })

          it('product contains 3 variants', () => {
            expect(product).toHaveLength(3)
          })

          it('contains `name`', () => {
            const name = {
              'name.en': 'Sample Duck-jacket',
              'name.de': 'Beispiel Entejacke',
            }
            expect(product[0]).toEqual(expect.objectContaining(name))
            expect(product[1]).toEqual(expect.objectContaining(name))
            expect(product[2]).toEqual(expect.objectContaining(name))
          })

          it('contains `description`', () => {
            const description = {
              'description.en':
                'The light jackets of Save the Duck keep us cozy warm. The slight',
              'description.de':
                'Die leichten Freizeitjacken von Save the Duck halten uns wohlig',
            }
            expect(product[0]).toEqual(expect.objectContaining(description))
            expect(product[1]).toEqual(expect.objectContaining(description))
            expect(product[2]).toEqual(expect.objectContaining(description))
          })

          it('contains `slug`', () => {
            const slug = {
              'slug.en': 'sample-sluggy-duck-jacke-123',
              'slug.de': 'beispiel-sluggy-ente-jacke-123',
            }
            expect(product[0]).toEqual(expect.objectContaining(slug))
            expect(product[1]).toEqual(expect.objectContaining(slug))
            expect(product[2]).toEqual(expect.objectContaining(slug))
          })

          it('contains `searchKeywords`', () => {
            const searchKeywords = {
              'searchKeywords.en': 'Standard Keyword;German | White | Space',
            }
            expect(product[0]).toEqual(expect.objectContaining(searchKeywords))
            expect(product[1]).toEqual(expect.objectContaining(searchKeywords))
            expect(product[2]).toEqual(expect.objectContaining(searchKeywords))
          })

          it('contains resolved namedPath of `categories`', () => {
            const categories = 'Parent Category>child Category'
            expect(product[0]).toEqual(expect.objectContaining({ categories }))
            expect(product[1]).toEqual(expect.objectContaining({ categories }))
            expect(product[2]).toEqual(expect.objectContaining({ categories }))
          })

          it('contains resolved `state`', () => {
            const state = 'stateKey'
            expect(product[0]).toEqual(expect.objectContaining({ state }))
            expect(product[1]).toEqual(expect.objectContaining({ state }))
            expect(product[2]).toEqual(expect.objectContaining({ state }))
          })

          it('contains resolved `taxCategory`', () => {
            const tax = 'new-tax-category'
            expect(product[0]).toEqual(expect.objectContaining({ tax }))
            expect(product[1]).toEqual(expect.objectContaining({ tax }))
            expect(product[2]).toEqual(expect.objectContaining({ tax }))
          })

          it('contains variants `SKUs`', () => {
            expect(product[0]).toEqual(
              expect.objectContaining({ sku: 'M00FCKV' })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ sku: 'M00FCKV-11' })
            )
            expect(product[2]).toEqual(
              expect.objectContaining({ sku: 'M00FCKV-22' })
            )
          })

          it('contains variants `keys`', () => {
            expect(product[0]).toEqual(
              expect.objectContaining({ variantKey: 'master-var-1' })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ variantKey: 'normal-var-1' })
            )
            expect(product[2]).toEqual(
              expect.objectContaining({ variantKey: 'normal-var-2' })
            )
          })

          // Test for custom attributes
          it('contains variants custom attributes', () => {
            expect(product[0]).toEqual(
              expect.objectContaining({ 'text-attribute': 'Master Var attr' })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ 'text-attribute': 'First Var attr' })
            )
            expect(product[2]).toEqual(
              expect.objectContaining({ 'text-attribute': 'Second Var attr' })
            )
          })
        })

        describe('File 2', () => {
          let product
          beforeAll(() => {
            product = product2
          })

          it('zip folder contains file named `anotherProductType`', () => {
            const fileName = ['products/anotherProductTypeForProductParse.xlsx']
            expect(fileNames).toEqual(expect.arrayContaining(fileName))
          })

          it('product contains 2 variants', () => {
            expect(product).toHaveLength(2)
          })

          it('contains `name`', () => {
            const name = {
              'name.en': 'Second Sample Duck-jacket',
              'name.de': 'Zwite Beispiel Entejacke',
            }
            expect(product[0]).toEqual(expect.objectContaining(name))
            expect(product[1]).toEqual(expect.objectContaining(name))
          })

          it('contains `description`', () => {
            const description = {
              'description.en':
                'Golom Jacop Caesar Icarve the Duck keep us cozy warm. The slight',
              'description.de':
                'Lorem Ipsum Text von Save the Duck halten uns wohlig',
            }
            expect(product[0]).toEqual(expect.objectContaining(description))
            expect(product[1]).toEqual(expect.objectContaining(description))
          })

          it('contains `slug`', () => {
            const slug = {
              'slug.en': 'sample-sluggy-duck-jacke-456789',
              'slug.de': 'beispiel-sluggy-ente-jacke-456789',
            }
            expect(product[0]).toEqual(expect.objectContaining(slug))
            expect(product[1]).toEqual(expect.objectContaining(slug))
          })

          it('contains `searchKeywords`', () => {
            const searchKeywords = {
              'searchKeywords.en': 'Multi Tool;Swiss | Army | Knife',
            }
            expect(product[0]).toEqual(expect.objectContaining(searchKeywords))
            expect(product[1]).toEqual(expect.objectContaining(searchKeywords))
          })

          it('contains resolved namedPath of `categories`', () => {
            const categories = 'Parent Category>child Category'
            expect(product[0]).toEqual(expect.objectContaining({ categories }))
            expect(product[1]).toEqual(expect.objectContaining({ categories }))
          })

          it('contains resolved `state`', () => {
            const state = 'stateKey'
            expect(product[0]).toEqual(expect.objectContaining({ state }))
            expect(product[1]).toEqual(expect.objectContaining({ state }))
          })

          it('contains resolved `taxCategory`', () => {
            const tax = 'new-tax-category'
            expect(product[0]).toEqual(expect.objectContaining({ tax }))
            expect(product[1]).toEqual(expect.objectContaining({ tax }))
          })

          it('contains variants `SKUs`', () => {
            expect(product[0]).toEqual(
              expect.objectContaining({ sku: 'M00F56YSS' })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ sku: 'M00F56YSS-11' })
            )
          })

          it('contains variants `keys`', () => {
            expect(product[0]).toEqual(
              expect.objectContaining({ variantKey: 'master-var-111' })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ variantKey: 'normal-var-222' })
            )
          })

          // Test for custom attributes
          it('contains variants custom attributes', () => {
            expect(product[0]).toEqual(
              expect.objectContaining({
                'another-text-attribute': 'Another Master Var attr',
              })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({
                'another-text-attribute': 'Another First Var attr',
              })
            )
          })
        })
      })

      describe('WITH HEADERS:: write products to `XLSX` file', () => {
        let xlsxFile
        let products = []
        let stdout
        let stderr
        const templateFile = `${__dirname}/helpers/product-headers.csv`

        beforeAll(async done => {
          xlsxFile = tmp.fileSync({ postfix: '.xlsx' }).name
          ;[stdout, stderr] = await exec(
            `${exporter} -p ${projectKey} -s | ${binPath} -p ${projectKey} -t ${templateFile} --referenceCategoryBy name -o ${xlsxFile}`
          )

          const excel = await analyzeExcelFile(xlsxFile)
          products = mapRowsToProducts(excel.rows)

          // Format the products array for easier testing because we
          // cannot guarantee the sort order from the API
          if (products[0].key === 'productKey-2') {
            products = products.concat(products.splice(0, 2))
          }
          done()
        }, 20000)

        it('should successfully export and map products', () => {
          expect(stdout).toBeTruthy()
          expect(stderr).toBeFalsy()
        })

        it('should contain five variants', () => {
          expect(products).toHaveLength(5)
        })

        it('should have two products', () => {
          // Check Master variants
          expect(products[0]).toEqual(
            expect.objectContaining({ key: 'productKey-1' })
          )
          expect(products[3]).toEqual(
            expect.objectContaining({ key: 'productKey-2' })
          )

          // Check other variants
          expect(products[1]).toEqual(
            expect.objectContaining({ key: undefined })
          )
          expect(products[2]).toEqual(
            expect.objectContaining({ key: undefined })
          )
          expect(products[4]).toEqual(
            expect.objectContaining({ key: undefined })
          )
        })

        it('should include only columns from template', () => {
          const columns = [
            '_published',
            '_hasStagedChanges',
            'key',
            'productType',
            'variantId',
            'sku',
            'text-attribute',
            'another-text-attribute',
          ]
          products.forEach(product => {
            const productColumns = Object.keys(product)
            expect(productColumns).toEqual(columns)
          })
        })

        it('should contain variants custom attributes', () => {
          // From first product
          expect(products[0]).toEqual(
            expect.objectContaining({ 'text-attribute': 'Master Var attr' })
          )
          expect(products[0]).toEqual(
            expect.objectContaining({ 'another-text-attribute': undefined })
          )
          expect(products[1]).toEqual(
            expect.objectContaining({ 'text-attribute': 'First Var attr' })
          )
          expect(products[1]).toEqual(
            expect.objectContaining({ 'another-text-attribute': undefined })
          )
          expect(products[2]).toEqual(
            expect.objectContaining({ 'text-attribute': 'Second Var attr' })
          )
          expect(products[2]).toEqual(
            expect.objectContaining({ 'another-text-attribute': undefined })
          )

          // From second product
          expect(products[3]).toEqual(
            expect.objectContaining({ 'text-attribute': undefined })
          )
          expect(products[3]).toEqual(
            expect.objectContaining({
              'another-text-attribute': 'Another Master Var attr',
            })
          )
          expect(products[4]).toEqual(
            expect.objectContaining({ 'text-attribute': undefined })
          )
          expect(products[4]).toEqual(
            expect.objectContaining({
              'another-text-attribute': 'Another First Var attr',
            })
          )
        })
      })
    })

    describe('From JSON file', () => {
      let productsJsonFile
      let stdout
      let stderr
      beforeAll(async () => {
        productsJsonFile = tmp.fileSync({ postfix: '.json' }).name
        ;[stdout, stderr] = await exec(
          `${exporter} -p ${projectKey} -s -o ${productsJsonFile}`
        )
      }, 10000)

      it('should successfully map products', () => {
        expect(stdout).toBeTruthy()
        expect(stderr).toBeFalsy()
      })

      describe('WITHOUT HEADERS::should write products to `zip` file', () => {
        let product1
        let product2
        const fileNames = []

        beforeAll(async done => {
          const zipFile = tmp.fileSync({ postfix: '.zip' }).name

          // Map products from a JSON file to archived XLSX files
          ;[stdout, stderr] = await exec(
            `${binPath} -p ${projectKey} -i ${productsJsonFile} --referenceCategoryBy namedPath --fillAllRows -o ${zipFile}`
          )

          fs.createReadStream(zipFile)
            .pipe(unzipper.Parse())
            .on('entry', async entry => {
              const excelInfo = await analyzeExcelStream(entry)
              fileNames.push(entry.path)

              if (entry.path.includes('anotherProductType'))
                product1 = mapRowsToProducts(excelInfo.rows)
              else product2 = mapRowsToProducts(excelInfo.rows)

              // unzipper module fires done event before we finish async operations
              if (fileNames.length === 2) done()
            })
        }, 30000)

        it('should successfully map products', () => {
          expect(stdout).toBeTruthy()
          expect(stderr).toBeFalsy()
        })

        describe('File 1', () => {
          let product
          beforeAll(() => {
            product = product1
          })

          it('zip folder contains file named `anotherProductType`', () => {
            const fileName = ['products/anotherProductTypeForProductParse.xlsx']
            expect(fileNames).toEqual(expect.arrayContaining(fileName))
          })

          it('product contains 2 variants', () => {
            expect(product).toHaveLength(2)
          })

          it('contains `name`', () => {
            const name = {
              'name.en': 'Second Sample Duck-jacket',
              'name.de': 'Zwite Beispiel Entejacke',
            }
            expect(product[0]).toEqual(expect.objectContaining(name))
            expect(product[1]).toEqual(expect.objectContaining(name))
          })

          it('contains `description`', () => {
            const description = {
              'description.en':
                'Golom Jacop Caesar Icarve the Duck keep us cozy warm. The slight',
              'description.de':
                'Lorem Ipsum Text von Save the Duck halten uns wohlig',
            }
            expect(product[0]).toEqual(expect.objectContaining(description))
            expect(product[1]).toEqual(expect.objectContaining(description))
          })

          it('contains `slug`', () => {
            const slug = {
              'slug.en': 'sample-sluggy-duck-jacke-456789',
              'slug.de': 'beispiel-sluggy-ente-jacke-456789',
            }
            expect(product[0]).toEqual(expect.objectContaining(slug))
            expect(product[1]).toEqual(expect.objectContaining(slug))
          })

          it('contains `searchKeywords`', () => {
            const searchKeywords = {
              'searchKeywords.en': 'Multi Tool;Swiss | Army | Knife',
            }
            expect(product[0]).toEqual(expect.objectContaining(searchKeywords))
            expect(product[1]).toEqual(expect.objectContaining(searchKeywords))
          })

          it('contains resolved namedPath of `categories`', () => {
            const categories = 'Parent Category>child Category'
            expect(product[0]).toEqual(expect.objectContaining({ categories }))
            expect(product[1]).toEqual(expect.objectContaining({ categories }))
          })

          it('contains resolved `state`', () => {
            const state = 'stateKey'
            expect(product[0]).toEqual(expect.objectContaining({ state }))
            expect(product[1]).toEqual(expect.objectContaining({ state }))
          })

          it('contains resolved `taxCategory`', () => {
            const tax = 'new-tax-category'
            expect(product[0]).toEqual(expect.objectContaining({ tax }))
            expect(product[1]).toEqual(expect.objectContaining({ tax }))
          })

          it('contains variants `SKUs`', () => {
            expect(product[0]).toEqual(
              expect.objectContaining({ sku: 'M00F56YSS' })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ sku: 'M00F56YSS-11' })
            )
          })

          it('contains variants `keys`', () => {
            expect(product[0]).toEqual(
              expect.objectContaining({ variantKey: 'master-var-111' })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ variantKey: 'normal-var-222' })
            )
          })

          // Test for custom attributes
          it('contains variants custom attributes', () => {
            expect(product[0]).toEqual(
              expect.objectContaining({
                'another-text-attribute': 'Another Master Var attr',
              })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({
                'another-text-attribute': 'Another First Var attr',
              })
            )
          })
        })

        describe('File 2', () => {
          let product
          beforeAll(() => {
            product = product2
          })

          it('zip folder contains file named `productType`', () => {
            const fileName = ['products/productTypeForProductParse.xlsx']
            expect(fileNames).toEqual(expect.arrayContaining(fileName))
          })

          it('product contains 3 variants', () => {
            expect(product).toHaveLength(3)
          })

          it('contains `name`', () => {
            const name = {
              'name.en': 'Sample Duck-jacket',
              'name.de': 'Beispiel Entejacke',
            }
            expect(product[0]).toEqual(expect.objectContaining(name))
            expect(product[1]).toEqual(expect.objectContaining(name))
            expect(product[2]).toEqual(expect.objectContaining(name))
          })

          it('contains `description`', () => {
            const description = {
              'description.en':
                'The light jackets of Save the Duck keep us cozy warm. The slight',
              'description.de':
                'Die leichten Freizeitjacken von Save the Duck halten uns wohlig',
            }
            expect(product[0]).toEqual(expect.objectContaining(description))
            expect(product[1]).toEqual(expect.objectContaining(description))
            expect(product[2]).toEqual(expect.objectContaining(description))
          })

          it('contains `slug`', () => {
            const slug = {
              'slug.en': 'sample-sluggy-duck-jacke-123',
              'slug.de': 'beispiel-sluggy-ente-jacke-123',
            }
            expect(product[0]).toEqual(expect.objectContaining(slug))
            expect(product[1]).toEqual(expect.objectContaining(slug))
            expect(product[2]).toEqual(expect.objectContaining(slug))
          })

          it('contains `searchKeywords`', () => {
            const searchKeywords = {
              'searchKeywords.en': 'Standard Keyword;German | White | Space',
            }
            expect(product[0]).toEqual(expect.objectContaining(searchKeywords))
            expect(product[1]).toEqual(expect.objectContaining(searchKeywords))
            expect(product[2]).toEqual(expect.objectContaining(searchKeywords))
          })

          it('contains resolved namedPath of `categories`', () => {
            const categories = 'Parent Category>child Category'
            expect(product[0]).toEqual(expect.objectContaining({ categories }))
            expect(product[1]).toEqual(expect.objectContaining({ categories }))
            expect(product[2]).toEqual(expect.objectContaining({ categories }))
          })

          it('contains resolved `state`', () => {
            const state = 'stateKey'
            expect(product[0]).toEqual(expect.objectContaining({ state }))
            expect(product[1]).toEqual(expect.objectContaining({ state }))
            expect(product[2]).toEqual(expect.objectContaining({ state }))
          })

          it('contains resolved `taxCategory`', () => {
            const tax = 'new-tax-category'
            expect(product[0]).toEqual(expect.objectContaining({ tax }))
            expect(product[1]).toEqual(expect.objectContaining({ tax }))
            expect(product[2]).toEqual(expect.objectContaining({ tax }))
          })

          it('contains variants `SKUs`', () => {
            expect(product[0]).toEqual(
              expect.objectContaining({ sku: 'M00FCKV' })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ sku: 'M00FCKV-11' })
            )
            expect(product[2]).toEqual(
              expect.objectContaining({ sku: 'M00FCKV-22' })
            )
          })

          it('contains variants `keys`', () => {
            expect(product[0]).toEqual(
              expect.objectContaining({ variantKey: 'master-var-1' })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ variantKey: 'normal-var-1' })
            )
            expect(product[2]).toEqual(
              expect.objectContaining({ variantKey: 'normal-var-2' })
            )
          })

          // Test for custom attributes
          it('contains variants custom attributes', () => {
            expect(product[0]).toEqual(
              expect.objectContaining({ 'text-attribute': 'Master Var attr' })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ 'text-attribute': 'First Var attr' })
            )
            expect(product[2]).toEqual(
              expect.objectContaining({ 'text-attribute': 'Second Var attr' })
            )
          })
        })
      })

      describe('WITH HEADERS::should write products to `XLSX` file', () => {
        const templateFile = path.join(
          __dirname,
          '/helpers/product-headers.csv'
        )
        let xlsxFile
        let excel
        let products

        beforeAll(async () => {
          xlsxFile = tmp.fileSync({ postfix: '.xlsx' }).name
          ;[stdout, stderr] = await exec(
            `${binPath} -p ${projectKey} -i ${productsJsonFile} -t ${templateFile} --referenceCategoryBy name -o ${xlsxFile}`
          )

          excel = await analyzeExcelFile(xlsxFile)
          products = mapRowsToProducts(excel.rows)
          // Format the products array for easier testing because we
          // cannot guarantee the sort order from the API
          if (products[0].key === 'productKey-2') {
            products = products.concat(products.splice(0, 2))
          }
        }, 15000)

        it('should successfully map products', () => {
          expect(stdout).toBeTruthy()
          expect(stderr).toBeFalsy()
          expect(excel.rows).toHaveLength(6)
        })

        it('should contain a proper header', () => {
          expect(Object.keys(products[0])).toEqual([
            '_published',
            '_hasStagedChanges',
            'key',
            'productType',
            'variantId',
            'sku',
            'text-attribute',
            'another-text-attribute',
          ])
        })

        it('should contain five variants', () => {
          expect(products).toHaveLength(5)
        })

        it('should have two products', () => {
          // Check Master variants
          expect(products[0]).toEqual(
            expect.objectContaining({ key: 'productKey-1' })
          )
          expect(products[3]).toEqual(
            expect.objectContaining({ key: 'productKey-2' })
          )

          // Check other variants
          expect(products[1]).toEqual(
            expect.objectContaining({ key: undefined })
          )
          expect(products[2]).toEqual(
            expect.objectContaining({ key: undefined })
          )
          expect(products[4]).toEqual(
            expect.objectContaining({ key: undefined })
          )
        })

        it('should include only columns from template', () => {
          const columns = [
            '_published',
            '_hasStagedChanges',
            'key',
            'productType',
            'variantId',
            'sku',
            'text-attribute',
            'another-text-attribute',
          ]
          products.forEach(product => {
            const productColumns = Object.keys(product)
            expect(productColumns).toEqual(columns)
          })
        })

        it('should contain variants custom attributes', () => {
          // From first product
          expect(products[0]).toEqual(
            expect.objectContaining({ 'text-attribute': 'Master Var attr' })
          )
          expect(products[0]).toEqual(
            expect.objectContaining({ 'another-text-attribute': undefined })
          )
          expect(products[1]).toEqual(
            expect.objectContaining({ 'text-attribute': 'First Var attr' })
          )
          expect(products[1]).toEqual(
            expect.objectContaining({ 'another-text-attribute': undefined })
          )
          expect(products[2]).toEqual(
            expect.objectContaining({ 'text-attribute': 'Second Var attr' })
          )
          expect(products[2]).toEqual(
            expect.objectContaining({ 'another-text-attribute': undefined })
          )

          // From second product
          expect(products[3]).toEqual(
            expect.objectContaining({ 'text-attribute': undefined })
          )
          expect(products[3]).toEqual(
            expect.objectContaining({
              'another-text-attribute': 'Another Master Var attr',
            })
          )
          expect(products[4]).toEqual(
            expect.objectContaining({ 'text-attribute': undefined })
          )
          expect(products[4]).toEqual(
            expect.objectContaining({
              'another-text-attribute': 'Another First Var attr',
            })
          )
        })
      })
    })
  })
})
