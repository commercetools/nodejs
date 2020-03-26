import streamtest from 'streamtest'
import * as csv from 'fast-csv'
import PriceExporter from '../src/main'
import sampleProduct from './helpers/sampleProduct.json'
import expectedPrices from './helpers/expectedPrices.json'

jest.mock('fast-csv', () => ({
  format: jest.fn(() => ({ pipe: jest.fn() })),
}))

describe('PriceExporter', () => {
  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    verbose: () => {},
  }

  let priceExporter
  beforeEach(() => {
    priceExporter = new PriceExporter(
      {
        apiConfig: {
          projectKey: 'project-key',
        },
        accessToken: 'myAccessToken',
        csvHeaders: ['sku', 'value'],
      },
      logger
    )
  })

  describe('constructor', () => {
    test('should be a function', () => {
      expect(typeof PriceExporter).toBe('function')
    })

    test('should throw if no `apiConfig` in `options` parameter', () => {
      expect(() => new PriceExporter({ foo: 'bar' })).toThrow(
        /The constructor must be passed an `apiConfig` object/
      )
    })

    test('throw if no `headers` array in options and export is csv', () => {
      expect(
        () =>
          new PriceExporter({
            apiConfig: 'config',
            exportFormat: 'csv',
          })
      ).toThrow(
        /The constructor must be passed a `csvHeaders` array for CSV export/
      )
    })

    test('not throw if no `headers` array in options and export is json', () => {
      expect(() => new PriceExporter({ apiConfig: 'config' })).not.toThrow()
    })

    test('should set default properties', () => {
      expect(priceExporter.apiConfig).toEqual({
        projectKey: 'project-key',
      })
      expect(priceExporter.logger).toEqual(logger)
      expect(priceExporter.config.delimiter).toBe(',')
      expect(priceExporter.config.exportFormat).toBe('json')
      expect(priceExporter.config.staged).toBe(false)
    })
  })

  describe('::run', () => {
    test('should call `_processStream` with outputStream if json', async () => {
      jest.mock('fast-csv', () => ({
        format: jest.fn(() => ({ pipe: jest.fn() })),
      }))
      priceExporter._getProducts = jest.fn(() => Promise.resolve())
      const outputStream = streamtest.v2.toText(() => {})
      priceExporter.config.exportFormat = 'json'
      await priceExporter.run(outputStream)
      expect(priceExporter._getProducts).toHaveBeenCalled()
      expect(priceExporter._getProducts.mock.calls[0][0]).toEqual(outputStream)
      expect(csv.format).not.toHaveBeenCalled()
    })

    test('should call `_processStream` with outputStream if csv', async () => {
      priceExporter._getProducts = jest.fn(() => Promise.resolve())
      const outputStream = streamtest.v2.toText(() => {})

      priceExporter.config.exportFormat = 'csv'
      await priceExporter.run(outputStream)
      expect(priceExporter._getProducts).toHaveBeenCalled()
      expect(priceExporter._getProducts.mock.calls[0][0]).toEqual(outputStream)
      expect(csv.format).toHaveBeenCalled()
    })
  })

  describe('::_getProducts', () => {
    test('should fetch products using `process` method', () => {
      const sampleResult = {
        body: {
          results: [],
        },
      }
      // eslint-disable-next-line jest/valid-expect-in-promise
      const processMock = jest.fn((request, processFn) =>
        processFn(sampleResult).then(() => Promise.resolve())
      )
      priceExporter.client.process = processMock
      const outputStream = { emit: jest.fn() }
      priceExporter._getProducts(outputStream)
      expect(processMock).toHaveBeenCalledTimes(1)
      expect(processMock.mock.calls[0][0]).toEqual({
        uri: '/project-key/product-projections?staged=false',
        method: 'GET',
        headers: { Authorization: 'Bearer myAccessToken' },
      })
    })

    test('should close stream after writing data', async () => {
      priceExporter.client.process = jest.fn(() => Promise.resolve())
      const outputStream = { emit: jest.fn() }
      const pipeStream = { end: jest.fn() }
      await priceExporter._getProducts(outputStream, pipeStream)

      expect(pipeStream.end).toHaveBeenCalled()
    })

    test('should emit `error` on output stream if error occurs', () => {
      return new Promise((done) => {
        const spy = jest
          .spyOn(priceExporter.client, 'process')
          .mockImplementation(() => Promise.reject(new Error('error occured')))

        const outputStream = streamtest.v2.toText((error, result) => {
          expect(error.message).toBe('error occured')
          expect(result).toBeUndefined()
          spy.mockRestore()
          done()
        })
        priceExporter._getProducts(outputStream)
      })
    })
  })

  describe('::_writePrices', () => {
    const sample = [
      {
        sku: 'my-variant-sku',
        prices: [
          {
            value: {
              centAmount: 16125,
            },
          },
          {
            value: {
              centAmount: 4000,
            },
          },
        ],
      },
    ]

    test('should write json output once for each sku to stream', () => {
      return new Promise((done) => {
        const pipeStream = { write: jest.fn(() => done()) }
        priceExporter._writePrices(sample, pipeStream)

        expect(pipeStream.write).toHaveBeenCalledTimes(1)
        expect(pipeStream.write).toHaveBeenCalledWith(sample[0])
      })
    })

    test('should flatten csv output and write to stream', () => {
      return new Promise((done) => {
        const pipeStream = { write: jest.fn(() => done()) }
        const firstExpected = { 'value.centAmount': 16125 }
        const secondExpected = { 'value.centAmount': 4000 }
        priceExporter.config.exportFormat = 'csv'
        priceExporter._writePrices(sample, pipeStream)

        expect(pipeStream.write).toHaveBeenCalledTimes(2)
        expect(pipeStream.write).toHaveBeenCalledWith(firstExpected)
        expect(pipeStream.write).toHaveBeenCalledWith(secondExpected)
      })
    })
  })

  describe('::_resolveReferences', () => {
    test('returns array of prices with resolved references', async () => {
      const resolvedChannel = { channel: { key: 'resolved-channel-key' } }
      const resolvedCustGroup = {
        customerGroup: { groupName: 'resolved-group-name' },
      }
      const resolvedCustomType = {
        customType: { key: 'resolved-custom-type-key' },
        customField: { foo: 'bar' },
      }
      const sample = [
        {
          sku: 'my-sku-1',
          prices: [
            {
              channel: { id: 'unresolved-channel-id-1' },
            },
            {
              customerGroup: { id: 'unresolved-customer-group-id-1' },
            },
          ],
        },
        {
          sku: 'my-sku-2',
          prices: [
            {
              customerGroup: { id: 'unresolved-customer-group-id-1' },
              channel: { id: 'unresolved-channel-id-1' },
              custom: {
                type: { id: 'some-custom-type-id' },
                fields: { foo: 'bar' },
              },
            },
          ],
        },
      ]
      priceExporter._resolveChannel = jest.fn((price) =>
        price.channel ? resolvedChannel : {}
      )
      priceExporter._resolveCustomerGroup = jest.fn((price) =>
        price.customerGroup ? resolvedCustGroup : {}
      )
      priceExporter._resolveCustomType = jest.fn((price) =>
        price.custom ? resolvedCustomType : {}
      )
      const expected = [
        {
          sku: 'my-sku-1',
          prices: [
            {
              ...resolvedChannel,
            },
            {
              ...resolvedCustGroup,
            },
          ],
        },
        {
          sku: 'my-sku-2',
          prices: [
            {
              ...resolvedCustGroup,
              ...resolvedChannel,
              ...resolvedCustomType,
              custom: {
                type: { id: 'some-custom-type-id' },
                fields: { foo: 'bar' },
              },
            },
          ],
        },
      ]
      const prices = await priceExporter._resolveReferences(sample)
      expect(prices).toEqual(expected)
    })
  })

  describe('::_resolveChannel', () => {
    test('should return empty object if no `channel` reference', () => {
      const samplePrice = {
        value: { centAmount: 4300 },
      }
      expect(priceExporter._resolveChannel(samplePrice)).toEqual({})
    })

    test('should return channel key if CSV format', async () => {
      priceExporter.config.exportFormat = 'csv'
      priceExporter.fetchReferences = jest.fn(() =>
        Promise.resolve({ body: { key: 'my-resolved-key' } })
      )
      const samplePrice = {
        value: { centAmount: 4300 },
        channel: { id: 'my-channel-id' },
      }
      const expected = { channel: { key: 'my-resolved-key' } }

      const actual = await priceExporter._resolveChannel(samplePrice)
      expect(actual).toEqual(expected)
    })

    test('should return channel key in `id` if JSON format', async () => {
      priceExporter.fetchReferences = jest.fn(() =>
        Promise.resolve({ body: { key: 'my-resolved-key' } })
      )
      const samplePrice = {
        value: { centAmount: 4300 },
        channel: { id: 'my-channel-id' },
      }
      const expected = { channel: { id: 'my-resolved-key' } }

      const actual = await priceExporter._resolveChannel(samplePrice)
      expect(actual).toEqual(expected)
    })
  })

  describe('::_resolveCustomerGroup', () => {
    test('should return empty object if no `customerGroup` reference', () => {
      const samplePrice = {
        value: { centAmount: 4300 },
      }
      expect(priceExporter._resolveCustomerGroup(samplePrice)).toEqual({})
    })

    test('should return customerGroup groupName if CSV format', async () => {
      priceExporter.config.exportFormat = 'csv'
      priceExporter.fetchReferences = jest.fn(() =>
        Promise.resolve({ body: { name: 'my-resolved-name' } })
      )
      const samplePrice = {
        value: { centAmount: 4300 },
        customerGroup: { id: 'my-customer-group-id' },
      }
      const expected = { customerGroup: { groupName: 'my-resolved-name' } }

      const actual = await priceExporter._resolveCustomerGroup(samplePrice)
      expect(actual).toEqual(expected)
    })

    test('should return customerGroup name in `id` if JSON format', async () => {
      priceExporter.fetchReferences = jest.fn(() =>
        Promise.resolve({ body: { name: 'my-resolved-name' } })
      )
      const samplePrice = {
        value: { centAmount: 4300 },
        customerGroup: { id: 'my-customer-group-id' },
      }
      const expected = { customerGroup: { id: 'my-resolved-name' } }

      const actual = await priceExporter._resolveCustomerGroup(samplePrice)
      expect(actual).toEqual(expected)
    })
  })

  describe('::_resolveCustomType', () => {
    test('should return empty object if no `custom` reference', () => {
      const samplePrice = {
        value: { centAmount: 4300 },
      }
      expect(priceExporter._resolveCustomType(samplePrice)).toEqual({})
    })

    test('return customType `key` and `customField` if CSV format', async () => {
      priceExporter.config.exportFormat = 'csv'
      priceExporter.fetchReferences = jest.fn(() =>
        Promise.resolve({ body: { key: 'my-custom-type-key' } })
      )
      const samplePrice = {
        value: { centAmount: 4300 },
        custom: {
          type: { id: 'some-custom-type-id' },
          fields: { foo: 'bar' },
        },
      }
      const expected = {
        customType: 'my-custom-type-key',
        customField: samplePrice.custom.fields,
      }

      const actual = await priceExporter._resolveCustomType(samplePrice)
      expect(actual).toEqual(expected)
    })

    test('should return custom without `typeId` if JSON format', async () => {
      const samplePrice = {
        value: { centAmount: 4300 },
        custom: {
          type: { id: 'some-custom-type-id', typeId: 'custom-type' },
          fields: { foo: 'bar' },
        },
      }
      const expected = {
        custom: {
          type: { id: 'some-custom-type-id' },
          fields: { foo: 'bar' },
        },
      }
      const actual = await priceExporter._resolveCustomType(samplePrice)
      expect(actual).toEqual(expected)
    })
  })

  describe('::_getPrices', () => {
    test('extracts prices from array of products and groups by sku', () => {
      const expected = expectedPrices
      const actual = PriceExporter._getPrices(sampleProduct)
      expect(actual).toEqual(expected)
    })
  })

  describe('::fetchReferences', () => {
    test('should fetch reference from API from url', () => {
      priceExporter.client.execute = jest.fn()
      const uri = 'dummy-uri'
      const expectedRequest = {
        uri,
        method: 'GET',
        headers: { Authorization: 'Bearer myAccessToken' },
      }

      priceExporter.fetchReferences(uri)
      expect(priceExporter.client.execute).toHaveBeenCalled()
      expect(priceExporter.client.execute).toHaveBeenCalledWith(expectedRequest)
    })

    test('should fetch only once for multiple calls with same parameter', () => {
      priceExporter.client.execute = jest.fn()
      const uri = 'dummy-uri-2'
      const expectedRequest = {
        uri,
        method: 'GET',
        headers: { Authorization: 'Bearer myAccessToken' },
      }

      priceExporter.fetchReferences(uri)
      priceExporter.fetchReferences(uri)
      expect(priceExporter.client.execute).toHaveBeenCalledTimes(1)
      expect(priceExporter.client.execute).toHaveBeenCalledWith(expectedRequest)
    })
  })
})
