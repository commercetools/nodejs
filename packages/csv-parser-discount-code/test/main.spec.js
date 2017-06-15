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
    it('should remove empty fields from code objects', () => {
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

  describe('::_cartDiscountsToArray', () => {
    it('should convert `cartDiscounts` property to an Array', () => {
      const actual = {
        foo: 'bar',
        cartDiscounts: 'high quality;low price',
      }
      const expected = {
        foo: 'bar',
        cartDiscounts: [
          {
            typeId: 'cart-discount',
            id: 'high quality',
          },
          {
            typeId: 'cart-discount',
            id: 'low price',
          }],
      }
      expect(csvParser._cartDiscountsToArray(actual)).toEqual(expected)
    })

    it('should do nothing if there is no `cartDiscounts` property', () => {
      const sample = { foo: 'bar' }
      expect(csvParser._cartDiscountsToArray(sample)).toEqual({ foo: 'bar' })
    })
  })

  describe(':: parse', () => {
    it('should successfully parse CSV to JSON', (done) => {
      const inputStream = fs.createReadStream(
        path.join(__dirname, 'helpers/sampleCodes.csv'),
      )

      const outputStream = streamtest['v2'].toText((err, data) => {
        const result = JSON.parse(data)
        expect(result).toBeInstanceOf(Array)
        expect(result.length).toBe(5)
        done()
      })
      csvParser.parse(inputStream, outputStream)
    })

    it('should stop parsing by default on error', (done) => {
      const inputStream = fs.createReadStream(
        path.join(__dirname, 'helpers/faultyCsv.csv'),
      )
      const expectedError = 'Row length does not match headers'
      const outputStream = streamtest['v2'].toText((err, data) => {
        expect(err.message).toMatch(expectedError)
        expect(data).toBeFalsy()
        done()
      })
      csvParser.parse(inputStream, outputStream)
    })

    it('should skip rows with error if `continueOnProblems`', (done) => {
      csvParser = new CsvParser(logger, { continueOnProblems: true })
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
      csvParser.parse(inputStream, outputStream)
    })
  })
})
