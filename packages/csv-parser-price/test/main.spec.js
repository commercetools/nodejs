import fs from 'fs'
import path from 'path'
import sinon from 'sinon'
import streamtest from 'streamtest'

import CONSTANTS from '../src/constants'
import CsvParserPrice from '../src/main'
import priceSample from './helpers/price-sample'
import customTypeSample from './helpers/custom-type-sample.json'

const logger = {
  error: () => {},
  warn: () => {},
  info: () => {},
  verbose: () => {},
}
const apiConfig = {
  projectKey: 'foo',
}

test(`CsvParserPrice
  should initialize default values`, () => {
  const options = { apiConfig, accessToken: 'testingToken' }
  const csvParserPrice = new CsvParserPrice(options)

  // logger
  expect(Object.keys(csvParserPrice.logger)).toEqual([
    'error',
    'warn',
    'info',
    'verbose',
  ])
  Object.keys(csvParserPrice.logger).forEach((key) => {
    expect(typeof csvParserPrice.logger[key]).toBe('function')
  })

  expect(csvParserPrice.accessToken).toBe(options.accessToken)
  // config
  expect(csvParserPrice.delimiter).toBe(CONSTANTS.standardOption.delimiter)
  expect(csvParserPrice.batchSize).toBe(CONSTANTS.standardOption.batchSize)
})

