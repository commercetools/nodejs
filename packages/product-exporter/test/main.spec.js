import streamtest from 'streamtest'
import ProductExporter from '../src/main'

describe('ProductExporter', () => {
  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    verbose: () => {},
  }

  let productExporter
  beforeEach(() => {
    productExporter = new ProductExporter(
      { projectKey: 'project-key' },
      { staged: true },
      logger,
      'myAccessToken',
      )
  })

  describe('constructor', () => {
    it('should initialize with defaults', () => {
      const apiConfig = {
        projectKey: 'foo',
      }
      productExporter = new ProductExporter(apiConfig)
      expect(productExporter.logger).toBeDefined()
      expect(productExporter.client).toBeDefined()
      expect(productExporter.exportConfig).toBeDefined()
    })
  })

  describe('::run', () => {
    it('should call `_processStream` with outputStream if json', async() => {
      productExporter._getProducts = jest.fn(() => Promise.resolve())
      const outputStream = streamtest['v2'].toText(() => {})
      await productExporter.run(outputStream)
      expect(productExporter._getProducts).toBeCalled()
    })

    it('should emit `error` on output stream if error occurs', (done) => {
      productExporter._getProducts = jest.fn(() =>
        Promise.reject(new Error('error occured')),
      )

      const outputStream = streamtest['v2'].toText((error, result) => {
        expect(error.message).toBe('error occured')
        expect(result).toBeUndefined()
        done()
      })
      productExporter.run(outputStream)
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
      productExporter.client.process = processMock
      const outputStream = {
        emit: jest.fn(),
      }
      productExporter._getProducts(outputStream)
      expect(processMock).toHaveBeenCalledTimes(1)
      expect(processMock.mock.calls[0][0])
        .toEqual({
          uri: '/project-key/product-projections?staged=true',
          method: 'GET',
          headers: {
            Authorization: 'Bearer myAccessToken',
          },
        })
    })

    it('should close stream after writing data', async() => {
      productExporter.client.process = jest.fn(() => Promise.resolve())
      const outputStream = {
        end: jest.fn(),
      }
      await productExporter._getProducts(outputStream)
      expect(outputStream.end).toBeCalled()
    })
  })
})
