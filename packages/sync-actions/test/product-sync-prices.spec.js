import shuffle from 'lodash.shuffle'
import productsSyncFn from '../src/products'

/* eslint-disable max-len */
describe('Actions', () => {
  let productsSync
  beforeEach(() => {
    productsSync = productsSyncFn()
  })

  describe('with `priceID`', () => {
    const discounted = {
      value: { centAmount: 4000, currencyCode: 'EUR' },
      discount: { typeId: 'product-discount', id: 'pd1' },
    }
    const validFrom = new Date().toISOString()

    const before = {
      id: '123',
      masterVariant: {
        id: 1,
        prices: [
          {
            id: '111',
            value: { currencyCode: 'EUR', centAmount: 1000 },
            discounted,
          },
        ],
      },
      variants: [
        {
          id: 3,
          prices: [],
        },
        {
          id: 2,
          prices: [
            {
              id: '222',
              value: { currencyCode: 'EUR', centAmount: 1000 },
              customerGroup: { typeId: 'customer-group', id: 'cg1' },
              discounted,
            },
          ],
        },
        {
          id: 4,
          prices: [
            {
              id: '223',
              value: { currencyCode: 'USD', centAmount: 1200 },
              customerGroup: { typeId: 'customer-group', id: 'cg1' },
              discounted,
            },
            {
              id: '444',
              value: { currencyCode: 'EUR', centAmount: 1000 },
              country: 'DE',
              customerGroup: { typeId: 'customer-group', id: 'cg1' },
              channel: { typeId: 'channel', id: 'ch1' },
              discounted,
            },
          ],
        },
      ],
    }

    const now = {
      id: '123',
      masterVariant: {
        id: 1,
        prices: [
          // Changed
          {
            id: '111',
            value: { currencyCode: 'EUR', centAmount: 2000 },
            country: 'US',
            discounted,
          },
        ],
      },
      variants: [
        {
          id: 2,
          // Removed
          prices: [],
        },
        {
          id: 3,
          prices: [
            // New
            {
              value: { currencyCode: 'USD', centAmount: 5000 },
              country: 'US',
              customerGroup: { typeId: 'customer-group', id: 'cg1' },
              channel: { typeId: 'channel', id: 'ch1' },
              validFrom,
            },
          ],
        },
        {
          id: 4,
          prices: [
            // No change
            {
              id: '444',
              value: { currencyCode: 'EUR', centAmount: 1000 },
              country: 'DE',
              customerGroup: { typeId: 'customer-group', id: 'cg1' },
              channel: { typeId: 'channel', id: 'ch1' },
            },
            {
              id: '223',
              value: { currencyCode: 'USD', centAmount: 1200 },
              customerGroup: { typeId: 'customer-group', id: 'cg1' },
              discounted,
            },
          ],
        },
      ],
    }

    test('should build actions for prices', () => {
      const actions = productsSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'changePrice',
          priceId: '111',
          price: {
            id: '111',
            value: { currencyCode: 'EUR', centAmount: 2000 },
            country: 'US',
          },
        },
        { action: 'removePrice', priceId: '222' },
        {
          action: 'addPrice',
          variantId: 3,
          price: {
            value: { currencyCode: 'USD', centAmount: 5000 },
            country: 'US',
            customerGroup: { typeId: 'customer-group', id: 'cg1' },
            channel: { typeId: 'channel', id: 'ch1' },
            validFrom,
          },
        },
      ])
    })

    test('should build actions for prices with discounted when enableDiscounted is set to true', () => {
      const actions = productsSync.buildActions(now, before, {
        enableDiscounted: true,
      })
      expect(actions).toEqual([
        {
          action: 'changePrice',
          priceId: '111',
          price: {
            country: 'US',
            id: '111',
            value: { currencyCode: 'EUR', centAmount: 2000 },
            discounted: {
              value: { centAmount: 4000, currencyCode: 'EUR' },
              discount: { typeId: 'product-discount', id: 'pd1' },
            },
          },
        },
        {
          action: 'changePrice',
          price: {
            channel: {
              id: 'ch1',
              typeId: 'channel',
            },
            country: 'DE',
            customerGroup: {
              id: 'cg1',
              typeId: 'customer-group',
            },
            id: '444',
            value: {
              centAmount: 1000,
              currencyCode: 'EUR',
              fractionDigits: undefined,
              type: undefined,
            },
          },
          priceId: '444',
        },
        { action: 'removePrice', priceId: '222' },
        {
          action: 'addPrice',
          variantId: 3,
          price: {
            value: { currencyCode: 'USD', centAmount: 5000 },
            country: 'US',
            customerGroup: { typeId: 'customer-group', id: 'cg1' },
            channel: { typeId: 'channel', id: 'ch1' },
            validFrom,
          },
        },
      ])
    })

    test('should not delete the discounted field from the original object', () => {
      expect('discounted' in before.masterVariant.prices[0]).toBeTruthy()
      expect('discounted' in now.masterVariant.prices[0]).toBeTruthy()
    })
  })

  test('should not build actions if prices are not set', () => {
    const before = {
      id: '123-abc',
      masterVariant: { id: 1, prices: [] },
      variants: [],
    }
    const now = {
      id: '456-def',
      masterVariant: { id: 1, prices: [] },
      variants: [],
    }

    const actions = productsSync.buildActions(now, before)
    expect(actions).toEqual([])
  })

  test('should generate PriceCustom actions before changePrice action', () => {
    const before = {
      id: '123',
      masterVariant: {
        prices: [
          {
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 1900,
              fractionDigits: 2,
            },
            id: '9fe6610f',
            country: 'DE',
            custom: {
              type: {
                typeId: 'type',
                id: '218d8068',
              },
              fields: {
                touchpoints: ['value'],
              },
            },
          },
        ],
      },
    }

    const now = {
      id: '123',
      masterVariant: {
        prices: [
          {
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 5678,
              fractionDigits: 2,
            },
            id: '9fe6610f',
            country: 'DE',
            custom: {
              type: {
                typeId: 'type',
                id: '218d8068',
              },
              fields: {
                published: false,
              },
            },
          },
        ],
      },
    }

    const actions = productsSync.buildActions(now, before)
    expect(actions).toEqual([
      {
        action: 'setProductPriceCustomField',
        name: 'touchpoints',
        priceId: '9fe6610f',
        value: undefined,
      },
      {
        action: 'setProductPriceCustomField',
        name: 'published',
        priceId: '9fe6610f',
        value: false,
      },
      {
        action: 'changePrice',
        price: {
          country: 'DE',
          custom: {
            fields: {
              published: false,
            },
            type: {
              id: '218d8068',
              typeId: 'type',
            },
          },
          id: '9fe6610f',
          value: {
            centAmount: 5678,
            currencyCode: 'EUR',
            fractionDigits: 2,
            type: 'centPrecision',
          },
        },
        priceId: '9fe6610f',
      },
    ])
  })

  describe('without `priceID`', () => {
    let actions
    const dateNow = new Date()
    const twoWeeksFromNow = new Date(Date.now() + 12096e5) // two weeks from now
    const threeWeeksFromNow = new Date(Date.now() + 12096e5 * 1.5)

    const before = {
      id: '123-abc',
      masterVariant: {
        id: 1,
        prices: [
          {
            // change
            id: '111',
            value: { currencyCode: 'EUR', centAmount: 3000 },
            country: 'US',
            customerGroup: { typeId: 'customer-group', id: 'cg1' },
            channel: { typeId: 'channel', id: 'ch1' },
          },
          {
            // change
            id: '333',
            value: { currencyCode: 'SEK', centAmount: 10000 },
            country: 'US',
            channel: { typeId: 'channel', id: 'ch1' },
          },
          {
            // keep
            id: '444',
            value: { currencyCode: 'SEK', centAmount: 25000 },
            country: 'SE',
          },
          {
            // remove
            id: '666',
            value: { currencyCode: 'GBP', centAmount: 1000 },
            country: 'UK',
            validFrom: twoWeeksFromNow,
            validUntil: threeWeeksFromNow,
          },
          {
            // change
            id: '777',
            value: { currencyCode: 'GBP', centAmount: 1000 },
            country: 'UK',
            validFrom: dateNow,
            validUntil: twoWeeksFromNow,
          },
          {
            // set price custom type
            id: '888',
            value: { currencyCode: 'GBP', centAmount: 1000 },
            country: 'UK',
            validFrom: dateNow,
            validUntil: twoWeeksFromNow,
          },
          {
            // set price custom type and field
            id: '999',
            value: { currencyCode: 'GBP', centAmount: 1000 },
            country: 'UK',
            validFrom: dateNow,
            validUntil: twoWeeksFromNow,
          },
          {
            // change price custom field
            id: '1010',
            value: { currencyCode: 'GBP', centAmount: 1000 },
            country: 'UK',
            validFrom: dateNow,
            validUntil: twoWeeksFromNow,
            custom: {
              type: {
                typeId: 'type',
                id: '5678',
              },
              fields: {
                source: 'shop',
              },
            },
          },
          {
            // remove price custom field
            id: '1111',
            value: { currencyCode: 'GBP', centAmount: 1000 },
            country: 'UK',
            validFrom: dateNow,
            validUntil: twoWeeksFromNow,
            custom: {
              type: {
                typeId: 'type',
                id: '5678',
              },
              fields: {
                source: 'shop',
              },
            },
          },
          {
            // action `changePrice` should contian custom object
            id: '2222',
            value: { currencyCode: 'GBP', centAmount: 1000 },
            country: 'UK',
            validFrom: dateNow,
            validUntil: twoWeeksFromNow,
            custom: {
              type: {
                typeId: 'type',
                id: '5678',
              },
              fields: {
                source: 'shop',
              },
            },
          },
        ],
      },
    }
    const now = {
      id: '456-def',
      masterVariant: {
        id: 1,
        prices: [
          {
            // change
            value: { currencyCode: 'EUR', centAmount: 4000 },
            country: 'US',
            customerGroup: { typeId: 'customer-group', id: 'cg1' },
            channel: { typeId: 'channel', id: 'ch1' },
          },
          {
            // change
            value: { currencyCode: 'SEK', centAmount: 15000 },
            country: 'US',
            channel: { typeId: 'channel', id: 'ch1' },
          },
          {
            // change
            value: { currencyCode: 'GBP', centAmount: 10000 },
            country: 'UK',
            validFrom: dateNow,
            validUntil: twoWeeksFromNow,
          },
          {
            // keep
            value: { currencyCode: 'SEK', centAmount: 25000 },
            country: 'SE',
          },
          {
            // add
            value: { currencyCode: 'GBP', centAmount: 1000 },
            country: 'US',
            validFrom: twoWeeksFromNow,
            validUntil: threeWeeksFromNow,
          },
          {
            // set price custom type
            id: '888',
            value: { currencyCode: 'GBP', centAmount: 1000 },
            country: 'UK',
            validFrom: dateNow,
            validUntil: twoWeeksFromNow,
            custom: {
              type: {
                typeId: 'type',
                id: '5678',
              },
            },
          },
          {
            // set price custom type and field
            id: '999',
            value: { currencyCode: 'GBP', centAmount: 1000 },
            country: 'UK',
            validFrom: dateNow,
            validUntil: twoWeeksFromNow,
            custom: {
              type: {
                typeId: 'type',
                id: '5678',
              },
              fields: {
                source: 'shop',
              },
            },
          },
          {
            // change price custom field
            id: '1010',
            value: { currencyCode: 'GBP', centAmount: 1000 },
            country: 'UK',
            validFrom: dateNow,
            validUntil: twoWeeksFromNow,
            custom: {
              type: {
                typeId: 'type',
                id: '5678',
              },
              fields: {
                source: 'random',
              },
            },
          },
          {
            // remove price custom field and type
            id: '1111',
            value: { currencyCode: 'GBP', centAmount: 1000 },
            country: 'UK',
            validFrom: dateNow,
            validUntil: twoWeeksFromNow,
          },
          {
            // action `changePrice` should contian custom object
            id: '2222',
            value: { currencyCode: 'GBP', centAmount: 2000 },
            country: 'UK',
            validFrom: dateNow,
            validUntil: twoWeeksFromNow,
            custom: {
              type: {
                typeId: 'type',
                id: '5678',
              },
              fields: {
                source: 'shop',
              },
            },
          },
        ],
      },
    }

    beforeEach(() => {
      now.masterVariant.prices = shuffle(now.masterVariant.prices)
      actions = productsSync.buildActions(now, before)
    })

    test('should build five update actions', () => {
      expect(actions).toHaveLength(14)
    })

    test('should build `changePrice` actions', () => {
      expect(actions).toEqual(
        expect.arrayContaining([
          {
            action: 'changePrice',
            priceId: '111',
            price: {
              id: '111',
              value: { currencyCode: 'EUR', centAmount: 4000 },
              country: 'US',
              customerGroup: { typeId: 'customer-group', id: 'cg1' },
              channel: { typeId: 'channel', id: 'ch1' },
            },
          },
          {
            action: 'changePrice',
            priceId: '333',
            price: {
              id: '333',
              value: { currencyCode: 'SEK', centAmount: 15000 },
              country: 'US',
              channel: { typeId: 'channel', id: 'ch1' },
            },
          },
          {
            action: 'changePrice',
            priceId: '777',
            price: {
              id: '777',
              value: { currencyCode: 'GBP', centAmount: 10000 },
              country: 'UK',
              validFrom: dateNow,
              validUntil: twoWeeksFromNow,
            },
          },
        ])
      )
    })

    test('should build `removePrice` action', () => {
      expect(actions).toEqual(
        expect.arrayContaining([
          {
            action: 'removePrice',
            priceId: '666',
          },
        ])
      )
    })

    test('should build `addPrice` action', () => {
      expect(actions).toEqual(
        expect.arrayContaining([
          {
            action: 'addPrice',
            price: {
              value: {
                currencyCode: 'GBP',
                centAmount: 1000,
              },
              country: 'US',
              validFrom: twoWeeksFromNow,
              validUntil: threeWeeksFromNow,
            },
            variantId: 1,
          },
        ])
      )
    })

    test('should build `changePrice` action without deleting `custom` prop', () => {
      expect(actions).toEqual(
        expect.arrayContaining([
          {
            action: 'changePrice',
            price: {
              id: '2222',
              value: {
                currencyCode: 'GBP',
                centAmount: 2000,
                fractionDigits: undefined,
                type: undefined,
              },
              country: 'UK',
              validFrom: dateNow,
              validUntil: twoWeeksFromNow,
              custom: {
                type: {
                  typeId: 'type',
                  id: '5678',
                },
                fields: {
                  source: 'shop',
                },
              },
            },
            priceId: '2222',
          },
        ])
      )
    })

    test('should build `setProductPriceCustomType` action without fields', () => {
      expect(actions).toEqual(
        expect.arrayContaining([
          {
            action: 'setProductPriceCustomType',
            priceId: '888',
            type: {
              id: '5678',
              typeId: 'type',
            },
          },
        ])
      )
    })

    test('should build `setProductPriceCustomType` action', () => {
      expect(actions).toEqual(
        expect.arrayContaining([
          {
            action: 'setProductPriceCustomType',
            priceId: '999',
            type: {
              id: '5678',
              typeId: 'type',
            },
            fields: {
              source: 'shop',
            },
          },
        ])
      )
    })

    test('should build `setProductPriceCustomType` action which delete custom type', () => {
      expect(actions).toEqual(
        expect.arrayContaining([
          {
            action: 'setProductPriceCustomType',
            priceId: '1111',
          },
        ])
      )
    })

    test('should build `setProductPriceCustomField` action', () => {
      expect(actions).toEqual(
        expect.arrayContaining([
          {
            action: 'setProductPriceCustomField',
            name: 'source',
            priceId: '1010',
            value: 'random',
          },
        ])
      )
    })

    test('should remove a price without id', () => {
      const oldProduct = {
        id: '123',
        version: 1,
        masterVariant: {
          id: 1,
          sku: 'v1',
          prices: [
            {
              country: 'DE',
              id: 'DE_PRICE',
              value: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 1111,
                fractionDigits: 2,
              },
            },
            {
              country: 'LT',
              id: 'LT_PRICE',
              value: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 2222,
                fractionDigits: 2,
              },
            },
            {
              country: 'IT',
              id: 'IT_PRICE',
              value: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 3333,
                fractionDigits: 2,
              },
            },
          ],
          attributes: [],
        },
        variants: [],
      }
      const newProduct = {
        id: '123',
        version: 1,
        masterVariant: {
          id: 1,
          sku: 'v1',
          prices: [
            {
              country: 'DE',
              value: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 1111,
                fractionDigits: 2,
              },
            },
            {
              country: 'IT',
              value: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 3333,
                fractionDigits: 2,
              },
            },
          ],
          attributes: [],
        },
        variants: [],
      }
      const updateActions = productsSync.buildActions(newProduct, oldProduct)
      expect(updateActions).toHaveLength(1)
      expect(updateActions).toEqual([
        {
          action: 'removePrice',
          priceId: 'LT_PRICE',
        },
      ])
    })

    test('should handle missing optional fields', () => {
      const oldProduct = {
        id: '123',
        version: 1,
        masterVariant: {
          id: 1,
          sku: 'v1',
          prices: [
            {
              country: 'DE',
              id: 'DE_PRICE',
              value: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 1111,
                fractionDigits: 2,
              },
            },
          ],
          attributes: [],
        },
        variants: [],
      }
      const newProduct = {
        id: '123',
        version: 1,
        masterVariant: {
          id: 1,
          sku: 'v1',
          prices: [
            {
              country: 'DE',
              value: {
                currencyCode: 'EUR',
                centAmount: 1111,
                // optional fields are missing here
              },
            },
          ],
          attributes: [],
        },
        variants: [],
      }
      const updateActions = productsSync.buildActions(newProduct, oldProduct)
      expect(updateActions).toHaveLength(0)
    })

    test('should sync when optional fields are different', () => {
      const oldProduct = {
        id: '123',
        version: 1,
        masterVariant: {
          id: 1,
          sku: 'v1',
          prices: [
            {
              country: 'DE',
              id: 'DE_PRICE',
              value: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 1111,
                fractionDigits: 2,
              },
            },
          ],
          attributes: [],
        },
        variants: [],
      }
      const newProduct = {
        id: '123',
        version: 1,
        masterVariant: {
          id: 1,
          sku: 'v1',
          prices: [
            {
              country: 'DE',
              value: {
                type: 'highPrecision',
                currencyCode: 'EUR',
                centAmount: 1111,
                fractionDigits: 4,
              },
            },
          ],
          attributes: [],
        },
        variants: [],
      }
      const updateActions = productsSync.buildActions(newProduct, oldProduct)
      expect(updateActions).toHaveLength(1)
      expect(updateActions).toEqual([
        {
          action: 'changePrice',
          price: {
            country: 'DE',
            id: 'DE_PRICE',
            value: {
              centAmount: 1111,
              currencyCode: 'EUR',
              fractionDigits: 4,
              type: 'highPrecision',
            },
          },
          priceId: 'DE_PRICE',
        },
      ])
    })
  })

  describe('without `country`', () => {
    let actions
    const before = {
      id: '81400c95-1de9-4431-9abd-a3eb8e0884d5',
      version: 1,
      productType: {
        typeId: 'product-type',
        id: 'c538376f-b565-4cb7-ac29-49b88b7f2acf',
      },
      name: {
        de: 'abcd',
      },
      description: {
        de: 'abcd',
      },
      categories: [],
      categoryOrderHints: {},
      slug: {
        de: 'abcd',
      },
      masterVariant: {
        id: 1,
        sku: '1111111111111',
        prices: [
          {
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 8995,
              fractionDigits: 2,
            },
            id: '7960b455-ab04-4722-a8b2-431460d60012',
            custom: {
              type: {
                typeId: 'type',
                id: 'aada6bfb-2df1-4877-90f3-6efae0fbefa8',
              },
              fields: {
                promotionDiscountType: 'VerlaengerungHZArtikel',
                promotionValidToExclusive: '2018-09-30T23:59:35.570Z',
                promotionValidFromInclusive: '2018-09-24T00:00:35.570Z',
                promotionRegularPrice: 9995,
              },
            },
          },
        ],
      },
      variants: [
        {
          id: 2,
          sku: '22222222222',
          prices: [
            {
              value: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 8995,
                fractionDigits: 2,
              },
              id: '38a9667a-976d-4bcc-8d2a-b04701e41f18',
              custom: {
                type: {
                  typeId: 'type',
                  id: 'aada6bfb-2df1-4877-90f3-6efae0fbefa8',
                },
                fields: {
                  promotionDiscountType: 'VerlaengerungHZArtikel',
                  promotionValidToExclusive: '2018-09-30T23:59:35.570Z',
                  promotionValidFromInclusive: '2018-09-24T00:00:35.570Z',
                  promotionRegularPrice: 9995,
                },
              },
            },
          ],
        },
      ],
    }

    const now = {
      id: '81400c95-1de9-4431-9abd-a3eb8e0884d5',
      version: 1,
      productType: {
        typeId: 'product-type',
        id: 'c538376f-b565-4cb7-ac29-49b88b7f2acf',
      },
      name: {
        de: 'abcd',
      },
      description: {
        de: 'abcd',
      },
      categories: [],
      categoryOrderHints: {},
      slug: {
        de: 'abcd',
      },
      masterVariant: {
        id: 1,
        sku: '1111111111111',
        prices: [
          {
            value: {
              centAmount: 6495,
              currencyCode: 'EUR',
            },
            custom: {
              type: {
                id: 'aada6bfb-2df1-4877-90f3-6efae0fbefa8',
              },
              fields: {
                promotionDiscountType: 'Tiefpreis',
                promotionRegularPrice: 8995,
                promotionValidToExclusive: 'SKU-1111111111111',
                promotionValidFromInclusive: '2018-10-02T00:00:35.570Z',
              },
            },
          },
        ],
      },
      variants: [
        {
          id: 2,
          sku: '22222222222',
          prices: [
            {
              value: {
                centAmount: 8995,
                currencyCode: 'EUR',
              },
              custom: {
                type: {
                  id: 'aada6bfb-2df1-4877-90f3-6efae0fbefa8',
                },
                fields: {
                  promotionDiscountType: 'Tiefpreis',
                  promotionRegularPrice: 9995,
                  promotionValidToExclusive: 'SKU-2222222222222',
                  promotionValidFromInclusive: '2018-10-02T00:00:35.570Z',
                },
              },
            },
          ],
        },
      ],
    }

    beforeEach(() => {
      actions = productsSync.buildActions(now, before)
    })

    test('should sync when optional fields are different', () => {
      const actionNames = actions.map((action) => action.action)

      expect(actions).toHaveLength(2)
      expect(actionNames).toEqual(['changePrice', 'changePrice'])
    })
  })

  describe('with read only prices', () => {
    const before = {
      id: '123',
      masterVariant: {
        id: 1,
        prices: Object.freeze([
          {
            id: '111',
            value: { currencyCode: 'EUR', centAmount: 1000 },
          },
        ]),
      },
    }

    const now = {
      id: '123',
      masterVariant: {
        id: 1,
        prices: Object.freeze([
          {
            id: '111',
            value: { currencyCode: 'EUR', centAmount: 2000 },
            country: 'US',
          },
        ]),
      },
    }

    test('should build actions for prices', () => {
      const actions = productsSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'changePrice',
          priceId: '111',
          price: {
            id: '111',
            value: { currencyCode: 'EUR', centAmount: 2000 },
            country: 'US',
          },
        },
      ])
    })
  })
})
