import discountCodesSyncFn, { actionGroups } from '../src/discount-codes'
import { baseActionsList } from '../src/discount-codes-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'custom'])
  })

  describe('action list', () => {
    test('should contain `changeIsActive` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'changeIsActive', key: 'isActive' }])
      )
    })

    test('should contain `setName` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'setName', key: 'name' }])
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

    test('should contain `setMaxApplications` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'setMaxApplications',
            key: 'maxApplications',
          },
        ])
      )
    })

    test('should contain `setMaxApplicationsPerCustomer` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'setMaxApplicationsPerCustomer',
            key: 'maxApplicationsPerCustomer',
          },
        ])
      )
    })

    test('should contain `changeCartDiscounts` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changeCartDiscounts',
            key: 'cartDiscounts',
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

    test('should contain `changeGroups` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'changeGroups', key: 'groups' }])
      )
    })
  })
})

describe('Actions', () => {
  let discountCodesSync
  beforeEach(() => {
    discountCodesSync = discountCodesSyncFn()
  })

  test('should build `changeIsActive` action', () => {
    const before = { isActive: false }
    const now = { isActive: true }
    const actual = discountCodesSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeIsActive',
        isActive: true,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setName` action', () => {
    const before = {
      name: { en: 'previous-en-name', de: 'previous-de-name' },
    }
    const now = {
      name: { en: 'current-en-name', de: 'current-de-name' },
    }

    const actual = discountCodesSync.buildActions(now, before)
    const expected = [
      {
        action: 'setName',
        name: { en: 'current-en-name', de: 'current-de-name' },
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setDescription` action', () => {
    const before = {
      description: { en: 'old-en-description', de: 'old-de-description' },
    }
    const now = {
      description: { en: 'new-en-description', de: 'new-de-description' },
    }

    const actual = discountCodesSync.buildActions(now, before)
    const expected = [
      {
        action: 'setDescription',
        description: { en: 'new-en-description', de: 'new-de-description' },
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setCartPredicate` action', () => {
    const before = { cartPredicate: 'old-cart-predicate' }
    const now = { cartPredicate: 'new-cart-predicate' }
    const actual = discountCodesSync.buildActions(now, before)
    const expected = [
      {
        action: 'setCartPredicate',
        cartPredicate: 'new-cart-predicate',
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setMaxApplications` action', () => {
    const before = { maxApplications: 5 }
    const now = { maxApplications: 10 }
    const actual = discountCodesSync.buildActions(now, before)
    const expected = [
      {
        action: 'setMaxApplications',
        maxApplications: 10,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setMaxApplicationsPerCustomer` action', () => {
    const before = { maxApplicationsPerCustomer: 1 }
    const now = { maxApplicationsPerCustomer: 3 }
    const actual = discountCodesSync.buildActions(now, before)
    const expected = [
      {
        action: 'setMaxApplicationsPerCustomer',
        maxApplicationsPerCustomer: 3,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeCartDiscounts` action', () => {
    const before = {
      cartDiscounts: [
        {
          typeId: 'previous-cart-discount',
          id: 'previous-cart-discount-id',
        },
        {
          typeId: 'another-previous-cart-discount',
          id: 'another-previous-cart-discount-id',
        },
      ],
    }
    const now = {
      cartDiscounts: [
        {
          typeId: 'previous-cart-discount',
          id: 'previous-cart-discount-id',
        },
        {
          typeId: 'new-cart-discount-1',
          id: 'new-cart-discount-id-1',
        },
        {
          typeId: 'new-cart-discount-2',
          id: 'new-cart-discount-id-2',
        },
        {
          typeId: 'another-new-cart-discount-2',
          id: 'another-new-cart-discount-id-2',
        },
      ],
    }

    const actual = discountCodesSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeCartDiscounts',
        cartDiscounts: [
          {
            typeId: 'previous-cart-discount',
            id: 'previous-cart-discount-id',
          },
          {
            typeId: 'new-cart-discount-1',
            id: 'new-cart-discount-id-1',
          },
          {
            typeId: 'new-cart-discount-2',
            id: 'new-cart-discount-id-2',
          },
          {
            typeId: 'another-new-cart-discount-2',
            id: 'another-new-cart-discount-id-2',
          },
        ],
      },
    ]
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
    const actual = discountCodesSync.buildActions(now, before)
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
    const actual = discountCodesSync.buildActions(now, before)
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
    const actual = discountCodesSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  test('should build the `changeGroups` action', () => {
    const before = {
      groups: ['A'],
    }

    const now = {
      groups: ['A', 'B'],
    }

    const expected = [
      {
        action: 'changeGroups',
        groups: ['A', 'B'],
      },
    ]
    const actual = discountCodesSync.buildActions(now, before)
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
      const actual = discountCodesSync.buildActions(now, before)
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
    const actual = discountCodesSync.buildActions(now, before)
    const expected = [
      {
        action: 'setCustomField',
        name: 'customField1',
        value: true,
      },
    ]
    expect(actual).toEqual(expected)
  })
})
