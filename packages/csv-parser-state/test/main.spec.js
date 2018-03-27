import fs from 'fs'
import path from 'path'
import streamtest from 'streamtest'
import CsvParserState from '../src/main'

describe('CsvParserState', () => {
  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    debug: () => {},
  }

  let csvParser
  beforeEach(() => {
    csvParser = new CsvParserState(
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
    test('should set default properties', () => {
      expect(csvParser.csvConfig.delimiter).toBe(',')
      expect(csvParser.csvConfig.multiValueDelimiter).toBe(';')
      expect(csvParser.csvConfig.continueOnProblems).toBeFalsy()
    })
  })

  xdescribe('::parse', () => {
    test('should successfully parse CSV to JSON', done => {
      const inputStream = fs.createReadStream(
        path.join(__dirname, 'helpers/sampleStates.csv')
      )

      const outputStream = streamtest.v2.toText((err, data) => {
        const result = JSON.parse(data)
        expect(result).toBeInstanceOf(Array)
        expect(result).toHaveLength(4)
        console.log(data)
        done()
      })
      csvParser.parse(inputStream, outputStream)
    })
  })

  describe('_transformTransitions', () => {
    describe('without transitions', () => {
      test('should not mutate state', async () => {
        const actual = {
          foo: 'bar',
          key: 'my-state',
        }
        expect(csvParser._transformTransitions(actual)).resolves.toEqual(actual)
      })
    })

    describe('with transitions', () => {
      let setupClientSpy
      const state = { key: 'state-key', transitions: ['state-1', 'state-2'] }
      beforeEach(() => {
        setupClientSpy = jest.spyOn(csvParser, '_setupClient')
        csvParser._buildStateRequest = jest.fn(() =>
          Promise.resolve({
            body: {
              results: [
                {
                  id: 'state-id-1',
                  key: 'state-key-1',
                },
              ],
            },
          })
        )
      })

      afterEach(() => {
        setupClientSpy.mockReset()
        setupClientSpy.mockRestore()
      })

      test('should setup client', () => {
        csvParser._transformTransitions(state)
        expect(setupClientSpy).toBeCalled()
      })

      describe('when execute resolves', () => {
        beforeEach(() => {
          // First transition exists but second does not
          csvParser._buildStateRequest = jest
            .fn()
            .mockImplementationOnce(() =>
              Promise.resolve({
                body: {
                  id: 'state-id-1',
                  key: 'state-1',
                },
              })
            )
            .mockImplementation(() =>
              Promise.resolve({
                body: {
                  id: 'state-id-2',
                  key: 'state-2',
                },
              })
            )
        })

        test('should resolve with modified state', () => {
          expect(csvParser._transformTransitions(state)).resolves.toEqual({
            key: 'state-key',
            transitions: [
              {
                id: 'state-id-1',
                typeId: 'state',
              },
              {
                id: 'state-id-2',
                typeId: 'state',
              },
            ],
          })
        })
      })

      describe('when execute rejects', () => {
        beforeEach(() => {
          csvParser._buildStateRequest = jest.fn(() =>
            Promise.reject(new Error('Invalid Request'))
          )
        })

        test('should reject with execute rejection error', () => {
          expect(csvParser._transformTransitions(state)).rejects.toThrow(
            /Invalid Request/
          )
        })
      })
    })
  })

  describe('_buildStateRequest', () => {
    beforeEach(() => {
      csvParser.client = { execute: jest.fn() }
    })

    test('should create a state service', done => {
      // We also ensure the `.build()` method is called
      csvParser._createStateService = jest.fn(() => ({
        byKey: () => ({
          build: () => done(),
        }),
      }))
      csvParser._buildStateRequest('state-key')
      expect(csvParser._createStateService).toBeCalled()
      expect(csvParser.client.execute).toBeCalledWith(
        expect.objectContaining({ method: 'GET' })
      )
    })
  })

  describe('_setupClient', () => {
    describe('without `apiConfig`', () => {
      beforeEach(() => {
        csvParser = new CsvParserState({ foo: 'bar' }, logger)
      })

      test('should throw error', () => {
        expect(() => csvParser._setupClient()).toThrowError(
          /The constructor must be passed an `apiConfig` object/
        )
      })
    })

    describe('with `apiConfig`', () => {
      test('should build client', () => {
        // Before executing the function
        expect(csvParser.client).not.toBeDefined()
        // After executing the function
        csvParser._setupClient()
        expect(csvParser.client).toBeDefined()
        expect(csvParser.client).toEqual(
          expect.objectContaining({
            execute: expect.any(Function),
            process: expect.any(Function),
          })
        )
      })
    })
  })

  describe('::_createStateService', () => {
    test('should be defined', () => {
      expect(csvParser._createStateService).toBeDefined()
      expect(csvParser._createStateService()).toEqual(
        expect.objectContaining({
          byKey: expect.any(Function),
          build: expect.any(Function),
          parse: expect.any(Function),
        })
      )
    })
  })

  describe('::_mapTransitionsToArray', () => {
    describe('with transitions', () => {
      test('should convert `transitions` property to an Array', () => {
        const actual = {
          foo: 'bar',
          transitions: 'my-state-1;my-state-2',
        }
        const expected = {
          foo: 'bar',
          transitions: ['my-state-1', 'my-state-2'],
        }
        expect(csvParser._mapTransitionsToArray(actual)).toEqual(expected)
      })
    })

    describe('without transitions', () => {
      test('should not mutate state', () => {
        const actual = {
          foo: 'bar',
          key: 'my-state',
        }
        expect(csvParser._mapTransitionsToArray(actual)).toEqual(actual)
      })
    })
  })

  describe('::_removeEmptyFields', () => {
    test('should remove empty fields from state objects', () => {
      const actual = {
        foo: 'bar',
        empty: '',
        some: 'all',
      }
      const expected = {
        foo: 'bar',
        some: 'all',
      }
      expect(CsvParserState._removeEmptyFields(actual)).toEqual(expected)
    })
  })
})
