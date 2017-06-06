// eslint-disable-next-line import/no-extraneous-dependencies
import streamtest from 'streamtest'
import fs from 'fs'
import path from 'path'
import CsvParser from '../src/main'

describe('CsvParser', () => {
  const options = {
    delimiter: ',',
    multiValueDelimiter: ';',
    continueOnProblems: true,
  }

  let csvParser
  beforeEach(() => {
    csvParser = new CsvParser(options)
  })

  describe('::constructor', () => {
    it('should be a function', () => {
      expect(typeof CsvParser).toBe('function')
    })

    it('should set default properties', () => {
      expect(csvParser.delimiter).toBe(',')
      expect(csvParser.multiValueDelimiter).toBe(';')
      expect(csvParser.continueOnProblems).toBeTruthy()
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
  })

  describe(':: parse', () => {
    it('should accept a stream and output a stream', (done) => {
      const readStream = fs.createReadStream(
        path.join(__dirname, 'helpers/sampleCodes.csv'),
      )

      const outputStream = streamtest['v2'].toText(
        (err, data) => {
          const result = JSON.parse(data)
          expect(result).toBeInstanceOf(Array)
          expect(result.length).toBe(4)
          done()
        })
      csvParser.parse(readStream, outputStream)
    })

    it('should resolve cartDiscounts to an Array', (done) => {
      const readStream = fs.createReadStream(
        path.join(__dirname, 'helpers/sampleCodes.csv'),
      )

      const outputStream = streamtest['v2'].toText(
        (err, data) => {
          const result = JSON.parse(data)
          expect(result[0].cartDiscounts).toBeInstanceOf(Array)
          expect(result[0].cartDiscounts).toEqual(['disc1', 'disc2', 'disc3'])
          expect(result.length).toBe(4)
          done()
        })
      csvParser.parse(readStream, outputStream)
    })
  })
})
