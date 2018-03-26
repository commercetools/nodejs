import fs from 'fs'

import AbstractParser from '../src/parsers/abstract-parser'

const sampleImportFile = 'data/lineitemstate-sample.csv'

describe('AbstractParser', () => {
  describe('::constructor', () => {
    test('should set default settings', () => {
      const parser = new AbstractParser()

      expect(parser.csvConfig).toEqual({
        batchSize: 100,
        delimiter: ',',
        strictMode: true,
      })

      expect(parser.logger).toBeDefined()
      expect(parser.logger.info).toBeInstanceOf(Function)
      expect(parser.logger.error).toBeInstanceOf(Function)
      expect(parser.logger.verbose).toBeInstanceOf(Function)
      expect(parser.logger.warn).toBeInstanceOf(Function)
    })

    test('should accept input options', () => {
      const parser = new AbstractParser({
        csvConfig: {
          delimiter: ';',
        },
      })

      expect(parser.csvConfig).toEqual({
        batchSize: 100,
        delimiter: ';',
        strictMode: true,
      })
    })
  })

  test('::_getMissingHeaders should return missing headers', () => {
    const parser = new AbstractParser({}, 'lineItemState')
    const headers = parser._getMissingHeaders({
      orderNumber: 123,
      lineItemId: 213,
    })

    expect(headers).toEqual(['quantity', 'fromState', 'toState'])
  })

  test('::_processData should throw an error when called', () => {
    const parser = new AbstractParser()

    expect(parser._processData).toThrowError(
      'Method AbstractParser._processData has to be overridden!'
    )
  })

  test('::_streamInput should return a highland stream', () => {
    const parser = new AbstractParser()

    const output = parser._streamInput(fs.createReadStream(sampleImportFile))
    expect(output.source.__HighlandStream__).toBeTruthy()
  })
})
