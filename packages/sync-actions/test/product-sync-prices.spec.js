import productsSyncFn from '../src/products'

/* eslint-disable max-len */
describe('Actions', () => {
  let productsSync
  beforeEach(() => {
    productsSync = productsSyncFn()
  })

  describe('build actions', () => {
    const validFrom = new Date().toISOString()
    const discounted = {
      value: { centAmount: 4000, currencyCode: 'EUR' },
      discount: { typeId: 'product-discount', id: 'pd1' },
    }

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

    it('should build actions for prices', () => {
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

    it('should not delete the discounted field from the original object', () => {
      expect('discounted' in before.masterVariant.prices[0]).toBeTruthy()
      expect('discounted' in now.masterVariant.prices[0]).toBeTruthy()
    })
  })

  it('should not build actions if prices are not set', () => {
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

  describe('build actions for scope without ID', () => {
    const shuffleArray = array =>
      array.reduce(
        (agg, val) =>
          agg.splice(Math.floor(Math.random() * agg.length), 0, val) && agg,
        []
      )

    const before = {
      id: '123-abc',
      masterVariant: {
        id: 1,
        prices: [
          {
            id: '111',
            value: { currencyCode: 'EUR', centAmount: 3000 },
            country: 'US',
            customerGroup: { typeId: 'customer-group', id: 'cg1' },
            channel: { typeId: 'channel', id: 'ch1' },
          },
          {
            id: '222',
            value: { currencyCode: 'USD', centAmount: 5000 },
            country: 'US',
            customerGroup: { typeId: 'customer-group', id: 'cg1' },
          },
          {
            id: '333',
            value: { currencyCode: 'SEK', centAmount: 10000 },
            country: 'US',
            channel: { typeId: 'channel', id: 'ch1' },
          },
        ],
      },
    }
    const pricesWithoutId = [
      {
        value: { currencyCode: 'EUR', centAmount: 4000 },
        country: 'US',
        customerGroup: { typeId: 'customer-group', id: 'cg1' },
        channel: { typeId: 'channel', id: 'ch1' },
      },
      {
        value: { currencyCode: 'USD', centAmount: 6000 },
        country: 'US',
        customerGroup: { typeId: 'customer-group', id: 'cg1' },
      },
      {
        value: { currencyCode: 'SEK', centAmount: 15000 },
        country: 'US',
        channel: { typeId: 'channel', id: 'ch1' },
      },
      {
        value: { currencyCode: 'EUR', centAmount: 1000 },
        country: 'DE',
      },
    ]
    const now = {
      id: '456-def',
      masterVariant: {
        id: 1,
        prices: shuffleArray(pricesWithoutId),
      },
    }

    it('should build actions even if id is not supplied', () => {
      const actions = productsSync.buildActions(now, before)

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
            priceId: '222',
            price: {
              id: '222',
              value: { currencyCode: 'USD', centAmount: 6000 },
              country: 'US',
              customerGroup: { typeId: 'customer-group', id: 'cg1' },
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
            action: 'addPrice',
            price: {
              country: 'DE',
              value: { centAmount: 1000, currencyCode: 'EUR' },
            },
            variantId: 1,
          },
        ])
      )
    })
  })
})
