import StreamTest from 'streamtest'
import { oneLineTrim } from 'common-tags'
import JSONParserProduct from '../src/main'
import * as writer from '../src/writer'

const streamTest = StreamTest.v2

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
      categoryBy: 'name',
      categoryOrderHintBy: 'name',
      delimiter: ',',
      fillAllRows: false,
      language: 'en',
      multiValueDelimiter: ';',
      productSeparator: '\n',
    }
    jsonParserProduct = new JSONParserProduct(
      { projectKey: 'project-key' },
      parserConfig,
      logger,
      'myAccessToken'
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
        categoryBy: 'name',
        categoryOrderHintBy: 'name',
        language: 'en',
        productSeparator: '\n',
      }

      jsonParserProduct = new JSONParserProduct(apiConfig)
      expect(jsonParserProduct.logger).toBeDefined()
      expect(jsonParserProduct.client).toBeDefined()
      expect(jsonParserProduct.parserConfig).toEqual(defaultConfig)
    })
  })

  describe('::run', () => {
    let zipSpy
    let csvSpy
    beforeEach(() => {
      zipSpy = jest.spyOn(writer, 'writeToZipFile').mockImplementation(() => {})
      csvSpy = jest
        .spyOn(writer, 'writeToSingleCsvFile')
        .mockImplementation(() => {})
    })
    afterEach(() => {
      jest.resetAllMocks()
    })

    it('should write data to single `csv` file if headers are set', () => {
      jsonParserProduct.parse = jest.fn(() => 'foo')
      jsonParserProduct.parserConfig.headers = []

      jsonParserProduct.run()
      expect(csvSpy).toBeCalled()
      expect(zipSpy).not.toBeCalled()
    })

    it('should write data to `zip` file if headers are not set', () => {
      jsonParserProduct.parse = jest.fn(() => 'bar')

      jsonParserProduct.run()
      expect(csvSpy).not.toBeCalled()
      expect(zipSpy).toBeCalled()
    })
  })

  describe('::parse', () => {
    beforeEach(() => {
      jsonParserProduct._resolveReferences = jest.fn(data =>
        Promise.resolve(data)
      )
      jsonParserProduct.logger.error = jest.fn()
    })

    it('should take an inputStream and output highland stream', () => {
      const product = oneLineTrim`
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
      const inputStream = streamTest.fromChunks([product])
      const productStream = jsonParserProduct.parse(inputStream)
      expect(productStream.source.__HighlandStream__).toBeTruthy()
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

        jsonParserProduct._resolveProductType = jest.fn(() => ({ productType }))
        jsonParserProduct._resolveTaxCategory = jest.fn(() => ({ taxCategory }))
        jsonParserProduct._resolveState = jest.fn(() => ({ state }))
        jsonParserProduct._resolveCategories = jest.fn(() => ({ categories }))
        jsonParserProduct._resolveCategoryOrderHints = jest.fn(() => ({
          categoryOrderHints,
        }))
      })

      it('should pass the products to all resolver functions', async () => {
        await jsonParserProduct._resolveReferences(sampleProduct)

        expect(jsonParserProduct._resolveProductType).toBeCalledWith(
          sampleProduct.productType
        )
        expect(jsonParserProduct._resolveTaxCategory).toBeCalledWith(
          sampleProduct.taxCategory
        )
        expect(jsonParserProduct._resolveState).toBeCalledWith(
          sampleProduct.state
        )
        expect(jsonParserProduct._resolveCategories).toBeCalledWith(
          sampleProduct.categories
        )
        expect(jsonParserProduct._resolveCategoryOrderHints).toBeCalledWith(
          sampleProduct.categoryOrderHints
        )
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
        const actual = await jsonParserProduct._resolveReferences(sampleProduct)
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveProductType', () => {
      beforeEach(() => {
        jsonParserProduct.fetchReferences = jest.fn(() =>
          Promise.resolve({
            body: {
              id: 'product-type-id',
              name: 'resolved-name',
              attributes: [{}],
            },
          })
        )
      })

      it('return empty object if no `productType` reference', () => {
        delete sampleProduct.productType
        expect(
          jsonParserProduct._resolveProductType(sampleProduct.productType)
        ).toEqual({})
      })

      it('build correct request uri for productType', async () => {
        const expected = /project-key\/product-types\/product-type-id/
        await jsonParserProduct._resolveProductType(sampleProduct.productType)
        expect(jsonParserProduct.fetchReferences).toBeCalledWith(
          expect.stringMatching(expected)
        )
      })

      it('return productType object', async () => {
        const expected = {
          productType: {
            id: 'product-type-id',
            name: 'resolved-name',
            attributes: [{}],
          },
        }
        const actual = await jsonParserProduct._resolveProductType(
          sampleProduct.productType
        )
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveTaxCategory', () => {
      beforeEach(() => {
        jsonParserProduct.fetchReferences = jest.fn(() =>
          Promise.resolve({
            body: {
              id: 'tax-cat-id',
              key: 'resolved-tax-cat-key',
            },
          })
        )
      })

      it('return empty object if no `taxCategory` reference', () => {
        delete sampleProduct.taxCategory
        expect(
          jsonParserProduct._resolveTaxCategory(sampleProduct.taxCategory)
        ).toEqual({})
      })

      it('build correct request uri for taxCategory', async () => {
        const expected = /project-key\/tax-categories\/tax-cat-id/
        await jsonParserProduct._resolveTaxCategory(sampleProduct.taxCategory)
        expect(jsonParserProduct.fetchReferences).toBeCalledWith(
          expect.stringMatching(expected)
        )
      })

      it('return resolved taxCategory object', async () => {
        const expected = {
          taxCategory: {
            id: 'tax-cat-id',
            key: 'resolved-tax-cat-key',
          },
        }
        const actual = await jsonParserProduct._resolveTaxCategory(
          sampleProduct.taxCategory
        )
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveState', () => {
      beforeEach(() => {
        jsonParserProduct.fetchReferences = jest.fn(() =>
          Promise.resolve({
            body: {
              id: 'state-id',
              key: 'res-state-key',
            },
          })
        )
      })

      it('return empty object if no `state` reference', () => {
        delete sampleProduct.state
        expect(jsonParserProduct._resolveState(sampleProduct.state)).toEqual({})
      })

      it('build correct request uri for state', async () => {
        const expected = /project-key\/states\/state-id/
        await jsonParserProduct._resolveState(sampleProduct.state)
        expect(jsonParserProduct.fetchReferences).toBeCalledWith(
          expect.stringMatching(expected)
        )
      })

      it('return resolved state object', async () => {
        const expected = {
          state: {
            id: 'state-id',
            key: 'res-state-key',
          },
        }
        const actual = await jsonParserProduct._resolveState(
          sampleProduct.state
        )
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveCategories', () => {
      beforeEach(() => {
        jsonParserProduct._getCategories = jest.fn(() => Promise.resolve([]))
      })

      it('return empty object if no array of `categories`', () => {
        delete sampleProduct.categories
        expect(
          jsonParserProduct._resolveCategories(sampleProduct.categories)
        ).toEqual({})
      })

      it('return resolved category objects as array', async () => {
        const resolvedCategories = [
          { id: 'cat-id-1', name: { en: 'res-cat-name-1' } },
          { id: 'cat-id-2', name: { en: 'res-cat-name-2' } },
        ]
        jsonParserProduct._getCategories.mockReturnValue(
          Promise.resolve(resolvedCategories)
        )
        const expected = {
          categories: [
            { id: 'cat-id-1', name: { en: 'res-cat-name-1' } },
            { id: 'cat-id-2', name: { en: 'res-cat-name-2' } },
          ],
        }
        const actual = await jsonParserProduct._resolveCategories(
          sampleProduct.categories
        )
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveCategoryOrderHints', () => {
      beforeEach(() => {
        jsonParserProduct._getCategories = jest.fn(() => Promise.resolve([]))
      })

      it('return empty object if no `categoryOrderHints`', () => {
        delete sampleProduct.categoryOrderHints
        expect(
          jsonParserProduct._resolveCategoryOrderHints(
            sampleProduct.categoryOrderHints
          )
        ).toEqual({})
      })

      it('return empty object if `categoryOrderHints` is empty', () => {
        sampleProduct.categoryOrderHints = {}
        expect(
          jsonParserProduct._resolveCategoryOrderHints(
            sampleProduct.categoryOrderHints
          )
        ).toEqual({})
      })

      it('return category name for `categoryOrderHints`', async () => {
        const resolvedCategories = [
          { id: 'cat-id-1', name: { en: 'res-cat-name-1' } },
          { id: 'cat-id-2', name: { en: 'res-cat-name-2' } },
        ]
        jsonParserProduct._getCategories.mockReturnValue(
          Promise.resolve(resolvedCategories)
        )
        const expected = {
          categoryOrderHints: {
            'res-cat-name-1': '0.012',
            'res-cat-name-2': '0.987',
          },
        }
        const actual = await jsonParserProduct._resolveCategoryOrderHints(
          sampleProduct.categoryOrderHints
        )
        expect(actual).toEqual(expected)
      })

      it('return category keys if specified', async () => {
        jsonParserProduct.parserConfig.categoryOrderHintBy = 'key'
        const resolvedCategories = [
          { id: 'cat-id-1', key: 'res-cat-key-1' },
          { id: 'cat-id-2', key: 'res-cat-key-2' },
        ]
        jsonParserProduct._getCategories.mockReturnValue(
          Promise.resolve(resolvedCategories)
        )
        const expected = {
          categoryOrderHints: {
            'res-cat-key-1': '0.012',
            'res-cat-key-2': '0.987',
          },
        }
        const actual = await jsonParserProduct._resolveCategoryOrderHints(
          sampleProduct.categoryOrderHints
        )
        expect(actual).toEqual(expected)
      })

      it('return externalIds if specified', async () => {
        jsonParserProduct.parserConfig.categoryOrderHintBy = 'externalId'
        const resolvedCategories = [
          { id: 'cat-id-1', externalId: 'res-cat-extId-1' },
          { id: 'cat-id-2', externalId: 'res-cat-extId-2' },
        ]
        jsonParserProduct._getCategories.mockReturnValue(
          Promise.resolve(resolvedCategories)
        )
        const expected = {
          categoryOrderHints: {
            'res-cat-extId-1': '0.012',
            'res-cat-extId-2': '0.987',
          },
        }
        const actual = await jsonParserProduct._resolveCategoryOrderHints(
          sampleProduct.categoryOrderHints
        )
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

        jsonParserProduct.fetchReferences = jest.fn(() =>
          Promise.resolve({ body: { results } })
        )
      })

      it('return category from cache if it exists', async () => {
        const expected = [{ id: 'cat-id-1', key: 'cat-key-1-in-cache' }]
        const categoryId = ['cat-id-1']
        const actual = await jsonParserProduct._getCategories(categoryId)
        expect(jsonParserProduct.fetchReferences).not.toBeCalled()
        expect(actual).toEqual(expected)
      })

      it('fetch only data not in cache from API', async () => {
        const expectedCategories = [
          {
            id: 'cat-id-1',
            key: 'cat-key-1-in-cache',
          },
          {
            id: 'cat-id-2',
            key: 'cat-key-2-new-in-cache',
          },
        ]
        const expectedUri = /categories\?where=id%20in%20\(%22cat-id-2%22\)/
        const categoryIds = ['cat-id-1', 'cat-id-2']
        const actual = await jsonParserProduct._getCategories(categoryIds)
        expect(jsonParserProduct.fetchReferences).toBeCalledWith(
          expect.stringMatching(expectedUri)
        )
        expect(actual).toEqual(expectedCategories)
      })

      it('save fetched categories in cache', async () => {
        const expectedCache = {
          'cat-id-1': {
            id: 'cat-id-1',
            key: 'cat-key-1-in-cache',
          },
          'cat-id-2': {
            id: 'cat-id-2',
            key: 'cat-key-2-new-in-cache',
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
        parent: { typeId: 'category', id: 'parent-cat-id' },
      }
      const parent = {
        id: 'parent-cat-id',
        name: { en: 'parent-cat-name' },
        parent: { typeId: 'category', id: 'grand-parent-cat-id' },
      }
      const grandParent = {
        id: 'grand-parent-cat-id',
        name: { en: 'grand-parent-cat-name' },
      }

      it('resolves all ancestors for a category', async () => {
        jsonParserProduct._getCategories = jest
          .fn()
          .mockImplementationOnce(() => Promise.resolve([parent]))
          .mockImplementationOnce(() => Promise.resolve([grandParent]))
          .mockImplementation(() =>
            Promise.reject(new Error('I should not be called'))
          )
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
              name: {
                en: 'grand-parent-cat-name',
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
