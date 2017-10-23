import StreamTest from 'streamtest'
import { oneLineTrim } from 'common-tags'
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
        fillAllRows: false,
        headers: true,
        categoryBy: 'name',
        categoryOrderHintBy: 'name',
        language: 'en',
      }

      jsonParserProduct = new JSONParserProduct(apiConfig)
      expect(jsonParserProduct.logger).toBeDefined()
      expect(jsonParserProduct.client).toBeDefined()
      expect(jsonParserProduct.parserConfig).toEqual(defaultConfig)
    })
  })

  describe('::parse', () => {
    beforeEach(() => {
      jsonParserProduct._resolveReferences = jest.fn(
        data => Promise.resolve(data),
      )
      jsonParserProduct.logger.error = jest.fn()
    })

    it('should accept 2 streams and write to output stream', (done) => {
      const product1 = oneLineTrim`
        {
          "id": "product-1-id",
          "slug": {
            "en": "my-slug-1"
          },
          "masterVariant": {
            "id": "mv-id",
            "key": "mv-key"
          },
          "variants": []
        }`
      const product2 = oneLineTrim`
        {
          "id": "product-2-id",
            "slug": {
            "en": "my-slug-2"
          },
          "masterVariant": {
            "id": "mv-id-2",
            "key": "mv-key-2"
          },
          "variants": []
        }`
      const myChunk = `${product1}\n${product2}`
      const inputStream = streamTest.fromChunks([myChunk])

      const outputStream = streamTest.toChunks((error, result) => {
        expect(error).toBeFalsy()
        const actualCsv = result.map(row => row.toString())
        expect(actualCsv[0]).toMatch(/id,slug.en,variant.id,variant.key/)
        expect(actualCsv[1]).toMatch(/product-1-id,my-slug-1,mv-id,mv-key/)
        expect(actualCsv[2]).toMatch(/product-2-id,my-slug-2,mv-id-2,mv-key-2/)
        done()
      })
      jsonParserProduct.parse(inputStream, outputStream)
    })

    it('should log error and exit on errors', (done) => {
      const product1 = oneLineTrim`
        {
          "id": "product-1-id",
          "slug": {
            "en": "my-slug-1"
          },
          "masterVariant": {
            "id": "mv-id",
            "key": "mv-key"
          },
          "variants": []
        }`
      // invalid json to generate error
      const product2 = oneLineTrim`
        {
          "id": "product-2-id",
          "slug": {
            en: "my-slug-2
          },
          "masterVariant": {
            "id": "mv-id-2",
            "key": "mv-key-2"
          },
          "variants": []
        }`

      const myChunk = `${product1}\n${product2}`
      const inputStream = streamTest.fromChunks([myChunk])
      const expectedError = /Unexpected token e in JSON/
      const outputStream = streamTest.toText((error, result) => {
        expect(jsonParserProduct.logger.error).toBeCalledWith(
          expect.objectContaining(error),
        )
        expect(error.message).toMatch(expectedError)
        expect(result).toBeFalsy()
        done()
      })
      jsonParserProduct.parse(inputStream, outputStream)
    })
  })

  describe('Resolvers', () => {
    let sampleProduct
    beforeEach(() => {
      sampleProduct = {
        id: 'myProduct-1',
        productType: { id: 'product-type-id' },
        taxCategory: { id: 'tax-cat-id' },
        state: { id: 'state-id' },
        categories: [{ id: 'cat-id-1' }, { id: 'cat-id-2' }],
        categoryOrderHints: { 'cat-id-1': '0.012', 'cat-id-2': '0.987' },
      }
    })

    describe('::_resolveReferences', () => {
      beforeEach(() => {
        const productType = {
          id: 'product-type-id',
          name: 'resolved-product-type',
          attributes: [{}],
        }
        const taxCategory = {
          id: 'tax-cat-id',
          key: 'resolved-tax-cat-key',
        }
        const state = {
          id: 'state-id',
          key: 'res-state-key',
        }
        const categories = [
          { id: 'cat-id-1', name: { en: 'res-cat-name-1' } },
          { id: 'cat-id-2', name: { en: 'res-cat-name-2' } },
        ]
        const categoryOrderHints = {
          'res-cat-name-1': '0.015',
          'res-cat-name-2': '0.987',
        }

        jsonParserProduct._resolveProductType = jest.fn(() => (
          { productType }
        ))
        jsonParserProduct._resolveTaxCategory = jest.fn(() => (
          { taxCategory }
        ))
        jsonParserProduct._resolveState = jest.fn(() => (
          { state }
        ))
        jsonParserProduct._resolveCategories = jest.fn(() => (
          { categories }
        ))
        jsonParserProduct._resolveCategoryOrderHints = jest.fn(() => (
          { categoryOrderHints }
        ))
      })

      it('should pass the products to all resolver functions', async () => {
        await jsonParserProduct._resolveReferences(sampleProduct)

        expect(jsonParserProduct._resolveProductType)
          .toBeCalledWith(sampleProduct.productType)
        expect(jsonParserProduct._resolveTaxCategory)
          .toBeCalledWith(sampleProduct.taxCategory)
        expect(jsonParserProduct._resolveState)
          .toBeCalledWith(sampleProduct.state)
        expect(jsonParserProduct._resolveCategories)
          .toBeCalledWith(sampleProduct.categories)
        expect(jsonParserProduct._resolveCategoryOrderHints)
          .toBeCalledWith(sampleProduct.categoryOrderHints)
      })

      it('should return object with resolved references', async () => {
        const expected = {
          id: 'myProduct-1',
          productType: {
            id: 'product-type-id',
            name: 'resolved-product-type',
            attributes: [{}],
          },
          taxCategory: {
            id: 'tax-cat-id',
            key: 'resolved-tax-cat-key',
          },
          state: {
            id: 'state-id',
            key: 'res-state-key',
          },
          categories: [
            { id: 'cat-id-1', name: { en: 'res-cat-name-1' } },
            { id: 'cat-id-2', name: { en: 'res-cat-name-2' } },
          ],
          categoryOrderHints: {
            'res-cat-name-1': '0.015',
            'res-cat-name-2': '0.987',
          },
        }
        const actual = await jsonParserProduct
          ._resolveReferences(sampleProduct)
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveProductType', () => {
      beforeEach(() => {
        jsonParserProduct.fetchReferences = jest.fn(() => (
          Promise.resolve({
            body: {
              id: 'product-type-id',
              name: 'resolved-name',
              attributes: [{}],
            },
          })
        ))
      })

      it('return empty object if no `productType` reference', () => {
        delete sampleProduct.productType
        expect(jsonParserProduct._resolveProductType(sampleProduct.productType))
          .toEqual({})
      })

      it('build correct request uri for productType', async () => {
        const expected = /project-key\/product-types\/product-type-id/
        await jsonParserProduct._resolveProductType(sampleProduct.productType)
        expect(jsonParserProduct.fetchReferences)
          .toBeCalledWith(expect.stringMatching(expected))
      })

      it('return productType object', async () => {
        const expected = {
          productType: {
            id: 'product-type-id',
            name: 'resolved-name',
            attributes: [{}],
          },
        }
        const actual = await jsonParserProduct
          ._resolveProductType(sampleProduct.productType)
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveTaxCategory', () => {
      beforeEach(() => {
        jsonParserProduct.fetchReferences = jest.fn(() => (
          Promise.resolve({
            body: {
              id: 'tax-cat-id',
              key: 'resolved-tax-cat-key',
            },
          })
        ))
      })

      it('return empty object if no `taxCategory` reference', () => {
        delete sampleProduct.taxCategory
        expect(jsonParserProduct._resolveTaxCategory(sampleProduct.taxCategory))
          .toEqual({})
      })

      it('build correct request uri for taxCategory', async () => {
        const expected = /project-key\/tax-categories\/tax-cat-id/
        await jsonParserProduct._resolveTaxCategory(sampleProduct.taxCategory)
        expect(jsonParserProduct.fetchReferences)
          .toBeCalledWith(expect.stringMatching(expected))
      })

      it('return resolved taxCategory object', async () => {
        const expected = {
          taxCategory: {
            id: 'tax-cat-id',
            key: 'resolved-tax-cat-key',
          },
        }
        const actual = await jsonParserProduct
          ._resolveTaxCategory(sampleProduct.taxCategory)
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveState', () => {
      beforeEach(() => {
        jsonParserProduct.fetchReferences = jest.fn(() => (
          Promise.resolve({
            body: {
              id: 'state-id',
              key: 'res-state-key',
            },
          })
        ))
      })

      it('return empty object if no `state` reference', () => {
        delete sampleProduct.state
        expect(jsonParserProduct._resolveState(sampleProduct.state))
          .toEqual({})
      })

      it('build correct request uri for state', async () => {
        const expected = /project-key\/states\/state-id/
        await jsonParserProduct._resolveState(sampleProduct.state)
        expect(jsonParserProduct.fetchReferences)
          .toBeCalledWith(expect.stringMatching(expected))
      })

      it('return resolved state object', async () => {
        const expected = {
          state: {
            id: 'state-id',
            key: 'res-state-key',
          },
        }
        const actual = await jsonParserProduct
          ._resolveState(sampleProduct.state)
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveCategories', () => {
      beforeEach(() => {
        jsonParserProduct._getCategories = jest.fn(() => (
          Promise.resolve([])
        ))
      })

      it('return empty object if no array of `categories`', () => {
        delete sampleProduct.categories
        expect(jsonParserProduct._resolveCategories(sampleProduct.categories))
          .toEqual({})
      })

      it('return resolved category objects as array', async () => {
        const resolvedCategories = [
          { id: 'cat-id-1', name: { en: 'res-cat-name-1' } },
          { id: 'cat-id-2', name: { en: 'res-cat-name-2' } },
        ]
        jsonParserProduct._getCategories
          .mockReturnValue(Promise.resolve(resolvedCategories))
        const expected = {
          categories: [
            { id: 'cat-id-1', name: { en: 'res-cat-name-1' } },
            { id: 'cat-id-2', name: { en: 'res-cat-name-2' } },
          ],
        }
        const actual = await jsonParserProduct
          ._resolveCategories(sampleProduct.categories)
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveCategoryOrderHints', () => {
      beforeEach(() => {
        jsonParserProduct._getCategories = jest.fn(() => (
          Promise.resolve([])
        ))
      })

      it('return empty object if no `categoryOrderHints`', () => {
        delete sampleProduct.categoryOrderHints
        expect(jsonParserProduct._resolveCategoryOrderHints(
          sampleProduct.categoryOrderHints)).toEqual({})
      })

      it('return empty object if `categoryOrderHints` is empty', () => {
        sampleProduct.categoryOrderHints = {}
        expect(jsonParserProduct._resolveCategoryOrderHints(
          sampleProduct.categoryOrderHints)).toEqual({})
      })

      it('return category name for `categoryOrderHints`', async () => {
        const resolvedCategories = [
          { id: 'cat-id-1', name: { en: 'res-cat-name-1' } },
          { id: 'cat-id-2', name: { en: 'res-cat-name-2' } },
        ]
        jsonParserProduct._getCategories
          .mockReturnValue(Promise.resolve(resolvedCategories))
        const expected = {
          categoryOrderHints: {
            'res-cat-name-1': '0.012',
            'res-cat-name-2': '0.987',
          },
        }
        const actual = await jsonParserProduct
          ._resolveCategoryOrderHints(sampleProduct.categoryOrderHints)
        expect(actual).toEqual(expected)
      })

      it('return category keys if specified', async () => {
        jsonParserProduct.parserConfig.categoryOrderHintBy = 'key'
        const resolvedCategories = [
          { id: 'cat-id-1', key: 'res-cat-key-1' },
          { id: 'cat-id-2', key: 'res-cat-key-2' },
        ]
        jsonParserProduct._getCategories
          .mockReturnValue(Promise.resolve(resolvedCategories))
        const expected = {
          categoryOrderHints: {
            'res-cat-key-1': '0.012',
            'res-cat-key-2': '0.987',
          },
        }
        const actual = await jsonParserProduct
          ._resolveCategoryOrderHints(sampleProduct.categoryOrderHints)
        expect(actual).toEqual(expected)
      })

      it('return externalIds if specified', async () => {
        jsonParserProduct.parserConfig.categoryOrderHintBy = 'externalId'
        const resolvedCategories = [
          { id: 'cat-id-1', externalId: 'res-cat-extId-1' },
          { id: 'cat-id-2', externalId: 'res-cat-extId-2' },
        ]
        jsonParserProduct._getCategories
          .mockReturnValue(Promise.resolve(resolvedCategories))
        const expected = {
          categoryOrderHints: {
            'res-cat-extId-1': '0.012',
            'res-cat-extId-2': '0.987',
          },
        }
        const actual = await jsonParserProduct
          ._resolveCategoryOrderHints(sampleProduct.categoryOrderHints)
        expect(actual).toEqual(expected)
      })
    })

    describe('::_getCategories', () => {
      beforeEach(() => {
        jsonParserProduct.categoriesCache = {
          'cat-id-1': {
            id: 'cat-id-1',
            key: 'cat-key-1-in-cache',
          },
        }
        const results = [{ id: 'cat-id-2', key: 'cat-key-2-new-in-cache' }]

        jsonParserProduct.fetchReferences = jest.fn(() => (
          Promise.resolve({ body: { results } })
        ))
      })

      it('return category from cache if it exists', async () => {
        const expected = [{ id: 'cat-id-1', key: 'cat-key-1-in-cache' }]
        const categoryId = ['cat-id-1']
        const actual = await jsonParserProduct._getCategories(categoryId)
        expect(jsonParserProduct.fetchReferences).not.toBeCalled()
        expect(actual).toEqual(expected)
      })

      it('fetch only data not in cache from API', async () => {
        const expectedCategories = [{
          id: 'cat-id-1', key: 'cat-key-1-in-cache',
        }, {
          id: 'cat-id-2', key: 'cat-key-2-new-in-cache',
        }]
        const expectedUri = /categories\?where=id%20in%20\(%22cat-id-2%22\)/
        const categoryIds = ['cat-id-1', 'cat-id-2']
        const actual = await jsonParserProduct._getCategories(categoryIds)
        expect(jsonParserProduct.fetchReferences)
          .toBeCalledWith(expect.stringMatching(expectedUri))
        expect(actual).toEqual(expectedCategories)
      })

      it('save fetched categories in cache', async () => {
        const expectedCache = {
          'cat-id-1': {
            id: 'cat-id-1', key: 'cat-key-1-in-cache',
          },
          'cat-id-2': {
            id: 'cat-id-2', key: 'cat-key-2-new-in-cache',
          },
        }
        const categoryIds = ['cat-id-2']
        await jsonParserProduct._getCategories(categoryIds)
        expect(jsonParserProduct.categoriesCache).toEqual(expectedCache)
      })
    })

    describe('::_resolveAncestors', () => {
      const child = {
        id: 'child-cat-id',
        name: { en: 'child-cat-name' },
        parent: { typeId: 'category', id: 'parent-cat-id' } }
      const parent = {
        id: 'parent-cat-id',
        name: { en: 'parent-cat-name' },
        parent: { typeId: 'category', id: 'grand-parent-cat-id' } }
      const grandParent = {
        id: 'grand-parent-cat-id',
        name: { en: 'grand-parent-cat-name' } }

      it('resolves all ancestors for a category', async () => {
        jsonParserProduct._getCategories = jest.fn()
          .mockImplementationOnce(() => Promise.resolve([parent]))
          .mockImplementationOnce(() => Promise.resolve([grandParent]))
          .mockImplementation(() => Promise.reject('I should not be called'))
        const expected = {
          id: 'child-cat-id',
          name: {
            en: 'child-cat-name',
          },
          parent: {
            id: 'parent-cat-id',
            name: { en: 'parent-cat-name' },
            parent: {
              id: 'grand-parent-cat-id',
              name: { en: 'grand-parent-cat-name',
              },
            },
          },
        }
        const actual = await jsonParserProduct._resolveAncestors(child)
        expect(jsonParserProduct._getCategories).toHaveBeenCalledTimes(2)
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('::fetchReferences', () => {
    beforeEach(() => {
      jsonParserProduct.client.execute = jest.fn()
    })
    it('should fetch reference from API from url', () => {
      const uri = 'dummy-uri'
      const expectedRequest = {
        uri,
        method: 'GET',
        headers: { Authorization: 'Bearer myAccessToken' },
      }

      jsonParserProduct.fetchReferences(uri)
      expect(jsonParserProduct.client.execute).toBeCalled()
      expect(jsonParserProduct.client.execute).toBeCalledWith(expectedRequest)
    })

    it('should fetch only once for multiple calls with same parameter', () => {
      const uri = 'dummy-uri-2'
      const expectedRequest = {
        uri,
        method: 'GET',
        headers: { Authorization: 'Bearer myAccessToken' },
      }

      jsonParserProduct.fetchReferences(uri)
      jsonParserProduct.fetchReferences(uri)
      expect(jsonParserProduct.client.execute).toHaveBeenCalledTimes(1)
      expect(jsonParserProduct.client.execute).toBeCalledWith(expectedRequest)
    })
  })
})
