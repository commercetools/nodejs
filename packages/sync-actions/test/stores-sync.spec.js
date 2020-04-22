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
          typeId: 'product-distribution',
          id: 'pd-001',
        },
      ],
    }
    const now = {
      distributionChannels: [
        {
          typeId: 'product-distribution',
          id: 'pd-001',
        },
        {
          typeId: 'product-distribution',
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
})
