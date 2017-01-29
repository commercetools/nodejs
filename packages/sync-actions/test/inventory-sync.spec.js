import inventorySyncFn, { actionGroups } from '../src/inventories'
import {
  baseActionsList,
  referenceActionsList,
} from '../src/inventory-actions'

describe('Exports', () => {
  it('action group list', () => {
    expect(actionGroups).toEqual([
      'base',
      'references',
    ])
  })

  it('correctly define base actions list', () => {
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

  it('correctly define reference actions list', () => {
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

  it('should build `changeQuantity` action', () => {
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
