// eslint-disable-next-line import/no-extraneous-dependencies
import streamtest from 'streamtest'
import fs from 'fs'
import path from 'path'
import CsvParserDiscountCode from '../src/main'

describe('CsvParserDiscountCode', () => {
  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    verbose: () => {},
  }

  let csvParser
  beforeEach(() => {
    csvParser = new CsvParserDiscountCode(logger)
  })

  describe('::constructor', () => {
    test('should be a function', () => {
      expect(typeof CsvParserDiscountCode).toBe('function')
    })

    test('should set default properties', () => {
      expect(csvParser.delimiter).toBe(',')
      expect(csvParser.multiValueDelimiter).toBe(';')
      expect(csvParser.continueOnProblems).toBeFalsy()
    })
  })

  describe('::_removeEmptyFields', () => {
    test('should remove empty fields from code objects', () => {
      const actual = {
        foo: 'bar',
        empty: '',
        some: 'all',
      }
      const expected = {
        foo: 'bar',
        some: 'all',
      }
      expect(CsvParserDiscountCode._removeEmptyFields(actual)).toEqual(expected)
    })
  })

  describe('::_cartDiscountsToArray', () => {
    test('should convert `cartDiscounts` property to an Array', () => {
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
          },
        ],
      }
      expect(csvParser._cartDiscountsToArray(actual)).toEqual(expected)
    })

    test('should do nothing if there is no `cartDiscounts` property', () => {
      const sample = { foo: 'bar' }
      expect(csvParser._cartDiscountsToArray(sample)).toEqual({ foo: 'bar' })
    })
  })

  describe('::_groupsToArray', () => {
    test('should convert `groups` property to an Array', () => {
      const actual = {
        foo: 'bar',
        groups: 'my-group-1;my-group-2',
      }
      const expected = {
        foo: 'bar',
        groups: ['my-group-1', 'my-group-2'],
      }
      expect(csvParser._groupsToArray(actual)).toEqual(expected)
    })

    test('should do nothing if there is no `groups` property', () => {
      const sample = { foo: 'bar' }
      expect(csvParser._cartDiscountsToArray(sample)).toEqual({ foo: 'bar' })
    })
  })

  describe(':: parse', () => {
    test('should successfully parse CSV to JSON', () => {
      return new Promise((done) => {
        const inputStream = fs.createReadStream(
          path.join(__dirname, 'helpers/sampleCodes.csv')
        )

        const outputStream = streamtest.v2.toText((err, data) => {
          const result = JSON.parse(data)
          expect(result).toBeInstanceOf(Array)
          expect(result).toHaveLength(5)
          done()
        })
        csvParser.parse(inputStream, outputStream)
      })
    })

    test('should stop parsing by default on error', () => {
      return new Promise((done) => {
        const inputStream = fs.createReadStream(
          path.join(__dirname, 'helpers/faultyCsv.csv')
        )
        const expectedError = 'Row length does not match headers'
        const outputStream = streamtest.v2.toText((err, data) => {
          expect(err.message).toMatch(expectedError)
          expect(data).toBeFalsy()
          done()
        })
        csvParser.parse(inputStream, outputStream)
      })
    })

    test('should skip rows with error if `continueOnProblems`', () => {
      return new Promise((done) => {
        csvParser = new CsvParserDiscountCode(logger, {
          continueOnProblems: true,
        })
        const inputStream = fs.createReadStream(
          path.join(__dirname, 'helpers/faultyCsv.csv')
        )

        const outputStream = streamtest.v2.toText((err, data) => {
          const result = JSON.parse(data)
          expect(result).toBeInstanceOf(Array)
          expect(result).toHaveLength(3)
          done()
        })
        csvParser.parse(inputStream, outputStream)
      })
    })
  })
})
