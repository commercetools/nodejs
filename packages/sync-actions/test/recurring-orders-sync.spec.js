import createRecurringOrdersSync, {
  actionGroups,
} from '../src/recurring-orders'
import { baseActionsList } from '../src/recurring-orders-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'custom'])
  })

  describe('action list', () => {
    test('should contain `setRecurringOrderState` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          { action: 'setRecurringOrderState', key: 'recurringOrderState' },
        ])
      )
    })

    test('should contain `setKey` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'setKey', key: 'key' }])
      )
    })

    test('should contain `transitionState` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'transitionState', key: 'state' }])
      )
    })
  })
})

describe('Actions', () => {
  let recurringOrdersSync
  beforeEach(() => {
    recurringOrdersSync = createRecurringOrdersSync()
  })

  test('should build `setRecurringOrderState` action', () => {
    const before = { recurringOrderState: 'Paused' }
    const now = { recurringOrderState: 'Active' }
    const actual = recurringOrdersSync.buildActions(now, before)
    const expected = [
      {
        action: 'setRecurringOrderState',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setKey` action', () => {
    const before = { key: '' }
    const now = { key: 'recurring-order-key-1' }
    const actual = recurringOrdersSync.buildActions(now, before)
    const expected = [
      {
        action: 'setKey',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `transitionState` action', () => {
    const before = {
      state: {
        typeId: 'state',
        id: 'sid1',
      },
    }
    const now = {
      state: {
        typeId: 'state',
        id: 'sid2',
      },
    }
    const actual = recurringOrdersSync.buildActions(now, before)
    const expected = [
      {
        action: 'transitionState',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

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
    const actual = recurringOrdersSync.buildActions(now, before)
    const expected = [{ action: 'setCustomType', ...now.custom }]
    expect(actual).toEqual(expected)
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
    const actual = recurringOrdersSync.buildActions(now, before)
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
