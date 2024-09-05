import subscriptionsSyncFn, { actionGroups } from '../src/subscriptions'
import { baseActionsList } from '../src/subscriptions-actions'

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
    test('should contain `setMessages` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'setMessages', key: 'messages' }])
      )
    })
    test('should contain `setChanges` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'setChanges', key: 'changes' }])
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
  let subscriptionsSync = subscriptionsSyncFn()
  beforeEach(() => {
    subscriptionsSync = subscriptionsSyncFn()
  })

  test('should build `setKey` action', () => {
    const before = { key: 'keyBefore' }
    const now = { key: 'keyAfter' }
    const actual = subscriptionsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setKey',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setMessages` action', () => {
    const before = {
      messages: [{ resourceTypeId: 'product', types: ['ProductCreated'] }],
    }
    const now = {
      messages: [{ resourceTypeId: 'product', types: ['ProductUpdated'] }],
    }
    const actual = subscriptionsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setMessages',
        messages: [
          {
            resourceTypeId: 'product',
            types: ['ProductUpdated'],
          },
        ],
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should add additional type', () => {
    const before = {
      messages: [{ resourceTypeId: 'product', types: ['ProductCreated'] }],
    }
    const now = {
      messages: [
        {
          resourceTypeId: 'product',
          types: ['ProductCreated', 'ProductUpdated'],
        },
      ],
    }
    const actual = subscriptionsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setMessages',
        messages: [
          {
            resourceTypeId: 'product',
            types: ['ProductCreated', 'ProductUpdated'],
          },
        ],
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should set Message', () => {
    const before = {}
    const now = {
      messages: [
        {
          resourceTypeId: 'store',
          types: ['StoreCreated'],
        },
        {
          resourceTypeId: 'product',
          types: ['ProductCreated', 'ProductUpdated'],
        },
      ],
    }
    const actual = subscriptionsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setMessages',
        messages: [
          {
            resourceTypeId: 'store',
            types: ['StoreCreated'],
          },
          {
            resourceTypeId: 'product',
            types: ['ProductCreated', 'ProductUpdated'],
          },
        ],
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setChanges` action', () => {
    const before = {
      changes: [{ resourceTypeId: 'product' }],
    }
    const now = {
      changes: [{ resourceTypeId: 'store' }],
    }
    const actual = subscriptionsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setChanges',
        changes: [
          {
            resourceTypeId: 'store',
          },
        ],
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build remove on `setChanges` action', () => {
    const before = {
      changes: [{ resourceTypeId: 'product' }],
    }
    const now = { changes: [] }
    const actual = subscriptionsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setChanges',
        changes: [],
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeDestination` action', () => {
    const before = {}
    const now = {
      destination: {
        type: 'GoogleCloudPubSub',
        projectId: 'projectId',
        topic: 'topic',
      },
    }
    const actual = subscriptionsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeDestination',
        destination: {
          type: 'GoogleCloudPubSub',
          projectId: 'projectId',
          topic: 'topic',
        },
      },
    ]
    expect(actual).toEqual(expected)
  })
})
