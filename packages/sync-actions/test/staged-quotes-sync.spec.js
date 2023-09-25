import createStagedQuotesSync, { actionGroups } from '../src/staged-quotes'
import { baseActionsList } from '../src/staged-quotes-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'custom'])
  })

  describe('action list', () => {
    test('should contain `changeStagedQuoteState` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          { action: 'changeStagedQuoteState', key: 'stagedQuoteState' },
        ])
      )
    })

    test('should contain `setSellerComment` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          { action: 'setSellerComment', key: 'sellerComment' },
        ])
      )
    })

    test('should contain `setValidTo` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'setValidTo', key: 'validTo' }])
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
  let stagedQuotesSync
  beforeEach(() => {
    stagedQuotesSync = createStagedQuotesSync()
  })

  test('should build `changeQuoteState` action', () => {
    const before = { stagedQuoteState: 'InProgress' }
    const now = { stagedQuoteState: 'Sent' }
    const actual = stagedQuotesSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeStagedQuoteState',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setSellerComment` action', () => {
    const before = { sellerComment: '' }
    const now = {
      sellerComment: 'let me know if this matches your expectations',
    }
    const actual = stagedQuotesSync.buildActions(now, before)
    const expected = [
      {
        action: 'setSellerComment',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setValidTo` action', () => {
    const before = { validTo: '' }
    const now = { validTo: '2022-09-22T15:41:55.816Z' }
    const actual = stagedQuotesSync.buildActions(now, before)
    const expected = [
      {
        action: 'setValidTo',
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
    const actual = stagedQuotesSync.buildActions(now, before)
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
    const actual = stagedQuotesSync.buildActions(now, before)
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
    const actual = stagedQuotesSync.buildActions(now, before)
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
