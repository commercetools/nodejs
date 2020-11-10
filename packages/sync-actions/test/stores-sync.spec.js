import storesSyncFn, { actionGroups } from '../src/stores'
import { baseActionsList } from '../src/stores-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base'])
  })

  test('correctly define base actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'setName', key: 'name' },
      { action: 'setLanguages', key: 'languages' },
      { action: 'setDistributionChannels', key: 'distributionChannels' },
      { action: 'setSupplyChannels', key: 'supplyChannels' },
    ])
  })
})

describe('Actions', () => {
  let storesSync
  beforeEach(() => {
    storesSync = storesSyncFn()
  })

  test('should build `setName` action', () => {
    const before = {
      name: { en: 'Algeria' },
    }
    const now = {
      name: { en: 'Algeria', de: 'Algerian' },
    }

    const actual = storesSync.buildActions(now, before)
    const expected = [{ action: 'setName', name: now.name }]
    expect(actual).toEqual(expected)
  })

  test('should build `setLanguages` action', () => {
    const before = {
      languages: ['en'],
    }
    const now = {
      languages: ['en', 'de'],
    }

    const actual = storesSync.buildActions(now, before)
    const expected = [{ action: 'setLanguages', languages: now.languages }]
    expect(actual).toEqual(expected)
  })

  test('should build `setDistributionsChannels` action', () => {
    const before = {
      distributionChannels: [
        {
          typeId: 'channel',
          id: 'pd-001',
        },
      ],
    }
    const now = {
      distributionChannels: [
        {
          typeId: 'channel',
          id: 'pd-001',
        },
        {
          typeId: 'channel',
          key: 'pd-002',
        },
      ],
    }

    const actual = storesSync.buildActions(now, before)
    expect(actual).toEqual([
      {
        action: 'setDistributionChannels',
        distributionChannels: now.distributionChannels,
      },
    ])
  })
  test('should build `setSupplyChannels` action', () => {
    const before = {
      supplyChannels: [
        {
          typeId: 'channel',
          id: 'inventory-supply-001',
        },
      ],
    }
    const now = {
      supplyChannels: [
        {
          typeId: 'channel',
          id: 'inventory-supply-001',
        },
        {
          typeId: 'channel',
          key: 'inventory-supply-002',
        },
      ],
    }

    const actual = storesSync.buildActions(now, before)
    expect(actual).toEqual([
      {
        action: 'setSupplyChannels',
        supplyChannels: now.supplyChannels,
      },
    ])
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
      const actual = storesSync.buildActions(now, before)
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
    const actual = storesSync.buildActions(now, before)
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
