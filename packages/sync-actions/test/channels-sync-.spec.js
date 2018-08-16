import createChannelsSync, { actionGroups } from '../src/channels'
import { baseActionsList } from '../src/channels-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'custom'])
  })

  describe('action list', () => {
    test('should contain `changeKey` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'changeKey', key: 'key' }])
      )
    })

    test('should contain `changeName` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([{ action: 'changeName', key: 'name' }])
      )
    })

    test('should contain `changeDescription` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'changeDescription',
            key: 'description',
          },
        ])
      )
    })

    test('should contain `setAddress` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'setAddress',
            key: 'address',
          },
        ])
      )
    })

    test('should contain `setGeoLocation` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'setGeoLocation',
            key: 'geoLocation',
          },
        ])
      )
    })

    test('should contain `setRoles` action', () => {
      expect(baseActionsList).toEqual(
        expect.arrayContaining([
          {
            action: 'setRoles',
            key: 'roles',
          },
        ])
      )
    })
  })
})

describe('Actions', () => {
  let channelsSync
  beforeEach(() => {
    channelsSync = createChannelsSync()
  })

  test('should build `changeKey` action', () => {
    const before = { key: 'keyBefore' }
    const now = { key: 'keyAfter' }
    const actual = channelsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeKey',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeName` action', () => {
    const before = { name: 'nameBefore' }
    const now = { name: 'nameAfter' }
    const actual = channelsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeName',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeDescription` action', () => {
    const before = { description: 'descriptionBefore' }
    const now = { description: 'descriptionAfter' }
    const actual = channelsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeDescription',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setAddress` action', () => {
    const before = { address: 'addressBefore' }
    const now = { address: 'addressAfter' }
    const actual = channelsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setAddress',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setGeoLocation` action', () => {
    const before = { geoLocation: 'geoLocationBefore' }
    const now = { geoLocation: 'geoLocationAfter' }
    const actual = channelsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setGeoLocation',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setRoles` action', () => {
    const before = { roles: ['exists'] }
    const now = { roles: ['exists', 'new'] }
    const actual = channelsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setRoles',
        ...now,
      },
    ]
    expect(actual).toEqual(expected)
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
      const actual = channelsSync.buildActions(now, before)
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
    const actual = channelsSync.buildActions(now, before)
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
