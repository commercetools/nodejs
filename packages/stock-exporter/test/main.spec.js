import streamtest from 'streamtest'
import { stripIndent } from 'common-tags'
import StockExporter from '../src/main'

describe('StockExporter', () => {
  it('should be defined', () => {
    expect(StockExporter).toBeDefined()
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
    it('should fetch stocks using the process method', () => {
      const processMock = jest.fn((request, processFn) => {
        const sampleResult = {
          body: {
            results: [],
          },
        }
        return processFn(sampleResult).then(() => Promise.resolve())
      })
      jest.spyOn(StockExporter, '_writeEachStock', jest.fn)
      stockExporter.client.process = processMock
      return stockExporter._fetchStocks().then(() => {
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
        StockExporter._writeEachStock.mockRestore()
      })
    })
    it('should add accessToken to request if present', () => {
      const processMock = jest.fn((request, processFn) => {
        const sampleResult = {
          body: {
            results: [],
          },
        }
        return processFn(sampleResult).then(() => Promise.resolve())
      })
      stockExporter.accessToken = '12345'
      jest.spyOn(StockExporter, '_writeEachStock', jest.fn)
      stockExporter.client.process = processMock
      return stockExporter._fetchStocks().then(() => {
        expect(processMock).toHaveBeenCalledTimes(1)
        expect(processMock.mock.calls[0][0])
          .toEqual({
            uri: '/foo/inventory?expand=custom.type&expand=supplyChannel',
            method: 'GET',
            headers: {
              Authorization: 'Bearer 12345',
            },
          },
          'first argument is request object',
          )
        expect(StockExporter._writeEachStock).toHaveBeenCalledTimes(1)
        StockExporter._writeEachStock.mockRestore()
      })
    })
  })

  describe('::run', () => {
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
})
