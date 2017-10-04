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
        fillAllRows: false,
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
      jsonParserProduct._resolveReferences = jest.fn(() => Promise.resolve())
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
          .toBeCalledWith(sampleProduct)
        expect(jsonParserProduct._resolveTaxCategory)
          .toBeCalledWith(sampleProduct)
        expect(jsonParserProduct._resolveState)
          .toBeCalledWith(sampleProduct)
        expect(jsonParserProduct._resolveCategories)
          .toBeCalledWith(sampleProduct)
        expect(jsonParserProduct._resolveCategoryOrderHints)
          .toBeCalledWith(sampleProduct)
      })

      it('should return object with resolved refeences', async () => {
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
        expect(jsonParserProduct._resolveProductType(sampleProduct)).toEqual({})
      })

      it('build correct request uri for productType', async () => {
        const expected = /project-key\/product-types\/fake-product-type/
        await jsonParserProduct._resolveProductType(sampleProduct)
        expect(jsonParserProduct.fetchReferences)
          .toBeCalledWith(expect.stringMatching(expected))
      })

      it('return productType name if `productType` reference', async () => {
        const expected = { productType: 'resolved-name' }
        const actual = await jsonParserProduct
          ._resolveProductType(sampleProduct)
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
        expect(jsonParserProduct._resolveTaxCategory(sampleProduct)).toEqual({})
      })

      it('build correct request uri for taxCategory', async () => {
        const expected = /project-key\/tax-categories\/fake-tax-category/
        await jsonParserProduct._resolveTaxCategory(sampleProduct)
        expect(jsonParserProduct.fetchReferences)
          .toBeCalledWith(expect.stringMatching(expected))
      })

      it('return taxCategory key if `taxCategory` reference', async () => {
        const expected = { taxCategory: 'resolved-key' }
        const actual = await jsonParserProduct
          ._resolveTaxCategory(sampleProduct)
        expect(actual).toEqual(expected)
      })

      it('return taxCategory name if `taxCategory` has no key', async () => {
        jsonParserProduct.fetchReferences
          .mockReturnValue(Promise.resolve({ body: { name: 'resolved-name' } }))
        const expected = { taxCategory: 'resolved-name' }
        const actual = await jsonParserProduct
          ._resolveTaxCategory(sampleProduct)
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
        expect(jsonParserProduct._resolveState(sampleProduct)).toEqual({})
      })

      it('build correct request uri for state', async () => {
        const expected = /project-key\/states\/fake-state/
        await jsonParserProduct._resolveState(sampleProduct)
        expect(jsonParserProduct.fetchReferences)
          .toBeCalledWith(expect.stringMatching(expected))
      })

      it('return state key if `state` reference', async () => {
        const expected = { state: 'resolved-key' }
        const actual = await jsonParserProduct
          ._resolveState(sampleProduct)
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveCategories', () => {
      beforeEach(() => {
        jsonParserProduct._manageCategories = jest.fn(() => (
          Promise.resolve([])
        ))
      })

      it('return empty object if no array of `categories`', () => {
        delete sampleProduct.categories
        expect(jsonParserProduct._resolveCategories(sampleProduct)).toEqual({})
      })

      it('return category keys if array of `categories`', async () => {
        const resolvedCategories = [
          { key: 'res-cat-key-1' },
          { key: 'res-cat-key-2' },
        ]
        jsonParserProduct._manageCategories
          .mockReturnValue(Promise.resolve(resolvedCategories))
        const expected = { categories: 'res-cat-key-1;res-cat-key-2' }
        const actual = await jsonParserProduct
          ._resolveCategories(sampleProduct)
        expect(actual).toEqual(expected)
      })

      it('return externalIds if no keys in categories', async () => {
        const resolvedCategories = [
          { externalId: 'res-cat-extId-1' },
          { externalId: 'res-cat-extId-2' },
        ]
        jsonParserProduct._manageCategories
          .mockReturnValue(Promise.resolve(resolvedCategories))
        const expected = { categories: 'res-cat-extId-1;res-cat-extId-2' }
        const actual = await jsonParserProduct
          ._resolveCategories(sampleProduct)
        expect(actual).toEqual(expected)
      })
    })

    describe('::_resolveCategoryOrderHints', () => {
      beforeEach(() => {
        jsonParserProduct._manageCategories = jest.fn(() => (
          Promise.resolve([])
        ))
      })

      it('return empty object if no `categoryOrderHints`', () => {
        delete sampleProduct.categoryOrderHints
        expect(jsonParserProduct._resolveCategoryOrderHints(sampleProduct))
          .toEqual({})
      })

      it('return empty object if `categoryOrderHints` is empty', () => {
        sampleProduct.categoryOrderHints = {}
        expect(jsonParserProduct._resolveCategoryOrderHints(sampleProduct))
          .toEqual({})
      })

      it('return category keys for `categoryOrderHints`', async () => {
        const resolvedCategories = [
          { id: 'fake-cat-1', key: 'res-cat-key-1' },
          { id: 'fake-cat-2', key: 'res-cat-key-2' },
        ]
        jsonParserProduct._manageCategories
          .mockReturnValue(Promise.resolve(resolvedCategories))
        const expected = {
          categoryOrderHints: 'res-cat-key-1:0.012;res-cat-key-2:0.987',
        }
        const actual = await jsonParserProduct
          ._resolveCategoryOrderHints(sampleProduct)
        expect(actual).toEqual(expected)
      })

      it('return externalIds if no keys in categories', async () => {
        const resolvedCategories = [
          { id: 'fake-cat-1', externalId: 'res-cat-extId-1' },
          { id: 'fake-cat-2', externalId: 'res-cat-extId-2' },
        ]
        jsonParserProduct._manageCategories
          .mockReturnValue(Promise.resolve(resolvedCategories))
        const expected = {
          categoryOrderHints: 'res-cat-extId-1:0.012;res-cat-extId-2:0.987',
        }
        const actual = await jsonParserProduct
          ._resolveCategoryOrderHints(sampleProduct)
        expect(actual).toEqual(expected)
      })
    })

    describe('::_manageCategories', () => {
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
        const actual = await jsonParserProduct._manageCategories(categoryId)
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
        const actual = await jsonParserProduct._manageCategories(categoryIds)
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
        await jsonParserProduct._manageCategories(categoryIds)
        expect(jsonParserProduct.categoriesCache).toEqual(expectedCache)
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
  })
})
