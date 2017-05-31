import fs from 'fs'
import path from 'path'
// eslint-disable-next-line import/no-extraneous-dependencies
import JSONStream from 'JSONStream'
import { CsvTransform, parseBool } from '../src/utils'

describe('CsvTransform', () => {
  const expected = {
    key1: 'value1',
    key2: 'value2',
    key3: 'value3',
  }

  test('should initialize', () => {
    expect(new CsvTransform()).toBeInstanceOf(CsvTransform)
  })

  test('should mutate object according to fn passed to constructor', () => {
    const sampleFunction = value => `I am transformed ${value}`
    const anotherSampleFunction = value => `I am also transformed ${value}`
    const transform = new CsvTransform({
      key2: sampleFunction,
      key3: anotherSampleFunction,
    })
    const readStream = fs.createReadStream(
      path.join(__dirname, 'helpers/sampleJSON.json'),
      'utf8',
    )
    let result

    readStream
      .pipe(JSONStream.parse())
      .pipe(transform)
      .on('data', (data) => {
        result = data
      })
      .on('end', () => {
        expect(Object.keys(result)).toEqual(Object.keys(expected))
        expect(result.key1).toBe('value1')
        expect(result.key2).toBe('I am transformed value2')
        expect(result.key3).toBe('I am also transformed value3')
      })
  })

  test(`should not mutate object if property in
      constructor does not exist`, () => {
    const sampleFunction = value => `I am doing nothing with ${value}`
    const transform = new CsvTransform({ key4: sampleFunction })
    const readStream = fs.createReadStream(
      path.join(__dirname, 'helpers/sampleJSON.json'),
      'utf8',
    )
    let result

    readStream
      .pipe(JSONStream.parse())
      .pipe(transform)
      .on('data', (data) => {
        result = data
      })
      .on('end', () => {
        expect(result).toEqual(expected)
      })
  })
})

describe('parseBool', () => {
  test('should return Boolean when passed a string', () => {
    expect(parseBool('true')).toBe(true)
    expect(parseBool('false')).toBe(false)
  })

  test('should return Boolean when passed a Boolean', () => {
    expect(parseBool(true)).toBe(true)
    expect(parseBool(false)).toBe(false)
  })
})
