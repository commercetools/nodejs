import StreamTest from 'streamtest'
import { oneLineTrim } from 'common-tags'
import ProductJsonToXlsx from '../src/main'
import * as writer from '../src/writer'

jest.mock('../src/writer')

const streamTest = StreamTest.v2

describe('ProductJsonToXlsx', () => {
  let productJsonToXlsx
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
      fillAllRows: false,
      language: 'en',
      multiValueDelimiter: ';',
      onlyMasterVariants: false,
    }
    productJsonToXlsx = new ProductJsonToXlsx(
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
        multiValueDelimiter: ';',
        onlyMasterVariants: false,
        fillAllRows: false,
        categoryBy: 'name',
        categoryOrderHintBy: 'name',
        language: 'en',
      }

      productJsonToXlsx = new ProductJsonToXlsx(apiConfig)

      expect(productJsonToXlsx.logger).toBeDefined()
      expect(productJsonToXlsx.client).toBeDefined()
      expect(productJsonToXlsx.parserConfig).toMatchObject(defaultConfig)
    })
  })

  describe('::run', () => {
    test('should write data to single `xlsx` file if headers are set', () => {
      productJsonToXlsx = new ProductJsonToXlsx(
        { projectKey: 'project-key' },
        { headerFields: ['header1, header2'] }
      )
      productJsonToXlsx.parse = jest.fn(() => 'foo')

      productJsonToXlsx.run()
      expect(writer.writeToSingleXlsxFile).toBeCalled()
      expect(writer.writeToZipFile).not.toBeCalled()
    })

    test('should write data to `zip` file if headers are not set', () => {
      productJsonToXlsx.parse = jest.fn(() => 'bar')

      productJsonToXlsx.run()
      expect(writer.writeToSingleXlsxFile).not.toBeCalled()
      expect(writer.writeToZipFile).toBeCalled()
    })
  })

  describe('::parse', () => {
    let outputStream
    let productStream
    beforeEach(() => {
      productJsonToXlsx._resolveReferences = jest.fn(data =>
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
      productStream = productJsonToXlsx.parse(inputStream, outputStream)
    })

    test('should take an inputStream and output highland stream', () => {
      expect(productStream.source.__HighlandStream__).toBeTruthy()
    })

    test('should log and emit error if error occurs', async () => {
      const fakeError = new Error('fake error')
      productJsonToXlsx._resolveReferences = jest.fn(() =>
        Promise.reject(fakeError)
      )

      // We expect the method to resolve to undefined as a rejected promise
      // indicates the error is not handled
      await expect(productStream.toPromise(Promise)).resolves.toBeUndefined()
      expect(productJsonToXlsx.logger.error).toBeCalledWith(fakeError)
      expect(outputStream.emit).toBeCalledWith('error', fakeError)
    })

    test('should process data through stream if no error occurs', async () => {
      productJsonToXlsx._resolveReferences = jest.fn(data =>
        Promise.resolve(data)
      )
      productJsonToXlsx._productMapping.run = jest.fn(data => data)
      // No headers in expected
      const expected = [
        'product-1-id',
        { en: 'my-slug-1' },
        { id: 'mv-id', key: 'mv-key' },
      ]
      await expect(productStream.collect().toPromise(Promise)).resolves.toEqual(
        expected
      )
      expect(productJsonToXlsx.logger.debug).toBeCalledWith(
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
        const categoryOrderHints = {
          'res-cat-name-1': '0.015',
          'res-cat-name-2': '0.987',
        }

        productJsonToXlsx._resolveProductType = jest.fn(() => ({ productType }))
        productJsonToXlsx._resolveTaxCategory = jest.fn(() => ({ taxCategory }))
        productJsonToXlsx._resolveState = jest.fn(() => ({ state }))
        productJsonToXlsx._getChannelsById = jest.fn(() => ({ channelsById }))
        productJsonToXlsx._resolveCategories = jest.fn(() => ({ categories }))
        productJsonToXlsx._resolveCategoryOrderHints = jest.fn(() => ({
          categoryOrderHints,
        }))
        productJsonToXlsx._getChannelsById = jest.fn(() => channelsById)
      })

      test('should pass the products to all resolver functions', async () => {
        const resolveVariantReferencesSpy = jest.spyOn(
          productJsonToXlsx,
          '_resolveVariantReferences'
        )
        const resolvePriceReferencesSpy = jest.spyOn(
          productJsonToXlsx,
          '_resolvePriceReferences'
        )

        await productJsonToXlsx._resolveReferences(sampleProduct)

        expect(productJsonToXlsx._resolveProductType).toBeCalledWith(
          sampleProduct.productType
        )
        expect(productJsonToXlsx._resolveTaxCategory).toBeCalledWith(
          sampleProduct.taxCategory
        )
        expect(productJsonToXlsx._resolveState).toBeCalledWith(
          sampleProduct.state
        )
        expect(productJsonToXlsx._resolveCategories).toBeCalledWith(
          sampleProduct.categories
        )
        expect(productJsonToXlsx._resolveCategoryOrderHints).toBeCalledWith(
          sampleProduct.categoryOrderHints
        )
        expect(resolveVariantReferencesSpy).toBeCalledWith(
          sampleProduct.masterVariant
        )
        expect(resolvePriceReferencesSpy).toBeCalledWith(
          sampleProduct.masterVariant.prices
        )
        expect(productJsonToXlsx._getChannelsById).toBeCalledWith([
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
              },
            ],
          },
          variants: [],
        }
        await expect(
          productJsonToXlsx._resolveReferences(sampleProduct)
        ).resolves.toEqual(expected)
      })
    })

    describe('::_resolveProductType', () => {
      beforeEach(() => {
        productJsonToXlsx.fetchReferences = jest.fn(() =>
          Promise.resolve({
            body: {
              id: 'product-type-id',
              name: 'resolved-name',
              attributes: [{}],
            },
          })
        )
      })

      test('return empty object if no `productType` reference', () => {
        delete sampleProduct.productType
        expect(
          productJsonToXlsx._resolveProductType(sampleProduct.productType)
        ).toEqual({})
      })

      test('build correct request uri for productType', async () => {
        const expected = /project-key\/product-types\/product-type-id/
        await productJsonToXlsx._resolveProductType(sampleProduct.productType)
        expect(productJsonToXlsx.fetchReferences).toBeCalledWith(
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
          productJsonToXlsx._resolveProductType(sampleProduct.productType)
        ).resolves.toEqual(expected)
      })
    })

    describe('::_resolveVariantReferences', () => {
      beforeEach(() => {
        productJsonToXlsx.fetchReferences = jest.fn(() =>
          Promise.resolve({
            body: {
              results: [
                {
                  id: 'uuid',
                  name: 'resolved-name',
                  key: 'resolved-key',
                },
              ],
            },
          })
        )
      })

      test('return undefined if variant is not defined', async () => {
        expect(await productJsonToXlsx._resolveVariantReferences()).toEqual(
          undefined
        )
      })

      test('resolve a simple variant', async () => {
        const sampleVariant = {
          key: 'variantKey',
          attributes: [],
        }
        expect(
          await productJsonToXlsx._resolveVariantReferences(sampleVariant)
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
          await productJsonToXlsx._resolveVariantReferences(sampleVariant)
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
          await productJsonToXlsx._resolveVariantReferences(sampleVariant)
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
    })

    describe('::_resolveTaxCategory', () => {
      beforeEach(() => {
        productJsonToXlsx.fetchReferences = jest.fn(() =>
          Promise.resolve({
            body: {
              id: 'tax-cat-id',
              key: 'resolved-tax-cat-key',
            },
          })
        )
      })

      test('return empty object if no `taxCategory` reference', () => {
        delete sampleProduct.taxCategory
        expect(
          productJsonToXlsx._resolveTaxCategory(sampleProduct.taxCategory)
        ).toEqual({})
      })

      test('build correct request uri for taxCategory', async () => {
        const expected = /project-key\/tax-categories\/tax-cat-id/
        await productJsonToXlsx._resolveTaxCategory(sampleProduct.taxCategory)
        expect(productJsonToXlsx.fetchReferences).toBeCalledWith(
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
          productJsonToXlsx._resolveTaxCategory(sampleProduct.taxCategory)
        ).resolves.toEqual(expected)
      })
    })

    describe('::_resolveState', () => {
      beforeEach(() => {
        productJsonToXlsx.fetchReferences = jest.fn(() =>
          Promise.resolve({
            body: {
              id: 'state-id',
              key: 'res-state-key',
            },
          })
        )
      })

      test('return empty object if no `state` reference', () => {
        delete sampleProduct.state
        expect(productJsonToXlsx._resolveState(sampleProduct.state)).toEqual({})
      })

      test('build correct request uri for state', async () => {
        const expected = /project-key\/states\/state-id/
        await productJsonToXlsx._resolveState(sampleProduct.state)
        expect(productJsonToXlsx.fetchReferences).toBeCalledWith(
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
          productJsonToXlsx._resolveState(sampleProduct.state)
        ).resolves.toEqual(expected)
      })
    })

    describe('::_resolveCategories', () => {
      beforeEach(() => {
        productJsonToXlsx._getCategories = jest.fn(() => Promise.resolve([]))
      })

      test('return empty object if no array of `categories`', () => {
        delete sampleProduct.categories
        expect(
          productJsonToXlsx._resolveCategories(sampleProduct.categories)
        ).toEqual({})
      })

      test('return resolved category objects as array', async () => {
        const resolvedCategories = [
          { id: 'cat-id-1', name: { en: 'res-cat-name-1' } },
          { id: 'cat-id-2', name: { en: 'res-cat-name-2' } },
        ]
        productJsonToXlsx._getCategories.mockReturnValue(
          Promise.resolve(resolvedCategories)
        )
        const expected = {
          categories: [
            { id: 'cat-id-1', name: { en: 'res-cat-name-1' } },
            { id: 'cat-id-2', name: { en: 'res-cat-name-2' } },
          ],
        }
        await expect(
          productJsonToXlsx._resolveCategories(sampleProduct.categories)
        ).resolves.toEqual(expected)
      })
    })

    describe('::_resolveCategoryOrderHints', () => {
      beforeEach(() => {
        productJsonToXlsx._getCategories = jest.fn(() => Promise.resolve([]))
      })

      test('return empty object if no `categoryOrderHints`', () => {
        delete sampleProduct.categoryOrderHints
        expect(
          productJsonToXlsx._resolveCategoryOrderHints(
            sampleProduct.categoryOrderHints
          )
        ).toEqual({})
      })

      test('return empty object if `categoryOrderHints` is empty', () => {
        sampleProduct.categoryOrderHints = {}
        expect(
          productJsonToXlsx._resolveCategoryOrderHints(
            sampleProduct.categoryOrderHints
          )
        ).toEqual({})
      })

      test('return category name for `categoryOrderHints`', async () => {
        const resolvedCategories = [
          { id: 'cat-id-1', name: { en: 'res-cat-name-1' } },
          { id: 'cat-id-2', name: { en: 'res-cat-name-2' } },
        ]
        productJsonToXlsx._getCategories.mockReturnValue(
          Promise.resolve(resolvedCategories)
        )
        const expected = {
          categoryOrderHints: {
            'res-cat-name-1': '0.012',
            'res-cat-name-2': '0.987',
          },
        }
        await expect(
          productJsonToXlsx._resolveCategoryOrderHints(
            sampleProduct.categoryOrderHints
          )
        ).resolves.toEqual(expected)
      })

      test('return category keys if specified', async () => {
        productJsonToXlsx.parserConfig.categoryOrderHintBy = 'key'
        const resolvedCategories = [
          { id: 'cat-id-1', key: 'res-cat-key-1' },
          { id: 'cat-id-2', key: 'res-cat-key-2' },
        ]
        productJsonToXlsx._getCategories.mockReturnValue(
          Promise.resolve(resolvedCategories)
        )
        const expected = {
          categoryOrderHints: {
            'res-cat-key-1': '0.012',
            'res-cat-key-2': '0.987',
          },
        }
        await expect(
          productJsonToXlsx._resolveCategoryOrderHints(
            sampleProduct.categoryOrderHints
          )
        ).resolves.toEqual(expected)
      })

      test('return externalIds if specified', async () => {
        productJsonToXlsx.parserConfig.categoryOrderHintBy = 'externalId'
        const resolvedCategories = [
          { id: 'cat-id-1', externalId: 'res-cat-extId-1' },
          { id: 'cat-id-2', externalId: 'res-cat-extId-2' },
        ]
        productJsonToXlsx._getCategories.mockReturnValue(
          Promise.resolve(resolvedCategories)
        )
        const expected = {
          categoryOrderHints: {
            'res-cat-extId-1': '0.012',
            'res-cat-extId-2': '0.987',
          },
        }
        await expect(
          productJsonToXlsx._resolveCategoryOrderHints(
            sampleProduct.categoryOrderHints
          )
        ).resolves.toEqual(expected)
      })
    })

    describe('::_getCategories', () => {
      beforeEach(() => {
        productJsonToXlsx.categoriesCache = {
          'cat-id-1': {
            id: 'cat-id-1',
            key: 'cat-key-1-in-cache',
          },
        }
        const results = [{ id: 'cat-id-2', key: 'cat-key-2-new-in-cache' }]

        productJsonToXlsx.fetchReferences = jest.fn(() =>
          Promise.resolve({ body: { results } })
        )
      })

      test('return category from cache if it exists', async () => {
        const expected = [{ id: 'cat-id-1', key: 'cat-key-1-in-cache' }]
        const categoryId = ['cat-id-1']
        await expect(
          productJsonToXlsx._getCategories(categoryId)
        ).resolves.toEqual(expected)
        expect(productJsonToXlsx.fetchReferences).not.toBeCalled()
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
          productJsonToXlsx._getCategories(categoryIds)
        ).resolves.toEqual(expectedCategories)
        expect(productJsonToXlsx.fetchReferences).toBeCalledWith(
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
        await productJsonToXlsx._getCategories(categoryIds)
        expect(productJsonToXlsx.categoriesCache).toEqual(expectedCache)
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
        productJsonToXlsx._getCategories = jest
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
          productJsonToXlsx._resolveAncestors(child)
        ).resolves.toEqual(expected)
        expect(productJsonToXlsx._getCategories).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('::fetchReferences', () => {
    beforeEach(() => {
      productJsonToXlsx.client.execute = jest.fn()
    })
    test('should fetch reference from API from url', () => {
      const uri = 'dummy-uri'
      const expectedRequest = {
        uri,
        method: 'GET',
        headers: { Authorization: 'Bearer myAccessToken' },
      }

      productJsonToXlsx.fetchReferences(uri)
      expect(productJsonToXlsx.client.execute).toBeCalled()
      expect(productJsonToXlsx.client.execute).toBeCalledWith(expectedRequest)
    })

    test('should fetch only once for multiple calls with same parameter', () => {
      const uri = 'dummy-uri-2'
      const expectedRequest = {
        uri,
        method: 'GET',
        headers: { Authorization: 'Bearer myAccessToken' },
      }

      productJsonToXlsx.fetchReferences(uri)
      productJsonToXlsx.fetchReferences(uri)
      expect(productJsonToXlsx.client.execute).toHaveBeenCalledTimes(1)
      expect(productJsonToXlsx.client.execute).toBeCalledWith(expectedRequest)
    })
  })

  describe('::fetchChannels', () => {
    beforeEach(() => {
      productJsonToXlsx.fetchReferences = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            body: {
              results: [
                {
                  id: 'channel-id',
                  key: 'channel-key',
                },
              ],
            },
          })
        )
        .mockImplementation(() =>
          Promise.reject(new Error('I should not be called'))
        )
    })

    test('should fetch and cache channel from API', async () => {
      const res = await productJsonToXlsx._getChannelsById(['channel-id'])

      expect(res).toEqual({
        'channel-id': {
          id: 'channel-id',
          key: 'channel-key',
        },
      })
      expect(productJsonToXlsx.fetchReferences).toBeCalledWith(
        '/project-key/channels?where=id%20in%20(%22channel-id%22)'
      )
      expect(productJsonToXlsx.fetchReferences).toHaveBeenCalledTimes(1)

      // should not call fetchReferences again as it was already cached
      await productJsonToXlsx._getChannelsById(['channel-id'])
      expect(productJsonToXlsx.fetchReferences).toHaveBeenCalledTimes(1)
    })
  })
})