describe('CsvParserPrice::parse', () => {
  test('should accept a stream and output a stream', () => {
    return new Promise((done) => {
      const csvParserPrice = new CsvParserPrice({ apiConfig, logger })
      const readStream = fs.createReadStream(
        path.join(__dirname, 'helpers/sample.csv')
      )

      sinon
        .stub(csvParserPrice, 'getCustomTypeDefinition')
        .returns(Promise.resolve(customTypeSample))

      const outputStream = streamtest.v2.toText((error, result) => {
        const prices = JSON.parse(result).prices
        const price = prices[0].prices[0]
        expect(prices).toHaveLength(2)
        expect(prices[0].sku).toBeTruthy()
        expect(price.value.centAmount).toBeTruthy()
        expect(price.value.currencyCode).toBeTruthy()
        expect(price.value).toEqual(
          expect.objectContaining({
            fractionDigits: 2,
            type: 'centPrecision',
          })
        )
        done()
      })
      csvParserPrice.parse(readStream, outputStream)
    })
  })

  test('should parse the UTF-8 BOM encoding file', () => {
    return new Promise((done) => {
      const csvParserPrice = new CsvParserPrice({ apiConfig, logger })
      const readStream = fs.createReadStream(
        path.join(__dirname, 'helpers/utf-bom.csv')
      )

      sinon
        .stub(csvParserPrice, 'getCustomTypeDefinition')
        .returns(Promise.resolve(customTypeSample))

      const outputStream = streamtest.v2.toText((error, result) => {
        const prices = JSON.parse(result).prices
        const price = prices[0].prices[0]
        expect(prices).toHaveLength(2)
        expect(prices[0].sku).toBeTruthy()
        expect(price.value.centAmount).toBeTruthy()
        expect(price.value.currencyCode).toBeTruthy()
        done()
      })
      csvParserPrice.parse(readStream, outputStream)
      csvParserPrice.parse(readStream, outputStream)
    })
  })

  test('should group prices by variants sku', () => {
    return new Promise((done) => {
      const csvParserPrice = new CsvParserPrice({ apiConfig, logger })
      const readStream = fs.createReadStream(
        path.join(__dirname, 'helpers/sample.csv')
      )

      sinon
        .stub(csvParserPrice, 'getCustomTypeDefinition')
        .returns(Promise.resolve(customTypeSample))

      const outputStream = streamtest.v2.toText((error, result) => {
        const prices = JSON.parse(result).prices
        expect(prices).toHaveLength(2)
        expect(prices[0].prices).toHaveLength(2)
        expect(prices[1].prices).toHaveLength(1)
        expect(prices[0].sku).toBeTruthy()
        done()
      })
      csvParserPrice.parse(readStream, outputStream)
    })
  })

  test('should parse a full price.value object', () => {
    return new Promise((done) => {
      const csvParserPrice = new CsvParserPrice({ apiConfig, logger })
      const readStream = fs.createReadStream(
        path.join(__dirname, 'helpers/full-price.csv')
      )

      const outputStream = streamtest.v2.toText((error, result) => {
        expect(error).not.toBeTruthy()

        const prices = JSON.parse(result).prices
        expect(prices).toEqual([
          {
            prices: [
              {
                country: 'DE',
                id: 'id1',
                value: {
                  type: 'centPrecision',
                  fractionDigits: 2,
                  centAmount: 12900,
                  currencyCode: 'EUR',
                },
              },
              {
                country: 'LT',
                id: 'id2',
                value: {
                  type: 'centPrecision',
                  fractionDigits: 2,
                  centAmount: 12900,
                  currencyCode: 'EUR',
                },
              },
              {
                country: 'IT',
                id: 'id3',
                value: {
                  type: 'highPrecision',
                  preciseAmount: 123456,
                  fractionDigits: 2,
                  centAmount: 12900,
                  currencyCode: 'EUR',
                },
              },
            ],
            sku: 'sku12',
          },
        ])
        done()
      })
      csvParserPrice.parse(readStream, outputStream)
    })
  })

  test('should parse a highPrecision fields in price and custom fields money object', () => {
    return new Promise((done) => {
      const csvParserPrice = new CsvParserPrice({ apiConfig, logger })
      const readStream = fs.createReadStream(
        path.join(__dirname, 'helpers/high-precision-price.csv')
      )

      const customType = {
        id: '123',
        key: 'custom-type',
        name: {
          en: 'name',
        },
        resourceTypeIds: ['product-price'],
        fieldDefinitions: [
          {
            name: 'kiloPrice',
            label: {
              de: 'Kilopreis',
            },
            type: {
              name: 'Money',
            },
          },
        ],
      }

      sinon
        .stub(csvParserPrice, 'getCustomTypeDefinition')
        .returns(Promise.resolve(customType))

      const outputStream = streamtest.v2.toText((error, result) => {
        expect(error).not.toBeTruthy()

        const prices = JSON.parse(result).prices
        expect(prices).toEqual([
          {
            prices: [
              {
                custom: {
                  fields: {
                    kiloPrice: {
                      centAmount: 56789,
                      currencyCode: 'GBP',
                      fractionDigits: 2,
                      preciseAmount: 5,
                      type: 'highPrecision',
                    },
                  },
                  type: {
                    id: '123',
                  },
                },
                value: {
                  centAmount: 123.5,
                  currencyCode: 'EUR',
                  fractionDigits: 3,
                  preciseAmount: 12345,
                  type: 'highPrecision',
                },
              },
            ],
            sku: 'variant-SKU',
          },
        ])
        done()
      })
      csvParserPrice.parse(readStream, outputStream)
    })
  })

  test('should exit on faulty CSV format', () => {
    return new Promise((done) => {
      const csvParserPrice = new CsvParserPrice({ apiConfig, logger })
      const inputStream = fs.createReadStream(
        path.join(__dirname, 'helpers/faulty-sample.csv')
      )

      const spy = sinon.spy(csvParserPrice.logger, 'error')

      const outputStream = streamtest.v2.toText(() => {
        const errorString = spy.args[0][0].toString()
        expect(spy.calledOnce).toBeTruthy()
        expect(errorString).toMatch('Row length does not match headers')
        csvParserPrice.logger.error.restore()
        done()
      })
      csvParserPrice.parse(inputStream, outputStream)
    })
  })

  test('should exit and show appropriate message on missing Sku variant Header in CSV', () => {
    return new Promise((done) => {
      const csvParserPrice = new CsvParserPrice({ apiConfig, logger })
      const inputStream = fs.createReadStream(
        path.join(__dirname, 'helpers/invalid-sku-sample.csv')
      )

      const spy = sinon.spy(csvParserPrice.logger, 'error')

      const outputStream = streamtest.v2.toText(() => {
        const errorString = spy.args[0][0].toString()
        expect(spy.calledOnce).toBeTruthy()
        expect(errorString).toMatch(
          'variant-sku key is missing/mis-spelled in the csv header.'
        )
        csvParserPrice.logger.error.restore()
        done()
      })
      csvParserPrice.parse(inputStream, outputStream)
    })
  })

  test('should exit on CSV parsing error', () => {
    return new Promise((done) => {
      const csvParserPrice = new CsvParserPrice({ apiConfig, logger })
      const inputStream = fs.createReadStream(
        path.join(__dirname, 'helpers/missing-type-sample.csv')
      )

      const spy = sinon.spy(csvParserPrice.logger, 'error')

      const outputStream = streamtest.v2.toText(() => {
        const errorString = spy.args[0][0].toString()
        expect(spy.calledOnce).toBeTruthy()
        expect(errorString).toMatch('Missing required option')
        csvParserPrice.logger.error.restore()
        done()
      })
      csvParserPrice.parse(inputStream, outputStream)
    })
  })
})

