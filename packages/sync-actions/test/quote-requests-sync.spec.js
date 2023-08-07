import createQuoteRequestsSync, { actionGroups } from '../src/quote-requests'
import { baseActionsList } from '../src/quote-requests-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'custom'])
  })

  describe('action list', () => {
    test('should contain `changeQuoteRequestState` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          { action: 'changeQuoteRequestState', key: 'quoteRequestState' },
        ])
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
  let quoteRequestsSync
  beforeEach(() => {
    quoteRequestsSync = createQuoteRequestsSync()
  })

  test('should build `changeQuoteRequestState` action', () => {
    const before = { quoteRequestState: 'Submitted' }
    const now = { quoteRequestState: 'Accepted' }
    const actual = quoteRequestsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeQuoteRequestState',
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
    const actual = quoteRequestsSync.buildActions(now, before)
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
    const actual = quoteRequestsSync.buildActions(now, before)
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
    const actual = quoteRequestsSync.buildActions(now, before)
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
