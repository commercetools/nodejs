import { oneLine } from 'common-tags'
import StateImport from '../src/main'
import states from './helpers/sampleStates.json'

describe('StateImport', () => {
  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    verbose: () => {},
  }

  let stateImport
  beforeEach(() => {
    stateImport = new StateImport(
      {
        apiConfig: {
          projectKey: 'myProjectKey',
        },
        accessToken: 'myAccessToken',
      },
      logger
    )
  })

  describe('::constructor', () => {
    it('should be a function', () => {
      expect(typeof StateImport).toBe('function')
    })

    it('should throw if no `apiConfig` in `options` parameter', () => {
      expect(() => new StateImport({ foo: 'bar' })).toThrowError(
        /The constructor must be passed an `apiConfig` object/
      )
    })

    it('should set default properties', () => {
      expect(stateImport.logger).toEqual(logger)
      expect(stateImport.client).toBeDefined()
      expect(stateImport.apiConfig).toBeDefined()
      expect(stateImport._summary).toBeDefined()
    })
  })

  describe('::processStream', () => {
    it('should be defined', () => {
      expect(stateImport.processStream).toBeDefined()
    })

    it('should call callback when done', done => {
      stateImport._processBatches = jest.fn()
      stateImport._processBatches.mockReturnValue(Promise.resolve())
      const myMockCallback = jest.fn(() => {
        done()
      })
      stateImport.processStream('foo', myMockCallback)
    })
  })

  describe('::_buildPredicate', () => {
    it('should be defined', () => {
      expect(StateImport._buildPredicate).toBeDefined()
    })

    it('should build predicate with states from array of states', () => {
      const predicate = StateImport._buildPredicate(states)
      expect(predicate).toMatch(
        'key in ("Initial", "Wubalubadubdub", "Meeseeks", "new-product-state")'
      )
    })
  })

  describe('::_processBatches', () => {
    it('should be defined', () => {
      expect(stateImport._processBatches).toBeDefined()
    })

    it('should process list of states and call `_createOrUpdate`', async () => {
      const response = { body: { results: [states[0]] } }
      stateImport.client.execute = jest.fn(() => Promise.resolve(response))
      stateImport._createOrUpdate = jest.fn()
      await stateImport._processBatches(states)
      expect(stateImport._createOrUpdate).toHaveBeenCalledTimes(1)
      expect(stateImport._createOrUpdate).toHaveBeenCalledWith(
        states,
        response.body.results
      )
    })
  })

  describe('::_createService', () => {
    it('should be defined', () => {
      expect(stateImport._createService).toBeDefined()
    })
  })

  describe('::summaryReport', () => {
    it('should be defined', () => {
      expect(stateImport.summaryReport).toBeDefined()
      expect(Object.keys(stateImport.summaryReport())).toEqual([
        'reportMessage',
        'detailedSummary',
      ])
    })

    it('should display correct report messages', () => {
      let report
      report = stateImport.summaryReport()
      expect(report.reportMessage).toMatch(
        'Summary: nothing to do, everything is fine'
      )

      stateImport._summary.created = 3
      stateImport._summary.updated = 2
      stateImport._summary.unchanged = 4
      report = stateImport.summaryReport()
      expect(report.reportMessage).toMatch(oneLine`
        Summary: there were 5 successfully imported states
        (3 were newly created, 2 were updated and 4 were unchanged).`)

      stateImport._summary.createErrorCount = 5
      stateImport._summary.updateErrorCount = 7
      report = stateImport.summaryReport()
      expect(report.reportMessage).toMatch(oneLine`
        Summary: there were 5 successfully imported states
        (3 were newly created, 2 were updated and 4 were unchanged).
        12 errors occured (5 create errors and 7 update errors.)`)
    })
  })
})
