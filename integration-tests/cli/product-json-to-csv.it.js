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

  describe('Parser', () => {
    const exporter = './integration-tests/node_modules/.bin/product-exporter'
    describe('From product exporter', () => {
      describe('WITHOUT HEADERS:: write products to `zip` file', () => {
        let csvContents1 = ''
        let csvContents2 = ''
        const fileNames = []

        beforeAll(done => {
          const zipFile = tmp.fileSync({ postfix: '.zip', keep: true }).name
          exec(
            `${exporter} -p ${projectKey} -s | ${binPath} -p ${projectKey} --categoryBy namedPath --fillAllRows -o ${zipFile}`,
            (error, stdout, stderr) => {
              expect(error).toBeFalsy()
              expect(stderr).toBeFalsy()

              fs
                .createReadStream(zipFile)
                .pipe(unzip.Parse())
                .on('entry', entry => {
                  if (entry.path.includes('anotherProductType')) {
                    entry.on('data', data => {
                      fileNames.push(entry.path)
                      csvContents2 += data.toString()
                    })
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
            expect(product).toHaveLength(3)
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

          // Test for custom attributes
          test('contains variants custom attributes', () => {
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
          const product = []
          beforeAll(done => {
            csvToJson()
              .fromString(csvContents2)
              .on('json', jsonObj => {
                product.push(jsonObj)
              })
              .on('done', () => done())
          })

          test('zip folder contains file named `anotherProductType`', () => {
            const fileName = ['products/anotherProductTypeForProductParse.csv']
            expect(fileNames).toEqual(expect.arrayContaining(fileName))
          })

          test('product contains 2 variants', () => {
            expect(product).toHaveLength(2)
          })

          test('contains `name`', () => {
            const name = {
              en: 'Second Sample Duck-jacket',
              de: 'Zwite Beispiel Entejacke',
            }
            expect(product[0]).toEqual(expect.objectContaining({ name }))
            expect(product[1]).toEqual(expect.objectContaining({ name }))
          })

          test('contains `description`', () => {
            const description = {
              en:
                'Golom Jacop Caesar Icarve the Duck keep us cozy warm. The slight',
              de: 'Lorem Ipsum Text von Save the Duck halten uns wohlig',
            }
            expect(product[0]).toEqual(expect.objectContaining({ description }))
            expect(product[1]).toEqual(expect.objectContaining({ description }))
          })

          test('contains `slug`', () => {
            const slug = {
              en: 'sample-sluggy-duck-jacke-456789',
              de: 'beispiel-sluggy-ente-jacke-456789',
            }
            expect(product[0]).toEqual(expect.objectContaining({ slug }))
            expect(product[1]).toEqual(expect.objectContaining({ slug }))
          })

          test('contains `searchKeywords`', () => {
            const searchKeywords = { en: 'Multi Tool;Swiss | Army | Knife' }
            expect(product[0]).toEqual(
              expect.objectContaining({ searchKeywords })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ searchKeywords })
            )
          })

          test('contains resolved namedPath of `categories`', () => {
            const categories = 'Parent Category>child Category'
            expect(product[0]).toEqual(expect.objectContaining({ categories }))
            expect(product[1]).toEqual(expect.objectContaining({ categories }))
          })

          test('contains resolved `state`', () => {
            const state = 'stateKey'
            expect(product[0]).toEqual(expect.objectContaining({ state }))
            expect(product[1]).toEqual(expect.objectContaining({ state }))
          })

          test('contains resolved `taxCategory`', () => {
            const tax = 'new-tax-category'
            expect(product[0]).toEqual(expect.objectContaining({ tax }))
            expect(product[1]).toEqual(expect.objectContaining({ tax }))
          })

          test('contains variants `SKUs`', () => {
            expect(product[0]).toEqual(
              expect.objectContaining({ sku: 'M00F56YSS' })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ sku: 'M00F56YSS-11' })
            )
          })

          test('contains variants `keys`', () => {
            expect(product[0]).toEqual(
              expect.objectContaining({ variantKey: 'master-var-111' })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ variantKey: 'normal-var-222' })
            )
          })

          // Test for custom attributes
          test('contains variants custom attributes', () => {
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

      describe('WITH HEADERS:: write products to `CSV` file', () => {
        let csvFile
        let products = []
        const templateFile = `${__dirname}/helpers/product-headers.csv`

        beforeAll(done => {
          csvFile = tmp.fileSync({ postfix: '.csv', keep: true }).name
          exec(
            `${exporter} -p ${projectKey} -s | ${binPath} -p ${projectKey} -t ${templateFile} --categoryBy name -o ${csvFile}`,
            (error, stdout, stderr) => {
              expect(error).toBeFalsy()
              expect(stderr).toBeFalsy()

              csvToJson()
                .fromFile(csvFile)
                .on('json', jsonObj => {
                  products.push(jsonObj)
                })
                .on('done', () => {
                  // Format the products array for easier testing because we
                  // cannot guarantee the sort order from the API
                  if (products[0].key === 'productKey-2') {
                    products = products.concat(products.splice(0, 2))
                  }
                  done()
                })
            }
          )
        }, 10000)

        test('should contain five variants', () => {
          expect(products).toHaveLength(5)
        })

        test('should have two products', () => {
          // Check Master variants
          expect(products[0]).toEqual(
            expect.objectContaining({ key: 'productKey-1' })
          )
          expect(products[3]).toEqual(
            expect.objectContaining({ key: 'productKey-2' })
          )

          // Check other variants
          expect(products[1]).toEqual(expect.objectContaining({ key: '' }))
          expect(products[2]).toEqual(expect.objectContaining({ key: '' }))
          expect(products[4]).toEqual(expect.objectContaining({ key: '' }))
        })

        test('should include only columns from template', () => {
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

        test('should contain variants custom attributes', () => {
          // From first product
          expect(products[0]).toEqual(
            expect.objectContaining({ 'text-attribute': 'Master Var attr' })
          )
          expect(products[0]).toEqual(
            expect.objectContaining({ 'another-text-attribute': '' })
          )
          expect(products[1]).toEqual(
            expect.objectContaining({ 'text-attribute': 'First Var attr' })
          )
          expect(products[1]).toEqual(
            expect.objectContaining({ 'another-text-attribute': '' })
          )
          expect(products[2]).toEqual(
            expect.objectContaining({ 'text-attribute': 'Second Var attr' })
          )
          expect(products[2]).toEqual(
            expect.objectContaining({ 'another-text-attribute': '' })
          )

          // From second product
          expect(products[3]).toEqual(
            expect.objectContaining({ 'text-attribute': '' })
          )
          expect(products[3]).toEqual(
            expect.objectContaining({
              'another-text-attribute': 'Another Master Var attr',
            })
          )
          expect(products[4]).toEqual(
            expect.objectContaining({ 'text-attribute': '' })
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
      beforeAll(done => {
        productsJsonFile = tmp.fileSync({ postfix: '.json', keep: true }).name
        exec(
          `${exporter} -p ${projectKey} -s -o ${productsJsonFile}`,
          (error, stdout, stderr) => {
            expect(error).toBeFalsy()
            expect(stderr).toBeFalsy()
            done()
          }
        )
      }, 15000)

      describe('WITHOUT HEADERS::should write products to `zip` file', () => {
        let csvContents1 = ''
        let csvContents2 = ''
        const fileNames = []

        beforeAll(done => {
          const zipFile = tmp.fileSync({ postfix: '.zip', keep: true }).name

          // Send request from with JSON file to parser
          exec(
            `${binPath} -p ${projectKey} -i ${productsJsonFile} --categoryBy namedPath --fillAllRows -o ${zipFile}`,
            (parseError, parseStdout, parseStderr) => {
              expect(parseError).toBeFalsy()
              expect(parseStderr).toBeFalsy()

              fs
                .createReadStream(zipFile)
                .pipe(unzip.Parse())
                .on('entry', entry => {
                  if (entry.path.includes('anotherProductType')) {
                    entry.on('data', data => {
                      fileNames.push(entry.path)
                      csvContents2 += data.toString()
                    })
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
        }, 30000)

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
            expect(product).toHaveLength(3)
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

          // Test for custom attributes
          test('contains variants custom attributes', () => {
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
          const product = []
          beforeAll(done => {
            csvToJson()
              .fromString(csvContents2)
              .on('json', jsonObj => {
                product.push(jsonObj)
              })
              .on('done', () => done())
          })

          test('zip folder contains file named `anotherProductType`', () => {
            const fileName = ['products/anotherProductTypeForProductParse.csv']
            expect(fileNames).toEqual(expect.arrayContaining(fileName))
          })

          test('product contains 2 variants', () => {
            expect(product).toHaveLength(2)
          })

          test('contains `name`', () => {
            const name = {
              en: 'Second Sample Duck-jacket',
              de: 'Zwite Beispiel Entejacke',
            }
            expect(product[0]).toEqual(expect.objectContaining({ name }))
            expect(product[1]).toEqual(expect.objectContaining({ name }))
          })

          test('contains `description`', () => {
            const description = {
              en:
                'Golom Jacop Caesar Icarve the Duck keep us cozy warm. The slight',
              de: 'Lorem Ipsum Text von Save the Duck halten uns wohlig',
            }
            expect(product[0]).toEqual(expect.objectContaining({ description }))
            expect(product[1]).toEqual(expect.objectContaining({ description }))
          })

          test('contains `slug`', () => {
            const slug = {
              en: 'sample-sluggy-duck-jacke-456789',
              de: 'beispiel-sluggy-ente-jacke-456789',
            }
            expect(product[0]).toEqual(expect.objectContaining({ slug }))
            expect(product[1]).toEqual(expect.objectContaining({ slug }))
          })

          test('contains `searchKeywords`', () => {
            const searchKeywords = { en: 'Multi Tool;Swiss | Army | Knife' }
            expect(product[0]).toEqual(
              expect.objectContaining({ searchKeywords })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ searchKeywords })
            )
          })

          test('contains resolved namedPath of `categories`', () => {
            const categories = 'Parent Category>child Category'
            expect(product[0]).toEqual(expect.objectContaining({ categories }))
            expect(product[1]).toEqual(expect.objectContaining({ categories }))
          })

          test('contains resolved `state`', () => {
            const state = 'stateKey'
            expect(product[0]).toEqual(expect.objectContaining({ state }))
            expect(product[1]).toEqual(expect.objectContaining({ state }))
          })

          test('contains resolved `taxCategory`', () => {
            const tax = 'new-tax-category'
            expect(product[0]).toEqual(expect.objectContaining({ tax }))
            expect(product[1]).toEqual(expect.objectContaining({ tax }))
          })

          test('contains variants `SKUs`', () => {
            expect(product[0]).toEqual(
              expect.objectContaining({ sku: 'M00F56YSS' })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ sku: 'M00F56YSS-11' })
            )
          })

          test('contains variants `keys`', () => {
            expect(product[0]).toEqual(
              expect.objectContaining({ variantKey: 'master-var-111' })
            )
            expect(product[1]).toEqual(
              expect.objectContaining({ variantKey: 'normal-var-222' })
            )
          })

          // Test for custom attributes
          test('contains variants custom attributes', () => {
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

      describe('WITH HEADERS::should write products to `CSV` file', () => {
        let csvFile
        let products = []
        const templateFile = `${__dirname}/helpers/product-headers.csv`

        beforeAll(done => {
          csvFile = tmp.fileSync({ postfix: '.csv', keep: true }).name
          exec(
            `${binPath} -p ${projectKey} -i ${productsJsonFile} -t ${templateFile} --categoryBy name -o ${csvFile}`,
            (error, stdout, stderr) => {
              expect(error).toBeFalsy()
              expect(stderr).toBeFalsy()

              csvToJson()
                .fromFile(csvFile)
                .on('json', jsonObj => {
                  products.push(jsonObj)
                })
                .on('done', () => {
                  // Format the products array for easier testing because we
                  // cannot guarantee the sort order from the API
                  if (products[0].key === 'productKey-2') {
                    products = products.concat(products.splice(0, 2))
                  }
                  done()
                })
            }
          )
        }, 15000)

        test('should contain five variants', () => {
          expect(products).toHaveLength(5)
        })

        test('should have two products', () => {
          // Check Master variants
          expect(products[0]).toEqual(
            expect.objectContaining({ key: 'productKey-1' })
          )
          expect(products[3]).toEqual(
            expect.objectContaining({ key: 'productKey-2' })
          )

          // Check other variants
          expect(products[1]).toEqual(expect.objectContaining({ key: '' }))
          expect(products[2]).toEqual(expect.objectContaining({ key: '' }))
          expect(products[4]).toEqual(expect.objectContaining({ key: '' }))
        })

        test('should include only columns from template', () => {
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

        test('should contain variants custom attributes', () => {
          // From first product
          expect(products[0]).toEqual(
            expect.objectContaining({ 'text-attribute': 'Master Var attr' })
          )
          expect(products[0]).toEqual(
            expect.objectContaining({ 'another-text-attribute': '' })
          )
          expect(products[1]).toEqual(
            expect.objectContaining({ 'text-attribute': 'First Var attr' })
          )
          expect(products[1]).toEqual(
            expect.objectContaining({ 'another-text-attribute': '' })
          )
          expect(products[2]).toEqual(
            expect.objectContaining({ 'text-attribute': 'Second Var attr' })
          )
          expect(products[2]).toEqual(
            expect.objectContaining({ 'another-text-attribute': '' })
          )

          // From second product
          expect(products[3]).toEqual(
            expect.objectContaining({ 'text-attribute': '' })
          )
          expect(products[3]).toEqual(
            expect.objectContaining({
              'another-text-attribute': 'Another Master Var attr',
            })
          )
          expect(products[4]).toEqual(
            expect.objectContaining({ 'text-attribute': '' })
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
