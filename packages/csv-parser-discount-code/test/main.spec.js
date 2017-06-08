// eslint-disable-next-line import/no-extraneous-dependencies
import streamtest from 'streamtest'
import fs from 'fs'
import path from 'path'
import CsvParser from '../src/main'

describe('CsvParser', () => {
  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    verbose: () => {},
  }

  let csvParser
  beforeEach(() => {
    csvParser = new CsvParser(logger)
  })

  describe('::constructor', () => {
    it('should be a function', () => {
      expect(typeof CsvParser).toBe('function')
    })

    it('should set default properties', () => {
      expect(csvParser.delimiter).toBe(',')
      expect(csvParser.multiValueDelimiter).toBe(';')
      expect(csvParser.continueOnProblems).toBeFalsy()
    })
  })

  describe('::_removeEmptyFields', () => {
    it('should be defined', () => {
      expect(CsvParser._removeEmptyFields).toBeDefined()
    })

    it('should be remove empty fields from code objects', () => {
      const actual = {
        foo: 'bar',
        empty: '',
        some: 'all',
      }
      const expected = {
        foo: 'bar',
        some: 'all',
      }
      expect(CsvParser._removeEmptyFields(actual)).toEqual(expected)
    })
  })

  describe('::_resolveCartDiscounts', () => {
    it('should be defined', () => {
      expect(csvParser._resolveCartDiscounts).toBeDefined()
    })

    it('should convert `cartDiscounts` property to an Array', () => {
      const actual = {
        foo: 'bar',
        cartDiscounts: 'high quality;low price',
      }
      const expected = {
        foo: 'bar',
        cartDiscounts: ['high quality', 'low price'],
      }
      expect(csvParser._resolveCartDiscounts(actual)).toEqual(expected)
    })

    it('should do nothing if there is no `cartDiscounts` property', () => {
      const sample = { foo: 'bar' }
      expect(csvParser._resolveCartDiscounts(sample)).toEqual({ foo: 'bar' })
    })
  })

  describe(':: parse', () => {
    it('should be defined', () => {
      expect(csvParser.parse).toBeDefined()
    })

    it('should accept a stream and output a stream', (done) => {
      const inputStream = fs.createReadStream(
        path.join(__dirname, 'helpers/sampleCodes.csv'),
      )

      const outputStream = streamtest['v2'].toText(
        (err, data) => {
          const result = JSON.parse(data)
          expect(result).toBeInstanceOf(Array)
          expect(result.length).toBe(5)
          done()
        })
      csvParser.parse(inputStream, outputStream)
    })

    it('should resolve on success', async (done) => {
      const summary = { parsed: 5, notParsed: 0, errors: [] }

      const inputStream = fs.createReadStream(
        path.join(__dirname, 'helpers/sampleCodes.csv'),
      )

      const outputStream = streamtest['v2'].toText(
        (err, data) => {
          const result = JSON.parse(data)
          expect(result).toBeInstanceOf(Array)
          expect(result.length).toBe(5)
          done()
        })
      expect(
        await csvParser.parse(inputStream, outputStream),
      ).toMatchObject(summary)
    })

    it('should throw by default on error ', () => {
      const inputStream = fs.createReadStream(
        path.join(__dirname, 'helpers/faultyCsv.csv'),
      )
      const outputStream = process.stdout

      expect(() => csvParser(inputStream, outputStream)).toThrow()
    })

    it('should skip rows with error if `continueOnProblems`', async (done) => {
      csvParser = new CsvParser(logger, { continueOnProblems: true })
      const summary = { parsed: 3, notParsed: 2 }

      const inputStream = fs.createReadStream(
        path.join(__dirname, 'helpers/faultyCsv.csv'),
      )

      const outputStream = streamtest['v2'].toText(
        (err, data) => {
          const result = JSON.parse(data)
          expect(result).toBeInstanceOf(Array)
          expect(result.length).toBe(3)
          done()
        })
      expect(
        await csvParser.parse(inputStream, outputStream),
      ).toMatchObject(summary)
    })
  })
})
