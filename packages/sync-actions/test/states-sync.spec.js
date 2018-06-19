import statesSyncFn, { actionGroups } from '../src/states'
import { baseActionsList } from '../src/state-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base'])
  })

  describe('action list', () => {
    test('should contain `changeIsActive` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'changeKey', key: 'key' }])
      )
    })

    test('should contain `setName` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'setName', key: 'name' }])
      )
    })

    test('should contain `setDescription` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'setDescription',
            key: 'description',
          },
        ])
      )
    })

    test('should contain `changeType` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changeType',
            key: 'type',
          },
        ])
      )
    })

    test('should contain `changeInitial` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changeInitial',
            key: 'initial',
          },
        ])
      )
    })

    test('should contain `setTransitions` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'setTransitions',
            key: 'transitions',
          },
        ])
      )
    })
  })
})

describe('Actions', () => {
  let statesSync
  beforeEach(() => {
    statesSync = statesSyncFn()
  })

  test('should build `setName` action', () => {
    const before = {
      name: { en: 'previous-en-name', de: 'previous-de-name' },
    }
    const now = {
      name: { en: 'current-en-name', de: 'current-de-name' },
    }

    const actual = statesSync.buildActions(now, before)
    const expected = [
      {
        action: 'setName',
        name: { en: 'current-en-name', de: 'current-de-name' },
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setDescription` action', () => {
    const before = {
      description: { en: 'old-en-description', de: 'old-de-description' },
    }
    const now = {
      description: { en: 'new-en-description', de: 'new-de-description' },
    }

    const actual = statesSync.buildActions(now, before)
    const expected = [
      {
        action: 'setDescription',
        description: { en: 'new-en-description', de: 'new-de-description' },
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeKey` action', () => {
    const before = { key: 'oldKey' }
    const now = { key: 'newKey' }
    const actual = statesSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeKey',
        key: 'newKey',
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeType` action', () => {
    const before = { key: 'state-1', type: 'ReviewState' }
    const now = { key: 'state-1', type: 'ProductState' }
    const actual = statesSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeType',
        type: 'ProductState',
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeInitial` action', () => {
    const before = { key: 'state-1', initial: true }
    const now = { key: 'state-1', initial: false }
    const actual = statesSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeInitial',
        initial: false,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setTransitions` action', () => {
    const before = {
      key: 'state-1',
      transitions: [
        {
          typeId: 'state',
          id: 'old-state-1',
        },
        {
          typeId: 'state',
          id: 'old-state-2',
        },
      ],
    }
    const now = {
      key: 'state-1',
      transitions: [
        {
          typeId: 'state',
          id: 'new-state-1',
        },
        {
          typeId: 'state',
          id: 'new-state-2',
        },
      ],
    }
    const actual = statesSync.buildActions(now, before)
    const expected = [
      {
        action: 'setTransitions',
        transitions: [
          {
            typeId: 'state',
            id: 'new-state-1',
          },
          {
            typeId: 'state',
            id: 'new-state-2',
          },
        ],
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `addRoles` action', () => {
    const before = {
      key: 'state-1',
      roles: ['ReviewIncludedInStatistics'],
    }
    const now = {
      key: 'state-1',
      roles: ['Return', 'Another', 'ReviewIncludedInStatistics'],
    }
    const actual = statesSync.buildActions(now, before)
    const expected = [
      {
        action: 'addRoles',
        roles: ['Return', 'Another'],
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `removeRoles` action', () => {
    const before = {
      key: 'state-1',
      roles: ['Return', 'Another', 'ReviewIncludedInStatistics'],
    }
    const now = {
      key: 'state-1',
      roles: ['ReviewIncludedInStatistics'],
    }
    const actual = statesSync.buildActions(now, before)
    const expected = [
      {
        action: 'removeRoles',
        roles: ['Return', 'Another'],
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build the `removeRoles` and `addRoles` actions', () => {
    // This is necessary because there is currently no way to differentiate
    // between `setRoles` action and `addRoles || removeRoles` actions so we
    // simply replace the roles that need to be replaced with add and remove
    const before = {
      key: 'state-1',
      roles: ['Return', 'Another', 'Baz'],
    }
    const now = {
      key: 'state-1',
      roles: ['Another', 'ReviewIncludedInStatistics', 'Foo'],
    }
    const actual = statesSync.buildActions(now, before)
    const expected = [
      {
        action: 'removeRoles',
        roles: ['Return', 'Baz'],
      },
      {
        action: 'addRoles',
        roles: ['ReviewIncludedInStatistics', 'Foo'],
      },
    ]
    expect(actual).toEqual(expected)
  })
})
