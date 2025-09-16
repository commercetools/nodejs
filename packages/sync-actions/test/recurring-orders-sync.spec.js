import createRecurringOrdersSync, {
  actionGroups,
} from '../src/recurring-orders'
import {
  baseActionsList,
  referenceActionsList,
} from '../src/recurring-orders-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'references', 'custom'])
  })

  describe('base action list', () => {
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

    test('should contain `setOrderSkipConfiguration` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          { action: 'setOrderSkipConfiguration', key: 'skipConfiguration' },
        ])
      )
    })

    test('should contain `setStartsAt` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'setStartsAt', key: 'startsAt' }])
      )
    })

    test('should contain `setExpiresAt` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'setExpiresAt', key: 'expiresAt' }])
      )
    })
  })

  describe('reference action list', () => {
    test('should contain `recurrencePolicy` action', () => {
      expect(referenceActionsList).toEqual(
        expect.arrayContaining([
          { action: 'setSchedule', key: 'recurrencePolicy' },
        ])
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

  test('should build `setOrderSkipConfiguration` action', () => {
    const before = {
      skipConfiguration: { type: 'counter', totalToSkip: 2, skipped: 1 },
    }
    const now = {
      skipConfiguration: { type: 'counter', totalToSkip: 5 },
    }

    const expected = [
      {
        action: 'setOrderSkipConfiguration',
        ...now,
      },
    ]
    const actual = recurringOrdersSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  test('should build `setStartsAt` action', () => {
    const before = { startsAt: '2025-10-01T00:00:00.000Z' }
    const now = { startsAt: '2026-01-10T00:00:00.000Z' }
    const actual = recurringOrdersSync.buildActions(now, before)
    const expected = [
      {
        action: 'setStartsAt',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setExpiresAt` action', () => {
    const before = { expiresAt: '2025-10-01T00:00:00.000Z' }
    const now = { expiresAt: '2026-01-10T00:00:00.000Z' }
    const actual = recurringOrdersSync.buildActions(now, before)
    const expected = [
      {
        action: 'setExpiresAt',
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

  test('should build `setSchedule` action', () => {
    const before = {
      recurrencePolicy: {
        typeId: 'recurrence-policy',
        id: '999-9999-9999',
      },
    }
    const now = {
      recurrencePolicy: {
        typeId: 'recurrence-policy',
        id: '1212-1212-1212',
      },
    }

    const actual = recurringOrdersSync.buildActions(now, before)
    const expected = [
      {
        action: 'setSchedule',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })
})