describe('CsvParserPrice::transformPriceData', () => {
  test('should transform price values to the expected type', () => {
    const csvParserPrice = new CsvParserPrice({ apiConfig, logger })
    const result = csvParserPrice.transformPriceData(priceSample())

    expect(result.value.centAmount).toBe(4200)
  })
})

describe('CsvParserPrice::transformCustomData', () => {
  test('should process object and build valid price object', () => {
    return new Promise((done) => {
      const csvParserPrice = new CsvParserPrice({ apiConfig, logger })

      sinon
        .stub(csvParserPrice, 'getCustomTypeDefinition')
        .returns(Promise.resolve(customTypeSample))

      csvParserPrice.transformCustomData(priceSample(), 2).then((result) => {
        expect(result.custom).toEqual({
          type: { id: '53 45 4c 57 59 4e 2e' },
          fields: {
            booleantype: true,
            localizedstringtype: { de: 'Merkel', nl: 'Selwyn' },
            moneytype: { centAmount: 1200, currencyCode: 'EUR' },
            numbertype: 12,
            settype: [1, 2, 3, 5],
            stringtype: 'nac',
          },
        })
        done()
      })
    })
  })

  test('should return input when there is no price.customType', () => {
    return new Promise((done) => {
      const csvParserPrice = new CsvParserPrice({ apiConfig, logger })

      csvParserPrice
        .transformCustomData({ a: true })
        .then((result) => {
          expect(result).toEqual({ a: true })
          done()
        })
        .catch(done.fail)
    })
  })
})

describe('CsvParserPrice::renameHeaders', () => {
  test(`should rename customerGroup.groupName to customerGroup.id
    for compatibility with product price import module`, () => {
    const csvParserPrice = new CsvParserPrice({ apiConfig, logger })
    const modifiedPriceSample = priceSample()
    delete modifiedPriceSample.customType
    delete modifiedPriceSample.customField
    delete modifiedPriceSample.value

    const result = csvParserPrice.renameHeaders(modifiedPriceSample)

    expect(result.customerGroup.groupName).toBeFalsy()
    expect(result.customerGroup.id).toBe('customer-group')
  })

  test(`should rename channel.key to channel.id
      for compatibility with product price import module`, () => {
    const csvParserPrice = new CsvParserPrice({ apiConfig, logger })
    const modifiedPriceSample = priceSample()
    delete modifiedPriceSample.customType
    delete modifiedPriceSample.customField
    delete modifiedPriceSample.value

    const result = csvParserPrice.renameHeaders(modifiedPriceSample)

    expect(result.channel.key).toBeFalsy()
    expect(result.channel.id).toBe('my-channel')
  })

  test(`should return input if no price.customerGroup
      or price.customerGroup.groupName and price.channel or
      price.channel.key`, () => {
    const csvParserPrice = new CsvParserPrice({ apiConfig, logger })

    const result = csvParserPrice.renameHeaders({ foo: 'bar' })
    expect(result).toEqual({ foo: 'bar' })
  })
})

