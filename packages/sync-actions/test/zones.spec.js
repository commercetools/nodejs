import zonesSyncFn, { actionGroups } from '../src/zones'
import { baseActionsList } from '../src/zones-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'locations'])
  })

  test('correctly define base actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'changeName', key: 'name' },
      { action: 'setDescription', key: 'description' },
      { action: 'setKey', key: 'key' },
    ])
  })
})

describe('Actions', () => {
  let zonesSync
  beforeEach(() => {
    zonesSync = zonesSyncFn()
  })

  test('should build `changeName` action', () => {
    const before = {
      name: 'Europe',
    }
    const now = {
      name: 'Asia',
    }

    const actual = zonesSync.buildActions(now, before)
    const expected = [{ action: 'changeName', name: now.name }]
    expect(actual).toEqual(expected)
  })

  test('should build `setDescription` action', () => {
    const before = {
      description: 'Zone for Europe',
    }
    const now = {
      description: 'Zone for Asia',
    }

    const actual = zonesSync.buildActions(now, before)
    const expected = [
      {
        action: 'setDescription',
        description: now.description,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setKey` action', () => {
    const before = {
      key: 'key-before',
    }

    const now = {
      key: 'key-now',
    }

    const actual = zonesSync.buildActions(now, before)
    const expected = [
      {
        action: 'setKey',
        key: 'key-now',
      },
    ]
    expect(actual).toEqual(expected)
  })

  describe('`addLocation`', () => {
    test('should build `addLocation` action with one location', () => {
      const before = { locations: [] }
      const now = { locations: [{ country: 'Spain' }] }

      const actual = zonesSync.buildActions(now, before)
      const expected = [{ action: 'addLocation', location: now.locations[0] }]
      expect(actual).toEqual(expected)
    })
    test('should build `addLocation` action with two locations', () => {
      const before = { locations: [] }
      const now = { locations: [{ country: 'Spain' }, { country: 'Italy' }] }

      const actual = zonesSync.buildActions(now, before)
      const expected = [
        { action: 'addLocation', location: now.locations[0] },
        { action: 'addLocation', location: now.locations[1] },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('`removeLocation`', () => {
    test('should build `removeLocation` action removing one location', () => {
      const before = {
        locations: [{ country: 'Spain' }, { country: 'Italy' }],
      }
      const now = { locations: [{ country: 'Spain' }] }

      const actual = zonesSync.buildActions(now, before)
      const expected = [
        { action: 'removeLocation', location: before.locations[1] },
      ]
      expect(actual).toEqual(expected)
    })
    test('should build `removeLocation` action removing two locations', () => {
      const before = {
        locations: [{ country: 'Spain' }, { country: 'Italy' }],
      }
      const now = { locations: [] }

      const actual = zonesSync.buildActions(now, before)
      const expected = [
        { action: 'removeLocation', location: before.locations[0] },
        { action: 'removeLocation', location: before.locations[1] },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('Swap locations (create one + delete one)', () => {
    test('should build `removeLocation` and `addLocation`', () => {
      const before = { locations: [{ country: 'Spain' }] }
      const now = { locations: [{ country: 'Italy' }] }

      const actual = zonesSync.buildActions(now, before)
      const expected = [
        { action: 'removeLocation', location: before.locations[0] },
        { action: 'addLocation', location: now.locations[0] },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('Multiple actions', () => {
    test('should build multiple actions for required changes', () => {
      const before = {
        locations: [{ country: 'Spain' }, { country: 'France' }],
      }
      const now = {
        locations: [
          { country: 'Italy' },
          { country: 'France' },
          { country: 'Germany' },
        ],
      }

      const actual = zonesSync.buildActions(now, before)
      const expected = [
        { action: 'removeLocation', location: before.locations[0] },
        { action: 'addLocation', location: now.locations[0] },
        { action: 'addLocation', location: now.locations[2] },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('Delete first locations', () => {
    test('should build multiple actions for required changes', () => {
      const before = {
        locations: [
          { country: 'Spain' },
          { country: 'Italy' },
          { country: 'France' },
        ],
      }
      const now = {
        locations: [{ country: 'France' }],
      }

      const actual = zonesSync.buildActions(now, before)
      const expected = [
        { action: 'removeLocation', location: before.locations[0] },
        { action: 'removeLocation', location: before.locations[1] },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('Delete multiple locations', () => {
    test('should build multiple actions for required changes', () => {
      const before = {
        locations: [
          { country: 'Spain' },
          { country: 'Italy' },
          { country: 'Poland' },
          { country: 'France' },
          { country: 'Portugal' },
          { country: 'Germany' },
        ],
      }
      const now = {
        locations: [
          { country: 'Italy' },
          { country: 'Poland' },
          { country: 'Portugal' },
          { country: 'Russia' },
        ],
      }

      const actual = zonesSync.buildActions(now, before)
      const expected = [
        { action: 'removeLocation', location: before.locations[0] },
        { action: 'removeLocation', location: before.locations[3] },
        { action: 'addLocation', location: now.locations[3] },
        { action: 'removeLocation', location: before.locations[5] },
      ]
      expect(actual).toEqual(expected)
    })
  })
})
