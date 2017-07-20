import fs from 'fs'
import path from 'path'
import Promise from 'bluebird'
import {
  createAuthMiddlewareForClientCredentialsFlow,
} from '@commercetools/sdk-middleware-auth'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { exec } from 'child_process'
import { getCredentials } from '@commercetools/get-credentials'
import { clearData } from './helpers/utils'
import DiscountCodeImport from '../../packages/discount-code-importer/src/main'

let projectKey
if (process.env.CI === 'true')
  projectKey = 'node-sdk-integration-tests'
else
  projectKey = process.env.npm_config_projectkey

describe('DiscountCode tests', () => {
  let apiConfig
  let service
  let client
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
      // Create client and service
      service = createRequestBuilder({ projectKey })
      client = createClient({
        middlewares: [
          createAuthMiddlewareForClientCredentialsFlow(apiConfig),
          createHttpMiddleware({ host: apiConfig.apiUrl }),
        ],
      })

      return clearData(apiConfig, 'discountCodes')
    })
    .then(() => {
      const cartDiscountDraft = fs.readFileSync(
        path.join(__dirname, './helpers/cartDiscountDraft.json'), 'utf8',
      )
      const req = {
        uri: service.cartDiscounts.build(),
        method: 'POST',
        body: cartDiscountDraft,
      }
      // Create cart-discount
      return client.execute(req)
    })
    .then((data) => {
      cartDiscount = data.body
    })
    .catch(process.stderr.write),
  )

  afterAll(() => {
    // Delete Discount codes
    const req = {
      uri: service.discountCodes.perPage(500).build(),
      method: 'GET',
    }
    return client.execute(req)
      .then((response) => {
        const codes = response.body.results
        return Promise.map(codes, (codeObj) => {
          const deleteCodeRequest = {
            uri: service
              .discountCodes
              .byId(codeObj.id)
              .withVersion(codeObj.version)
              .build(),
            method: 'DELETE',
          }
          return client.execute(deleteCodeRequest)
        })
      })
      .then(() => {
        // Delete cart discount
        const deleteCartRequest = {
          uri: service
            .cartDiscounts
            .byId(cartDiscount.id)
            .withVersion(1)
            .build(),
          method: 'DELETE',
        }
        return client.execute(deleteCartRequest)
      })
      .catch(process.stderr.write)
  })

  describe('Discount code generator', () => {
    const binPath = './integration-tests/node_modules/.bin/discount-code-gen'

    afterAll(() => {
    // Delete the generated log file
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
    test('should create discount codes on CTP', async () => {
      const expected = {
        // eslint-disable-next-line max-len
        reportMessage: 'Summary: there were 10 successfully imported discount codes (10 were newly created, 0 were updated and 0 were unchanged).',
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

      const expected = {
        // eslint-disable-next-line max-len
        reportMessage: 'Summary: there were 10 successfully imported discount codes (0 were newly created, 10 were updated and 0 were unchanged).',
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
      const expected = {
        // eslint-disable-next-line max-len
        reportMessage: 'Summary: there were 8 successfully imported discount codes (8 were newly created, 0 were updated and 0 were unchanged). 2 errors occured (2 create errors and 0 update errors.)',
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
})
