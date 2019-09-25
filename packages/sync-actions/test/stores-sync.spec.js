import storesSyncFn, { actionGroups } from '../src/stores'
import { baseActionsList } from '../src/stores-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base'])
  })

  test('correctly define base actions list', () => {
    expect(baseActionsList).toEqual([{ action: 'setName', key: 'name' }])
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
})
