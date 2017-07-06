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
          .toEqual(
            { uri: '/foo/inventory', method: 'GET' },
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
            uri: '/foo/inventory',
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
    it('should fetch stocks and output to stream', (done) => {
      const outputStream = streamtest['v2'].toText((error, result) => {
        const expectedResult = stripIndent`
          sku,quantityOnStock,restockableInDays
          hello,me,4
        `
        expect(result).toEqual(expectedResult)
        done()
      })
      const sampleStock = {
        sku: 'hello',
        quantityOnStock: 'me',
        restockableInDays: 4,
      }
      const _fetchStocksMock = jest.fn((csvStream) => {
        csvStream.write(sampleStock)
        csvStream.end()
      })
      stockExporter._fetchStocks = _fetchStocksMock
      stockExporter.run(outputStream)
    })
  })
  describe('::_writeEachStock', () => {
    it('should loop over stocks and write to csvStream', () => {
      const csvWriteMock = jest.fn()
      const csvStreamMock = {
        write: csvWriteMock,
      }
      StockExporter._writeEachStock(csvStreamMock, [1, 2, 3, 4, 5])
      expect(csvWriteMock).toHaveBeenCalledTimes(5)
    })
  })
})
