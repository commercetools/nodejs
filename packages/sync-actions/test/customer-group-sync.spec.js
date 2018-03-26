import customerGroupSyncFn, { actionGroups } from '../src/customer-group'
import { baseActionsList } from '../src/customer-group-actions'

describe('Customer Groups Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'custom'])
  })

  describe('action list', () => {
    test('should contain `changeName` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'changeName', key: 'name' }])
      )
    })

    test('should contain `setKey` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'setKey',
            key: 'key',
          },
        ])
      )
    })
  })
})

describe('Customer Groups Actions', () => {
  let customerGroupSync
  beforeEach(() => {
    customerGroupSync = customerGroupSyncFn()
  })

  test('should build the `changeName` action', () => {
    const before = {
      name: { en: 'en-name-before', de: 'de-name-before' },
    }

    const now = {
      name: { en: 'en-name-now', de: 'de-name-now' },
    }

    const expected = [
      {
        action: 'changeName',
        name: { en: 'en-name-now', de: 'de-name-now' },
      },
    ]
    const actual = customerGroupSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  test('should build the `setKey` action', () => {
    const before = {
      key: 'foo-key',
    }

    const now = {
      key: 'bar-key',
    }

    const expected = [
      {
        action: 'setKey',
        key: 'bar-key',
      },
    ]
    const actual = customerGroupSync.buildActions(now, before)
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
      const actual = customerGroupSync.buildActions(now, before)
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
    const actual = customerGroupSync.buildActions(now, before)
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
