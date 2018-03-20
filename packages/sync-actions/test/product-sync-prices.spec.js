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

  describe('build actions for prices without ID', () => {
    const validFrom = new Date()
    const validUntil = new Date(Date.now() + 12096e5) // two weeks from now

    const validFromThreeWeeksFromNow = new Date(Date.now() + 12096e5 * 1.5)
    const validUntilFourWeeksFromNow = new Date(Date.now() + 12096e5 * 2)

    const before = {
      id: '123-abc',
      masterVariant: {
        id: 1,
      },
    }
    const now = {
      id: '456-def',
      masterVariant: {
        id: 1,
      },
    }

    it('should build changePrice actions to update centAmount through priceSelection if there is no priceId', () => {
      before.masterVariant.prices = [
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
        {
          id: '666',
          value: { currencyCode: 'GBP', centAmount: 1000 },
          country: 'UK',
          validFrom,
          validUntil,
        },
      ]

      now.masterVariant.prices = [
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
          value: { currencyCode: 'GBP', centAmount: 10000 },
          country: 'UK',
          validFrom,
          validUntil,
        },
      ]

      const actions = productsSync.buildActions(now, before)

      expect(actions).toEqual([
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
          action: 'changePrice',
          priceId: '666',
          price: {
            id: '666',
            value: { currencyCode: 'GBP', centAmount: 10000 },
            country: 'UK',
            validFrom,
            validUntil,
          },
        },
      ])
    })

    it('should build changePrice actions to update dates when validFrom or validUntil priceSelection matches and there is no priceId', () => {
      before.masterVariant.prices = [
        {
          value: { currencyCode: 'GBP', centAmount: 123 },
          id: '888',
          country: 'UK',
          validFrom: '2018-01-01T00:00:00.000Z',
          validUntil: '2018-01-31T00:00:00.000Z',
        },
        {
          value: { currencyCode: 'GBP', centAmount: 123 },
          id: '999',
          country: 'UK',
          validFrom: '2018-02-01T00:00:00.000Z',
          validUntil: '2018-02-28T00:00:00.000Z',
        },
      ]
      now.masterVariant.prices = [
        {
          value: { currencyCode: 'GBP', centAmount: 123 },
          country: 'UK',
          validFrom: '2018-01-01T00:00:00.000Z',
          validUntil: '2018-01-15T00:00:00.000Z',
        },
        {
          value: { currencyCode: 'GBP', centAmount: 123 },
          country: 'UK',
          validFrom: '2018-02-15T00:00:00.000Z',
          validUntil: '2018-02-28T00:00:00.000Z',
        },
      ]
      const actions = productsSync.buildActions(now, before)

      expect(actions).toEqual([
        {
          action: 'changePrice',
          priceId: '888',
          price: {
            id: '888',
            value: { currencyCode: 'GBP', centAmount: 123 },
            country: 'UK',
            validFrom: '2018-01-01T00:00:00.000Z',
            validUntil: '2018-01-15T00:00:00.000Z',
          },
        },
        {
          action: 'changePrice',
          priceId: '999',
          price: {
            id: '999',
            value: { currencyCode: 'GBP', centAmount: 123 },
            country: 'UK',
            validFrom: '2018-02-15T00:00:00.000Z',
            validUntil: '2018-02-28T00:00:00.000Z',
          },
        },
      ])
    })

    it('should not delete entries found with priceSelection and build addPrice actions for entries outside of priceSelection scope', () => {
      before.masterVariant.prices = [
        {
          id: '444',
          value: { currencyCode: 'SEK', centAmount: 25000 },
          country: 'SE',
        },
        {
          id: '555',
          value: { currencyCode: 'EUR', centAmount: 1000 },
          country: 'DE',
          validFrom,
          validUntil,
        },
        {
          id: '777',
          value: { currencyCode: 'GBP', centAmount: 1250 },
          country: 'US',
          validFrom,
          validUntil,
        },
      ]

      now.masterVariant.prices = [
        {
          value: { currencyCode: 'EUR', centAmount: 1000 },
          country: 'DE',
          validFrom,
          validUntil,
        },
        {
          value: { currencyCode: 'SEK', centAmount: 25000 },
          country: 'SE',
        },
        {
          value: { currencyCode: 'SEK', centAmount: 25000 },
          country: 'SE',
          validFrom,
          validUntil,
        },
        { value: { currencyCode: 'EUR', centAmount: 1000 }, country: 'DE' },
        {
          value: { currencyCode: 'GBP', centAmount: 1250 },
          country: 'US',
          validFrom,
          validUntil,
        },
        {
          value: { currencyCode: 'GBP', centAmount: 1250 },
          country: 'US',
          validFrom: validFromThreeWeeksFromNow,
          validUntil: validUntilFourWeeksFromNow,
        },
      ]

      const actions = productsSync.buildActions(now, before)

      expect(actions).toEqual([
        {
          action: 'addPrice',
          price: {
            value: { currencyCode: 'SEK', centAmount: 25000 },
            country: 'SE',
            validFrom,
            validUntil,
          },
          variantId: 1,
        },
        {
          action: 'addPrice',
          price: {
            country: 'DE',
            value: { centAmount: 1000, currencyCode: 'EUR' },
          },
          variantId: 1,
        },
        {
          action: 'addPrice',
          price: {
            value: { currencyCode: 'GBP', centAmount: 1250 },
            country: 'US',
            validFrom: validFromThreeWeeksFromNow,
            validUntil: validUntilFourWeeksFromNow,
          },
          variantId: 1,
        },
      ])
    })

    it('should build changePrice actions if validFrom/Until dates are overlapping and the rest of priceSelection scope is equal', () => {
      before.masterVariant.prices = [
        {
          id: '666',
          value: { currencyCode: 'GBP', centAmount: 1000 },
          country: 'UK',
          validFrom, // from now
          validUntil: validFromThreeWeeksFromNow,
        },
        {
          id: '777',
          value: { currencyCode: 'USD', centAmount: 2000 },
          country: 'US',
          validFrom: validUntil, // two weeks from now
          validUntil: validUntilFourWeeksFromNow,
        },
      ]
      now.masterVariant.prices = [
        {
          value: { currencyCode: 'GBP', centAmount: 1000 },
          country: 'UK',
          validFrom: validUntil, // two weeks from now
          validUntil: validUntilFourWeeksFromNow,
        },
        {
          value: { currencyCode: 'USD', centAmount: 2000 },
          country: 'US',
          validFrom, // from now
          validUntil: validFromThreeWeeksFromNow,
        },
      ]
      const actions = productsSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'changePrice',
          priceId: '666',
          price: {
            id: '666',
            value: { currencyCode: 'GBP', centAmount: 1000 },
            country: 'UK',
            validFrom: validUntil,
            validUntil: validUntilFourWeeksFromNow,
          },
        },
        {
          action: 'changePrice',
          priceId: '777',
          price: {
            id: '777',
            value: { currencyCode: 'USD', centAmount: 2000 },
            country: 'US',
            validFrom,
            validUntil: validFromThreeWeeksFromNow,
          },
        },
      ])
    })

    it('should build remove- and addPrice actions if validFrom/Until dates are not overlapping', () => {
      before.masterVariant.prices = [
        {
          id: '666',
          value: { currencyCode: 'GBP', centAmount: 1000 },
          country: 'UK',
          validFrom, // from now
          validUntil, // two weeks from now
        },
      ]
      now.masterVariant.prices = [
        {
          value: { currencyCode: 'GBP', centAmount: 1000 },
          country: 'UK',
          validFrom: validFromThreeWeeksFromNow,
          validUntil: validUntilFourWeeksFromNow,
        },
      ]
      const actions = productsSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'removePrice',
          priceId: '666',
        },
        {
          action: 'addPrice',
          price: {
            value: { currencyCode: 'GBP', centAmount: 1000 },
            country: 'UK',
            validFrom: validFromThreeWeeksFromNow,
            validUntil: validUntilFourWeeksFromNow,
          },
          variantId: 1,
        },
      ])
    })
  })
})
