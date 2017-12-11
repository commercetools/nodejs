import cartDiscountsSyncFn, { actionGroups } from '../src/cart-discounts'
import { baseActionsList } from '../src/cart-discounts-actions'

describe('Cart Discounts Exports', () => {
  it('action group list', () => {
    expect(actionGroups).toEqual(['base'])
  })

  describe('action list', () => {
    it('should contain `changeIsActive` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'changeIsActive', key: 'isActive' }])
      )
    })

    it('should contain `changeName` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'changeName', key: 'name' }])
      )
    })

    it('should contain `changeCartPredicate` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changeCartPredicate',
            key: 'cartPredicate',
          },
        ])
      )
    })

    it('should contain `changeSortOrder` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          { action: 'changeSortOrder', key: 'sortOrder' },
        ])
      )
    })

    it('should contain `changeValue` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'changeValue', key: 'value' }])
      )
    })

    it('should contain `changeRequiresDiscountCode` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changeRequiresDiscountCode',
            key: 'requiresDiscountCode',
          },
        ])
      )
    })

    it('should contain `changeTarget` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'changeTarget', key: 'target' }])
      )
    })

    it('should contain `setDescription` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'setDescription',
            key: 'description',
          },
        ])
      )
    })

    it('should contain `setValidFrom` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'setValidFrom', key: 'validFrom' }])
      )
    })

    it('should contain `setValidUntil` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'setValidUntil', key: 'validUntil' }])
      )
    })

    it('should contain `changeStackingMode` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changeStackingMode',
            key: 'stackingMode',
          },
        ])
      )
    })
  })
})

describe('Cart Discounts Actions', () => {
  let cartDiscountsSync
  beforeEach(() => {
    cartDiscountsSync = cartDiscountsSyncFn()
  })

  it('should build the `changeIsActive` action', () => {
    const before = {
      isActive: false,
    }

    const now = {
      isActive: true,
    }

    const expected = [
      {
        action: 'changeIsActive',
        isActive: true,
      },
    ]
    const actual = cartDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  it('should build the `changeName` action', () => {
    const before = {
      name: { en: 'en-name-before', de: 'de-name-before' },
    }

    const now = {
      name: { en: 'en-name-now', de: 'de-name-now' },
    }

    const expected = [
      {
        action: 'changeName',
        name: { en: 'en-name-now', de: 'de-name-now' },
      },
    ]
    const actual = cartDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  it('should build the `changeCartPredicate` action', () => {
    const before = {
      cartPredicate: '1=1',
    }

    const now = {
      cartPredicate: 'sku="test-sku"',
    }

    const expected = [
      {
        action: 'changeCartPredicate',
        cartPredicate: 'sku="test-sku"',
      },
    ]
    const actual = cartDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  it('should build the `changeSortOrder` action', () => {
    const before = {
      sortOrder: '0.1',
    }

    const now = {
      sortOrder: '0.2',
    }

    const expected = [
      {
        action: 'changeSortOrder',
        sortOrder: '0.2',
      },
    ]
    const actual = cartDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  it('should build the `changeValue` action', () => {
    const before = {
      value: {
        type: 'relative',
        permyriad: 100,
      },
    }

    const now = {
      value: {
        type: 'relative',
        permyriad: 200,
      },
    }

    const expected = [
      {
        action: 'changeValue',
        value: {
          type: 'relative',
          permyriad: 200,
        },
      },
    ]
    const actual = cartDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  it('should build the `changeRequiresDiscountCode` action', () => {
    const before = {
      requiresDiscountCode: false,
    }

    const now = {
      requiresDiscountCode: true,
    }

    const expected = [
      {
        action: 'changeRequiresDiscountCode',
        requiresDiscountCode: true,
      },
    ]
    const actual = cartDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  it('should build the `changeTarget` action', () => {
    const before = {
      target: {
        type: 'customLineItems',
        predicate: 'sku="sku-a"',
      },
    }

    const now = {
      target: {
        type: 'lineItems',
        predicate: 'sku="sku-b"',
      },
    }

    const expected = [
      {
        action: 'changeTarget',
        target: {
          type: 'lineItems',
          predicate: 'sku="sku-b"',
        },
      },
    ]
    const actual = cartDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  it('should build the `setDescription` action', () => {
    const before = {
      description: {
        en: 'en-description-before',
        de: 'de-description-before',
      },
    }

    const now = {
      description: { en: 'en-description-now', de: 'de-description-now' },
    }

    const expected = [
      {
        action: 'setDescription',
        description: { en: 'en-description-now', de: 'de-description-now' },
      },
    ]
    const actual = cartDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  it('should build the `setValidFrom` action', () => {
    const before = {
      validFrom: 'date1',
    }

    const now = {
      validFrom: 'date2',
    }

    const expected = [
      {
        action: 'setValidFrom',
        validFrom: 'date2',
      },
    ]
    const actual = cartDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  it('should build the `setValidUntil` action', () => {
    const before = {
      validUntil: 'date1',
    }

    const now = {
      validUntil: 'date2',
    }

    const expected = [
      {
        action: 'setValidUntil',
        validUntil: 'date2',
      },
    ]
    const actual = cartDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  it('should build the `changeStackingMode` action', () => {
    const before = {
      stackingMode: 'Stacking',
    }

    const now = {
      stackingMode: 'StopAfterThisDiscount',
    }

    const expected = [
      {
        action: 'changeStackingMode',
        stackingMode: 'StopAfterThisDiscount',
      },
    ]
    const actual = cartDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })
})
