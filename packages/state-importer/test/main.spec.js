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
    test('should throw if no `apiConfig` in `options` parameter', () => {
      expect(() => new StateImport({ foo: 'bar' })).toThrowError(
        /The constructor must be passed an `apiConfig` object/
      )
    })

    test('should set default properties', () => {
      expect(stateImport.logger).toEqual(logger)
      expect(stateImport.client).toBeDefined()
      expect(stateImport.apiConfig).toBeDefined()
      expect(stateImport._summary).toBeDefined()
    })
  })

  describe('::processStream', () => {
    describe('when done', () => {
      beforeEach(() => {
        stateImport._processBatches = jest.fn()
        stateImport._processBatches.mockReturnValue(Promise.resolve())
      })

      test('should call callback when done', done => {
        const myMockCallback = jest.fn(() => {
          done()
        })
        stateImport.processStream('foo', myMockCallback)
      })
    })
  })

  describe('::run', () => {
    test('should return `_processBatches` and pass it the argument', async () => {
      stateImport._processBatches = jest.fn()
      stateImport._processBatches.mockReturnValue(Promise.resolve('imported'))

      const response = await stateImport.run('state')
      expect(response).toBe('imported')
      expect(stateImport._processBatches).toHaveBeenCalledTimes(1)
      expect(stateImport._processBatches).toBeCalledWith('state')
    })
  })

  describe('::_buildPredicate', () => {
    describe('given an array of states', () => {
      test('should build predicate with keys', () => {
        const predicate = StateImport._buildPredicate(states)
        expect(predicate).toMatch(
          'key in ("angela", "Wubalubadubdub", "Meeseeks", "new-product-state")'
        )
      })
    })
  })

  describe('::_processBatches', () => {
    describe('when `execute` resolves', () => {
      const response = { body: { results: [states[0]] } }
      beforeEach(() => {
        stateImport.client.execute = jest.fn(() => Promise.resolve(response))
        stateImport._createOrUpdate = jest.fn()
      })

      test('should process states and call `_createOrUpdate`', async () => {
        await stateImport._processBatches(states)
        expect(stateImport._createOrUpdate).toHaveBeenCalledTimes(1)
        expect(stateImport._createOrUpdate).toBeCalledWith(
          states,
          response.body.results
        )
      })
    })

    describe('when `execute` rejects', () => {
      beforeEach(() => {
        const myError = new Error('fake error')
        stateImport.client.execute = jest.fn(() => Promise.reject(myError))
      })

      test('should throw Stateimport error CLI', async () => {
        try {
          await stateImport._processBatches(states)
        } catch ({ message, summary, error }) {
          expect(message).toMatch(/Processing batch failed/)
          expect(summary).toMatch(/fake error/)
          expect(Object.keys(error)).toEqual([
            'created',
            'updated',
            'unchanged',
            'errors',
          ])
        }
      })
    })
  })

  describe('::_createOrUpdate', () => {
    const existingStates = states.slice(0, 2)
    beforeEach(() => {
      stateImport._create = jest.fn(() => Promise.resolve())
      stateImport._update = jest.fn(() => Promise.resolve())
    })

    describe('when state already exists on API', () => {
      test('should call `_update`', async () => {
        await stateImport._createOrUpdate(states, existingStates)
        expect(stateImport._update).toHaveBeenCalledTimes(2)
        expect(stateImport._update).toBeCalledWith(states[0], existingStates[0])
        expect(stateImport._update).toHaveBeenLastCalledWith(
          states[1],
          existingStates[1]
        )
      })

      describe('when state is successfully updated', () => {
        test('should resolve', async () => {
          await stateImport._createOrUpdate(states, existingStates)
          expect(stateImport._summary.updated).toBe(2)
        })
      })

      describe('when state is unchanged', () => {
        test('should resolve and do nothing', async () => {
          // No update action generated
          stateImport._update.mockImplementation(() =>
            Promise.resolve({ statusCode: 304 })
          )
          await stateImport._createOrUpdate(states, existingStates)
          expect(stateImport._summary.unchanged).toBe(2)
          expect(stateImport._summary.updated).toBe(0)
        })
      })

      describe('when error occurs', () => {
        beforeEach(() => {
          stateImport._update.mockImplementationOnce(() =>
            Promise.reject(new Error('Invalid state'))
          )
          stateImport._update.mockImplementationOnce(() =>
            Promise.reject(new Error('Invalid state 2'))
          )
        })

        describe('when `continueOnProblems`', () => {
          beforeEach(() => {
            stateImport.continueOnProblems = true
          })

          test('should continue update', async () => {
            await stateImport._createOrUpdate(states, existingStates)
            expect(stateImport._update).toHaveBeenCalledTimes(2)
            expect(stateImport._summary.updated).toBe(0)
            expect(stateImport._summary.errors.update).toHaveLength(2)
            expect(stateImport._summary.errors.update[0]).toBe('Invalid state')
            expect(stateImport._summary.errors.update[1]).toBe(
              'Invalid state 2'
            )
          })
        })

        describe('when `continueOnProblems` is false (Default)', () => {
          test('should reject and stop update', async () => {
            try {
              await stateImport._createOrUpdate(states, existingStates)
            } catch (error) {
              // Assertions in catch block because we expect promises to fail
              expect(stateImport._update).toBeCalled()
              expect(stateImport._summary.updated).toBe(0)
              expect(stateImport._summary.errors.update).toHaveLength(2)
              expect(stateImport._summary.errors.update[0]).toBe(
                'Invalid state'
              )
              expect(error).toEqual(new Error('Invalid state'))
            }
          })
        })
      })
    })

    describe('when state does not exist on API', () => {
      test('should call `_create` if state is unique', async () => {
        await stateImport._createOrUpdate(states, existingStates)
        expect(stateImport._create).toHaveBeenCalledTimes(2)
        expect(stateImport._create).toBeCalledWith(states[2])
        expect(stateImport._create).toBeCalledWith(states[3])
      })

      describe('when state is successfully created', () => {
        test('should resolve', async () => {
          await stateImport._createOrUpdate(states, existingStates)
          expect(stateImport._summary.created).toBe(2)
        })
      })

      describe('when error occurs', () => {
        beforeEach(() => {
          stateImport._create.mockImplementationOnce(() =>
            Promise.reject(new Error('Creation Error'))
          )
          stateImport._create.mockImplementationOnce(() =>
            Promise.reject(new Error('Creation Error 2'))
          )
        })

        describe('when `continueOnProblems`', () => {
          beforeEach(() => {
            stateImport.continueOnProblems = true
          })
          test('should continue create on errors if `continueOnProblems`', async () => {
            await stateImport._createOrUpdate(states, existingStates)
            expect(stateImport._create).toHaveBeenCalledTimes(2)
            expect(stateImport._summary.created).toBe(0)
            expect(stateImport._summary.errors.create).toHaveLength(2)
            expect(stateImport._summary.errors.create[0]).toBe('Creation Error')
            expect(stateImport._summary.errors.create[1]).toBe(
              'Creation Error 2'
            )
          })
        })

        describe('when `continueOnProblems` is false (Default)', () => {
          test('should reject by default and stop on create error', async () => {
            try {
              await stateImport._createOrUpdate(states, existingStates)
            } catch (error) {
              // Put assertions in catch block because we expect promises to fail
              expect(stateImport._create).toBeCalled()
              expect(stateImport._summary.created).toBe(0)
              expect(stateImport._summary.errors.create).toHaveLength(2)
              expect(stateImport._summary.errors.create[0]).toBe(
                'Creation Error'
              )
              expect(error).toEqual(new Error('Creation Error'))
            }
          })
        })
      })
    })
  })

  describe('::_update', () => {
    let currentState
    beforeEach(() => {
      currentState = { ...states[1], id: 'some_Id' }
      stateImport.client.execute = jest.fn(() => Promise.resolve())
    })

    test('should POST a state update', async () => {
      await stateImport._update(states[2], currentState)
      expect(stateImport.client.execute).toHaveBeenCalled()
    })

    describe('when no update actions', () => {
      test('should not call API', async () => {
        const result = await stateImport._update(states[1], currentState)
        expect(result).toEqual({ statusCode: 304 })
        expect(stateImport.client.execute).not.toHaveBeenCalled()
      })
    })
  })

  describe('::_create', () => {
    test('should POST a new state', async () => {
      stateImport.client.execute = jest.fn(() => Promise.resolve())
      await stateImport._create(states[0])
      expect(stateImport.client.execute).toBeCalledWith(
        expect.objectContaining({ body: states[0] })
      )
    })
  })

  describe('::_createService', () => {
    test('should be defined', () => {
      expect(stateImport._createService).toBeDefined()
    })
  })

  describe('::_buildRequest', () => {
    describe('without body parameter', () => {
      test('should build request', () => {
        const actual = StateImport._buildRequest('myUri/', 'GET')
        expect(actual).toEqual({ uri: 'myUri/', method: 'GET' })
      })
    })

    describe('with body parameter', () => {
      test('should build a request with body', () => {
        const actual = StateImport._buildRequest('myUri/', 'POST', {
          foo: 'bar',
        })
        expect(actual).toEqual({
          uri: 'myUri/',
          method: 'POST',
          body: { foo: 'bar' },
        })
      })
    })
  })

  describe('::summaryReport', () => {
    test('should initialize', () => {
      const report = stateImport.summaryReport()
      expect(Object.keys(report)).toEqual(['reportMessage', 'detailedSummary'])
      expect(report.reportMessage).toMatch(
        'Summary: nothing to do, everything is fine'
      )
    })

    describe('when complete', () => {
      beforeEach(() => {
        stateImport._summary.created = 3
        stateImport._summary.updated = 2
        stateImport._summary.unchanged = 4
      })
      describe('without errors', () => {
        test('should display correct report messages', () => {
          const report = stateImport.summaryReport()
          expect(report.reportMessage).toMatch(oneLine`
            Summary: there were 5 successfully imported states
            (3 were newly created, 2 were updated and 4 were unchanged).`)
        })
      })

      describe('with errors', () => {
        beforeEach(() => {
          stateImport._summary.errors.create = [
            'create error 1',
            'create error 2',
          ]
          stateImport._summary.errors.update = [
            'update error 1',
            'update error 2',
          ]
        })

        test('should display correct report messages', () => {
          const report = stateImport.summaryReport()
          expect(report.reportMessage).toMatch(oneLine`
              Summary: there were 5 successfully imported states
              (3 were newly created, 2 were updated and 4 were unchanged).
              4 errors occured (2 create errors and 2 update errors.)`)
        })
      })
    })
  })
})
