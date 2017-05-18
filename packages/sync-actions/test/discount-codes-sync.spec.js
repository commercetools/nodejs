import discountCodesSyncFn, { actionGroups } from '../src/discount-codes'
import {
  baseActionsList,
  referenceActionsList,
} from '../src/discount-codes-actions'

describe('Exports', () => {
  it('action group list', () => {
    expect(actionGroups).toEqual(['base', 'references'])
  })

  it('correctly defines base actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'changeIsActive', key: 'isActive' },
      { action: 'setName', key: 'name' },
      { action: 'setDescription', key: 'description' },
      { action: 'setCartPredicate', key: 'cartPredicate' },
      { action: 'setMaxApplications', key: 'maxApplications' },
      {
        action: 'setMaxApplicationsPerCustomer',
        key: 'maxApplicationsPerCustomer',
      },
    ])
  })

  it('correctly defines reference Actions List', () => {
    expect(referenceActionsList).toEqual([
      { action: 'changeCartDiscounts', key: 'cartDiscounts' },
    ])
  })
})

describe('Actions', () => {
  let discountCodesSync
  beforeEach(() => {
    discountCodesSync = discountCodesSyncFn()
  })

  it('should build `changeIsActive` action', () => {
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
  it('should build `setName` action', () => {
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

  it('should build `setDescription` action', () => {
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

  it('should build `setCartPredicate` action', () => {
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

  it('should build `setMaxApplications` action', () => {
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

  it('should build `setMaxApplicationsPerCustomer` action', () => {
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

  xit('should build `changeCartDiscounts` action', () => {
    const before = {
      cartDiscounts: [
        {
          typeId: 'previous-cart-discount',
          id: 'previous-cart-discount-id',
        },
      ],
    }
    const now = {
      cartDiscounts: [
        {
          typeId: 'new-cart-discount-1',
          id: 'new-cart-discount-id-1',
        },
        {
          typeId: 'new-cart-discount-2',
          id: 'new-cart-discount-id-2',
        },
      ],
    }

    const actual = discountCodesSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeCartDiscounts',
        cartDiscounts: [
          {
            typeId: 'new-cart-discount-1',
            id: 'new-cart-discount-id-1',
          },
          {
            typeId: 'new-cart-discount-2',
            id: 'new-cart-discount-id-2',
          },
        ],
      },
    ]
    expect(actual).toEqual(expected)
  })
})
