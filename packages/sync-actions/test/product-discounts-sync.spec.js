import productDiscountsSyncFn, { actionGroups } from '../src/product-discounts'
import { baseActionsList } from '../src/product-discounts-actions'

describe('Exports', () => {
  it('action group list', () => {
    expect(actionGroups).toEqual(['base'])
  })

  describe('Exports', () => {
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

    it('should contain `changePredicate` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changePredicate',
            key: 'predicate',
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
  })
})

describe('Actions', () => {
  let productDiscountsSync
  beforeEach(() => {
    productDiscountsSync = productDiscountsSyncFn()
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
    const actual = productDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  it('should build "changeName" action', () => {
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

  it('should build the `changePredicate` action', () => {
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
    const actual = productDiscountsSync.buildActions(now, before)
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
    const actual = productDiscountsSync.buildActions(now, before)
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
    const actual = productDiscountsSync.buildActions(now, before)
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
    const actual = productDiscountsSync.buildActions(now, before)
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
    const actual = productDiscountsSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })
})
