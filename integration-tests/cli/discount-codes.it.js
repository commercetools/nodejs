import fs from 'fs'
import tmp from 'tmp'
import path from 'path'
import isuuid from 'isuuid'
import csv from 'csvtojson'
import { oneLine } from 'common-tags'
import { exec } from 'child_process'
import { getCredentials } from '@commercetools/get-credentials'
import { createData, clearData } from './helpers/utils'
import DiscountCodeImport from '../../packages/discount-code-importer/src/main'

let projectKey
if (process.env.CI === 'true')
  projectKey = 'node-sdk-integration-tests'
else
  projectKey = process.env.npm_config_projectkey

describe('DiscountCode tests', () => {
  let apiConfig
  let cartDiscount

  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    verbose: () => {},
  }

  beforeAll(() => getCredentials(projectKey)
    // Get test credentials
    .then((credentials) => {
      apiConfig = {
        host: 'https://auth.sphere.io',
        apiUrl: 'https://api.sphere.io',
        projectKey,
        credentials,
      }
      // Clear all discount codes
      return clearData(apiConfig, 'discountCodes')
    })
    // Clear all cart discounts
    .then(() => clearData(apiConfig, 'cartDiscounts'))
    .then(() => {
      // Create cart-discount
      const cartDiscountDraft = fs.readFileSync(
        path.join(__dirname, './helpers/cartDiscountDraft.json'), 'utf8',
      )
      // Wrap in an array because the util function expects an array
      return createData(apiConfig, 'cartDiscounts', [cartDiscountDraft])
    })
    .then((data) => {
      cartDiscount = data[0].body
    })
    .catch(process.stderr.write),
  )

  // Delete Discount codes
  afterAll(() => clearData(apiConfig, 'discountCodes')
    // Delete cart discounts
    .then(() => clearData(apiConfig, 'cartDiscounts'))
    .catch(process.stderr.write),
  )

  describe('Discount code generator', () => {
    const binPath = './integration-tests/node_modules/.bin/discount-code-gen'

    // Delete the generated log file
    afterAll(() => {
      fs.unlinkSync('discountCodeGenerator.log', 'utf8')
    })

    test('should generate required codes according to template', (done) => {
      const expected = {
        name: {
          en: 'Sammy',
          de: 'Valerian',
        },
        description: {
          en: 'greatest promo',
          de: 'super angebot',
        },
        cartPredicate: 'some cart predicate',
        isActive: true,
        maxApplications: 9,
        maxApplicationsPerCustomer: 4,
      }
      const filePath = path.join(__dirname, './helpers/generatorTemplate.csv')

      exec(`${binPath} -q 10 -p IT -l 8 -i ${filePath}`,
        (error, stdout, stderr) => {
          expect(error).toBeFalsy()
          expect(stderr).toBeFalsy()
          const generatedCodes = JSON.parse(stdout)
          expect(generatedCodes.length).toBe(10)
          generatedCodes.forEach((codeObj) => {
            expect(codeObj).toMatchObject(expected)
            expect(codeObj.code).toMatch(/^IT/)
            expect(codeObj.code.length).toBe(8)
          })
          done()
        },
      )
    })
  })

  describe('Discount code Importer', () => {
    let codeImport
    let preparedDiscountCodes
    beforeEach(() => {
      codeImport = new DiscountCodeImport({ apiConfig }, logger)

      // Get the sample discount codes and add cartDiscounts
      preparedDiscountCodes = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, './helpers/discountCodes.json'), 'utf8',
        ),
      ).map(codeObj => (
        Object.assign({}, codeObj, {
          cartDiscounts: [
            {
              typeId: 'cart-discount',
              id: cartDiscount.id,
            },
          ],
        })
      ))
    })

    // Delete Discount codes
    afterAll(() => clearData(apiConfig, 'discountCodes')
      .catch(process.stderr.write),
    )

    test('should create discount codes on CTP', async () => {
      const reportMessage = oneLine`
        Summary: there were 10 successfully imported discount codes
        (10 were newly created, 0 were updated and 0 were unchanged).
      `
      const expected = {
        reportMessage,
        detailedSummary: {
          created: 10,
          updated: 0,
          unchanged: 0,
          createErrorCount: 0,
          updateErrorCount: 0,
          errors: [],
        },
      }
      await codeImport.run(preparedDiscountCodes)
      const summary = codeImport.summaryReport()
      expect(summary).toEqual(expected)
    })

    test('should update discount codes on the CTP', async () => {
      // First, import the codes that need to be updated
      const oldCodesToUpdate = preparedDiscountCodes.map((codeObj) => {
        const uniqueCode = codeObj.code
        return Object.assign({}, codeObj, { code: `${uniqueCode}foo` })
      })
      await codeImport.run(oldCodesToUpdate)

      // Call a new `codeImport` instance so we reset the summary
      codeImport = new DiscountCodeImport({ apiConfig }, logger)
      const reportMessage = oneLine`
        Summary: there were 10 successfully imported discount codes
        (0 were newly created, 10 were updated and 0 were unchanged).
      `
      const expected = {
        reportMessage,
        detailedSummary: {
          created: 0,
          updated: 10,
          unchanged: 0,
          createErrorCount: 0,
          updateErrorCount: 0,
          errors: [],
        },
      }
      const newCodesToUpdate = oldCodesToUpdate.map(codeObj => (
        Object.assign({}, codeObj, { maxApplications: 20 })
      ))

      await codeImport.run(newCodesToUpdate)
      const summary = codeImport.summaryReport()
      expect(summary).toEqual(expected)
    })

    test('should stop import on first errors by default', async () => {
      // Set batchSize to 1 so it executes serially
      codeImport = new DiscountCodeImport({ apiConfig, batchSize: 1 }, logger)
      // Make codes unique
      const discountCodesSample = preparedDiscountCodes.map((codeObj) => {
        const uniqueCode = codeObj.code
        return Object.assign({}, codeObj, { code: `${uniqueCode}bar` })
      })

      // Make code invalid
      discountCodesSample[1].code = ''
      discountCodesSample[2].code = ''

      try {
        await codeImport.run(discountCodesSample)
      } catch (e) {
        expect(e.summary.created).toBe(1)
        expect(e.summary.errors.length).toBe(1)
        expect(e.summary.errors[0]).toMatch(/'code' should not be empty/)
      }
    })

    test('should continueOnProblems if `continueOnProblems`', async () => {
      codeImport = new DiscountCodeImport({
        apiConfig,
        batchSize: 5,
        continueOnProblems: true,
      }, logger)
      // Make codes unique
      const discountCodesSample = preparedDiscountCodes.map((codeObj) => {
        const uniqueCode = codeObj.code
        return Object.assign({}, codeObj, { code: `${uniqueCode}foobar` })
      })
      const reportMessage = oneLine`
        Summary: there were 8 successfully imported discount codes
        (8 were newly created, 0 were updated and 0 were unchanged).
        2 errors occured (2 create errors and 0 update errors.)
      `
      const expected = {
        reportMessage,
        detailedSummary: {
          created: 8,
          updated: 0,
          unchanged: 0,
          createErrorCount: 2,
          updateErrorCount: 0,
        },
      }

      // Make code invalid
      discountCodesSample[1].code = ''
      discountCodesSample[7].cartDiscounts = 'INVALID-CART-DISCOUNT'

      await codeImport.run(discountCodesSample)
      const summary = codeImport.summaryReport()
      expect(summary).toMatchObject(expected)
      const errors = summary.detailedSummary.errors
      expect(errors[0]).toMatch(/'code' should not be empty/)
      expect(errors[1]).toMatch(/Request body does not contain valid JSON/)
    })
  })

  describe('Discount Code Exporter', () => {
    const UTCDateTimeRegex = new RegExp(
      /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/g,
    )
    let preparedDiscountCodes
    const bin = './integration-tests/node_modules/.bin/discount-code-exporter'

    beforeAll(() => {
      // Get the sample discount codes and add cartDiscounts
      preparedDiscountCodes = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, './helpers/discountCodes.json'), 'utf8',
        ),
      ).map(codeObj => (
        Object.assign({}, codeObj, {
          cartDiscounts: [
            {
              typeId: 'cart-discount',
              id: cartDiscount.id,
            },
          ],
        })
      ))
      return createData(apiConfig, 'discountCodes', preparedDiscountCodes)
      .catch(process.stderr.write)
    })

    test('should write json output to file by default', (done) => {
      const jsonFilePath = tmp.fileSync().name
      const expected = {
        version: 1,
        name: {
          en: 'Sammy',
          de: 'Valerian',
        },
        description: {
          en: 'greatest promo',
          de: 'super angebot',
        },
        cartDiscounts: [{
          typeId: 'cart-discount',
          id: cartDiscount.id,
        }],
        cartPredicate: 'lineItemTotal(1 = 1) >  "10.00 USD"',
        isActive: true,
        maxApplications: 10,
        maxApplicationsPerCustomer: 2,
      }

      exec(`${bin} -o ${jsonFilePath} -p ${projectKey}`,
        (cliError, stdout, stderr) => {
          expect(cliError).toBeFalsy()
          expect(stderr).toBeFalsy()
          expect(stdout).toMatch(/Export operation completed successfully/)

          fs.readFile(jsonFilePath, { encoding: 'utf8' }, (error, data) => {
            expect(error).toBeFalsy()
            const actual = JSON.parse(data)
            actual.forEach((codeObj) => {
              expect(codeObj).toMatchObject(expected)
              expect(isuuid(codeObj.id)).toBe(true)
              expect(codeObj.createdAt).toMatch(UTCDateTimeRegex)
              expect(codeObj.lastModifiedAt).toMatch(UTCDateTimeRegex)
            })

            done()
          })
        },
      )
    })

    test('should write csv output to file when passed the option', (done) => {
      const csvFilePath = tmp.fileSync().name
      const expected = {
        version: '1',
        name: {
          en: 'Sammy',
          de: 'Valerian',
        },
        description: {
          en: 'greatest promo',
          de: 'super angebot',
        },
        cartDiscounts: cartDiscount.id,
        cartPredicate: 'lineItemTotal(1 = 1) >  "10.00 USD"',
        isActive: 'true',
        maxApplications: '10',
        maxApplicationsPerCustomer: '2',
      }

      exec(`${bin} -o ${csvFilePath} -p ${projectKey} -f csv`,
        (cliError, stdout, stderr) => {
          expect(cliError).toBeFalsy()
          expect(stderr).toBeFalsy()
          expect(stdout).toMatch(/Export operation completed successfully/)

          fs.readFile(csvFilePath, { encoding: 'utf8' }, (error, data) => {
            expect(error).toBeFalsy()
            csv().fromString(data)
              .on('json', (jsonObj) => {
                expect(jsonObj).toMatchObject(expected)
                expect(isuuid(jsonObj.id)).toBe(true)
                expect(jsonObj.createdAt).toMatch(UTCDateTimeRegex)
                expect(jsonObj.lastModifiedAt).toMatch(UTCDateTimeRegex)
              })
              .on('done', () => done())
          })
        },
      )
    })
  })
})
