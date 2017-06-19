import fs from 'fs'
import tmp from 'tmp'
import path from 'path'
import Promise from 'bluebird'
import { createAuthMiddlewareForClientCredentialsFlow }
from '@commercetools/sdk-middleware-auth'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { exec } from 'child_process'
import { getCredentials } from '@commercetools/get-credentials'
import DiscountCodeImport from '../../packages/discount-code-importer/src/main'

let projectKey
if (process.env.CI === 'true')
  projectKey = 'node-sdk-integration-tests'
else
  projectKey = process.env.npm_config_projectkey

const templateFile = tmp.fileSync({ postfix: '.csv' })

describe('DiscountCode tests', () => {
  let apiConfig
  let service
  let client
  let cartDiscount
  let generatedCodes

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
      // Create csv templateFile from which to generate discount codes
      const sampleGenCsv =
      /* eslint-disable max-len */
`name.en,name.de,description.en,description.de,cartDiscounts,cartPredicate,isActive,maxApplications,maxApplicationsPerCustomer
Sammy,Valerian,greatest promo,super angebot,${cartDiscount.id},lineItemTotal(1 = 1) >  "10.00 USD",true,10,2`
      /* eslint-enable max-len */

      fs.writeFileSync(templateFile.name, sampleGenCsv, 'utf8')
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

    test('should generate required codes by specs', (done) => {
      exec(`${binPath} -q 10 -p IT -l 8 -i ${templateFile.name}`,
        (error, stdout, stderr) => {
          expect(error).toBeFalsy()
          expect(stderr).toBeFalsy()
          generatedCodes = JSON.parse(stdout)
          expect(generatedCodes.length).toBe(10)
          generatedCodes.forEach((codeObj) => {
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
    beforeEach(() => {
      codeImport = new DiscountCodeImport({ apiConfig }, logger)
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
      const summary = await codeImport.run(generatedCodes)
      expect(summary).toEqual(expected)
    })

    test('should update discount codes on the CTP', async () => {
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
      const codesToUpdate = generatedCodes.map(codeObj => (
        Object.assign({}, codeObj, { maxApplications: 20 })
      ))

      const summary = await codeImport.run(codesToUpdate)
      expect(summary).toEqual(expected)
    })

    test('should stop import on first errors by default', async () => {
      // Set batchSize to 1 so it executes serially
      codeImport = new DiscountCodeImport({ apiConfig, batchSize: 1 }, logger)
      const codesToUpdate = generatedCodes.map(codeObj => (
        Object.assign({}, codeObj, { maxApplications: 30 })
      ))

      // Make code invalid
      codesToUpdate[1].code = ''
      codesToUpdate[2].code = ''

      try {
        await codeImport.run(codesToUpdate)
      } catch (e) {
        expect(e.summary.updated).toBe(1)
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
      const codesToUpdate = generatedCodes.map(codeObj => (
        Object.assign({}, codeObj, { maxApplications: 40 })
      ))
      const expected = {
        // eslint-disable-next-line max-len
        reportMessage: 'Summary: there were 8 successfully imported discount codes (0 were newly created, 8 were updated and 0 were unchanged). 2 errors occured (1 create errors and 1 update errors.)',
        detailedSummary: {
          created: 0,
          updated: 8,
          unchanged: 0,
          createErrorCount: 1,
          updateErrorCount: 1,
          // errors: [],
        },
      }

      // Make code invalid
      codesToUpdate[1].code = ''
      codesToUpdate[7].cartDiscounts = 'INVALID-CART-DISCOUNT'

      const summary = await codeImport.run(codesToUpdate)
      expect(summary).toMatchObject(expected)
      const errors = summary.detailedSummary.errors
      expect(errors[0]).toMatch(/'code' should not be empty/)
      expect(errors[1]).toMatch(/Request body does not contain valid JSON/)
    })
  })
})
