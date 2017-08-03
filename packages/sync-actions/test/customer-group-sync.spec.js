import customerGroupSyncFn, { actionGroups } from '../src/customer-group'
import { baseActionsList } from '../src/customer-group-actions'

describe('Exports', () => {
  it('action group list', () => {
    expect(actionGroups).toEqual(['base'])
  })

  it('correctly defined based actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'changeName', key: 'name' },
      { action: 'setKey', key: 'key' },
    ])
  })
})

describe('Actions', () => {
  let customerGroupSync
  beforeEach(() => { customerGroupSync = customerGroupSyncFn() })

  it('should build `changeName` action', () => {
    const before = { name: 'the-greatest-name-before' }
    const now = { name: 'the-greatest-name-now' }
    const expected = [{ action: 'changeName', ...now }]
    const actual = customerGroupSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })

  it('should build `setKey` action', () => {
    const before = { key: 'unique-key-before' }
    const now = { key: 'unique-key-now' }
    const expected = [{ action: 'setKey', ...now }]
    const actual = customerGroupSync.buildActions(now, before)
    expect(actual).toEqual(expected)
  })
})
