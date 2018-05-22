import taxCategorySyncFn, { actionGroups } from '../src/tax-categories'
import { baseActionsList } from '../src/tax-categories-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'rates'])
  })

  test('correctly define base actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'changeName', key: 'name' },
      { action: 'setKey', key: 'key' },
      { action: 'setDescription', key: 'description' },
    ])
  })
})

describe('Actions', () => {
  let taxCategorySync
  beforeEach(() => {
    taxCategorySync = taxCategorySyncFn()
  })

  test('should build `changeName` action', () => {
    const before = {
      name: 'John',
    }
    const now = {
      name: 'Robert',
    }

    const actual = taxCategorySync.buildActions(now, before)
    const expected = [{ action: 'changeName', name: now.name }]
    expect(actual).toEqual(expected)
  })

  test('should build `setDescription` action', () => {
    const before = {
      description: 'some description',
    }
    const now = {
      description: 'some updated description',
    }

    const actual = taxCategorySync.buildActions(now, before)
    const expected = [
      {
        action: 'setDescription',
        description: now.description,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `addTaxRate` action', () => {
    const before = { addresses: [] }
    const now = {
      rates: [{ name: '5% US', amount: '0.05' }],
    }

    const actual = taxCategorySync.buildActions(now, before)
    const expected = [{ action: 'addTaxRate', taxRate: now.rates[0] }]
    expect(actual).toEqual(expected)
  })

  test('should build `replaceTaxRate` action', () => {
    const before = {
      rates: [
        {
          id: 'taxRate-1',
          name: '5% US',
          amount: '0.05',
        },
      ],
    }
    const now = {
      rates: [
        {
          id: 'taxRate-1',
          name: '11% US',
          amount: '0.11',
        },
      ],
    }

    const actual = taxCategorySync.buildActions(now, before)
    const expected = [
      {
        action: 'replaceTaxRate',
        taxRateId: before.rates[0].id,
        taxRate: now.rates[0],
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `removeTaxRate` action', () => {
    const before = {
      rates: [{ id: 'taxRate-1' }],
    }
    const now = { rates: [] }

    const actual = taxCategorySync.buildActions(now, before)
    const expected = [
      {
        action: 'removeTaxRate',
        taxRateId: before.rates[0].id,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build complex mixed actions (1)', () => {
    const before = {
      rates: [
        {
          id: 'taxRate-1',
          name: '11% US',
          amount: '0.11',
        },
        {
          id: 'taxRate-2',
          name: '8% DE',
          amount: '0.08',
        },
        {
          id: 'taxRate-3',
          name: '21% ES',
          amount: '0.21',
        },
      ],
    }
    const now = {
      rates: [
        {
          id: 'taxRate-1',
          name: '11% US',
          amount: '0.11',
          country: 'US',
        },
        // REMOVED RATE 2
        {
          // UNCHANGED RATE 3
          id: 'taxRate-3',
          name: '21% ES',
          amount: '0.21',
        },
        {
          // ADD NEW RATE
          id: 'taxRate-4',
          name: '15% FR',
          amount: '0.15',
        },
      ],
    }

    const actual = taxCategorySync.buildActions(now, before)
    const expected = [
      {
        action: 'replaceTaxRate',
        taxRate: {
          amount: '0.11',
          country: 'US', // added country to an existing rate
          id: 'taxRate-1',
          name: '11% US',
        },
        taxRateId: 'taxRate-1',
      },
      { action: 'removeTaxRate', taxRateId: 'taxRate-2' }, // removed second tax rate
      {
        action: 'addTaxRate',
        taxRate: { amount: '0.15', id: 'taxRate-4', name: '15% FR' }, // adds new tax rate
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build complex mixed actions (2)', () => {
    const before = {
      rates: [
        {
          id: 'taxRate-1',
          name: '11% US',
          amount: '0.11',
        },
        {
          id: 'taxRate-2',
          name: '8% DE',
          amount: '0.08',
        },
        {
          id: 'taxRate-3',
          name: '21% ES',
          amount: '0.21',
        },
      ],
    }
    const now = {
      rates: [
        // REMOVED RATE 1
        // REMOVED RATE 2
        {
          // CHANGED RATE 3
          id: 'taxRate-3',
          name: '21% ES',
          state: 'NY',
          amount: '0.21',
        },
        {
          // ADD NEW RATE
          id: 'taxRate-4',
          name: '15% FR',
          amount: '0.15',
        },
      ],
    }

    const actual = taxCategorySync.buildActions(now, before)
    const expected = [
      {
        action: 'replaceTaxRate',
        taxRate: {
          amount: '0.21',
          id: 'taxRate-3',
          name: '21% ES',
          state: 'NY',
        },
        taxRateId: 'taxRate-3',
      },
      { action: 'removeTaxRate', taxRateId: 'taxRate-1' }, // removed first tax rate
      { action: 'removeTaxRate', taxRateId: 'taxRate-2' }, // removed second tax rate
      {
        action: 'addTaxRate',
        taxRate: { amount: '0.15', id: 'taxRate-4', name: '15% FR' }, // adds new tax rate
      },
    ]

    expect(actual).toEqual(expected)
  })

  test('should build `setKey` action', () => {
    const before = {
      key: '1234',
    }
    const now = {
      key: '4321',
    }
    const actual = taxCategorySync.buildActions(now, before)
    const expected = [
      {
        action: 'setKey',
        key: now.key,
      },
    ]
    expect(actual).toEqual(expected)
  })
})
