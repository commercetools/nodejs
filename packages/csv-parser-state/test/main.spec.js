import fs from 'fs'
import path from 'path'
import streamtest from 'streamtest'
import CsvParserState from '../src/main'

describe('CsvParserState', () => {
  const logger = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('::constructor', () => {
    test('should set default properties', () => {
      expect(csvParser.csvConfig.delimiter).toBe(',')
      expect(csvParser.csvConfig.multiValueDelimiter).toBe(';')
      expect(csvParser.csvConfig.continueOnProblems).toBeFalsy()
    })
  })

  describe('::parse', () => {
    beforeEach(() => {
      jest
        .spyOn(CsvParserState, '_removeEmptyFields')
        .mockImplementation(data => data)
      csvParser._mapTransitionsToArray = jest.fn(data => data)
      csvParser._transformTransitions = jest.fn(data => Promise.resolve(data))
    })

    describe('when parsing is successful', () => {
      test('should output states as JSON', done => {
        const inputStream = fs.createReadStream(
          path.join(__dirname, 'helpers/sampleStates.csv')
        )

        const outputStream = streamtest.v2.toText((err, data) => {
          expect(csvParser.logger.info).toBeCalledWith('Starting conversion')
          expect(csvParser.logger.debug).toBeCalledWith(
            expect.stringMatching(/Successfully parsed/)
          )
          expect(err).toBeFalsy()
          const result = JSON.parse(data)
          expect(result).toBeInstanceOf(Array)
          expect(result).toHaveLength(4)
          // expect(result).toMatchSnapshot()
          done()
        })
        csvParser.parse(inputStream, outputStream)
      })
    })

    describe('when errors occur', () => {
      const myError = new Error('parse error')
      describe('when continueOnProblems is false', () => {
        beforeEach(() => {
          // Fail on parsing of second state
          csvParser._transformTransitions = jest
            .fn()
            .mockImplementationOnce(data => Promise.resolve(data))
            .mockImplementationOnce(() => Promise.reject(myError))
        })

        test('should stop parsing on first error', done => {
          const inputStream = fs.createReadStream(
            path.join(__dirname, 'helpers/sampleStates.csv')
          )

          const outputStream = streamtest.v2.toText((err, data) => {
            expect(data).toBeFalsy()
            expect(err).toEqual(myError)
            expect(csvParser.logger.error).toBeCalledWith(
              expect.stringMatching(/At row: 2, Error/)
            )
            done()
          })
          csvParser.parse(inputStream, outputStream)
        })
      })

      describe('when continueOnProblems is true', () => {
        beforeEach(() => {
          csvParser = new CsvParserState({ continueOnProblems: true }, logger)
          // Fail on parsing of second state
          csvParser._transformTransitions = jest
            .fn()
            .mockImplementationOnce(data => Promise.resolve(data))
            .mockImplementationOnce(() => Promise.reject(myError))
            .mockImplementation(data => Promise.resolve(data))
        })

        test('should skip rows with error', done => {
          const inputStream = fs.createReadStream(
            path.join(__dirname, 'helpers/sampleStates.csv')
          )

          const outputStream = streamtest.v2.toText((err, data) => {
            expect(err).toBeFalsy()
            const result = JSON.parse(data)
            expect(result).toBeInstanceOf(Array)
            expect(result).toHaveLength(3)
            expect(csvParser.logger.warn).toBeCalledWith(
              expect.stringMatching(/Ignoring error at row: 2/)
            )
            // expect(result).toMatchSnapshot()
            done()
          })
          csvParser.parse(inputStream, outputStream)
        })
      })
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
      const state = { key: 'state-key', transitions: ['state-1', 'state-2'] }
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

  describe('::_handleErrors', () => {
    const fakeError = new Error('General error')
    const callback = jest.fn()
    describe('when continueOnProblems is false (Default)', () => {
      beforeEach(() => {
        csvParser = new CsvParserState({ continueOnProblems: false }, logger)
      })

      test('should pass error to callback', () => {
        csvParser._handleErrors(fakeError, callback)
        expect(callback).toBeCalledWith(fakeError)
      })
    })

    describe('when continueOnProblems is true', () => {
      beforeEach(() => {
        csvParser = new CsvParserState({ continueOnProblems: true }, logger)
      })

      test('should log error', () => {
        csvParser._handleErrors(fakeError, callback)
        expect(csvParser.logger.warn).toBeCalledWith(
          expect.stringMatching(/Ignoring error at/)
        )
      })

      test('should not pass error to callback', () => {
        csvParser._handleErrors(fakeError, callback)
        expect(callback).not.toBeCalled()
      })
    })
  })

  describe('::_fetchStates', () => {
    beforeEach(() => {
      csvParser.client = { execute: jest.fn() }
    })

    it('should fetch reference from API from url', () => {
      const uri = 'dummy-uri'
      const expectedRequest = { uri, method: 'GET' }

      csvParser._fetchStates(uri)
      expect(csvParser.client.execute).toBeCalled()
      expect(csvParser.client.execute).toHaveBeenCalledWith(expectedRequest)
    })

    describe('when multiple calls with same parameter', () => {
      it('should fetch only once', () => {
        const uri = 'dummy-uri-2'
        const expectedRequest = { uri, method: 'GET' }

        csvParser._fetchStates(uri)
        csvParser._fetchStates(uri)
        expect(csvParser.client.execute).toHaveBeenCalledTimes(1)
        expect(csvParser.client.execute).toHaveBeenCalledWith(expectedRequest)
      })
    })
  })
})
