import StreamTest from 'streamtest'
import { oneLineTrim } from 'common-tags'
import ProductJsonToCsv from '../src/main'
import * as writer from '../src/writer'

jest.mock('../src/writer')

const streamTest = StreamTest.v2

describe('ProductJsonToCsv', () => {
  let productJsonToCsv
  beforeEach(() => {
    const logger = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      verbose: jest.fn(),
    }
    const parserConfig = {
      categoryBy: 'name',
      categoryOrderHintBy: 'name',
      delimiter: ',',
      fillAllRows: false,
      language: 'en',
      multiValueDelimiter: ';',
    }
    productJsonToCsv = new ProductJsonToCsv(
      { projectKey: 'project-key' },
      parserConfig,
      logger,
      'myAccessToken'
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
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
      }

      productJsonToCsv = new ProductJsonToCsv(apiConfig)
      expect(productJsonToCsv.logger).toBeDefined()
      expect(productJsonToCsv.client).toBeDefined()
      expect(productJsonToCsv.parserConfig).toEqual(defaultConfig)
    })
  })

  describe('::run', () => {
    it('should write data to single `csv` file if headers are set', () => {
      productJsonToCsv = new ProductJsonToCsv(
        { projectKey: 'project-key' },
        { headerFields: ['header1, header2'] }
      )
      productJsonToCsv.parse = jest.fn(() => 'foo')

      productJsonToCsv.run()
      expect(writer.writeToSingleCsvFile).toBeCalled()
      expect(writer.writeToZipFile).not.toBeCalled()
    })

    it('should write data to `zip` file if headers are not set', () => {
      productJsonToCsv.parse = jest.fn(() => 'bar')

      productJsonToCsv.run()
      expect(writer.writeToSingleCsvFile).not.toBeCalled()
      expect(writer.writeToZipFile).toBeCalled()
    })
  })

  describe('::parse', () => {
    let outputStream
    let productStream
    beforeEach(() => {
      productJsonToCsv._resolveReferences = jest.fn(data =>
        Promise.resolve(data)
      )
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

      outputStream = {
        emit: jest.fn(),
      }
      productStream = productJsonToCsv.parse(inputStream, outputStream)
    })

    it('should take an inputStream and output highland stream', () => {
      expect(productStream.source.__HighlandStream__).toBeTruthy()
    })

    it('should log and emit error if error occurs', async () => {
      const fakeError = new Error('fake error')
      productJsonToCsv._resolveReferences = jest.fn(() =>
        Promise.reject(fakeError)
      )

      // We expect the method to resolve to undefined as a rejected promise
      // indicates the error is not handled
      await expect(productStream.toPromise(Promise)).resolves.toBeUndefined()
      expect(productJsonToCsv.logger.error).toBeCalledWith(fakeError)
      expect(outputStream.emit).toBeCalledWith('error', fakeError)
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

        productJsonToCsv._resolveProductType = jest.fn(() => ({ productType }))
        productJsonToCsv._resolveTaxCategory = jest.fn(() => ({ taxCategory }))
        productJsonToCsv._resolveState = jest.fn(() => ({ state }))
        productJsonToCsv._resolveCategories = jest.fn(() => ({ categories }))
        productJsonToCsv._resolveCategoryOrderHints = jest.fn(() => ({
          categoryOrderHints,
        }))
      })

      it('should pass the products to all resolver functions', async () => {
        await productJsonToCsv._resolveReferences(sampleProduct)

        expect(productJsonToCsv._resolveProductType).toBeCalledWith(
          sampleProduct.productType
        )
        expect(productJsonToCsv._resolveTaxCategory).toBeCalledWith(
          sampleProduct.taxCategory
        )
        expect(productJsonToCsv._resolveState).toBeCalledWith(
          sampleProduct.state
        )
        expect(productJsonToCsv._resolveCategories).toBeCalledWith(
          sampleProduct.categories
        )
        expect(productJsonToCsv._resolveCategoryOrderHints).toBeCalledWith(
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
        await expect(
          productJsonToCsv._resolveReferences(sampleProduct)
        ).resolves.toEqual(expected)
      })
    })

    describe('::_resolveProductType', () => {
      beforeEach(() => {
        productJsonToCsv.fetchReferences = jest.fn(() =>
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
          productJsonToCsv._resolveProductType(sampleProduct.productType)
        ).toEqual({})
      })

      it('build correct request uri for productType', async () => {
        const expected = /project-key\/product-types\/product-type-id/
        await productJsonToCsv._resolveProductType(sampleProduct.productType)
        expect(productJsonToCsv.fetchReferences).toBeCalledWith(
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
        await expect(
          productJsonToCsv._resolveProductType(sampleProduct.productType)
        ).resolves.toEqual(expected)
      })
    })

    describe('::_resolveTaxCategory', () => {
      beforeEach(() => {
        productJsonToCsv.fetchReferences = jest.fn(() =>
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
          productJsonToCsv._resolveTaxCategory(sampleProduct.taxCategory)
        ).toEqual({})
      })

      it('build correct request uri for taxCategory', async () => {
        const expected = /project-key\/tax-categories\/tax-cat-id/
        await productJsonToCsv._resolveTaxCategory(sampleProduct.taxCategory)
        expect(productJsonToCsv.fetchReferences).toBeCalledWith(
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
        await expect(
          productJsonToCsv._resolveTaxCategory(sampleProduct.taxCategory)
        ).resolves.toEqual(expected)
      })
    })

    describe('::_resolveState', () => {
      beforeEach(() => {
        productJsonToCsv.fetchReferences = jest.fn(() =>
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
        expect(productJsonToCsv._resolveState(sampleProduct.state)).toEqual({})
      })

      it('build correct request uri for state', async () => {
        const expected = /project-key\/states\/state-id/
        await productJsonToCsv._resolveState(sampleProduct.state)
        expect(productJsonToCsv.fetchReferences).toBeCalledWith(
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
        await expect(
          productJsonToCsv._resolveState(sampleProduct.state)
        ).resolves.toEqual(expected)
      })
    })

    describe('::_resolveCategories', () => {
      beforeEach(() => {
        productJsonToCsv._getCategories = jest.fn(() => Promise.resolve([]))
      })

      it('return empty object if no array of `categories`', () => {
        delete sampleProduct.categories
        expect(
          productJsonToCsv._resolveCategories(sampleProduct.categories)
        ).toEqual({})
      })

      it('return resolved category objects as array', async () => {
        const resolvedCategories = [
          { id: 'cat-id-1', name: { en: 'res-cat-name-1' } },
          { id: 'cat-id-2', name: { en: 'res-cat-name-2' } },
        ]
        productJsonToCsv._getCategories.mockReturnValue(
          Promise.resolve(resolvedCategories)
        )
        const expected = {
          categories: [
            { id: 'cat-id-1', name: { en: 'res-cat-name-1' } },
            { id: 'cat-id-2', name: { en: 'res-cat-name-2' } },
          ],
        }
        await expect(
          productJsonToCsv._resolveCategories(sampleProduct.categories)
        ).resolves.toEqual(expected)
      })
    })

    describe('::_resolveCategoryOrderHints', () => {
      beforeEach(() => {
        productJsonToCsv._getCategories = jest.fn(() => Promise.resolve([]))
      })

      it('return empty object if no `categoryOrderHints`', () => {
        delete sampleProduct.categoryOrderHints
        expect(
          productJsonToCsv._resolveCategoryOrderHints(
            sampleProduct.categoryOrderHints
          )
        ).toEqual({})
      })

      it('return empty object if `categoryOrderHints` is empty', () => {
        sampleProduct.categoryOrderHints = {}
        expect(
          productJsonToCsv._resolveCategoryOrderHints(
            sampleProduct.categoryOrderHints
          )
        ).toEqual({})
      })

      it('return category name for `categoryOrderHints`', async () => {
        const resolvedCategories = [
          { id: 'cat-id-1', name: { en: 'res-cat-name-1' } },
          { id: 'cat-id-2', name: { en: 'res-cat-name-2' } },
        ]
        productJsonToCsv._getCategories.mockReturnValue(
          Promise.resolve(resolvedCategories)
        )
        const expected = {
          categoryOrderHints: {
            'res-cat-name-1': '0.012',
            'res-cat-name-2': '0.987',
          },
        }
        await expect(
          productJsonToCsv._resolveCategoryOrderHints(
            sampleProduct.categoryOrderHints
          )
        ).resolves.toEqual(expected)
      })

      it('return category keys if specified', async () => {
        productJsonToCsv.parserConfig.categoryOrderHintBy = 'key'
        const resolvedCategories = [
          { id: 'cat-id-1', key: 'res-cat-key-1' },
          { id: 'cat-id-2', key: 'res-cat-key-2' },
        ]
        productJsonToCsv._getCategories.mockReturnValue(
          Promise.resolve(resolvedCategories)
        )
        const expected = {
          categoryOrderHints: {
            'res-cat-key-1': '0.012',
            'res-cat-key-2': '0.987',
          },
        }
        await expect(
          productJsonToCsv._resolveCategoryOrderHints(
            sampleProduct.categoryOrderHints
          )
        ).resolves.toEqual(expected)
      })

      it('return externalIds if specified', async () => {
        productJsonToCsv.parserConfig.categoryOrderHintBy = 'externalId'
        const resolvedCategories = [
          { id: 'cat-id-1', externalId: 'res-cat-extId-1' },
          { id: 'cat-id-2', externalId: 'res-cat-extId-2' },
        ]
        productJsonToCsv._getCategories.mockReturnValue(
          Promise.resolve(resolvedCategories)
        )
        const expected = {
          categoryOrderHints: {
            'res-cat-extId-1': '0.012',
            'res-cat-extId-2': '0.987',
          },
        }
        await expect(
          productJsonToCsv._resolveCategoryOrderHints(
            sampleProduct.categoryOrderHints
          )
        ).resolves.toEqual(expected)
      })
    })

    describe('::_getCategories', () => {
      beforeEach(() => {
        productJsonToCsv.categoriesCache = {
          'cat-id-1': {
            id: 'cat-id-1',
            key: 'cat-key-1-in-cache',
          },
        }
        const results = [{ id: 'cat-id-2', key: 'cat-key-2-new-in-cache' }]

        productJsonToCsv.fetchReferences = jest.fn(() =>
          Promise.resolve({ body: { results } })
        )
      })

      it('return category from cache if it exists', async () => {
        const expected = [{ id: 'cat-id-1', key: 'cat-key-1-in-cache' }]
        const categoryId = ['cat-id-1']
        await expect(
          productJsonToCsv._getCategories(categoryId)
        ).resolves.toEqual(expected)
        expect(productJsonToCsv.fetchReferences).not.toBeCalled()
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
        await expect(
          productJsonToCsv._getCategories(categoryIds)
        ).resolves.toEqual(expectedCategories)
        expect(productJsonToCsv.fetchReferences).toBeCalledWith(
          expect.stringMatching(expectedUri)
        )
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
        await productJsonToCsv._getCategories(categoryIds)
        expect(productJsonToCsv.categoriesCache).toEqual(expectedCache)
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
        productJsonToCsv._getCategories = jest
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
        await expect(
          productJsonToCsv._resolveAncestors(child)
        ).resolves.toEqual(expected)
        expect(productJsonToCsv._getCategories).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('::fetchReferences', () => {
    beforeEach(() => {
      productJsonToCsv.client.execute = jest.fn()
    })
    it('should fetch reference from API from url', () => {
      const uri = 'dummy-uri'
      const expectedRequest = {
        uri,
        method: 'GET',
        headers: { Authorization: 'Bearer myAccessToken' },
      }

      productJsonToCsv.fetchReferences(uri)
      expect(productJsonToCsv.client.execute).toBeCalled()
      expect(productJsonToCsv.client.execute).toBeCalledWith(expectedRequest)
    })

    it('should fetch only once for multiple calls with same parameter', () => {
      const uri = 'dummy-uri-2'
      const expectedRequest = {
        uri,
        method: 'GET',
        headers: { Authorization: 'Bearer myAccessToken' },
      }

      productJsonToCsv.fetchReferences(uri)
      productJsonToCsv.fetchReferences(uri)
      expect(productJsonToCsv.client.execute).toHaveBeenCalledTimes(1)
      expect(productJsonToCsv.client.execute).toBeCalledWith(expectedRequest)
    })
  })
})
