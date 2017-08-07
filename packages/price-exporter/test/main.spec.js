import streamtest from 'streamtest'
import csv from 'fast-csv'
import lodash from 'lodash'
import PriceExporter from '../src/main'
import sampleProduct from './helpers/sampleProduct.json'
import expectedPrices from './helpers/expectedPrices.json'

jest.mock('fast-csv', () => ({
  createWriteStream: jest.fn(() => ({ pipe: jest.fn() })),
}))

jest.mock('lodash', () => ({
  flattenDeep: jest.fn(data => data),
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
    priceExporter = new PriceExporter({
      apiConfig: {
        projectKey: 'project-key',
      },
      accessToken: 'myAccessToken',
      csvHeaders: ['sku', 'value'],
    }, logger)
  })

  describe('constructor', () => {
    it('should be a function', () => {
      expect(typeof PriceExporter).toBe('function')
    })

    it('should throw if no `apiConfig` in `options` parameter', () => {
      expect(() => new PriceExporter({ foo: 'bar' })).toThrowError(
        /The constructor must be passed an `apiConfig` object/,
      )
    })

    it('throw if no `headers` array in options and export is csv', () => {
      expect(() => new PriceExporter({
        apiConfig: 'config',
        exportFormat: 'csv',
      })).toThrowError(
        /The constructor must be passed a `csvHeaders` array for CSV export/,
      )
    })

    it('not throw if no `headers` array in options and export is json', () => {
      expect(() => new PriceExporter({ apiConfig: 'config' })).not.toThrow()
    })

    it('should set default properties', () => {
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
    it('should call `_processStream` with outputStream if json', async () => {
      jest.mock('fast-csv', () => ({
        createWriteStream: jest.fn(() => ({ pipe: jest.fn() })),
      }))
      priceExporter._getProducts = jest.fn(() => Promise.resolve())
      const outputStream = streamtest['v2'].toText(() => {})
      priceExporter.config.exportFormat = 'json'
      await priceExporter.run(outputStream)
      expect(priceExporter._getProducts).toBeCalled()
      expect(priceExporter._getProducts.mock.calls[0][0])
        .toEqual(outputStream)
      expect(csv.createWriteStream).not.toBeCalled()
    })

    it('should call `_processStream` with outputStream if csv', async () => {
      priceExporter._getProducts = jest.fn(() => Promise.resolve())
      const outputStream = streamtest['v2'].toText(() => {})

      priceExporter.config.exportFormat = 'csv'
      await priceExporter.run(outputStream)
      expect(priceExporter._getProducts).toBeCalled()
      expect(priceExporter._getProducts.mock.calls[0][0])
        .toEqual(outputStream)
      expect(csv.createWriteStream).toBeCalled()
    })
  })

  describe('::_writePrices', () => {
    it('should write json output to stream', (done) => {
      const pipeStream = { write: jest.fn(() => done()) }
      const sample = ['price-1', 'price-2']
      priceExporter._writePrices(sample, pipeStream)

      expect(lodash.flattenDeep).not.toBeCalled()
      expect(pipeStream.write).toHaveBeenCalledTimes(2)
      expect(pipeStream.write.mock.calls[0][0]).toBe('price-1')
      expect(pipeStream.write.mock.calls[1][0]).toBe('price-2')
    })

    it('should flatten csv output and write to stream', (done) => {
      const pipeStream = { write: jest.fn(() => done()) }
      const sample = ['price-1', 'price-2']
      priceExporter.config.exportFormat = 'csv'
      priceExporter._writePrices(sample, pipeStream)

      expect(lodash.flattenDeep).toBeCalled()
      expect(pipeStream.write).toHaveBeenCalledTimes(2)
      expect(pipeStream.write.mock.calls[0][0]).toBe('price-1')
      expect(pipeStream.write.mock.calls[1][0]).toBe('price-2')
    })
  })

  describe('::_getProducts', () => {
    it('should fetch products using `process` method', () => {
      const sampleResult = {
        body: {
          results: [],
        },
      }
      const processMock = jest.fn((request, processFn) => (
        processFn(sampleResult).then(() => Promise.resolve())
      ))
      priceExporter.client.process = processMock
      const outputStream = { emit: jest.fn() }
      priceExporter._getProducts(outputStream)
      expect(processMock).toHaveBeenCalledTimes(1)
      expect(processMock.mock.calls[0][0])
      .toEqual({
        uri: '/project-key/product-projections?staged=false',
        method: 'GET',
        headers: { Authorization: 'Bearer myAccessToken' },
      })
    })

    it('should close stream after writing data', async () => {
      priceExporter.client.process = jest.fn(() => Promise.resolve())
      const outputStream = { emit: jest.fn() }
      const pipeStream = { end: jest.fn() }
      await priceExporter._getProducts(outputStream, pipeStream)

      expect(pipeStream.end).toBeCalled()
    })

    it('should emit `error` on output stream if error occurs', (done) => {
      const spy = jest
        .spyOn(priceExporter.client, 'process')
        .mockImplementation(() => Promise.reject(new Error('error occured')))

      const outputStream = streamtest['v2'].toText((error, result) => {
        expect(error.message).toBe('error occured')
        expect(result).toBeUndefined()
        spy.mockRestore()
        done()
      })
      priceExporter._getProducts(outputStream)
    })
  })

  describe('::_flattenPrices', () => {
    it(
      'should resolve price data and not resolve price references if json',
      async () => {
        PriceExporter._flattenPricesArray = jest.fn(data => data)
        const sample = ['price1', 'price2']
        priceExporter.config.exportFormat = 'json'
        priceExporter._resolveReferences = jest.fn()

        const actual = await priceExporter._flattenPrices(sample)
        expect(actual).toEqual(['price1', 'price2'])
        expect(priceExporter._resolveReferences).not.toHaveBeenCalled()
      },
    )

    it('should resolve price data and resolve references if csv', async () => {
      const sample = ['price1', 'price2']
      const expected = [
        'prepared-price-1',
        'prepared-price-2',
      ]
      priceExporter.config.exportFormat = 'csv'
      priceExporter._resolveReferences = jest.fn()
      priceExporter._resolveReferences.mockReturnValue(expected)

      const actual = await priceExporter._flattenPrices(sample)
      expect(actual).toEqual(expected)
      expect(priceExporter._resolveReferences).toHaveBeenCalled()
    })
  })

  describe('::_resolveReferences', () => {
    const sample = [
      {
        prices: ['price-1', 'price-2'],
      },
      {
        prices: ['price-6', 'price-7'],
      },
    ]
    it('call `resolveReferences` on each price for each ref', async () => {
      priceExporter._resolveEachReferenceType = jest.fn((string, price) => (
        Promise.resolve(price)
      ))

      await priceExporter._resolveReferences(sample)
      expect(priceExporter._resolveEachReferenceType).toHaveBeenCalledTimes(12)
    })

    it('should flatten arrays of nested price objects', async () => {
      priceExporter._resolveEachReferenceType = jest.fn((string, price) => (
        Promise.resolve({ price }) // Nests by one layer on each return
      ))
      const expected = [[
        {
          'price.price.price': 'price-1',
        }, {
          'price.price.price': 'price-2',
        }], [{
          'price.price.price': 'price-6',
        }, {
          'price.price.price': 'price-7',
        },
        ]]
      const actual = await priceExporter._resolveReferences(sample)
      expect(actual).toEqual(expected)
    })
  })

  describe('::_resolveEachReferenceType', () => {
    it('not modify the object if the `type` key does not exist', async () => {
      const price = { foo: 'bar' }
      const actual = await priceExporter
        ._resolveEachReferenceType('type', price)
      expect(actual).toEqual({ foo: 'bar' })
    })

    describe('::_resolveEachReferenceType: `custom`', () => {
      let price
      beforeEach(() => {
        price = {
          foo: 'bar',
          custom: {
            type: {
              typeId: 'The custom type name',
              id: 'custom-type-id',
            },
            fields: {
              name: 'Will',
            },
          },
        }
      })

      it('should get data from cache if present', async () => {
        priceExporter._cache['custom-type-id'] = 'myCustomType'
        priceExporter.client.execute = jest.fn()
        const expected = {
          foo: 'bar',
          customField: {
            name: 'Will',
          },
          customType: 'myCustomType',
        }

        const actual = await priceExporter
          ._resolveEachReferenceType('custom', price)
        expect(priceExporter.client.execute).not.toHaveBeenCalled()
        expect(actual).toEqual(expected)
      })

      it('get data from API if not in cache and save to cache', async () => {
        const customType = {
          body: {
            key: 'myCustomType2',
          },
        }
        priceExporter.client.execute = jest.fn(() => (
          Promise.resolve(customType)
        ))
        const expected = {
          foo: 'bar',
          customField: {
            name: 'Will',
          },
          customType: 'myCustomType2',
        }

        const actual = await priceExporter
          ._resolveEachReferenceType('custom', price)
        expect(priceExporter.client.execute).toHaveBeenCalled()
        expect(priceExporter._cache['custom-type-id']).toBe('myCustomType2')
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveEachReferenceType: `channel`', () => {
      let price
      beforeEach(() => {
        price = {
          foo: 'bar',
          channel: {
            typeId: 'channel',
            id: 'channel-id',
          },
        }
      })

      it('should get data from cache if present', async () => {
        priceExporter._cache['channel-id'] = 'myChannelKey'
        priceExporter.client.execute = jest.fn()
        const expected = {
          foo: 'bar',
          channel: {
            key: 'myChannelKey',
          },
        }

        const actual = await priceExporter
          ._resolveEachReferenceType('channel', price)
        expect(priceExporter.client.execute).not.toHaveBeenCalled()
        expect(actual).toEqual(expected)
      })

      it('get data from API if not in cache and save to cache', async () => {
        const myChannel = {
          body: {
            key: 'myChannelKey2',
          },
        }
        priceExporter.client.execute = jest.fn(() => (
          Promise.resolve(myChannel)
        ))
        const expected = {
          foo: 'bar',
          channel: {
            key: 'myChannelKey2',
          },
        }

        const actual = await priceExporter
          ._resolveEachReferenceType('channel', price)
        expect(priceExporter.client.execute).toHaveBeenCalled()
        expect(priceExporter._cache['channel-id']).toBe('myChannelKey2')
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveEachReferenceType: `customerGroup`', () => {
      let price
      beforeEach(() => {
        price = {
          foo: 'bar',
          customerGroup: {
            typeId: 'customer-group',
            id: 'customer-group-id',
          },
        }
      })

      it('should get data from cache if present', async () => {
        priceExporter._cache['customer-group-id'] = 'myCustomerGroupName'
        priceExporter.client.execute = jest.fn()
        const expected = {
          foo: 'bar',
          customerGroup: {
            groupName: 'myCustomerGroupName',
          },
        }

        const actual = await priceExporter._resolveEachReferenceType(
          'customerGroup',
          price,
        )
        expect(priceExporter.client.execute).not.toHaveBeenCalled()
        expect(actual).toEqual(expected)
      })

      it('get data from API if not in cache and save to cache', async () => {
        const customType = {
          body: {
            name: 'myCustomerGroupName2',
          },
        }
        priceExporter.client.execute = jest.fn(() => (
          Promise.resolve(customType)
        ))
        const expected = {
          foo: 'bar',
          customerGroup: {
            groupName: 'myCustomerGroupName2',
          },
        }

        const actual = await priceExporter._resolveEachReferenceType(
          'customerGroup',
          price,
        )
        expect(priceExporter.client.execute).toHaveBeenCalled()
        expect(priceExporter._cache['customer-group-id'])
          .toBe('myCustomerGroupName2')
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('::_buildRequest', () => {
    it('should build requests for `references` by id', () => {
      const sample = {
        channel: { id: 'channel-id' },
        customerGroup: { id: 'customer-group-id' },
        custom: {
          type: { id: 'my-custom-id' },
        },
      }

      expect(priceExporter._buildRequest('channel', sample).uri)
        .toBe('/project-key/channels/channel-id')

      expect(priceExporter._buildRequest('customerGroup', sample).uri)
        .toBe('/project-key/customer-groups/customer-group-id')

      expect(priceExporter._buildRequest('custom', sample).uri)
        .toBe('/project-key/types/my-custom-id')
    })

    it('should build request to fetch products', () => {
      priceExporter.config.predicate = 'predicate'

      expect(priceExporter._buildRequest('productProjections'))
        .toEqual({
          uri: '/project-key/product-projections?staged=false&where=predicate',
          method: 'GET',
          headers: {
            Authorization: 'Bearer myAccessToken',
          },
        })
    })
  })

  describe('_getPrices', () => {
    it('extracts prices from product and groups by sku', () => {
      const expected = expectedPrices
      const actual = PriceExporter._getPrices(sampleProduct)
      expect(actual).toEqual(expected)
    })
  })
})