describe('CsvParserPrice::processCustomField', () => {
  test('should build custom object', () => {
    return new Promise((done) => {
      const csvParserPrice = new CsvParserPrice({ apiConfig, logger })

      sinon
        .stub(csvParserPrice, 'getCustomTypeDefinition')
        .returns(Promise.resolve(customTypeSample))

      csvParserPrice.processCustomField(priceSample(), 2).then((result) => {
        expect(result.fields).toBeTruthy()
        expect(result.type).toBeTruthy()
        const expected = {
          type: {
            id: '53 45 4c 57 59 4e 2e',
          },
          fields: {
            booleantype: true,
            localizedstringtype: { de: 'Merkel', nl: 'Selwyn' },
            moneytype: { centAmount: 1200, currencyCode: 'EUR' },
            numbertype: 12,
            settype: [1, 2, 3, 5],
            stringtype: 'nac',
          },
        }
        expect(result).toEqual(expected)
        done()
      })
    })
  })

  test('should build report errors on data', () => {
    return new Promise((done) => {
      const csvParserPrice = new CsvParserPrice({ apiConfig, logger })
      const modifiedPriceSample = priceSample()

      modifiedPriceSample.customField.settype = "1,'2',3,4"
      sinon
        .stub(csvParserPrice, 'getCustomTypeDefinition')
        .returns(Promise.resolve(customTypeSample))

      csvParserPrice
        .processCustomField(modifiedPriceSample, 2)
        .then((result) => {
          done.fail()
          expect(result).toBeFalsy()
          done()
        })
        .catch((error) => {
          expect(error).toHaveLength(1)
          expect(error[0].message).toBe(
            "[row 2: liqui 63 69 ty] - The number '2' isn't valid"
          )
          done()
        })
    })
  })
})

describe('CsvParserPrice::getCustomTypeDefinition', () => {
  test('should reject when no type with given key exists', () => {
    return new Promise((done) => {
      const csvParserPrice = new CsvParserPrice({ apiConfig, logger })

      sinon.stub(csvParserPrice.client, 'execute').returns(
        Promise.resolve({
          body: { count: 0 },
        })
      )

      csvParserPrice
        .getCustomTypeDefinition('(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧')
        .then(done.fail)
        .catch((error) => {
          expect(error.message).toBe("No type with key '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧' found")
          done()
        })
    })
  })

  test('should resolve to type definition when given key exists', () => {
    return new Promise((done) => {
      const options = { apiConfig, logger, accessToken: 'testingToken' }
      const csvParserPrice = new CsvParserPrice(options)

      const stub = sinon.stub(csvParserPrice.client, 'execute').returns(
        Promise.resolve({
          body: {
            count: 1,
            results: ['Welcome'],
          },
        })
      )

      csvParserPrice
        .getCustomTypeDefinition()
        .then((result) => {
          expect(stub.args[0][0].headers.Authorization).toBe(
            `Bearer ${options.accessToken}`
          )
          expect(result).toBe('Welcome')
          done()
        })
        .catch(() => {
          done.fail("Type doesn't exist")
        })
    })
  })
})

describe('CsvParserPrice::deleteMovedData', () => {
  test('should delete leftover data if present', () => {
    const csvParserPrice = new CsvParserPrice({ apiConfig, logger })

    const result = csvParserPrice.deleteMovedData(priceSample())

    expect(result.customField).toBeFalsy()
    expect(result.customType).toBeFalsy()
  })

  test('should return input if leftover data absent', () => {
    const csvParserPrice = new CsvParserPrice({ apiConfig, logger })

    const result = csvParserPrice.deleteMovedData({ foo: 'bar' })
    expect(result).toEqual({ foo: 'bar' })
  })
})
