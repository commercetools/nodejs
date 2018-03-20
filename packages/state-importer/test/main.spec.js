import { oneLine } from 'common-tags'
import StateImport from '../src/main'
import states from './helpers/sampleStates.json'

describe('StateImport', () => {
  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    debug: () => {},
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

  describe('::run', () => {
    it('should be defined', () => {
      expect(stateImport.run).toBeDefined()
    })
    it('should return `_processBatches` and pass it the argument', async () => {
      stateImport._processBatches = jest.fn()
      stateImport._processBatches.mockReturnValue(Promise.resolve('imported'))

      const response = await stateImport.run('state')
      expect(response).toBe('imported')
      expect(stateImport._processBatches).toHaveBeenCalledTimes(1)
      expect(stateImport._processBatches).toBeCalledWith('state')
    })
  })

  describe('::_buildPredicate', () => {
    it('should be defined', () => {
      expect(StateImport._buildPredicate).toBeDefined()
    })

    it('should build predicate with states from array of states', () => {
      const predicate = StateImport._buildPredicate(states)
      expect(predicate).toMatch(
        'key in ("angela", "Wubalubadubdub", "Meeseeks", "new-product-state")'
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
      expect(stateImport._createOrUpdate).toBeCalledWith(
        states,
        response.body.results
      )
    })
  })

  describe('::_createOrUpdate', () => {
    const existingStates = states.slice(0, 2)
    beforeEach(() => {
      stateImport._create = jest.fn(() => Promise.resolve())
      stateImport._update = jest.fn(() => Promise.resolve())
    })

    it('should be defined', () => {
      expect(stateImport._createOrUpdate).toBeDefined()
    })

    it('should call `_update` if state already exists', async () => {
      await stateImport._createOrUpdate(states, existingStates)
      expect(stateImport._update).toHaveBeenCalledTimes(2)
      expect(stateImport._update).toBeCalledWith(states[0], existingStates[0])
      expect(stateImport._update).toHaveBeenLastCalledWith(
        states[1],
        existingStates[1]
      )
    })

    it('should resolve if state is updated', async () => {
      await stateImport._createOrUpdate(states, existingStates)
      expect(stateImport._summary.updated).toBe(2)
    })

    it('should resolve and do nothing when no update actions', async () => {
      stateImport._update.mockImplementation(() =>
        Promise.resolve({ statusCode: 304 })
      )
      await stateImport._createOrUpdate(states, existingStates)
      expect(stateImport._summary.unchanged).toBe(2)
      expect(stateImport._summary.updated).toBe(0)
    })

    it('should continue update on errors if `continueOnProblems`', async () => {
      stateImport.continueOnProblems = true
      stateImport._update.mockImplementationOnce(() =>
        Promise.reject(new Error('First invalid state'))
      )
      stateImport._update.mockImplementationOnce(() =>
        Promise.reject(new Error('Second invalid state'))
      )
      await stateImport._createOrUpdate(states, existingStates)
      expect(stateImport._update).toHaveBeenCalledTimes(2)
      expect(stateImport._summary.updated).toBe(0)
      expect(stateImport._summary.updateErrorCount).toBe(2)
      expect(stateImport._summary.errors).toHaveLength(2)
      expect(stateImport._summary.errors[0]).toBe('First invalid state')
      expect(stateImport._summary.errors[1]).toBe('Second invalid state')
    })

    it('should reject by default and stop on update error', async () => {
      stateImport._update.mockImplementation(() =>
        Promise.reject(new Error('Invalid state'))
      )
      try {
        await stateImport._createOrUpdate(states, existingStates)
      } catch (error) {
        // Put assertions in catch block because we expect promises to fail
        expect(stateImport._update).toBeCalled()
        expect(stateImport._summary.updated).toBe(0)
        expect(stateImport._summary.updateErrorCount).toBe(2)
        expect(stateImport._summary.errors).toHaveLength(2)
        expect(stateImport._summary.errors[0]).toBe('Invalid state')
        expect(error).toEqual(new Error('Invalid state'))
      }
    })

    it('should call `_create` if state is unique', async () => {
      await stateImport._createOrUpdate(states, existingStates)
      expect(stateImport._create).toHaveBeenCalledTimes(2)
      expect(stateImport._create).toBeCalledWith(states[2])
      expect(stateImport._create).toBeCalledWith(states[3])
    })

    it('should resolve if state is created and imported', async () => {
      await stateImport._createOrUpdate(states, existingStates)
      expect(stateImport._summary.created).toBe(2)
    })

    it('should continue create on errors if `continueOnProblems`', async () => {
      stateImport.continueOnProblems = true
      stateImport._create.mockImplementationOnce(() =>
        Promise.reject(new Error('First invalid state'))
      )
      stateImport._create.mockImplementationOnce(() =>
        Promise.reject(new Error('Second invalid state'))
      )
      await stateImport._createOrUpdate(states, existingStates)
      expect(stateImport._create).toHaveBeenCalledTimes(2)
      expect(stateImport._summary.created).toBe(0)
      expect(stateImport._summary.createErrorCount).toBe(2)
      expect(stateImport._summary.errors).toHaveLength(2)
      expect(stateImport._summary.errors[0]).toBe('First invalid state')
      expect(stateImport._summary.errors[1]).toBe('Second invalid state')
    })

    it('should reject by default and stop on create error', async () => {
      stateImport._create.mockImplementation(() =>
        Promise.reject(new Error('Invalid new state'))
      )
      try {
        await stateImport._createOrUpdate(states, existingStates)
      } catch (error) {
        // Put assertions in catch block because we expect promises to fail
        expect(stateImport._create).toBeCalled()
        expect(stateImport._summary.created).toBe(0)
        expect(stateImport._summary.createErrorCount).toBe(2)
        expect(stateImport._summary.errors).toHaveLength(2)
        expect(stateImport._summary.errors[0]).toBe('Invalid new state')
        expect(error).toEqual(new Error('Invalid new state'))
      }
    })
  })

  describe('::_update', () => {
    const currentState = { ...states[1], id: 'some_Id' }

    it('should be defined', () => {
      expect(stateImport._update).toBeDefined()
    })

    it('should not call API if no update actions', async () => {
      stateImport.client.execute = jest.fn(() => Promise.resolve())
      const result = await stateImport._update(states[1], currentState)
      expect(result).toEqual({ statusCode: 304 })
      expect(stateImport.client.execute).not.toHaveBeenCalled()
    })

    it('should POST a state update', async () => {
      stateImport.client.execute = jest.fn(() => Promise.resolve())
      await stateImport._update(states[2], currentState)
      expect(stateImport.client.execute).toHaveBeenCalled()
    })
  })

  describe('::_create', () => {
    it('should be defined', () => {
      expect(stateImport._create).toBeDefined()
    })

    it('should POST a new state', async () => {
      stateImport.client.execute = jest.fn(() => Promise.resolve())
      await stateImport._create(states[0])
      expect(stateImport.client.execute).toBeCalledWith(
        expect.objectContaining({ body: states[0] })
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
