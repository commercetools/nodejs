import createQuotesSync, { actionGroups } from '../src/quotes'
import { baseActionsList } from '../src/quotes-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'custom'])
  })

  describe('action list', () => {
    test('should contain `changeQuoteState` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          { action: 'changeQuoteState', key: 'quoteState' },
        ])
      )
    })

    test('should contain `requestQuoteRenegotiation` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          { action: 'requestQuoteRenegotiation', key: 'buyerComment' },
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
  let quotesSync
  beforeEach(() => {
    quotesSync = createQuotesSync()
  })

  test('should build `changeQuoteState` action', () => {
    const before = { quoteState: 'Pending' }
    const now = { quoteState: 'Approved' }
    const actual = quotesSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeQuoteState',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `requestQuoteRenegotiation` action', () => {
    const before = { buyerComment: '' }
    const now = { buyerComment: 'give me a 10% discount' }
    const actual = quotesSync.buildActions(now, before)
    const expected = [
      {
        action: 'requestQuoteRenegotiation',
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
    const actual = quotesSync.buildActions(now, before)
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
    const actual = quotesSync.buildActions(now, before)
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
    const actual = quotesSync.buildActions(now, before)
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
