import fs from 'mz/fs'
import tmp from 'tmp'
import path from 'path'
import isuuid from 'isuuid'
import csv from 'csvtojson'
import { exec } from 'mz/child_process'
import fetch from 'node-fetch'
import DiscountCodeImport from '@commercetools/discount-code-importer'
import { getCredentials } from '@commercetools/get-credentials'
import { createData, clearData } from './helpers/utils'

let projectKey
if (process.env.CI === 'true') projectKey = 'discount-codes-integration-test'
else projectKey = process.env.npm_config_projectkey

describe('DiscountCode tests', () => {
  let apiConfig
  let cartDiscount

  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    verbose: () => {},
  }

  beforeAll(async () => {
    const credentials = await getCredentials(projectKey)
    // Get test credentials

    apiConfig = {
      host: 'https://auth.sphere.io',
      apiUrl: 'https://api.sphere.io',
      projectKey,
      credentials,
    }

    // Clear all discount codes
    await clearData(apiConfig, 'discountCodes')
    // Clear all cart discounts
    await clearData(apiConfig, 'cartDiscounts')

    // Create cart-discount
    const cartDiscountDraft = await fs.readFileSync(
      path.join(__dirname, './helpers/cartDiscountDraft.json'),
      'utf8'
    )
    // Wrap in an array because the util function expects an array
    const data = await createData(apiConfig, 'cartDiscounts', [
      cartDiscountDraft,
    ])

    cartDiscount = data[0].body
  }, 15000)

  afterAll(async () => {
    // Delete discount codes
    await clearData(apiConfig, 'discountCodes')
    // Delete cart discounts
    await clearData(apiConfig, 'cartDiscounts')
  })

  describe('Discount code generator', () => {
    const binPath = './integration-tests/node_modules/.bin/discount-code-gen'

    // Delete the generated log file
    afterAll(() => {
      fs.unlinkSync('discountCodeGenerator.log', 'utf8')
    })

    it(
      'should generate required codes according to template',
      async () => {
        const expected = {
          name: { en: 'Sammy', de: 'Valerian' },
          description: { en: 'greatest promo', de: 'super angebot' },
          cartPredicate: 'some cart predicate',
          isActive: true,
          maxApplications: 9,
          maxApplicationsPerCustomer: 4,
        }
        const filePath = path.join(__dirname, './helpers/generatorTemplate.csv')

        const [stdout, stderr] = await exec(
          `${binPath} -q 10 -p IT -l 8 -i ${filePath}`
        )
        expect(stderr).toBeFalsy()
        const generatedCodes = JSON.parse(stdout)
        expect(generatedCodes).toHaveLength(10)
        generatedCodes.forEach(codeObj => {
          expect(codeObj).toMatchObject(expected)
          expect(codeObj.code).toMatch(/^IT/)
          expect(codeObj.code).toHaveLength(8)
        })
      },
      15000
    )
  })

  describe('Discount code Importer', () => {
    let codeImport
    let preparedDiscountCodes
    beforeEach(() => {
      codeImport = new DiscountCodeImport({ apiConfig }, logger)

      // Get the sample discount codes and add cartDiscounts
      preparedDiscountCodes = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, './helpers/discountCodes.json'),
          'utf8'
        )
      ).map(codeObj =>
        Object.assign({}, codeObj, {
          cartDiscounts: [
            {
              typeId: 'cart-discount',
              id: cartDiscount.id,
            },
          ],
        })
      )
    }, 20000)

    // Delete Discount codes
    afterAll(() => clearData(apiConfig, 'discountCodes', fetch))

    it(
      'should create discount codes on CTP',
      async () => {
        await codeImport.run(preparedDiscountCodes)
        const summary = codeImport.summaryReport()
        expect(summary).toMatchSnapshot()
      },
      15000
    )

    it('should update discount codes on the CTP', async () => {
      // First, import the codes that need to be updated
      const oldCodesToUpdate = preparedDiscountCodes.map(codeObj => {
        const uniqueCode = codeObj.code
        return Object.assign({}, codeObj, { code: `${uniqueCode}foo` })
      })
      await codeImport.run(oldCodesToUpdate)

      // Call a new `codeImport` instance so we reset the summary
      codeImport = new DiscountCodeImport({ apiConfig }, logger)

      const newCodesToUpdate = oldCodesToUpdate.map(codeObj =>
        Object.assign({}, codeObj, { maxApplications: 20 })
      )

      await codeImport.run(newCodesToUpdate)
      const summary = codeImport.summaryReport()
      expect(summary).toMatchSnapshot()
    })

    it('should stop import on first errors by default', async () => {
      // Set batchSize to 1 so it executes serially
      codeImport = new DiscountCodeImport({ apiConfig, batchSize: 1 }, logger)
      // Make codes unique
      const discountCodesSample = preparedDiscountCodes.map(codeObj => {
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
        expect(e.summary.errors).toHaveLength(1)
        expect(e.summary.errors[0]).toMatch(/'code' should not be empty/)
      }
    })

    it('should continueOnProblems if `continueOnProblems`', async () => {
      codeImport = new DiscountCodeImport(
        {
          apiConfig,
          batchSize: 5,
          continueOnProblems: true,
        },
        logger
      )
      // Make codes unique
      const discountCodesSample = preparedDiscountCodes.map(codeObj => {
        const uniqueCode = codeObj.code
        return Object.assign({}, codeObj, { code: `${uniqueCode}foobar` })
      })
      // Make code invalid
      discountCodesSample[1].code = ''
      discountCodesSample[7].cartDiscounts = 'INVALID-CART-DISCOUNT'

      await codeImport.run(discountCodesSample)
      const summary = codeImport.summaryReport()
      expect(summary).toMatchSnapshot()
      const errors = summary.detailedSummary.errors
      expect(errors).toMatchSnapshot()
    })
  })

  describe('Discount Code Exporter', () => {
    const UTCDateTimeRegex = new RegExp(
      /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/g
    )
    let preparedDiscountCodes
    const bin = './integration-tests/node_modules/.bin/discount-code-exporter'

    beforeAll(() => {
      // Get the sample discount codes and add cartDiscounts
      preparedDiscountCodes = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, './helpers/discountCodes.json'),
          'utf8'
        )
      ).map(codeObj =>
        Object.assign({}, codeObj, {
          cartDiscounts: [
            {
              typeId: 'cart-discount',
              id: cartDiscount.id,
            },
          ],
        })
      )
      return createData(
        apiConfig,
        'discountCodes',
        preparedDiscountCodes
      ).catch(process.stderr.write)
    }, 15000)

    it('should write json output to file by default', async () => {
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
        cartDiscounts: [
          {
            typeId: 'cart-discount',
            id: cartDiscount.id,
          },
        ],
        cartPredicate: 'lineItemTotal(1 = 1) >  "10.00 USD"',
        isActive: true,
        maxApplications: 10,
        maxApplicationsPerCustomer: 2,
      }

      const [stdout, stderr] = await exec(
        `${bin} -o ${jsonFilePath} -p ${projectKey}`
      )
      expect(stderr).toBeFalsy()
      expect(stdout).toMatchSnapshot()

      const data = await fs.readFile(jsonFilePath, { encoding: 'utf8' })

      const actual = JSON.parse(data)
      actual.forEach(codeObj => {
        expect(codeObj).toMatchObject(expected)
        expect(isuuid(codeObj.id)).toBe(true)
        expect(codeObj.createdAt).toMatch(UTCDateTimeRegex)
        expect(codeObj.lastModifiedAt).toMatch(UTCDateTimeRegex)
      })
    })

    it('should write csv output to file when passed the option', async () => {
      const csvFilePath = tmp.fileSync().name
      const expected = {
        name: {
          en: 'Sammy',
        },
        description: {
          en: 'greatest promo',
        },
        cartDiscounts: cartDiscount.id,
        cartPredicate: 'lineItemTotal(1 = 1) >  "10.00 USD"',
        isActive: 'true',
        maxApplications: '10',
        maxApplicationsPerCustomer: '2',
      }
      const [stdout, stderr] = await exec(
        `${bin} -o ${csvFilePath} -p ${projectKey} -f csv`
      )
      expect(stderr).toBeFalsy()
      expect(stdout).toMatch(/Export operation completed successfully/)

      const data = await fs.readFile(csvFilePath, { encoding: 'utf8' })

      await new Promise(resolve => {
        csv()
          .fromString(data)
          .subscribe(jsonObj => {
            expect(jsonObj).toMatchObject(expected)
            resolve()
          })
      })
    })
  })
})
