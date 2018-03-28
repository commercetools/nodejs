import inventorySyncFn, { actionGroups } from '../src/inventories'
import { baseActionsList, referenceActionsList } from '../src/inventory-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'references'])
  })

  test('correctly define base actions list', () => {
    expect(baseActionsList).toEqual([
      {
        action: 'changeQuantity',
        key: 'quantityOnStock',
        actionKey: 'quantity',
      },
      { action: 'setRestockableInDays', key: 'restockableInDays' },
      { action: 'setExpectedDelivery', key: 'expectedDelivery' },
    ])
  })

  test('correctly define reference actions list', () => {
    expect(referenceActionsList).toEqual([
      { action: 'setSupplyChannel', key: 'supplyChannel' },
    ])
  })
})

describe('Actions', () => {
  let inventorySync
  beforeEach(() => {
    inventorySync = inventorySyncFn()
  })

  test('should build `changeQuantity` action', () => {
    const before = {
      quantityOnStock: 1,
    }
    const now = {
      quantityOnStock: 2,
    }

    const actual = inventorySync.buildActions(now, before)
    const expected = [{ action: 'changeQuantity', quantity: 2 }]
    expect(actual).toEqual(expected)
  })
})
