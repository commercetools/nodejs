import cartDiscountsSyncFn, { actionGroups } from '../src/cart-discounts'
import { baseActionsList } from '../src/cart-discounts-actions'

describe('Cart Discounts Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'custom'])
  })

  describe('action list', () => {
    test('should contain `changeIsActive` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'changeIsActive', key: 'isActive' }])
      )
    })

    test('should contain `changeName` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'changeName', key: 'name' }])
      )
    })

    test('should contain `changeCartPredicate` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changeCartPredicate',
            key: 'cartPredicate',
          },
        ])
      )
    })

    test('should contain `changeSortOrder` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          { action: 'changeSortOrder', key: 'sortOrder' },
        ])
      )
    })

    test('should contain `changeValue` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'changeValue', key: 'value' }])
      )
    })

    test('should contain `changeRequiresDiscountCode` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changeRequiresDiscountCode',
            key: 'requiresDiscountCode',
          },
        ])
      )
    })

    test('should contain `changeTarget` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'changeTarget', key: 'target' }])
      )
    })

    test('should contain `setDescription` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'setDescription',
            key: 'description',
          },
        ])
      )
    })

    test('should contain `setValidFrom` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'setValidFrom', key: 'validFrom' }])
      )
    })

    test('should contain `setValidUntil` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'setValidUntil', key: 'validUntil' }])
      )
    })

    test('should contain `changeStackingMode` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changeStackingMode',
            key: 'stackingMode',
          },
        ])
      )
    })

    test('should contain `setKey` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'setKey',
            key: 'key',
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

  test('should build the `changeIsActive` action', () => {
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

  test('should build the `changeName` action', () => {
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

  test('should build the `changeCartPredicate` action', () => {
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

  test('should build the `changeSortOrder` action', () => {
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

  test('should build the `changeValue` action', () => {
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

  test('should build the `changeRequiresDiscountCode` action', () => {
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

  test('should build the `changeTarget` action', () => {
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

  test('should build the `setDescription` action', () => {
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

  test('should build the `setValidFrom` action', () => {
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

  test('should build the `setValidUntil` action', () => {
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
  test('should build the `setValidFromAndUntil` action when both `validFrom` and `validUntil` exist', () => {
    const before = {
      validFrom: 'date-1-From',
      validUntil: 'date-1-Until',
    }

    const now = {
      validFrom: 'date-2-From',
      validUntil: 'date-2-Until',
    }

    const expected = [
      {
        action: 'setValidFromAndUntil',
        validFrom: 'date-2-From',
        validUntil: 'date-2-Until',
      },
    ]
    const actual = cartDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })
  test('should build the `changeStackingMode` action', () => {
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

  describe('custom fields', () => {
    test('should build `setCustomType` action', () => {
      const before = {
        custom: {
          type: {
            typeId: 'type',
            id: 'customType1',
          },
          fields: {
            customField1: true,
          },
        },
      }
      const now = {
        custom: {
          type: {
            typeId: 'type',
            id: 'customType2',
          },
          fields: {
            customField1: true,
          },
        },
      }
      const actual = cartDiscountsSync.buildActions(now, before)
      const expected = [{ action: 'setCustomType', ...now.custom }]
      expect(actual).toEqual(expected)
    })
  })

  test('should build `setCustomField` action', () => {
    const before = {
      custom: {
        type: {
          typeId: 'type',
          id: 'customType1',
        },
        fields: {
          customField1: false,
        },
      },
    }
    const now = {
      custom: {
        type: {
          typeId: 'type',
          id: 'customType1',
        },
        fields: {
          customField1: true,
        },
      },
    }
    const actual = cartDiscountsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setCustomField',
        name: 'customField1',
        value: true,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build the `setKey` action', () => {
    const before = {
      key: 'key-before',
    }

    const now = {
      key: 'key-now',
    }

    const expected = [
      {
        action: 'setKey',
        key: 'key-now',
      },
    ]
    const actual = cartDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })
})
