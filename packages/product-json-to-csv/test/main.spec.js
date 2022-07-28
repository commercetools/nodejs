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
      debug: jest.fn(),
    }
    const parserConfig = {
      categoryBy: 'name',
      categoryOrderHintBy: 'name',
      delimiter: ',',
      fillAllRows: false,
      onlyMasterVariants: false,
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
    test('should initialize with defaults', () => {
      const apiConfig = {
        projectKey: 'foo',
      }
      const defaultConfig = {
        delimiter: ',',
        encoding: 'utf8',
        multiValueDelimiter: ';',
        fillAllRows: false,
        onlyMasterVariants: false,
        categoryBy: 'name',
        categoryOrderHintBy: 'name',
        language: 'en',
        languages: ['en'],
      }

      productJsonToCsv = new ProductJsonToCsv(apiConfig)
      expect(productJsonToCsv.logger).toBeDefined()
      expect(productJsonToCsv.client).toBeDefined()
      expect(productJsonToCsv.parserConfig).toEqual(defaultConfig)
    })
  })

  describe('::run', () => {
    test('should write data to single `csv` file if headers are set', () => {
      productJsonToCsv = new ProductJsonToCsv(
        { projectKey: 'project-key' },
        {
          headerFields: ['header1, header2'],
          delimiter: ';',
          encoding: 'win1250',
        }
      )
      productJsonToCsv.parse = jest.fn(() => 'foo')

      productJsonToCsv.run()
      expect(writer.writeToSingleCsvFile).toHaveBeenCalled()
      expect(writer.writeToZipFile).not.toHaveBeenCalled()
      expect(writer.writeToSingleCsvFile.mock.calls[0][4]).toEqual({
        delimiter: ';',
        encoding: 'win1250',
      })
    })

    test('should write data to `zip` file if headers are not set', () => {
      productJsonToCsv = new ProductJsonToCsv(
        { projectKey: 'project-key' },
        { delimiter: ';', encoding: 'win1250' }
      )
      productJsonToCsv.parse = jest.fn(() => 'bar')

      productJsonToCsv.run()
      expect(writer.writeToSingleCsvFile).not.toHaveBeenCalled()
      expect(writer.writeToZipFile).toHaveBeenCalled()
      expect(writer.writeToZipFile.mock.calls[0][3]).toEqual({
        delimiter: ';',
        encoding: 'win1250',
      })
    })
  })

  describe('::parse', () => {
    let outputStream
    let productStream
    beforeEach(() => {
      productJsonToCsv._resolveReferences = jest.fn((data) =>
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

    test('should take an inputStream and output highland stream', () => {
      expect(productStream.source.__HighlandStream__).toBeTruthy()
    })

    test('should log and emit error if error occurs', async () => {
      const fakeError = new Error('fake error')
      productJsonToCsv._resolveReferences = jest.fn(() =>
        Promise.reject(fakeError)
      )

      // We expect the method to resolve to undefined as a rejected promise
      // indicates the error is not handled
      await expect(productStream.toPromise(Promise)).resolves.toBeUndefined()
      expect(productJsonToCsv.logger.error).toHaveBeenCalledWith(fakeError)
      expect(outputStream.emit).toHaveBeenCalledWith('error', fakeError)
    })

    test('should process data through stream if no error occurs', async () => {
      productJsonToCsv._resolveReferences = jest.fn((data) =>
        Promise.resolve(data)
      )
      productJsonToCsv._productMapping.run = jest.fn((data) => data)
      // No headers in expected
      const expected = [
        'product-1-id',
        { en: 'my-slug-1' },
        { id: 'mv-id', key: 'mv-key' },
      ]
      await expect(productStream.collect().toPromise(Promise)).resolves.toEqual(
        expected
      )
      expect(productJsonToCsv.logger.debug).toHaveBeenCalledWith(
        expect.stringMatching('Done with conversion')
      )
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
        masterVariant: {
          prices: [
            {
              country: 'EN',
              value: {
                currencyCode: 'EUR',
                centAmount: 1234,
              },
              channel: {
                id: '123',
              },
              customerGroup: {
                id: '123',
              },
            },
            {
              country: 'GB',
              value: {
                currencyCode: 'GBP',
                centAmount: 1023,
              },
              channel: {
                id: '456',
              },
              customerGroup: {
                id: '456',
              },
            },
            {
              country: 'CA',
              value: {
                currencyCode: 'CAD',
                centAmount: 2292,
              },
            },
            {
              country: 'US',
              value: {
                currencyCode: 'USD',
                centAmount: 9383,
              },
              channel: {
                id: 'unknown',
              },
              customerGroup: {
                id: 'unknown',
              },
            },
          ],
        },
        variants: [],
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
        const channelsById = {
          '123': { id: '123', key: 'channel123' },
          '456': { id: '456', key: 'channel456' },
        }
        const customerGroupsById = {
          '123': { id: '123', key: 'customerGroup123' },
          '456': { id: '456', key: 'customerGroup456' },
        }
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
        productJsonToCsv._getChannelsById = jest.fn(() => channelsById)
        productJsonToCsv._getCustomerGroupsById = jest.fn(
          () => customerGroupsById
        )
      })

      test('should pass the products to all resolver functions', async () => {
        const resolveVariantReferencesSpy = jest.spyOn(
          productJsonToCsv,
          '_resolveVariantReferences'
        )
        const resolvePriceReferencesSpy = jest.spyOn(
          productJsonToCsv,
          '_resolvePriceReferences'
        )

        await productJsonToCsv._resolveReferences(sampleProduct)

        expect(productJsonToCsv._resolveProductType).toHaveBeenCalledWith(
          sampleProduct.productType
        )
        expect(productJsonToCsv._resolveTaxCategory).toHaveBeenCalledWith(
          sampleProduct.taxCategory
        )
        expect(productJsonToCsv._resolveState).toHaveBeenCalledWith(
          sampleProduct.state
        )
        expect(productJsonToCsv._resolveCategories).toHaveBeenCalledWith(
          sampleProduct.categories
        )
        expect(
          productJsonToCsv._resolveCategoryOrderHints
        ).toHaveBeenCalledWith(sampleProduct.categoryOrderHints)
        expect(resolveVariantReferencesSpy).toHaveBeenCalledWith(
          sampleProduct.masterVariant
        )
        expect(resolvePriceReferencesSpy).toHaveBeenCalledWith(
          sampleProduct.masterVariant.prices
        )
        expect(productJsonToCsv._getChannelsById).toHaveBeenCalledWith([
          '123',
          '456',
          'unknown',
        ])
        expect(productJsonToCsv._getCustomerGroupsById).toHaveBeenCalledWith([
          '123',
          '456',
          'unknown',
        ])
      })

      test('should return object with resolved references', async () => {
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
          masterVariant: {
            prices: [
              {
                country: 'EN',
                value: {
                  currencyCode: 'EUR',
                  centAmount: 1234,
                },
                channel: {
                  id: '123',
                  key: 'channel123',
                },
                customerGroup: {
                  id: '123',
                  key: 'customerGroup123',
                },
              },
              {
                country: 'GB',
                value: {
                  currencyCode: 'GBP',
                  centAmount: 1023,
                },
                channel: {
                  id: '456',
                  key: 'channel456',
                },
                customerGroup: {
                  id: '456',
                  key: 'customerGroup456',
                },
              },
              {
                country: 'CA',
                value: {
                  currencyCode: 'CAD',
                  centAmount: 2292,
                },
              },
              {
                country: 'US',
                value: {
                  currencyCode: 'USD',
                  centAmount: 9383,
                },
                channel: {
                  id: 'unknown',
                },
                customerGroup: {
                  id: 'unknown',
                },
              },
            ],
          },
          variants: [],
        }
        await expect(
          productJsonToCsv._resolveReferences(sampleProduct)
        ).resolves.toEqual(expected)
      })
    })

    describe('::_resolveProductType', () => {
      beforeEach(() => {
        productJsonToCsv.fetchReferences = jest.fn(() =>
          Promise.resolve([
            {
              body: {
                id: 'product-type-id',
                name: 'resolved-name',
                attributes: [{}],
              },
            },
          ])
        )
      })

      test('return empty object if no `productType` reference', () => {
        delete sampleProduct.productType
        expect(
          productJsonToCsv._resolveProductType(sampleProduct.productType)
        ).toEqual({})
      })

      test('build correct request uri for productType', async () => {
        const expected = /project-key\/product-types\/product-type-id/
        await productJsonToCsv._resolveProductType(sampleProduct.productType)
        expect(productJsonToCsv.fetchReferences).toHaveBeenCalledWith(
          expect.stringMatching(expected)
        )
      })

      test('return productType object', async () => {
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

    describe('::_resolveVariantReferences', () => {
      beforeEach(() => {
        productJsonToCsv.fetchReferences = jest.fn(() =>
          Promise.resolve([
            {
              body: {
                results: [
                  {
                    id: 'uuid',
                    name: 'resolved-name',
                    key: 'resolved-key',
                  },
                ],
              },
            },
          ])
        )
      })

      test('return undefined if variant is not defined', async () => {
        expect(await productJsonToCsv._resolveVariantReferences()).toEqual(
          undefined
        )
      })

      test('resolve a simple variant', async () => {
        const sampleVariant = {
          key: 'variantKey',
          attributes: [],
        }
        expect(
          await productJsonToCsv._resolveVariantReferences(sampleVariant)
        ).toEqual({
          key: 'variantKey',
          attributes: [],
          prices: [],
        })
      })

      test('resolve variant with prices', async () => {
        const sampleVariant = {
          key: 'variantKey',
          prices: [
            {
              value: {
                currencyCode: 'EUR',
                centAmount: 4995,
              },
            },
          ],
          attributes: [],
        }
        expect(
          await productJsonToCsv._resolveVariantReferences(sampleVariant)
        ).toEqual({
          key: 'variantKey',
          attributes: [],
          prices: [
            {
              value: {
                currencyCode: 'EUR',
                centAmount: 4995,
              },
            },
          ],
        })
      })

      test('resolve variant with prices with channels', async () => {
        const sampleVariant = {
          key: 'variantKey',
          prices: [
            {
              value: {
                currencyCode: 'EUR',
                centAmount: 4995,
              },
              channel: {
                typeId: 'channel',
                id: 'uuid',
              },
            },
          ],
          attributes: [],
        }

        expect(
          await productJsonToCsv._resolveVariantReferences(sampleVariant)
        ).toEqual({
          key: 'variantKey',
          attributes: [],
          prices: [
            {
              value: {
                currencyCode: 'EUR',
                centAmount: 4995,
              },
              channel: {
                id: 'uuid',
                name: 'resolved-name',
                key: 'resolved-key',
              },
            },
          ],
        })
      })

      test('resolve variant with prices with customerGroups', async () => {
        const sampleVariant = {
          key: 'variantKey',
          prices: [
            {
              value: {
                currencyCode: 'EUR',
                centAmount: 4995,
              },
              customerGroup: {
                typeId: 'customerGroup',
                id: 'uuid',
              },
            },
          ],
          attributes: [],
        }

        expect(
          await productJsonToCsv._resolveVariantReferences(sampleVariant)
        ).toEqual({
          key: 'variantKey',
          attributes: [],
          prices: [
            {
              value: {
                currencyCode: 'EUR',
                centAmount: 4995,
              },
              customerGroup: {
                id: 'uuid',
                name: 'resolved-name',
                key: 'resolved-key',
              },
            },
          ],
        })
      })
    })

    describe('::_resolveTaxCategory', () => {
      beforeEach(() => {
        productJsonToCsv.fetchReferences = jest.fn(() =>
          Promise.resolve([
            {
              body: {
                id: 'tax-cat-id',
                key: 'resolved-tax-cat-key',
              },
            },
          ])
        )
      })

      test('return empty object if no `taxCategory` reference', () => {
        delete sampleProduct.taxCategory
        expect(
          productJsonToCsv._resolveTaxCategory(sampleProduct.taxCategory)
        ).toEqual({})
      })

      test('build correct request uri for taxCategory', async () => {
        const expected = /project-key\/tax-categories\/tax-cat-id/
        await productJsonToCsv._resolveTaxCategory(sampleProduct.taxCategory)
        expect(productJsonToCsv.fetchReferences).toHaveBeenCalledWith(
          expect.stringMatching(expected)
        )
      })

      test('return resolved taxCategory object', async () => {
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
          Promise.resolve([
            {
              body: {
                id: 'state-id',
                key: 'res-state-key',
              },
            },
          ])
        )
      })

      test('return empty object if no `state` reference', () => {
        delete sampleProduct.state
        expect(productJsonToCsv._resolveState(sampleProduct.state)).toEqual({})
      })

      test('build correct request uri for state', async () => {
        const expected = /project-key\/states\/state-id/
        await productJsonToCsv._resolveState(sampleProduct.state)
        expect(productJsonToCsv.fetchReferences).toHaveBeenCalledWith(
          expect.stringMatching(expected)
        )
      })

      test('return resolved state object', async () => {
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

      test('return empty object if no array of `categories`', () => {
        delete sampleProduct.categories
        expect(
          productJsonToCsv._resolveCategories(sampleProduct.categories)
        ).toEqual({})
      })

      test('return resolved category objects as array', async () => {
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

      test('return empty object if no `categoryOrderHints`', () => {
        delete sampleProduct.categoryOrderHints
        expect(
          productJsonToCsv._resolveCategoryOrderHints(
            sampleProduct.categoryOrderHints
          )
        ).toEqual({})
      })

      test('return empty object if `categoryOrderHints` is empty', () => {
        sampleProduct.categoryOrderHints = {}
        expect(
          productJsonToCsv._resolveCategoryOrderHints(
            sampleProduct.categoryOrderHints
          )
        ).toEqual({})
      })

      test('return category name for `categoryOrderHints`', async () => {
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

      test('return category keys if specified', async () => {
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

      test('return externalIds if specified', async () => {
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
          Promise.resolve([{ body: { results } }])
        )
      })

      test('return category from cache if it exists', async () => {
        const expected = [{ id: 'cat-id-1', key: 'cat-key-1-in-cache' }]
        const categoryId = ['cat-id-1']
        await expect(
          productJsonToCsv._getCategories(categoryId)
        ).resolves.toEqual(expected)
        expect(productJsonToCsv.fetchReferences).not.toHaveBeenCalled()
      })

      test('fetch only data not in cache from API', async () => {
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
        expect(productJsonToCsv.fetchReferences).toHaveBeenCalledWith(
          expect.stringMatching(expectedUri)
        )
      })

      test('save fetched categories in cache', async () => {
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

      test('resolves all ancestors for a category', async () => {
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
    const payload = {
      body: {
        count: 5,
        results: [{}]
      },
    }
    beforeEach(() => {
      productJsonToCsv.client.execute = jest.fn().mockImplementation(() => Promise.resolve(payload));
    })
    test('should fetch reference from API from url', async () => {
      const uri = 'dummy-uri'
      const expectedRequest = {
        uri,
        method: 'GET',
        headers: { Authorization: 'Bearer myAccessToken' },
      }

      await productJsonToCsv.fetchReferences(uri)
      expect(productJsonToCsv.client.execute).toHaveBeenCalled()
      expect(productJsonToCsv.client.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          ...expectedRequest,
          // client.process enhances query with sort, withTotal and limit params
          uri: expect.stringMatching(uri),
        })
      )
    })

    test('should fetch only once for multiple calls with same parameter', () => {
      const uri = 'dummy-uri-2'
      const expectedRequest = {
        uri,
        method: 'GET',
        headers: { Authorization: 'Bearer myAccessToken' },
      }

      productJsonToCsv.fetchReferences(uri)
      productJsonToCsv.fetchReferences(uri)
      expect(productJsonToCsv.client.execute).toHaveBeenCalledTimes(1)
      expect(productJsonToCsv.client.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          ...expectedRequest,
          // client.process enhances query with sort, withTotal and limit params
          uri: expect.stringMatching(uri),
        })
      )
    })
  })

  describe('::fetchChannels', () => {
    beforeEach(() => {
      productJsonToCsv.fetchReferences = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve([
            {
              body: {
                results: [
                  {
                    id: 'channel-id',
                    key: 'channel-key',
                  },
                ],
              },
            },
          ])
        )
        .mockImplementation(() =>
          Promise.reject(new Error('I should not be called'))
        )
    })

    test('should fetch and cache channel from API', async () => {
      const res = await productJsonToCsv._getChannelsById(['channel-id'])

      expect(res).toEqual({
        'channel-id': {
          id: 'channel-id',
          key: 'channel-key',
        },
      })
      expect(productJsonToCsv.fetchReferences).toHaveBeenCalledWith(
        '/project-key/channels?where=id%20in%20(%22channel-id%22)'
      )
      expect(productJsonToCsv.fetchReferences).toHaveBeenCalledTimes(1)

      // should not call fetchReferences again as it was already cached
      await productJsonToCsv._getChannelsById(['channel-id'])
      expect(productJsonToCsv.fetchReferences).toHaveBeenCalledTimes(1)
    })
  })

  describe('::fetchCustomerGroups', () => {
    beforeEach(() => {
      productJsonToCsv.fetchReferences = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve([
            {
              body: {
                results: [
                  {
                    id: 'customerGroup-id',
                    key: 'customerGroup-key',
                  },
                ],
              },
            },
          ])
        )
        .mockImplementation(() =>
          Promise.reject(new Error('I should not be called'))
        )
    })

    test('should fetch and cache customerGroup from API', async () => {
      const res = await productJsonToCsv._getCustomerGroupsById([
        'customerGroup-id',
      ])

      expect(res).toEqual({
        'customerGroup-id': {
          id: 'customerGroup-id',
          key: 'customerGroup-key',
        },
      })
      expect(productJsonToCsv.fetchReferences).toHaveBeenCalledWith(
        '/project-key/customer-groups?where=id%20in%20(%22customerGroup-id%22)'
      )
      expect(productJsonToCsv.fetchReferences).toHaveBeenCalledTimes(1)

      // should not call fetchReferences again as it was already cached
      await productJsonToCsv._getCustomerGroupsById(['customerGroup-id'])
      expect(productJsonToCsv.fetchReferences).toHaveBeenCalledTimes(1)
    })
  })
})
