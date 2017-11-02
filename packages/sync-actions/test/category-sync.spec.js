import categorySyncFn, { actionGroups } from '../src/categories'
import {
  baseActionsList,
  metaActionsList,
  referenceActionsList,
} from '../src/category-actions'

describe('Exports', () => {
  it('action group list', () => {
    expect(actionGroups).toEqual(['base', 'references', 'meta', 'custom'])
  })

  it('correctly define base actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'changeName', key: 'name' },
      { action: 'changeSlug', key: 'slug' },
      { action: 'setDescription', key: 'description' },
      { action: 'changeOrderHint', key: 'orderHint' },
      { action: 'setExternalId', key: 'externalId' },
      { action: 'setKey', key: 'key' },
    ])
  })

  it('correctly define meta actions list', () => {
    expect(metaActionsList).toEqual([
      { action: 'setMetaTitle', key: 'metaTitle' },
      { action: 'setMetaKeywords', key: 'metaKeywords' },
      { action: 'setMetaDescription', key: 'metaDescription' },
    ])
  })

  it('correctly define reference actions list', () => {
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

  it('should build `setCustomType` action', () => {
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

  it('should build `setCustomField` action', () => {
    const before = {
      custom: {
        type: {
          typeId: 'type',
          id: 'customType1',
        },
        fields: {
          customField1: true, // will change
          customField2: true, // will stay unchanged
          customField3: false, // will be removed
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
          customField1: false,
          customField2: true,
          customField4: true, // was added
        },
      },
    }
    const actual = categorySync.buildActions(now, before)
    const expected = [
      {
        action: 'setCustomField',
        name: 'customField1',
        value: false,
      },
      {
        action: 'setCustomField',
        name: 'customField3',
        value: undefined,
      },
      {
        action: 'setCustomField',
        name: 'customField4',
        value: true,
      },
    ]
    expect(actual).toEqual(expected)
  })
})
