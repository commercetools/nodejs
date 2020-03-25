import categorySyncFn, { actionGroups } from '../src/categories'
import {
  baseActionsList,
  metaActionsList,
  referenceActionsList,
} from '../src/category-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual([
      'base',
      'references',
      'meta',
      'custom',
      'assets',
    ])
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

  describe('assets', () => {
    test('should build "addAsset" action with empty assets', () => {
      const before = {
        assets: [],
      }
      const now = {
        assets: [
          {
            key: 'asset-key',
            name: {
              en: 'asset name ',
            },
            sources: [
              {
                uri: 'http://example.org/content/product-manual.pdf',
              },
            ],
          },
        ],
      }
      const actual = categorySync.buildActions(now, before)
      const expected = [
        {
          action: 'addAsset',
          asset: now.assets[0],
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build "addAsset" action with existing assets', () => {
      const existingAsset = {
        key: 'existing',
        sources: [
          {
            uri: 'http://example.org/content/product-manual.pdf',
          },
        ],
      }
      const newAsset = {
        key: 'new',
        sources: [
          {
            uri: 'http://example.org/content/product-manual.gif',
          },
        ],
      }
      const before = {
        assets: [existingAsset],
      }
      const now = {
        assets: [existingAsset, newAsset],
      }
      const actual = categorySync.buildActions(now, before)
      const expected = [
        {
          action: 'addAsset',
          asset: newAsset,
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build "removeAsset" action with assetId prop', () => {
      const before = {
        assets: [
          {
            id: 'c136c9dc-51e8-40fe-8e2e-2a4c159f3358',
            name: {
              en: 'asset name ',
            },
            sources: [
              {
                uri: 'http://example.org/content/product-manual.pdf',
              },
            ],
          },
        ],
      }
      const now = {
        assets: [],
      }
      const actual = categorySync.buildActions(now, before)
      const expected = [
        {
          action: 'removeAsset',
          assetId: before.assets[0].id,
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build "removeAsset" action with assetKey prop', () => {
      const before = {
        assets: [
          {
            key: 'asset-key',
            name: {
              en: 'asset name ',
            },
            sources: [
              {
                uri: 'http://example.org/content/product-manual.pdf',
              },
            ],
          },
        ],
      }
      const now = {
        assets: [],
      }
      const actual = categorySync.buildActions(now, before)
      const expected = [
        {
          action: 'removeAsset',
          assetKey: before.assets[0].key,
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should throw no exception on missing assets', () => {
      const before = {
        assets: [],
      }
      const now = {}
      const actual = categorySync.buildActions(now, before)
      const expected = []
      expect(actual).toEqual(expected)
    })
  })

  test('should build "removeAsset" and "addAsset" action when asset is changed', () => {
    const initialAsset = {
      key: 'asset-key',
      name: {
        en: 'asset name ',
      },
    }
    const changedName = {
      name: {
        en: 'asset name ',
        de: 'Asset Name',
      },
    }
    const changedAsset = { ...initialAsset, ...changedName }
    const before = {
      assets: [initialAsset],
    }
    const now = {
      assets: [changedAsset],
    }
    const actual = categorySync.buildActions(now, before)
    const expected = [
      {
        action: 'removeAsset',
        assetKey: before.assets[0].key,
      },
      {
        action: 'addAsset',
        asset: changedAsset,
      },
    ]
    expect(actual).toEqual(expected)
  })
})
