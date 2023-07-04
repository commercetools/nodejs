import pricesSyncFn, { actionGroups } from '../src/prices'

const pricesSync = pricesSyncFn()

const dateNow = new Date()
const twoWeeksFromNow = new Date(Date.now() + 12096e5)

/* eslint-disable max-len */
describe('price actions', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'custom'])
  })

  test('should not build actions if prices are not set', () => {
    const before = {}
    const now = {}
    const actions = pricesSync.buildActions(now, before)
    expect(actions).toEqual([])
  })

  test('should not build actions if now price is not set', () => {
    const before = {
      id: '9fe6610f',
      value: {
        type: 'centPrecision',
        currencyCode: 'EUR',
        centAmount: 1900,
        fractionDigits: 2,
      },
    }
    const now = {}
    const actions = pricesSync.buildActions(now, before)
    expect(actions).toEqual([])
  })

  test('should not build actions if there is no change', () => {
    const before = {
      id: '9fe6610f',
      value: {
        type: 'centPrecision',
        currencyCode: 'EUR',
        centAmount: 1900,
        fractionDigits: 2,
      },
      discounted: {
        value: { centAmount: 4000, currencyCode: 'EGP' },
        discount: { typeId: 'product-discount', id: 'pd1' },
      },
      custom: {
        type: {
          typeId: 'type',
          id: '5678',
        },
        fields: {
          source: 'shop',
        },
      },
    }

    const now = {
      id: '9fe6610f',
      value: {
        type: 'centPrecision',
        currencyCode: 'EUR',
        centAmount: 1900,
        fractionDigits: 2,
      },
      discounted: {
        value: { centAmount: 4000, currencyCode: 'EGP' },
        discount: { typeId: 'product-discount', id: 'pd1' },
      },
      custom: {
        type: {
          typeId: 'type',
          id: '5678',
        },
        fields: {
          source: 'shop',
        },
      },
    }
    const actions = pricesSync.buildActions(now, before)
    expect(actions).toEqual([])
  })

  describe('changeValue', () => {
    test('should generate changeValue action', () => {
      const before = {
        id: '9fe6610f',
        value: {
          type: 'centPrecision',
          currencyCode: 'EUR',
          centAmount: 1900,
          fractionDigits: 2,
        },
      }

      const now = {
        id: '9fe6610f',
        value: {
          type: 'centPrecision',
          currencyCode: 'EUR',
          centAmount: 5678,
          fractionDigits: 2,
        },
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'changeValue',
          value: {
            centAmount: 5678,
            currencyCode: 'EUR',
            fractionDigits: 2,
            type: 'centPrecision',
          },
        },
      ])
    })
  })

  describe('setDiscountedPrice', () => {
    test('should build `setDiscountedPrice` action for newly discounted', () => {
      const before = {
        id: '1010',
        value: { currencyCode: 'EGP', centAmount: 1000 },
        country: 'UK',
        validFrom: dateNow,
        validUntil: twoWeeksFromNow,
      }

      const now = {
        id: '1010',
        value: { currencyCode: 'EGP', centAmount: 1000 },
        country: 'UK',
        validFrom: dateNow,
        validUntil: twoWeeksFromNow,
        discounted: {
          value: { centAmount: 4000, currencyCode: 'EGP' },
          discount: { typeId: 'product-discount', id: 'pd1' },
        },
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'setDiscountedPrice',
          discounted: {
            value: { centAmount: 4000, currencyCode: 'EGP' },
            discount: {
              typeId: 'product-discount',
              id: 'pd1',
            },
          },
        },
      ])
    })

    test('should build `setDiscountedPrice` action for removed discounted', () => {
      const before = {
        id: '1010',
        value: { currencyCode: 'EGP', centAmount: 1000 },
        country: 'UK',
        validFrom: dateNow,
        validUntil: twoWeeksFromNow,
        discounted: {
          value: { centAmount: 4000, currencyCode: 'EGP' },
          discount: { typeId: 'product-discount', id: 'pd1' },
        },
      }

      const now = {
        id: '1010',
        value: { currencyCode: 'EGP', centAmount: 1000 },
        country: 'UK',
        validFrom: dateNow,
        validUntil: twoWeeksFromNow,
        // TODO: check this
        discounted: null,
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'setDiscountedPrice',
          discounted: undefined,
        },
      ])
    })

    test('should build `setDiscountedPrice` action for changed value centAmount', () => {
      const before = {
        id: '1010',
        value: { currencyCode: 'GBP', centAmount: 1000 },
        country: 'UK',
        validFrom: dateNow,
        validUntil: twoWeeksFromNow,
        discounted: {
          value: { centAmount: 4000, currencyCode: 'EUR' },
          discount: { typeId: 'product-discount', id: 'pd1' },
        },
      }

      const now = {
        id: '1010',
        value: { currencyCode: 'GBP', centAmount: 1000 },
        country: 'UK',
        validFrom: dateNow,
        validUntil: twoWeeksFromNow,
        discounted: {
          value: { centAmount: 3000, currencyCode: 'EUR' },
          discount: { typeId: 'product-discount', id: 'pd1' },
        },
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'setDiscountedPrice',
          discounted: {
            value: { centAmount: 3000, currencyCode: 'EUR' },
            discount: {
              typeId: 'product-discount',
              id: 'pd1',
            },
          },
        },
      ])
    })
  })

  describe('setPriceTiers', () => {
    test('should  build `setPriceTiers` action if price tier are set', () => {
      const before = {}
      const now = {
        id: '9fe6610f',
        value: {
          type: 'centPrecision',
          currencyCode: 'EUR',
          centAmount: 1900,
          fractionDigits: 2,
        },
        tiers: [
          {
            minimumQuantity: 5,
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 1900,
              fractionDigits: 2,
            },
          },
        ],
      }
      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'changeValue',
          value: {
            type: 'centPrecision',
            currencyCode: 'EUR',
            centAmount: 1900,
            fractionDigits: 2,
          },
        },
        {
          action: 'setPriceTiers',
          tiers: [
            {
              minimumQuantity: 5,
              value: {
                centAmount: 1900,
                currencyCode: 'EUR',
                fractionDigits: 2,
                type: 'centPrecision',
              },
            },
          ],
        },
      ])
    })

    test('should  build `setPriceTiers` action for price tier change', () => {
      const before = {
        id: '9fe6610f',
        value: {
          type: 'centPrecision',
          currencyCode: 'EUR',
          centAmount: 1900,
          fractionDigits: 2,
        },
        tiers: [
          {
            minimumQuantity: 5,
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 1900,
              fractionDigits: 2,
            },
          },
        ],
      }
      const now = {
        id: '9fe6610f',
        value: {
          type: 'centPrecision',
          currencyCode: 'EUR',
          centAmount: 1900,
          fractionDigits: 2,
        },
        tiers: [
          {
            minimumQuantity: 5,
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 900,
              fractionDigits: 2,
            },
          },
        ],
      }
      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'setPriceTiers',
          tiers: [
            {
              minimumQuantity: 5,
              value: {
                centAmount: 900,
                currencyCode: 'EUR',
                fractionDigits: 2,
                type: 'centPrecision',
              },
            },
          ],
        },
      ])
    })

    test('should build `setPriceTiers` action for removed price tier', () => {
      const before = {
        id: '9fe6610f',
        value: {
          type: 'centPrecision',
          currencyCode: 'EUR',
          centAmount: 1900,
          fractionDigits: 2,
        },
        tiers: [
          {
            minimumQuantity: 5,
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 1900,
              fractionDigits: 2,
            },
          },
          {
            minimumQuantity: 25,
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 2900,
              fractionDigits: 2,
            },
          },
        ],
      }

      const now = {
        id: '9fe6610f',
        value: {
          type: 'centPrecision',
          currencyCode: 'EUR',
          centAmount: 1900,
          fractionDigits: 2,
        },
        tiers: [
          {
            minimumQuantity: 5,
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 1900,
              fractionDigits: 2,
            },
          },
        ],
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'setPriceTiers',
          tiers: [
            {
              minimumQuantity: 5,
              value: {
                centAmount: 1900,
                currencyCode: 'EUR',
                fractionDigits: 2,
                type: 'centPrecision',
              },
            },
          ],
        },
      ])
    })

    test('should build `setPriceTiers` action when removed all price tier', () => {
      const before = {
        id: '9fe6610f',
        value: {
          type: 'centPrecision',
          currencyCode: 'EUR',
          centAmount: 1900,
          fractionDigits: 2,
        },
        tiers: [
          {
            minimumQuantity: 5,
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 1900,
              fractionDigits: 2,
            },
          },
          {
            minimumQuantity: 25,
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 2900,
              fractionDigits: 2,
            },
          },
        ],
      }

      const now = {
        id: '9fe6610f',
        value: {
          type: 'centPrecision',
          currencyCode: 'EUR',
          centAmount: 1900,
          fractionDigits: 2,
        },
        tiers: null,
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'setPriceTiers',
          tiers: undefined,
        },
      ])
    })

    test('should not build `setPriceTiers` action when price tiers on now and then are equal', () => {
      const before = {
        id: '9fe6610f',
        value: {
          type: 'centPrecision',
          currencyCode: 'EUR',
          centAmount: 1900,
          fractionDigits: 2,
        },
        tiers: [
          {
            minimumQuantity: 5,
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 1900,
              fractionDigits: 2,
            },
          },
          {
            minimumQuantity: 25,
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 2900,
              fractionDigits: 2,
            },
          },
        ],
      }

      const now = {
        id: '9fe6610f',
        value: {
          type: 'centPrecision',
          currencyCode: 'EUR',
          centAmount: 1900,
          fractionDigits: 2,
        },
        tiers: [
          {
            minimumQuantity: 5,
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 1900,
              fractionDigits: 2,
            },
          },
          {
            minimumQuantity: 25,
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 2900,
              fractionDigits: 2,
            },
          },
        ],
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([])
    })
  })

  describe('setKey', () => {
    test('should build `setKey` action', () => {
      const key = 'test-key'

      const before = {
        id: '1010',
        key: undefined,
      }

      const now = {
        id: '1010',
        key,
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'setKey',
          key,
        },
      ])
    })
  })

  describe('setValidFrom', () => {
    test('should build `setValidFrom` action', () => {
      const before = {
        id: '1010',
        validFrom: dateNow,
        validUntil: dateNow,
      }

      const now = {
        id: '1010',
        validFrom: twoWeeksFromNow,
        validUntil: dateNow,
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'setValidFrom',
          validFrom: twoWeeksFromNow,
        },
      ])
    })
  })

  describe('setValidUntil', () => {
    test('should build `setValidUntil` action', () => {
      const before = {
        id: '1010',
        validFrom: dateNow,
        validUntil: dateNow,
      }

      const now = {
        id: '1010',
        validFrom: dateNow,
        validUntil: twoWeeksFromNow,
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'setValidUntil',
          validUntil: twoWeeksFromNow,
        },
      ])
    })
  })

  describe('setValidFromAndUntil', () => {
    it('should build `setValidFromAndUntil` action', () => {
      const before = {
        id: '1010',
        validFrom: dateNow,
        validUntil: dateNow,
      }

      const now = {
        id: '1010',
        validFrom: twoWeeksFromNow,
        validUntil: twoWeeksFromNow,
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'setValidFromAndUntil',
          validFrom: twoWeeksFromNow,
          validUntil: twoWeeksFromNow,
        },
      ])
    })
  })

  describe('changeActive', () => {
    test('should build `changeActive` action', () => {
      const before = {
        id: '1010',
        active: false,
      }

      const now = {
        id: '1010',
        active: true,
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'changeActive',
          active: true,
        },
      ])
    })
  })

  describe('setCustomType', () => {
    test('should build `setCustomType` action without fields', () => {
      const before = {
        id: '888',
        value: { currencyCode: 'GBP', centAmount: 1000 },
        country: 'UK',
        validFrom: dateNow,
        validUntil: twoWeeksFromNow,
      }

      const now = {
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
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'setCustomType',
          type: {
            id: '5678',
            typeId: 'type',
          },
        },
      ])
    })

    test('should build `setCustomType` action', () => {
      const before = {
        id: '999',
        value: { currencyCode: 'GBP', centAmount: 1000 },
        country: 'UK',
        validFrom: dateNow,
        validUntil: twoWeeksFromNow,
      }

      const now = {
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
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'setCustomType',
          type: {
            id: '5678',
            typeId: 'type',
          },
          fields: {
            source: 'shop',
          },
        },
      ])
    })

    test('should build `setCustomType` action which delete custom type', () => {
      const before = {
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
      }

      const now = {
        // remove price custom field and type
        id: '1111',
        value: { currencyCode: 'GBP', centAmount: 1000 },
        country: 'UK',
        validFrom: dateNow,
        validUntil: twoWeeksFromNow,
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'setCustomType',
        },
      ])
    })
  })

  describe('setCustomField', () => {
    test('should generate `setCustomField` actions', () => {
      const before = {
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
      }

      const now = {
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
            published: false,
          },
        },
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'setCustomField',
          name: 'touchpoints',
          value: undefined,
        },
        {
          action: 'setCustomField',
          name: 'published',
          value: false,
        },
      ])
    })

    test('should build `setCustomField` action', () => {
      const before = {
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
      }

      const now = {
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
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'setCustomField',
          name: 'source',
          value: 'random',
        },
      ])
    })

    test('should build three `setCustomField` action', () => {
      const before = {
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
            source2: 'shop2',
            source3: 'shop3',
            source4: 'shop4',
          },
        },
      }

      const now = {
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
            source2: 'random2',
            source3: 'random3',
            source4: 'shop4',
          },
        },
      }

      const actions = pricesSync.buildActions(now, before)
      expect(actions).toEqual([
        {
          action: 'setCustomField',
          name: 'source',
          value: 'random',
        },
        {
          action: 'setCustomField',
          name: 'source2',
          value: 'random2',
        },
        {
          action: 'setCustomField',
          name: 'source3',
          value: 'random3',
        },
      ])
    })
  })
})
