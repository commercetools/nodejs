import streamtest from 'streamtest'
import { oneLineTrim } from 'common-tags'
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
      { staged: true, batch: 5, predicate: 'foo=bar', expand: 'something' },
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
    it('should call `_getProducts`', async() => {
      productExporter._getProducts = jest.fn(() => Promise.resolve())
      const outputStream = streamtest['v2'].toText(() => {})
      await productExporter.run(outputStream)
      expect(productExporter._getProducts).toBeCalled()
      expect(productExporter._getProducts).not.toBeCalledWith(outputStream)
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
    let processMock
    const outputStream = {
      emit: () => {},
      end: jest.fn(),
    }
    beforeEach(() => {
      const sampleResult = {
        body: {
          results: [],
        },
      }
      processMock = jest.fn((request, processFn) => (
        processFn(sampleResult).then(() => Promise.resolve())
      ))
      productExporter.client.process = processMock
    })

    it('should fetch products using `process` method', () => {
      productExporter._getProducts(outputStream)
      expect(processMock).toHaveBeenCalledTimes(1)
      expect(processMock.mock.calls[0][0])
        .toEqual({
          uri: oneLineTrim`
            /project-key/product-projections?staged=true
            &expand=something&where=foo%3Dbar&limit=5`,
          method: 'GET',
          headers: {
            Authorization: 'Bearer myAccessToken',
          },
        })
    })

    it('should call `_writeEachProduct` method', () => {
      const spy = jest.spyOn(ProductExporter, '_writeEachProduct')

      productExporter._getProducts(outputStream)
      expect(spy).toBeCalled()
      spy.mockRestore()
    })

    it('should close stream after writing data', async() => {
      productExporter.client.process = jest.fn(() => Promise.resolve())
      await productExporter._getProducts(outputStream)
      expect(outputStream.end).toBeCalled()
    })
  })

  describe('::_writeEachProduct', () => {
    it('should write each product to the output stream', () => {
      const writeMock = jest.fn()
      const outputStream = {
        write: writeMock,
      }
      ProductExporter._writeEachProduct(outputStream, [1, 2, 3])
      expect(writeMock).toHaveBeenCalledTimes(3)
    })
  })
})
