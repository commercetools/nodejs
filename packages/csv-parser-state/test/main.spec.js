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
    let inputStream
    beforeEach(() => {
      inputStream = fs.createReadStream(
        path.join(__dirname, 'helpers/sampleStates.csv')
      )
      jest
        .spyOn(CsvParserState, '_removeEmptyFields')
        .mockImplementation(data => data)
      csvParser._mapTransitionsToArray = jest.fn(data => data)
      csvParser._transformTransitions = jest.fn(data => Promise.resolve(data))
    })

    describe('when parsing is successful', () => {
      test('should output states as JSON', done => {
        const outputStream = streamtest.v2.toText((err, data) => {
          expect(csvParser.logger.info).toHaveBeenCalledWith(
            'Starting conversion'
          )
          expect(csvParser.logger.debug).toHaveBeenCalledWith(
            expect.stringMatching(/Successfully parsed/)
          )
          expect(err).toBeFalsy()
          const result = JSON.parse(data)
          expect(result).toBeInstanceOf(Array)
          expect(result).toHaveLength(4)
          expect(result).toMatchSnapshot()
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
          const outputStream = streamtest.v2.toText((err, data) => {
            expect(data).toBeFalsy()
            expect(err).toEqual(myError)
            expect(csvParser.logger.error).toHaveBeenCalledWith(
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
          const outputStream = streamtest.v2.toText((err, data) => {
            expect(err).toBeFalsy()
            const result = JSON.parse(data)
            expect(result).toBeInstanceOf(Array)
            expect(result).toHaveLength(3)
            expect(csvParser.logger.warn).toHaveBeenCalledWith(
              expect.stringMatching(/Ignoring error at row: 2/)
            )
            expect(result).toMatchSnapshot()
            done()
          })
          csvParser.parse(inputStream, outputStream)
        })
      })
    })
  })

  describe('::_transformTransitions', () => {
    describe('without state transitions', () => {
      test('should not mutate state', () => {
        const actual = {
          foo: 'bar',
          key: 'my-state',
        }
        return expect(csvParser._transformTransitions(actual)).resolves.toEqual(
          actual
        )
      })
    })

    describe('with state transitions', () => {
      const state = { key: 'state-key', transitions: ['state-1', 'state-2'] }
      describe('when execute resolves', () => {
        beforeEach(() => {
          // First transition exists but second does not
          csvParser._fetchStates = jest
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

        test('should resolve with modified state', () =>
          expect(
            csvParser._transformTransitions(state)
          ).resolves.toMatchSnapshot())
      })

      describe('when execute rejects', () => {
        beforeEach(() => {
          csvParser._fetchStates = jest.fn(() =>
            Promise.reject(new Error('Invalid Request'))
          )
        })

        test('should reject with execute rejection error', () =>
          expect(csvParser._transformTransitions(state)).rejects.toThrow(
            /Invalid Request/
          ))
      })
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
        expect(callback).toHaveBeenCalledWith(fakeError)
      })
    })

    describe('when continueOnProblems is true', () => {
      beforeEach(() => {
        csvParser = new CsvParserState({ continueOnProblems: true }, logger)
      })

      test('should log error', () => {
        csvParser._handleErrors(fakeError, callback)
        expect(csvParser.logger.warn).toHaveBeenCalledWith(
          expect.stringMatching(/Ignoring error at/)
        )
      })

      test('should not pass error to callback', () => {
        csvParser._handleErrors(fakeError, callback)
        expect(callback).not.toHaveBeenCalled()
      })
    })
  })

  describe('::_buildStateRequestUri', () => {
    test('should create a state request URI', () => {
      expect(
        CsvParserState._buildStateRequestUri('my-project-key', 'state-key')
      ).toMatch(/\/my-project-key\/states\/key=state-key/)
    })
  })

  describe('::_setupClient', () => {
    describe('without `apiConfig`', () => {
      test('should throw error', () => {
        expect(() => CsvParserState._setupClient()).toThrow(
          /The constructor must be passed an `apiConfig` object/
        )
      })
    })

    describe('with `apiConfig`', () => {
      test('should return client', () => {
        const client = CsvParserState._setupClient({ foo: 'bar' })
        expect(client).toEqual(
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
      expect(CsvParserState._createStateService).toBeDefined()
      expect(CsvParserState._createStateService('project-key')).toEqual(
        expect.objectContaining({
          byKey: expect.any(Function),
          build: expect.any(Function),
          parse: expect.any(Function),
        })
      )
    })
  })

  describe('::_mapMultiValueFieldsToArray', () => {
    describe('with transitions', () => {
      describe('with roles', () => {
        test('should convert `transitions` and roles property to an Array', () => {
          const actual = {
            foo: 'bar',
            transitions: 'my-state-1;my-state-2',
            roles: 'ReviewIncludedInStatistics;Return',
          }
          const expected = {
            foo: 'bar',
            transitions: ['my-state-1', 'my-state-2'],
            roles: ['ReviewIncludedInStatistics', 'Return'],
          }
          expect(
            CsvParserState._mapMultiValueFieldsToArray(actual, ';')
          ).toEqual(expected)
        })
      })

      describe('without roles', () => {
        test('should convert `transitions` and roles property to an Array', () => {
          const actual = {
            foo: 'bar',
            transitions: 'my-state-1;my-state-2',
          }
          const expected = {
            foo: 'bar',
            transitions: ['my-state-1', 'my-state-2'],
          }
          expect(
            CsvParserState._mapMultiValueFieldsToArray(actual, ';')
          ).toEqual(expected)
        })
      })
    })

    describe('without transitions', () => {
      describe('with roles', () => {
        test('should convert `transitions` and roles property to an Array', () => {
          const actual = {
            foo: 'bar',
            roles: 'ReviewIncludedInStatistics;Return',
          }
          const expected = {
            foo: 'bar',
            roles: ['ReviewIncludedInStatistics', 'Return'],
          }
          expect(
            CsvParserState._mapMultiValueFieldsToArray(actual, ';')
          ).toEqual(expected)
        })
      })

      describe('without roles', () => {
        test('should not mutate state', () => {
          const actual = {
            foo: 'bar',
            key: 'my-state',
          }
          expect(
            CsvParserState._mapMultiValueFieldsToArray(actual, ';')
          ).toEqual(actual)
        })
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

  describe('::_parseInitialToBoolean', () => {
    describe('with `initial` field', () => {
      test('should return boolean value from true string', () => {
        const actual = {
          foo: 'bar',
          initial: 'true',
        }
        const expected = {
          foo: 'bar',
          initial: true,
        }
        expect(CsvParserState._parseInitialToBoolean(actual)).toEqual(expected)
      })

      test('should return boolean value from false string', () => {
        const actual = {
          foo: 'bar',
          initial: 'false',
        }
        const expected = {
          foo: 'bar',
          initial: false,
        }
        expect(CsvParserState._parseInitialToBoolean(actual)).toEqual(expected)
      })
    })

    describe('without `initial` field', () => {
      test('should not mutate state', () => {
        const actual = {
          foo: 'bar',
        }
        expect(CsvParserState._parseInitialToBoolean(actual)).toEqual(actual)
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
      expect(csvParser.client.execute).toHaveBeenCalled()
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
