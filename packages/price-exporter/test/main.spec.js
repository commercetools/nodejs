import streamtest from 'streamtest'
import { stripIndent } from 'common-tags'
import PriceExporter from '../src/main'

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

    it('should set default properties', () => {
      expect(priceExporter.apiConfig).toEqual({
        projectKey: 'project-key',
      })
      expect(priceExporter.logger).toEqual(logger)
      expect(priceExporter.config.delimiter).toBe(',')
      expect(priceExporter.config.multiValueDelimiter).toBe(';')
    })
  })

  describe('::run', () => {
    let processMock
    const sampleResult = {
      body: {
        results: [],
      },
    }
    beforeEach(() => {
      processMock = jest.fn((request, processFn) => (
        processFn(sampleResult)
          .then(() => Promise.resolve(['foo', 'bar']))
      ))
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

      priceExporter.run(outputStream)
    })

    it('should fetch discount codes using `process` method', async () => {
      priceExporter.client.process = processMock
      const outputStream = streamtest['v2'].toText(() => {})

      await priceExporter.run(outputStream)
      expect(processMock).toHaveBeenCalledTimes(1)
      expect(processMock.mock.calls[0][0])
        .toEqual({
          uri: '/project-key/product-projections?staged=false',
          method: 'GET',
          headers: {
            Authorization: 'Bearer myAccessToken',
          },
        })
    })
  })

  describe('::_handlePrices', () => {
    it(
      'should resolve price data and not resolve price references if json',
      async () => {
        const sample = ['price1', 'price2']
        priceExporter.config.exportFormat = 'json'
        priceExporter._preparePrices = jest.fn()

        const actual = await priceExporter._handlePrices(sample)
        expect(actual).toEqual(['price1', 'price2'])
        expect(priceExporter._preparePrices).not.toHaveBeenCalled()
      },
    )

    it('should resolve price data and resolve references if csv', async () => {
      const sample = ['price1', 'price2']
      const expected = [
        'prepared-price-1',
        'prepared-price-2',
      ]
      priceExporter.config.exportFormat = 'csv'
      priceExporter._preparePrices = jest.fn()
      priceExporter._preparePrices.mockReturnValue(expected)

      const actual = await priceExporter._handlePrices(sample)
      expect(actual).toEqual(expected)
      expect(priceExporter._preparePrices).toHaveBeenCalled()
    })
  })

  describe('::_handleOutput', () => {
    it('should write `JSON` output to stream', (done) => {
      priceExporter.config.exportFormat = 'json'
      const sample = ['price-1', 'price-2', 'price-3', 'price-4']
      const expected = {
        prices: ['price-1', 'price-2', 'price-3', 'price-4'],
      }

      const outputStream = streamtest['v2'].toText((error, result) => {
        expect(error).toBeFalsy()
        expect(result).toEqual(JSON.stringify(expected))
        done()
      })

      priceExporter._handleOutput(sample, outputStream)
    })

    it('should write `CSV` output to stream', (done) => {
      priceExporter.config.exportFormat = 'csv'
      priceExporter.config.delimiter = ','
      const sample = [
        {
          name: 'price-1',
          value: 500,
        },
        {
          name: 'price-2',
          value: 700,
        },
      ]
      const expected = stripIndent`
        name,value
        price-1,500
        price-2,700
      `

      const outputStream = streamtest['v2'].toText((error, result) => {
        expect(error).toBeFalsy()
        expect(result).toEqual(expected)
        done()
      })

      priceExporter._handleOutput(sample, outputStream)
    })
  })

  describe('::_preparePrices', () => {
    const sample = [
      {
        prices: ['price-1', 'price-2'],
      },
      {
        prices: ['price-6', 'price-7'],
      },
    ]
    it('call `resolveReferences` on each price for each ref', async () => {
      priceExporter._resolveReferences = jest.fn((string, price) => (
        Promise.resolve(price)
      ))

      await priceExporter._preparePrices(sample)
      expect(priceExporter._resolveReferences).toHaveBeenCalledTimes(12)
    })

    it('should flatten arrays of nested price objects', async () => {
      priceExporter._resolveReferences = jest.fn((string, price) => (
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
      const actual = await priceExporter._preparePrices(sample)
      expect(actual).toEqual(expected)
    })
  })

  describe('::_resolveReferences', () => {
    it('not modify the object if the `type` key does not exist', async () => {
      const price = { foo: 'bar' }
      const actual = await priceExporter._resolveReferences('type', price)
      expect(actual).toEqual({ foo: 'bar' })
    })

    describe('::_resolveReferences: `custom`', () => {
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

        const actual = await priceExporter._resolveReferences('custom', price)
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

        const actual = await priceExporter._resolveReferences('custom', price)
        expect(priceExporter.client.execute).toHaveBeenCalled()
        expect(priceExporter._cache['custom-type-id']).toBe('myCustomType2')
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveReferences: `channel`', () => {
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

        const actual = await priceExporter._resolveReferences('channel', price)
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

        const actual = await priceExporter._resolveReferences('channel', price)
        expect(priceExporter.client.execute).toHaveBeenCalled()
        expect(priceExporter._cache['channel-id']).toBe('myChannelKey2')
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveReferences: `customerGroup`', () => {
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

        const actual = await priceExporter._resolveReferences(
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

        const actual = await priceExporter._resolveReferences(
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
})
