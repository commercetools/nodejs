import storesSyncFn, { actionGroups } from '../src/stores'
import { baseActionsList } from '../src/stores-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base'])
  })

  test('correctly define base actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'setLanguages', key: 'languages' },
      { action: 'setName', key: 'name' },
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
      name: { locale: 'en', value: 'Algeria' },
    }
    const now = {
      name: [
        { locale: 'en', value: 'Algeria' },
        { locale: 'de', value: 'Algerian' },
      ],
    }

    const actual = storesSync.buildActions(now, before)
    const expected = [{ action: 'setName', name: now.name }]
    expect(actual).toEqual(expected)
  })

  test('should build `setLanguages` action', () => {
    const before = {
      languages: 'en',
    }
    const now = {
      languages: ['de', 'en'],
    }

    const actual = storesSync.buildActions(now, before)
    const expected = [{ action: 'setLanguages', languages: now.languages }]
    expect(actual).toEqual(expected)
  })
})
