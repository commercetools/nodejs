import categorySyncFn, { actionGroups } from '../src/categories'
import {
  baseActionsList,
  metaActionsList,
  referenceActionsList,
} from '../src/category-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'references', 'meta', 'custom'])
  })

  test('correctly define base actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'changeName', key: 'name' },
      { action: 'changeSlug', key: 'slug' },
      { action: 'setDescription', key: 'description' },
      { action: 'changeOrderHint', key: 'orderHint' },
      { action: 'setExternalId', key: 'externalId' },
      { action: 'setKey', key: 'key' },
    ])
  })

  test('correctly define meta actions list', () => {
    expect(metaActionsList).toEqual([
      { action: 'setMetaTitle', key: 'metaTitle' },
      { action: 'setMetaKeywords', key: 'metaKeywords' },
      { action: 'setMetaDescription', key: 'metaDescription' },
    ])
  })

  test('correctly define reference actions list', () => {
    expect(referenceActionsList).toEqual([
      { action: 'changeParent', key: 'parent' },
    ])
  })
})

describe('Actions', () => {
  let categorySync
  beforeEach(() => {
    categorySync = categorySyncFn()
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
      const actual = categorySync.buildActions(now, before)
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
    const actual = categorySync.buildActions(now, before)
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
