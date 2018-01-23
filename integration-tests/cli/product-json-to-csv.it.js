import fs from 'fs'
import tmp from 'tmp'
import unzip from 'unzip'
import csvToJson from 'csvtojson'
import { exec } from 'child_process'
import { getCredentials } from '@commercetools/get-credentials'
import { version } from '@commercetools/product-json-to-csv/package.json'
import {
  sampleProductType,
  anotherSampleProductType,
  sampleState,
  sampleTaxCategory,
  sampleParentCategory,
  sampleCategory,
  createProducts,
} from './helpers/product-json2csv.data'
import { createData, clearData } from './helpers/utils'

let projectKey
if (process.env.CI === 'true') projectKey = 'product-export-integration-test'
else projectKey = process.env.npm_config_projectkey

describe('CSV and CLI Tests', () => {
  let apiConfig
  const binPath = './integration-tests/node_modules/.bin/product-json-to-csv'

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

    await createData(apiConfig, 'categories', [sampleParentCategory])
    await createData(apiConfig, 'categories', [sampleCategory])

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
    await createData(apiConfig, 'products', sampleProducts)
  }, 15000)

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

  describe('Parser', () => {
    describe('should parse product data from product exporter', () => {
      const exporter = './integration-tests/node_modules/.bin/product-exporter'
      describe('WITHOUT HEADERS::should write products to `zip` file', () => {
        let zipFile
        let csvContents1 = ''
        // TODO: let csvContents2 = ''
        const fileNames = []

        beforeAll(done => {
          zipFile = tmp.fileSync({ postfix: '.zip', keep: true }).name
          exec(
            `${exporter} -p ${projectKey} -e chunk -s | ${binPath} -p ${projectKey} --categoryBy namedPath --fillAllRows -o ${zipFile}`,
            (error, stdout, stderr) => {
              expect(error).toBeFalsy()
              expect(stderr).toBeFalsy()

              fs
                .createReadStream(zipFile)
                .pipe(unzip.Parse())
                .on('entry', entry => {
                  if (entry.path.includes('anotherProductType')) {
                    // TODO:
                    /* entry.on('data', data => {
                      fileNames.push(entry.path)
                      csvContents2 += data.toString()
                    }) */
                  } else {
                    entry.on('data', data => {
                      fileNames.push(entry.path)
                      csvContents1 += data.toString()
                    })
                  }
                })
                .on('close', () => {
                  done()
                })
            }
          )
        }, 15000)

        describe('File 1', () => {
          const product = []
          beforeAll(done => {
            csvToJson()
              .fromString(csvContents1)
              .on('json', jsonObj => {
                product.push(jsonObj)
              })
              .on('done', () => done())
          })

          test('zip folder contains file named `productType`', () => {
            const fileName = ['products/productTypeForProductParse.csv']
            expect(fileNames).toEqual(expect.arrayContaining(fileName))
          })

          test('product contains 3 variants', () => {
            expect(product.length).toBe(3)
          })

          test('contains `name`', () => {
            const name = { en: 'Sample Duck-jacket', de: 'Beispiel Entejacke' }
            expect(product[0]).toEqual(expect.objectContaining({ name }))
            expect(product[1]).toEqual(expect.objectContaining({ name }))
            expect(product[2]).toEqual(expect.objectContaining({ name }))
          })

          test('contains `description`', () => {
            const description = {
              en:
                'The light jackets of Save the Duck keep us cozy warm. The slight',
              de:
                'Die leichten Freizeitjacken von Save the Duck halten uns wohlig',
            }
            expect(product[0]).toEqual(expect.objectContaining({ description }))
            expect(product[1]).toEqual(expect.objectContaining({ description }))
            expect(product[2]).toEqual(expect.objectContaining({ description }))
          })

          test('contains `slug`', () => {
            const slug = {
              en: 'sample-sluggy-duck-jacke-123',
              de: 'beispiel-sluggy-ente-jacke-123',
            }
            expect(product[0]).toEqual(expect.objectContaining({ slug }))
            expect(product[1]).toEqual(expect.objectContaining({ slug }))
            expect(product[2]).toEqual(expect.objectContaining({ slug }))
          })

          test('contains `searchKeywords`', () => {
            const searchKeywords = {
              en: 'Standard Keyword;German | White | Space',
            }
            expect(product[0]).toEqual(
              expect.objectContaining({ searchKeywords })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ searchKeywords })
            )
            expect(product[2]).toEqual(
              expect.objectContaining({ searchKeywords })
            )
          })

          test('contains resolved namedPath of `categories`', () => {
            const categories = 'Parent Category>child Category'
            expect(product[0]).toEqual(expect.objectContaining({ categories }))
            expect(product[1]).toEqual(expect.objectContaining({ categories }))
            expect(product[2]).toEqual(expect.objectContaining({ categories }))
          })

          test('contains resolved `state`', () => {
            const state = 'stateKey'
            expect(product[0]).toEqual(expect.objectContaining({ state }))
            expect(product[1]).toEqual(expect.objectContaining({ state }))
            expect(product[2]).toEqual(expect.objectContaining({ state }))
          })

          test('contains resolved `taxCategory`', () => {
            const tax = 'new-tax-category'
            expect(product[0]).toEqual(expect.objectContaining({ tax }))
            expect(product[1]).toEqual(expect.objectContaining({ tax }))
            expect(product[2]).toEqual(expect.objectContaining({ tax }))
          })

          test('contains variants `SKUs`', () => {
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

          test('contains variants `keys`', () => {
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
        })
      })
      // describe('WITH HEADERS::should write products to `CSV` file', () => {})
    })

    // describe('should parse product data from JSON file', () => {
    //   describe('WITHOUT HEADERS::should write products to `zip` file', () => {})
    //   describe('WITH HEADERS::should write products to `CSV` file', () => {})
    // })
  })
})
