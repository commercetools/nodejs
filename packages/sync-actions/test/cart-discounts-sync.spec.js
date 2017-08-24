import cartDiscountsSyncFn, {
  actionGroups,
} from '../src/cart-discounts'
import { baseActionsList } from '../src/cart-discounts-actions'

describe('Exports', () => {
  it('action group list', () => {
    expect(actionGroups).toEqual(['base'])
  })

  it('correctly defined base actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'changeIsActive', key: 'isActive' },
      { action: 'changeName', key: 'name' },
      { action: 'changeCartPredicate', key: 'cartPredicate' },
      { action: 'changeSortOrder', key: 'sortOrder' },
      { action: 'changeValue', key: 'value' },
      { action: 'changeRequiresDiscountCode', key: 'requiresDiscountCode' },
      { action: 'changeTarget', key: 'target' },
      { action: 'setDescription', key: 'description' },
      { action: 'setValidFrom', key: 'validFrom' },
      { action: 'setValidUntil', key: 'validUntil' },
    ])
  })
})

describe('Actions', () => {
  describe('changeIsActive action', () => {
    let actual
    let expected
    beforeEach(() => {
      const before = {
        isActive: false,
      }

      const now = {
        isActive: true,
      }
      actual = cartDiscountsSyncFn().buildActions(now, before)
      expected = [
        {
          action: 'changeIsActive',
          isActive: true,
        },
      ]
    })

    it('should build the `changeIsActive` action', () => {
      expect(actual).toEqual(expected)
    })
  })
  describe('changeName action', () => {
    let actual
    let expected
    beforeEach(() => {
      const before = {
        name: { en: 'en-name-before', de: 'de-name-before' },
      }

      const now = {
        name: { en: 'en-name-now', de: 'de-name-now' },
      }
      actual = cartDiscountsSyncFn().buildActions(now, before)
      expected = [
        {
          action: 'changeName',
          name: { en: 'en-name-now', de: 'de-name-now' },
        },
      ]
    })

    it('should build the `changeName` action', () => {
      expect(actual).toEqual(expected)
    })
  })
  describe('changeCartPredicate action', () => {
    let actual
    let expected
    beforeEach(() => {
      const before = {
        cartPredicate: '1=1',
      }

      const now = {
        cartPredicate: 'sku="test-sku"',
      }
      actual = cartDiscountsSyncFn().buildActions(now, before)
      expected = [
        {
          action: 'changeCartPredicate',
          cartPredicate: 'sku="test-sku"',
        },
      ]
    })

    it('should build the `changeCartPredicate` action', () => {
      expect(actual).toEqual(expected)
    })
  })
  describe('changeSortOrder action', () => {
    let actual
    let expected
    beforeEach(() => {
      const before = {
        sortOrder: '0.1',
      }

      const now = {
        sortOrder: '0.2',
      }
      actual = cartDiscountsSyncFn().buildActions(now, before)
      expected = [
        {
          action: 'changeSortOrder',
          sortOrder: '0.2',
        },
      ]
    })

    it('should build the `changeSortOrder` action', () => {
      expect(actual).toEqual(expected)
    })
  })
  describe('changeValue action', () => {
    let actual
    let expected
    beforeEach(() => {
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
      actual = cartDiscountsSyncFn().buildActions(now, before)
      expected = [
        {
          action: 'changeValue',
          value: {
            type: 'relative',
            permyriad: 200,
          },
        },
      ]
    })

    it('should build the `changeValue` action', () => {
      expect(actual).toEqual(expected)
    })
  })
  describe('changeRequiresDiscountCode action', () => {
    let actual
    let expected
    beforeEach(() => {
      const before = {
        requiresDiscountCode: false,
      }

      const now = {
        requiresDiscountCode: true,
      }
      actual = cartDiscountsSyncFn().buildActions(now, before)
      expected = [
        {
          action: 'changeRequiresDiscountCode',
          requiresDiscountCode: true,
        },
      ]
    })

    it('should build the `changeRequiresDiscountCode` action', () => {
      expect(actual).toEqual(expected)
    })
  })
  describe('changeTarget action', () => {
    let actual
    let expected
    beforeEach(() => {
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
      actual = cartDiscountsSyncFn().buildActions(now, before)
      expected = [
        {
          action: 'changeTarget',
          target: {
            type: 'lineItems',
            predicate: 'sku="sku-b"',
          },
        },
      ]
    })

    it('should build the `changeTarget` action', () => {
      expect(actual).toEqual(expected)
    })
  })
  describe('setDescription action', () => {
    let actual
    let expected
    beforeEach(() => {
      const before = {
        description: {
          en: 'en-description-before',
          de: 'de-description-before',
        },
      }

      const now = {
        description: { en: 'en-description-now', de: 'de-description-now' },
      }
      actual = cartDiscountsSyncFn().buildActions(now, before)
      expected = [
        {
          action: 'setDescription',
          description: { en: 'en-description-now', de: 'de-description-now' },
        },
      ]
    })

    it('should build the `setDescription` action', () => {
      expect(actual).toEqual(expected)
    })
  })
  describe('setValidFrom action', () => {
    let actual
    let expected
    beforeEach(() => {
      const before = {
        validFrom: 'date1',
      }

      const now = {
        validFrom: 'date2',
      }
      actual = cartDiscountsSyncFn().buildActions(now, before)
      expected = [
        {
          action: 'setValidFrom',
          validFrom: 'date2',
        },
      ]
    })

    it('should build the `setValidFrom` action', () => {
      expect(actual).toEqual(expected)
    })
  })
  describe('setValidUntil action', () => {
    let actual
    let expected
    beforeEach(() => {
      const before = {
        validUntil: 'date1',
      }

      const now = {
        validUntil: 'date2',
      }
      actual = cartDiscountsSyncFn().buildActions(now, before)
      expected = [
        {
          action: 'setValidUntil',
          validUntil: 'date2',
        },
      ]
    })

    it('should build the `setValidUntil` action', () => {
      expect(actual).toEqual(expected)
    })
  })
})
