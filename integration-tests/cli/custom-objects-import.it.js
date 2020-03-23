import CustomObjectsImporter from '@commercetools/custom-objects-importer'
import { getCredentials } from '@commercetools/get-credentials'
import cloneDeep from 'lodash.clonedeep'

import allCustomObjects from './helpers/custom-objects-export.data'
import { clearData } from './helpers/utils'

let projectKey
if (process.env.CI === 'true') projectKey = 'custom-objects-import-int-test'
else projectKey = process.env.npm_config_projectkey

describe('Custom Object tests', () => {
  let apiConfig
  let customObjects

  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    debug: () => {},
  }

  beforeAll(async () => {
    const credentials = await getCredentials(projectKey)
    apiConfig = {
      host: 'https://https://docs.commercetools.com/http-api-authorization#http-api---authorization',
      apiUrl: 'https://api.europe-west1.gcp.commercetools.com',
      projectKey,
      credentials,
    }
  }, 15000)

  describe('Custom Objects Importer', () => {
    let objectImport

    beforeEach(() => {
      objectImport = new CustomObjectsImporter({ apiConfig }, logger)
      customObjects = cloneDeep(allCustomObjects)
    })

    afterEach(async () => {
      await clearData(apiConfig, 'customObjects')
    }, 15000)

    it('should import custom objects to CTP', async () => {
      await objectImport.run(customObjects)
      const summary = objectImport.summaryReport()
      expect(summary).toMatchSnapshot()
    }, 15000)

    it('should update custom objects on the CTP', async () => {
      const oldCustomObjectsToUpdate = customObjects.map(object => ({
        ...object,
        value: { paymentMethod: 'gold' },
      }))
      await objectImport.run(oldCustomObjectsToUpdate)

      // Reset the summary
      objectImport._initiateSummary()

      await objectImport.run(customObjects)
      const summary = objectImport.summaryReport()
      expect(summary).toMatchSnapshot()
    }, 15000)

    it('should stop import on first errors by default', async () => {
      // Set batchSize to 1 so it executes serially
      objectImport = new CustomObjectsImporter(
        { apiConfig, batchSize: 1 },
        logger
      )

      // Make last two objects invalid
      customObjects[1].key = ''
      customObjects[2].container = ''

      try {
        await objectImport.run(customObjects)
      } catch (e) {
        // should create first object
        expect(e.summary.createdCount).toBe(1)
        // should stop after first error
        expect(e.summary.errors).toHaveLength(1)
        expect(e.summary).toMatchSnapshot()
      }
    }, 15000)

    it('should continueOnProblems if `continueOnProblems`', async () => {
      // Set batchSize to 1 so it executes serially
      objectImport = new CustomObjectsImporter(
        {
          apiConfig,
          batchSize: 1,
          continueOnProblems: true,
        },
        logger
      )

      // Make two objects invalid
      customObjects[0].key = ''
      customObjects[1].container = ''

      await objectImport.run(customObjects)
      const summary = objectImport.summaryReport()
      expect(summary).toMatchSnapshot()
      const errors = summary.detailedSummary.errors
      expect(errors).toMatchSnapshot()
    }, 15000)
  })
})
