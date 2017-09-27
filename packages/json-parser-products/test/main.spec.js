import StreamTest from 'streamtest'
import JSONParserProduct from '../src/main'

const streamTest = StreamTest['v2']

describe('JSONParserProduct', () => {
  let jsonParserProduct
  beforeEach(() => {
    const logger = {
      error: () => {},
      warn: () => {},
      info: () => {},
      verbose: () => {},
    }
    const parserConfig = {
      staged: true,
      batch: 5,
      predicate: 'foo=bar',
      expand: 'something',
      total: 20,
    }
    jsonParserProduct = new JSONParserProduct(
      { projectKey: 'project-key' },
      parserConfig,
      logger,
      'myAccessToken',
      )
  })

  describe('::constructor', () => {
    it('should initialize with defaults', () => {
      const apiConfig = {
        projectKey: 'foo',
      }
      const defaultConfig = {
        delimiter: ',',
        multiValueDelimiter: ';',
        continueOnProblems: false,
        categoryOrderHintBy: 'id',
      }

      jsonParserProduct = new JSONParserProduct(apiConfig)
      expect(jsonParserProduct.logger).toBeDefined()
      expect(jsonParserProduct.client).toBeDefined()
      expect(jsonParserProduct.parserConfig).toEqual(defaultConfig)
    })
  })

  describe('::parse', () => {
    beforeEach(() => {
      jsonParserProduct._resolveReferences = jest.fn(() => {})
    })

    afterEach(() => {
      jsonParserProduct._resolveReferences.mockRestore()
    })

    describe('::onReadable', () => {
      const midMarker = '\n\n\n'
      const endMarker = '\n\n'

      it('do nothing if an empty chunk is passed as product', (done) => {
        const inputStream = streamTest.fromChunks([])
        inputStream.on('end', () => {
          expect(jsonParserProduct._resolveReferences).not.toBeCalled()
          done()
        })
        jsonParserProduct.parse(inputStream)
      })

      it('process chunk that end with product delimiters', (done) => {
        const product1 = '{"product": "my-great-hoodie"}'
        const product2 = '{"anotherProduct": "comfortable-shoes"}'
        const myChunk = `${product1}${midMarker}${product2}${endMarker}`
        const expected = [JSON.parse(product1), JSON.parse(product2)]
        const inputStream = streamTest.fromChunks([myChunk])

        inputStream.on('end', () => {
          expect(jsonParserProduct._resolveReferences).toHaveBeenCalledTimes(1)
          expect(jsonParserProduct._resolveReferences).toBeCalledWith(expected)
          done()
        })
        jsonParserProduct.parse(inputStream)
      })

      it('process only products followed by end or middle marker', (done) => {
        const product1 = '{"product": "my-great-hoodie"}'
        const product2 = '{"anotherProduct": "comfortable-shoes"}'
        const myChunk = `${product1}${midMarker}${product2}`
        const expected = [JSON.parse(product1)]
        const inputStream = streamTest.fromChunks([myChunk])

        inputStream.on('end', () => {
          expect(jsonParserProduct._resolveReferences).toHaveBeenCalledTimes(1)
          expect(jsonParserProduct._resolveReferences).toBeCalledWith(expected)
          done()
        })
        jsonParserProduct.parse(inputStream)
      })

      it('do not process if chunk only contains incomplete product', (done) => {
        const incompleteProduct = '{"product": "my-gre'
        const inputStream = streamTest.fromChunks([incompleteProduct])

        inputStream.on('end', () => {
          expect(jsonParserProduct._resolveReferences).not.toBeCalled()
          done()
        })
        jsonParserProduct.parse(inputStream)
      })

      it('join incomplete product from one chunk to the next', (done) => {
        const product1 = '{"product": "my-great-hoodie"}'
        const halfProduct = '{"first": "brok'
        const anotherHalf = 'en-product"}'
        const product3 = '{"anotherProduct": "comfortable-shoes"}'
        const myChunk1 = `${product1}${midMarker}${halfProduct}`
        const myChunk2 = `${anotherHalf}${midMarker}${product3}${endMarker}`
        const expected1 = [JSON.parse(product1)]
        const expected2 = [ { first: 'broken-product' }, JSON.parse(product3)]
        const inputStream = streamTest.fromChunks([myChunk1, myChunk2])

        inputStream.on('end', () => {
          expect(jsonParserProduct._resolveReferences).toHaveBeenCalledTimes(2)
          expect(jsonParserProduct._resolveReferences).toBeCalledWith(expected1)
          expect(jsonParserProduct._resolveReferences).toBeCalledWith(expected2)
          done()
        })
        jsonParserProduct.parse(inputStream)
      })
    })
  })
})
