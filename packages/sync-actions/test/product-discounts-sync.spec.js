import productDiscountsSyncFn, { actionGroups } from '../src/product-discounts'
import { baseActionsList } from '../src/product-discounts-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base'])
  })

  describe('Exports', () => {
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

    test('should contain `changePredicate` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changePredicate',
            key: 'predicate',
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

    test('should contain `setKey` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'setKey', key: 'key' }])
      )
    })
  })
})

describe('Actions', () => {
  let productDiscountsSync
  beforeEach(() => {
    productDiscountsSync = productDiscountsSyncFn()
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
    const actual = productDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  test('should build "changeName" action', () => {
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
    const actual = productDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  test('should build the `changePredicate` action', () => {
    const before = {
      predicate: '1=1',
    }

    const now = {
      predicate: 'sku="test-sku"',
    }

    const expected = [
      {
        action: 'changePredicate',
        predicate: 'sku="test-sku"',
      },
    ]
    const actual = productDiscountsSync.buildActions(now, before)
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
    const actual = productDiscountsSync.buildActions(now, before)
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
    const actual = productDiscountsSync.buildActions(now, before)
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
    const actual = productDiscountsSync.buildActions(now, before)
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
    const actual = productDiscountsSync.buildActions(now, before)
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
    const actual = productDiscountsSync.buildActions(now, before)
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
    const actual = productDiscountsSync.buildActions(now, before)
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
    const actual = productDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })
})
