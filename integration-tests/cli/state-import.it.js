import { oneLine } from 'common-tags'
import StateImport from '@commercetools/state-importer'
import { getCredentials } from '@commercetools/get-credentials'
import { clearData } from './helpers/utils'
import states from '../../packages/state-importer/test/helpers/sampleStates.json'

let projectKey
if (process.env.CI === 'true') projectKey = 'state-import-integration-test'
else projectKey = process.env.npm_config_projectkey

describe('State importer', () => {
  let apiConfig
  let stateImport

  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    debug: () => {},
  }

  beforeAll(() =>
    getCredentials(projectKey).then(credentials => {
      apiConfig = {
        host: 'https://auth..sphere.io',
        apiUrl: 'https://api..sphere.io',
        projectKey,
        credentials,
      }
      // Clear all existing states
      return clearData(apiConfig, 'states')
    })
  )

  afterAll(() => clearData(apiConfig, 'states'))

  beforeEach(() => {
    stateImport = new StateImport({ apiConfig }, logger)
  })

  describe('normal usage', () => {
    it('should create states on the CTP', async () => {
      const reportMessage = oneLine`
          Summary: there were 4 successfully imported states
          (4 were newly created, 0 were updated and 0 were unchanged).`
      const expected = {
        reportMessage,
        detailedSummary: {
          created: 4,
          updated: 0,
          unchanged: 0,
          errors: { create: [], update: [] },
        },
      }
      await stateImport.run(states)
      expect(stateImport.summaryReport()).toEqual(
        expect.objectContaining(expected)
      )
    })

    it('should update states on the CTP', async () => {
      const statesToUpdate = states.map(state => ({ ...state, initial: false }))
      const reportMessage = oneLine`
          Summary: there were 3 successfully imported states
          (0 were newly created, 3 were updated and 1 were unchanged).`
      const expected = {
        reportMessage,
        detailedSummary: {
          created: 0,
          updated: 3,
          unchanged: 1,
          errors: { create: [], update: [] },
        },
      }
      await stateImport.run(statesToUpdate)
      expect(stateImport.summaryReport()).toEqual(
        expect.objectContaining(expected)
      )
    })
  })

  describe('Error handling', () => {
    let invalidStates
    beforeEach(() => {
      invalidStates = states.map(state => ({ ...state, key: '' }))
    })
    describe('without `continueOnProblems', () => {
      it('should stop import on first error', async () => {
        try {
          await stateImport.run(invalidStates)
        } catch (caughtError) {
          // Because import is done in batches, we cannot guarantee
          // how many will be successful before the failure, but the
          // errors array must be only one
          expect(caughtError.message).toMatch(/Processing batch failed/)
          expect(caughtError.error.errors.create).toHaveLength(1)
          expect(caughtError.error.errors.create[0]).toMatch(
            /'key' should not be empty/
          )
        }
      })
    })

    describe('with `continueOnProblems', () => {
      beforeEach(() => {
        stateImport = new StateImport(
          { apiConfig, continueOnProblems: true },
          logger
        )
      })

      it('should not stop on errors', async () => {
        const reportMessage = oneLine`
            Summary: there were 0 successfully imported states
            (0 were newly created, 0 were updated and 0 were unchanged).
            4 errors occured (4 create errors and 0 update errors.)`
        const expected = {
          reportMessage,
          detailedSummary: {
            created: 0,
            updated: 0,
            unchanged: 0,
            errors: {
              create: [
                `'key' should not be empty.`,
                `'key' should not be empty.`,
                `'key' should not be empty.`,
                `'key' should not be empty.`,
              ],
              update: [],
            },
          },
        }
        await stateImport.run(invalidStates)
        expect(stateImport.summaryReport()).toEqual(
          expect.objectContaining(expected)
        )
      })
    })
  })
})
