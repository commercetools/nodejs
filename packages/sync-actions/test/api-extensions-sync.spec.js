import apiExtensionsSyncFn, { actionGroups } from '../src/api-extensions'
import { baseActionsList } from '../src/api-extensions-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base'])
  })

  describe('action list', () => {
    test('should contain `setKey` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'setKey', key: 'key' }])
      )
    })
    test('should contain `changeTriggers` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'changeTriggers', key: 'triggers' }])
      )
    })
    test('should contain `setTimeoutInMs` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          { action: 'setTimeoutInMs', key: 'timeoutInMs' },
        ])
      )
    })
    test('should contain `changeDestination` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          { action: 'changeDestination', key: 'destination' },
        ])
      )
    })
  })
})

describe('Actions', () => {
  let apiExtensionsSync = apiExtensionsSyncFn()
  beforeEach(() => {
    apiExtensionsSync = apiExtensionsSyncFn()
  })

  test('should build `setKey` action', () => {
    const before = { key: 'keyBefore' }
    const now = { key: 'keyAfter' }
    const actual = apiExtensionsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setKey',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeDestination` action', () => {
    const before = {}
    const now = {
      destination: {
        type: 'GoogleCloudFunction',
        url: 'url',
      },
    }
    const actual = apiExtensionsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeDestination',
        destination: {
          type: 'GoogleCloudFunction',
          url: 'url',
        },
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setTimeoutInMs` action', () => {
    const before = { timeoutInMs: 5 }
    const now = {
      timeoutInMs: 10,
    }
    const actual = apiExtensionsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setTimeoutInMs',
        timeoutInMs: 10,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeTriggers` action', () => {
    const before = {}
    const now = {
      triggers: [
        {
          resourceTypeId: 'cart',
          actions: ['Create', 'Update'],
          condition: 'field is defined and field has changed',
        },
      ],
    }
    const actual = apiExtensionsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeTriggers',
        triggers: [
          {
            resourceTypeId: 'cart',
            actions: ['Create', 'Update'],
            condition: 'field is defined and field has changed',
          },
        ],
      },
    ]
    expect(actual).toEqual(expected)
  })
})
