import JSONStream from 'JSONStream'
import streamtest from 'streamtest'
import { oneLineTrim } from 'common-tags'
import ProductExporter from '../src/main'

describe('ProductExporter', () => {
  let productExporter
  beforeEach(() => {
    const logger = {
      error: () => {},
      warn: () => {},
      info: () => {},
      verbose: () => {},
    }
    const exportConfig = {
      staged: true,
      batch: 5,
      predicate: 'foo=bar',
      expand: ['something'],
      total: 20,
    }
    productExporter = new ProductExporter(
      { projectKey: 'project-key' },
      exportConfig,
      logger,
      'myAccessToken'
    )
  })

  describe('::constructor', () => {
    test('should initialize with defaults', () => {
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
    test('prepare the output stream and pass to `_getProducts`', async () => {
      productExporter._getProducts = jest.fn(() => Promise.resolve())
      const outputStream = streamtest.v2.toText(() => {})
      await productExporter.run(outputStream)
      expect(productExporter._getProducts).toBeCalled()
      expect(productExporter._getProducts).not.toBeCalledWith(outputStream)
    })

    test('should emit `error` on output stream if error occurs', done => {
      productExporter._getProducts = jest.fn(() =>
        Promise.reject(new Error('error occured'))
      )

      const outputStream = streamtest.v2.toText((error, result) => {
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
      processMock = jest.fn((request, processFn) =>
        processFn(sampleResult).then(() => Promise.resolve())
      )
      productExporter.client.process = processMock
    })

    test('should fetch products using `process` method', () => {
      productExporter._getProducts(outputStream)
      expect(processMock).toHaveBeenCalledTimes(1)
      expect(processMock.mock.calls[0][0]).toEqual({
        uri: oneLineTrim`
            /project-key/product-projections
            ?staged=true
            &expand=something
            &where=foo%3Dbar
            &limit=5`,
        method: 'GET',
        headers: {
          Authorization: 'Bearer myAccessToken',
        },
      })
    })

    test('should pass the products and the stream to the writer method', () => {
      const spy = jest.spyOn(ProductExporter, '_writeEachProduct')

      productExporter._getProducts(outputStream)
      expect(spy).toBeCalled()
      spy.mockRestore()
    })

    test('should close stream after writing data', async () => {
      productExporter.client.process = jest.fn(() => Promise.resolve())
      await productExporter._getProducts(outputStream)
      expect(outputStream.end).toBeCalled()
    })
  })

  describe('::_buildProductProjectionsUri', () => {
    const projectKey = 'my-project-key'
    const exportConfig = {
      staged: true,
      batch: 5,
      predicate: 'foo=bar',
      expand: ['someReference', 'anotherReference'],
    }

    test('should build uri with query options', () => {
      const expectedUri = oneLineTrim`
        /my-project-key/product-projections
        ?staged=true
        &expand=someReference
        &expand=anotherReference
        &where=foo%3Dbar
        &limit=5
      `
      const actualUri = ProductExporter._buildProductProjectionsUri(
        projectKey,
        exportConfig
      )
      expect(actualUri).toEqual(expectedUri)
    })

    test('should build uri with no query options if none', () => {
      const expectedUri = '/my-project-key/product-projections?staged=false'
      const actualUri = ProductExporter._buildProductProjectionsUri(
        projectKey,
        { staged: false }
      )
      expect(actualUri).toEqual(expectedUri)
    })
  })

  describe('::_getStream', () => {
    test('should prepare the json stream with the right arguments', () => {
      // Mock the JSONStream
      const spy = jest.spyOn(JSONStream, 'stringify')

      ProductExporter._getStream('json')
      expect(spy).lastCalledWith('[\n', ',\n', '\n]')
      ProductExporter._getStream('chunk')
      expect(spy).lastCalledWith(false)
      spy.mockRestore()
    })
  })

  describe('::_writeEachProduct', () => {
    test('should write each product to the output stream', () => {
      const writeMock = jest.fn()
      const outputStream = {
        write: writeMock,
      }
      ProductExporter._writeEachProduct(outputStream, [1, 2, 3])
      expect(writeMock).toHaveBeenCalledTimes(3)
    })
  })
})
