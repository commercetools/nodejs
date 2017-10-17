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
        batchSize: 5,
        delimiter: ',',
        multiValueDelimiter: ';',
        fillAllRows: false,
        headers: true,
        categoryBy: 'namedPath',
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
      jsonParserProduct._formatProducts = jest.fn(data => data)
      jsonParserProduct.logger.error = jest.fn()
    })

    it('should accept 2 streams and write to output stream', (done) => {
      const product1 = '{"id": "product-1-id", "slug": {"en": "my-slug-1"}}'
      const product2 = '{"id": "product-2-id", "slug": {"en": "my-slug-2"}}'
      const myChunk = `${product1}\n${product2}`
      const inputStream = streamTest.fromChunks([myChunk])

      const outputStream = streamTest.toChunks((error, result) => {
        const actualCsv = result.map(row => row.toString())
        expect(actualCsv[0]).toMatch(/id,slug.en/)
        expect(actualCsv[1]).toMatch(/product-1-id,my-slug-1/)
        expect(actualCsv[2]).toMatch(/product-2-id,my-slug-2/)
        done()
      })
      jsonParserProduct.parse(inputStream, outputStream)
    })

    it('should log error and exit on errors', (done) => {
      const product1 = '{"id": "product-1-id", "slug": {"en": "my-slug-1"}}'
      // invalid json to generate error
      const product2 = '{"id": "product-2-id", "slug": {en: "my-slug-2}}'
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
        productType: { id: 'fake-product-type' },
        taxCategory: { id: 'fake-tax-category' },
        state: { id: 'fake-state' },
        categories: [{ id: 'fake-cat-1' }, { id: 'fake-cat-2' }],
        categoryOrderHints: { 'fake-cat-1': '0.012', 'fake-cat-2': '0.987' },
      }
    })

    describe('::_resolveReferences', () => {
      beforeEach(() => {
        jsonParserProduct._resolveProductType = jest.fn(() => (
          { productType: 'resolved-product-type' }
        ))
        jsonParserProduct._resolveTaxCategory = jest.fn(() => (
          { taxCategory: 'resolved-tax-category' }
        ))
        jsonParserProduct._resolveState = jest.fn(() => (
          { state: 'resolved-state' }
        ))
        jsonParserProduct._resolveCategories = jest.fn(() => (
          { categories: ['resolved-cat-1', 'resolved-cat-2'] }
        ))
        jsonParserProduct._resolveCategoryOrderHints = jest.fn(() => (
          { categoryOrderHints: ['res-cat-1':'0.012', 'res-cat-2':'0.987'] }
        ))
      })

      it('should pass the products to all resolver functions', async () => {
        await jsonParserProduct._resolveReferences([sampleProduct])

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
        const expected = [{
          id: 'myProduct-1',
          productType: 'resolved-product-type',
          taxCategory: 'resolved-tax-category',
          state: 'resolved-state',
          categories: ['resolved-cat-1', 'resolved-cat-2'],
          categoryOrderHints: ['res-cat-1':'0.012', 'res-cat-2':'0.987'],
        }]
        const actual = await jsonParserProduct
          ._resolveReferences([sampleProduct])
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveProductType', () => {
      beforeEach(() => {
        jsonParserProduct.fetchReferences = jest.fn(() => (
          Promise.resolve({ body: { name: 'resolved-name' } })
        ))
      })

      it('return empty object if no `productType` reference', () => {
        delete sampleProduct.productType
        expect(jsonParserProduct._resolveProductType(sampleProduct.productType))
          .toEqual({})
      })

      it('build correct request uri for productType', async () => {
        const expected = /project-key\/product-types\/fake-product-type/
        await jsonParserProduct._resolveProductType(sampleProduct.productType)
        expect(jsonParserProduct.fetchReferences)
          .toBeCalledWith(expect.stringMatching(expected))
      })

      it('return productType name if `productType` reference', async () => {
        const expected = { productType: 'resolved-name' }
        const actual = await jsonParserProduct
          ._resolveProductType(sampleProduct.productType)
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveTaxCategory', () => {
      beforeEach(() => {
        jsonParserProduct.fetchReferences = jest.fn(() => (
          Promise.resolve({ body: { key: 'resolved-key' } })
        ))
      })

      it('return empty object if no `taxCategory` reference', () => {
        delete sampleProduct.taxCategory
        expect(jsonParserProduct._resolveTaxCategory(sampleProduct.taxCategory))
          .toEqual({})
      })

      it('build correct request uri for taxCategory', async () => {
        const expected = /project-key\/tax-categories\/fake-tax-category/
        await jsonParserProduct._resolveTaxCategory(sampleProduct.taxCategory)
        expect(jsonParserProduct.fetchReferences)
          .toBeCalledWith(expect.stringMatching(expected))
      })

      it('return taxCategory key if `taxCategory` reference', async () => {
        const expected = { taxCategory: 'resolved-key' }
        const actual = await jsonParserProduct
          ._resolveTaxCategory(sampleProduct.taxCategory)
        expect(actual).toEqual(expected)
      })

      it('return taxCategory name if `taxCategory` has no key', async () => {
        jsonParserProduct.fetchReferences
          .mockReturnValue(Promise.resolve({ body: { name: 'resolved-name' } }))
        const expected = { taxCategory: 'resolved-name' }
        const actual = await jsonParserProduct
          ._resolveTaxCategory(sampleProduct.taxCategory)
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveState', () => {
      beforeEach(() => {
        jsonParserProduct.fetchReferences = jest.fn(() => (
          Promise.resolve({ body: { key: 'resolved-key' } })
        ))
      })

      it('return empty object if no `state` reference', () => {
        delete sampleProduct.state
        expect(jsonParserProduct._resolveState(sampleProduct.state))
          .toEqual({})
      })

      it('build correct request uri for state', async () => {
        const expected = /project-key\/states\/fake-state/
        await jsonParserProduct._resolveState(sampleProduct.state)
        expect(jsonParserProduct.fetchReferences)
          .toBeCalledWith(expect.stringMatching(expected))
      })

      it('return state key if `state` reference', async () => {
        const expected = { state: 'resolved-key' }
        const actual = await jsonParserProduct
          ._resolveState(sampleProduct.state)
        expect(actual).toEqual(expected)
      })
    })

    fdescribe('::_resolveCategories', () => {
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

      it('return category name if array of `categories`', async () => {
        const resolvedCategories = [
          { name: { en: 'res-cat-name-1' } },
          { name: { en: 'res-cat-name-2' } },
        ]
        jsonParserProduct._getCategories
          .mockReturnValue(Promise.resolve(resolvedCategories))
        const expected = { categories: 'res-cat-name-1;res-cat-name-2' }
        const actual = await jsonParserProduct
          ._resolveCategories(sampleProduct.categories)
        expect(actual).toEqual(expected)
      })

      it('return category keys if specified', async () => {
        jsonParserProduct.parserConfig.categoryBy = 'key'
        const resolvedCategories = [
          { key: 'res-cat-key-1' },
          { key: 'res-cat-key-2' },
        ]
        jsonParserProduct._getCategories
          .mockReturnValue(Promise.resolve(resolvedCategories))
        const expected = { categories: 'res-cat-key-1;res-cat-key-2' }
        const actual = await jsonParserProduct
          ._resolveCategories(sampleProduct.categories)
        expect(actual).toEqual(expected)
      })

      it('return externalIds if specified', async () => {
        jsonParserProduct.parserConfig.categoryBy = 'externalId'
        const resolvedCategories = [
          { externalId: 'res-cat-extId-1' },
          { externalId: 'res-cat-extId-2' },
        ]
        jsonParserProduct._getCategories
          .mockReturnValue(Promise.resolve(resolvedCategories))
        const expected = { categories: 'res-cat-extId-1;res-cat-extId-2' }
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
          { id: 'fake-cat-1', name: { en: 'res-cat-name-1' } },
          { id: 'fake-cat-2', name: { en: 'res-cat-name-2' } },
        ]
        jsonParserProduct._getCategories
          .mockReturnValue(Promise.resolve(resolvedCategories))
        const expected = {
          categoryOrderHints: 'res-cat-name-1:0.012;res-cat-name-2:0.987',
        }
        const actual = await jsonParserProduct
          ._resolveCategoryOrderHints(sampleProduct.categoryOrderHints)
        expect(actual).toEqual(expected)
      })

      it('return category keys if specified', async () => {
        jsonParserProduct.parserConfig.categoryOrderHintBy = 'key'
        const resolvedCategories = [
          { id: 'fake-cat-1', key: 'res-cat-key-1' },
          { id: 'fake-cat-2', key: 'res-cat-key-2' },
        ]
        jsonParserProduct._getCategories
          .mockReturnValue(Promise.resolve(resolvedCategories))
        const expected = {
          categoryOrderHints: 'res-cat-key-1:0.012;res-cat-key-2:0.987',
        }
        const actual = await jsonParserProduct
          ._resolveCategoryOrderHints(sampleProduct.categoryOrderHints)
        expect(actual).toEqual(expected)
      })

      it('return externalIds if specified', async () => {
        jsonParserProduct.parserConfig.categoryOrderHintBy = 'externalId'
        const resolvedCategories = [
          { id: 'fake-cat-1', externalId: 'res-cat-extId-1' },
          { id: 'fake-cat-2', externalId: 'res-cat-extId-2' },
        ]
        jsonParserProduct._getCategories
          .mockReturnValue(Promise.resolve(resolvedCategories))
        const expected = {
          categoryOrderHints: 'res-cat-extId-1:0.012;res-cat-extId-2:0.987',
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

    describe('::_retrieveNamedPath', () => {
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
        const expected = 'grand-parent-cat-name>parent-cat-name>child-cat-name'
        const actual = await jsonParserProduct._retrieveNamedPath(child)
        expect(jsonParserProduct._getCategories).toHaveBeenCalledTimes(2)
        expect(actual).toMatch(expected)
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

  describe('Product structure', () => {
    describe('::_formatProducts', () => {
      const p1 = { id: 'product-1-id', slug: { en: 'my-slug-1' } }
      const p2 = { id: 'product-2-id', slug: { en: 'my-slug-2' } }
      const products = [p1, p2]
      beforeAll(() => {
        jest.spyOn(JSONParserProduct, '_mergeVariants')
          .mockImplementation(data => ({ ...data, mergedVariants: true }))
        jest.spyOn(JSONParserProduct, '_stringFromImages')
          .mockImplementation(data => ({ ...data, imageAsString: true }))
        jest.spyOn(JSONParserProduct, '_variantToProduct')
          .mockImplementation(data => ({ ...data, variantAtTopLevel: true }))
      })

      afterAll(() => {
        JSONParserProduct._mergeVariants.mockRestore()
        JSONParserProduct._stringFromImages.mockRestore()
        JSONParserProduct._variantToProduct.mockRestore()
      })

      it('should pass the products to all formatting functions', () => {
        jsonParserProduct._formatProducts(products)
        expect(JSONParserProduct._mergeVariants).toHaveBeenCalledTimes(2)
        expect(JSONParserProduct._stringFromImages).toHaveBeenCalledTimes(2)
        expect(JSONParserProduct._variantToProduct).toHaveBeenCalledTimes(2)
      })

      it('should return processed products from all methods', () => {
        const expected = [{
          id: 'product-1-id',
          slug: { en: 'my-slug-1' },
          mergedVariants: true,
          imageAsString: true,
          variantAtTopLevel: true,
        }, {
          id: 'product-2-id',
          slug: { en: 'my-slug-2' },
          mergedVariants: true,
          imageAsString: true,
          variantAtTopLevel: true,
        }]
        const actual = jsonParserProduct._formatProducts(products)

        expect(actual).toEqual(expected)
      })
    })
    describe('::_mergeVariants', () => {
      it('should merge all variants in a product into one property', () => {
        const sampleProduct = {
          masterVariant: { id: 1 },
          variants: [{ id: 2 }, { id: 3 }],
        }
        const expected = {
          variant: [{ id: 1 }, { id: 2 }, { id: 3 }],
        }
        const actual = JSONParserProduct._mergeVariants(sampleProduct)
        expect(actual).toEqual(expected)
      })
    })

    describe('::_stringFromImage', () => {
      let sampleProduct
      beforeEach(() => {
        sampleProduct = {
          name: { en: 'my-fresh-product' },
          variant: [{
            id: 1,
            images: [{
              url: 'image1/master',
              dimensions: { w: 10, h: 15 },
              label: 'masterVariant',
            }],
          }, {
            id: 2,
            images: [{
              url: 'image1/var2',
              dimensions: { w: 5, h: 5 },
              label: 'foo',
            }, {
              url: 'image2/var2',
              dimensions: { w: 10, h: 5 },
              label: 'foo-2',
            }],
          }],
        }
      })

      it('should extract a csv-ready string from image object', () => {
        const expected = {
          name: { en: 'my-fresh-product' },
          variant: [{
            id: 1, images: 'image1/master|10|15|masterVariant',
          }, {
            id: 2, images: 'image1/var2|5|5|foo;image2/var2|10|5|foo-2',
          }],
        }
        const actual = JSONParserProduct._stringFromImages(sampleProduct, ';')
        expect(actual).toEqual(expected)
      })

      it('should not display `undefined` if label is empty', () => {
        const expected = {
          name: { en: 'my-fresh-product' },
          variant: [{
            id: 1, images: 'image1/master|10|15|',
          }, {
            id: 2, images: 'image1/var2|5|5|foo;image2/var2|10|5|foo-2',
          }],
        }
        delete sampleProduct.variant[0].images[0].label
        const actual = JSONParserProduct._stringFromImages(sampleProduct, ';')
        expect(actual).toEqual(expected)
      })
    })

    describe('::_variantToProduct', () => {
      const sampleProduct = {
        name: { en: 'my-fresh-product' },
        description: { en: 'sample product object' },
        variant: [
          { id: 'masterVariant' },
          { id: 'variant-2' },
          { id: 'variant-3' },
        ],
      }

      it('multiply product data for each variant if `fillAllRows`', () => {
        const expected = [{
          name: { en: 'my-fresh-product' },
          description: { en: 'sample product object' },
          variant: { id: 'masterVariant' },
        }, {
          name: { en: 'my-fresh-product' },
          description: { en: 'sample product object' },
          variant: { id: 'variant-2' },
        }, {
          name: { en: 'my-fresh-product' },
          description: { en: 'sample product object' },
          variant: { id: 'variant-3' },
        }]
        const actual = JSONParserProduct._variantToProduct(sampleProduct, true)
        expect(actual).toEqual(expected)
      })

      it('not multiply product data for each variant if no fillAllRows', () => {
        const expected = [{
          name: { en: 'my-fresh-product' },
          description: { en: 'sample product object' },
          variant: { id: 'masterVariant' },
        }, {
          variant: { id: 'variant-2' },
        }, {
          variant: { id: 'variant-3' },
        }]
        const actual = JSONParserProduct._variantToProduct(sampleProduct, false)
        expect(actual).toEqual(expected)
      })
    })

    describe('::_removePrices', () => {
      it('should return original object if no prices in variant object', () => {
        const product = { id: 'product-1-id', slug: { en: 'my-slug-1' } }
        const actual = JSONParserProduct._removePrices(product)
        expect(actual).toBe(product)
      })

      it('should return object without variant prices', () => {
        const product = {
          id: 'product-1-id',
          variant: { prices: ['price-1', 'price-2'] },
        }
        const expected = {
          id: 'product-1-id',
          variant: {},
        }
        const actual = JSONParserProduct._removePrices(product)
        expect(actual).not.toBe(product)
        expect(actual).toEqual(expected)
      })
    })

    describe('::_removeEmptyObjects', () => {
      it('set empty objects to empty string from object properties', () => {
        const sampleProduct = {
          id: 'I should remain',
          key: 'me too',
          categoryOrderHints: {},
          attributes: {},
        }
        const expected = {
          id: 'I should remain',
          key: 'me too',
          categoryOrderHints: '',
          attributes: '',
        }
        const actual = JSONParserProduct._removeEmptyObjects(sampleProduct)
        expect(actual).toEqual(expected)
      })
    })
  })
})
