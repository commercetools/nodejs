import streamtest from 'streamtest'
import { stripIndent } from 'common-tags'
import StockExporter from '../src/main'

describe('StockExporter', () => {
  it('should be defined', () => {
    expect(StockExporter).toBeDefined()
  })
  it('should initialize with defaults', () => {
    const apiConfig = {
      projectKey: 'foo',
    }
    const stockExporter = new StockExporter(null, apiConfig)
    expect(stockExporter.logger).toBeDefined()
    expect(stockExporter.client).toBeDefined()
    expect(stockExporter.exportConfig).toBeDefined()
  })
  let stockExporter
  const logger = {
    error: () => {},
    info: () => {},
    warn: () => {},
    verbose: () => {},
  }
  const apiConfig = {
    projectKey: 'foo',
  }
  beforeEach(() => {
    stockExporter = new StockExporter(logger, apiConfig)
  })
  describe('::_fetchStocks', () => {
    it('should resolve channel key if present', () => {
      const channelKey = 'qw84'
      stockExporter.exportConfig.channelKey = channelKey
      stockExporter._resolveChannelKey = jest.fn(() => Promise.resolve())
      stockExporter._makeRequest = jest.fn(() => Promise.resolve())
      return stockExporter._fetchStocks().then(() => {
        expect(stockExporter._resolveChannelKey).toHaveBeenCalledTimes(1)
        expect(stockExporter._makeRequest).toHaveBeenCalledTimes(1)
        expect(stockExporter._resolveChannelKey.mock.calls[0][0])
          .toEqual(channelKey)
      })
    })

    it('should not resolve channel key if not present', () => {
      stockExporter._resolveChannelKey = jest.fn(() => Promise.resolve())
      stockExporter._makeRequest = jest.fn(() => Promise.resolve())
      return stockExporter._fetchStocks().then(() => {
        expect(stockExporter._resolveChannelKey).toHaveBeenCalledTimes(0)
        expect(stockExporter._makeRequest).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('::_makeRequest', () => {
    let processMock
    beforeEach(() => {
      processMock = jest.fn((request, processFn) => {
        const sampleResult = {
          body: {
            results: [],
          },
        }
        return processFn(sampleResult).then(() => Promise.resolve())
      })
      jest.spyOn(StockExporter, '_writeEachStock', jest.fn)
    })
    afterEach(() => {
      StockExporter._writeEachStock.mockRestore()
    })
    it('should fetch stocks using the process method', () => {
      stockExporter.client.process = processMock
      return stockExporter._makeRequest().then(() => {
        expect(processMock).toHaveBeenCalledTimes(1)
        expect(processMock.mock.calls[0][0])
        .toEqual({
          // should expand customfields object and supplyChannel
          uri: '/foo/inventory?expand=custom.type&expand=supplyChannel',
          method: 'GET',
        },
        'first argument is request object',
        )
        expect(StockExporter._writeEachStock).toHaveBeenCalledTimes(1)
      })
    })
    it('should add accessToken to request if present', () => {
      stockExporter.accessToken = '12345'
      stockExporter.client.process = processMock
      return stockExporter._makeRequest().then(() => {
        expect(processMock).toHaveBeenCalledTimes(1)
        expect(processMock.mock.calls[0][0])
          .toEqual({
            uri: '/foo/inventory?expand=custom.type&expand=supplyChannel',
            method: 'GET',
            headers: {
              Authorization: 'Bearer 12345',
            },
          },
          )
        expect(StockExporter._writeEachStock).toHaveBeenCalledTimes(1)
      })
    })
    it('should add channelid and queryString to request if present', () => {
      stockExporter.accessToken = '12345'
      const channelId = '1234567qwertyuxcv'
      stockExporter.exportConfig.queryString = 'descript="lovely"'
      stockExporter.client.process = processMock
      return stockExporter._makeRequest(null, channelId).then(() => {
        expect(processMock).toHaveBeenCalledTimes(1)
        expect(processMock.mock.calls[0][0])
          .toEqual({
            // eslint-disable-next-line max-len
            uri: '/foo/inventory?expand=custom.type&expand=supplyChannel&where=descript%3D%22lovely%22%20and%20supplyChannel(id%3D%221234567qwertyuxcv%22)',
            method: 'GET',
            headers: {
              Authorization: 'Bearer 12345',
            },
          },
          )
        expect(StockExporter._writeEachStock).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('::run', () => {
    beforeEach(() => {})
    it('should fetch stocks and output csv to stream', (done) => {
      stockExporter.exportConfig.format = 'csv'
      const sampleStock = {
        sku: 'hello',
        quantityOnStock: 'me',
        restockableInDays: 4,
      }
      const spy = jest
        .spyOn(stockExporter, '_fetchStocks')
        .mockImplementation((csvStream) => {
          csvStream.write(sampleStock)
          return Promise.resolve()
        })
      const outputStream = streamtest['v2'].toText((error, result) => {
        const expectedResult = stripIndent`
          sku,quantityOnStock,restockableInDays
          hello,me,4
        `
        expect(result).toEqual(expectedResult)
        spy.mockRestore()
        done()
      })

      stockExporter.run(outputStream)
    })

    it('should emit error if it occurs when streaming to csv', (done) => {
      stockExporter.exportConfig.format = 'csv'
      const spy = jest
        .spyOn(stockExporter, '_fetchStocks')
        .mockImplementation(() => Promise.reject(new Error('error occured')))
      const outputStream = streamtest['v2'].toText((error, result) => {
        expect(error.message).toBe('error occured')
        expect(result).toBeUndefined()
        spy.mockRestore()
        done()
      })

      stockExporter.run(outputStream)
    })

    it('should emit error if it occurs when streaming to json', (done) => {
      stockExporter.exportConfig.format = 'json'
      const spy = jest
        .spyOn(stockExporter, '_fetchStocks')
        .mockImplementation(() => Promise.reject(new Error('error occured')))
      const outputStream = streamtest['v2'].toText((error, result) => {
        expect(error.message).toBe('error occured')
        expect(result).toBeUndefined()
        spy.mockRestore()
        done()
      })

      stockExporter.run(outputStream)
    })

    it('should fetch stocks and output json to stream as default', (done) => {
      const sampleStock = {
        sku: 'hello',
        quantityOnStock: 'me',
        restockableInDays: 4,
      }
      const spy = jest
        .spyOn(stockExporter, '_fetchStocks')
        .mockImplementation((csvStream) => {
          csvStream.write(sampleStock)
          return Promise.resolve()
        })
      const outputStream = streamtest['v2'].toText((error, result) => {
        const expectedResult = [{ ...sampleStock }]
        expect(JSON.parse(result)).toEqual(expectedResult)
        spy.mockRestore()
        done()
      })

      stockExporter.run(outputStream)
    })
  })
  describe('::_writeEachStock', () => {
    it('should loop over stocks and write to stream', () => {
      const csvWriteMock = jest.fn()
      const csvStreamMock = {
        write: csvWriteMock,
      }
      StockExporter._writeEachStock(csvStreamMock, [1, 2, 3, 4, 5])
      expect(csvWriteMock).toHaveBeenCalledTimes(5)
    })
  })
  describe('::stockMappings', () => {
    it('should export basic stock object', () => {
      const stock = {
        sku: 'qwert',
        quantityOnStock: 30,
      }
      const expectedResult = { ...stock }
      const result = StockExporter.stockMappings(stock)
      expect(result).toEqual(expectedResult)
    })

    it('should add other fields if present', () => {
      const stock = {
        sku: 'qwert',
        quantityOnStock: 30,
        supplyChannel: {
          obj: {
            key: 'abi',
          },
        },
        restockableInDays: 23,
        expectedDelivery: Date.now(),
      }
      const expectedResult = {
        ...stock,
        supplyChannel: 'abi',
      }
      const result = StockExporter.stockMappings(stock)
      expect(result).toEqual(expectedResult)
    })

    it('should add customFields if present', () => {
      const stock = {
        sku: 'qwert',
        quantityOnStock: 30,
        supplyChannel: {
          obj: {
            key: 'abi',
          },
        },
        restockableInDays: 23,
        expectedDelivery: Date.now(),
        custom: {
          type: {
            obj: {
              key: 'my-type',
            },
          },
          fields: {
            nac: 'foo',
            weg: 'Bearer',
          },
        },
      }
      const expectedResult = {
        ...stock,
        supplyChannel: 'abi',
        customType: 'my-type',
        'custom.nac': 'foo',
        'custom.weg': 'Bearer',
      }
      delete expectedResult.custom // remove unused fields
      const result = StockExporter.stockMappings(stock)
      expect(result).toEqual(expectedResult)
    })
  })
  describe('::resolveChannelKey', () => {
    it('should resolve channel key from the API and return id', () => {
      const channelKey = 'foobar'
      const expectedChannelId = '12345678sdfghj'
      const mockResult = {
        body: {
          results: [{
            id: expectedChannelId,
          }],
        },
      }
      const executeMock = jest.fn(() => Promise.resolve(mockResult))
      stockExporter.client.execute = executeMock
      return stockExporter._resolveChannelKey(channelKey)
        .then((id) => {
          expect(executeMock).toHaveBeenCalled()
          expect(id).toBe(expectedChannelId)
        })
    })

    it('should resolve channel key from the API using token', () => {
      const channelKey = 'foobar'
      const expectedChannelId = '12345678sdfghj'
      const mockResult = {
        body: {
          results: [{
            id: expectedChannelId,
          }],
        },
      }
      const executeMock = jest.fn(() => Promise.resolve(mockResult))
      stockExporter.client.execute = executeMock
      stockExporter.accessToken = '12345'
      return stockExporter._resolveChannelKey(channelKey)
        .then((id) => {
          expect(executeMock.mock.calls[0][0]).toEqual({
            uri: '/foo/channels?where=key%3D%22foobar%22',
            method: 'GET',
            headers: {
              Authorization: 'Bearer 12345',
            },
          })
          expect(executeMock).toHaveBeenCalled()
          expect(id).toBe(expectedChannelId)
        })
    })

    it('should reject if channel key is not found', () => {
      const channelKey = 'foobar'
      const mockResult = {
        body: {
          results: [],
        },
      }
      const executeMock = jest.fn(() => Promise.resolve(mockResult))
      stockExporter.client.execute = executeMock
      return stockExporter._resolveChannelKey(channelKey)
        .catch((err) => {
          expect(err.message).toBe('No data with channel key in CTP Platform')
        })
    })
  })
})
