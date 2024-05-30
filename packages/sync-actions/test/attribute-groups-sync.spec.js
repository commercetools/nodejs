import attributeGroupSyncFn from '../src/attribute-groups'
import { baseActionsList } from '../src/attribute-groups-actions'

describe('Exports', () => {
  test('correctly define base actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'changeName', key: 'name' },
      { action: 'setKey', key: 'key' },
      { action: 'setDescription', key: 'description' },
    ])
  })
})

describe('Actions', () => {
  let attributeGroupSync
  beforeEach(() => {
    attributeGroupSync = attributeGroupSyncFn()
  })

  test('should build `changeName` action', () => {
    const before = {
      name: 'John',
    }
    const now = {
      name: 'Robert',
    }

    const actual = attributeGroupSync.buildActions(now, before)
    const expected = [{ action: 'changeName', name: now.name }]
    expect(actual).toEqual(expected)
  })

  test('should build `setDescription` action', () => {
    const before = {
      description: 'some description',
    }
    const now = {
      description: 'some updated description',
    }

    const actual = attributeGroupSync.buildActions(now, before)
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
      key: 'some-key',
    }
    const now = {
      key: 'new-key',
    }

    const actual = attributeGroupSync.buildActions(now, before)
    const expected = [
      {
        action: 'setKey',
        key: now.key,
      },
    ]
    expect(actual).toEqual(expected)
  })

  describe('`addAttribute`', () => {
    test('should build `addAttribute` action with one attribute', () => {
      const before = {
        attributes: [],
      }
      const now = { attributes: [{ key: 'Size' }] }

      const actual = attributeGroupSync.buildActions(now, before)
      const expected = [
        { action: 'addAttribute', attribute: now.attributes[0] },
      ]
      expect(actual).toEqual(expected)
    })
    test('should build `addAttribute` action with two attributes', () => {
      const before = { attributes: [] }
      const now = { attributes: [{ key: 'Size' }, { key: 'Brand' }] }

      const actual = attributeGroupSync.buildActions(now, before)
      const expected = [
        { action: 'addAttribute', attribute: now.attributes[0] },
        { action: 'addAttribute', attribute: now.attributes[1] },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('`removeAttribute`', () => {
    test('should build `removeAttribute` action removing one attribute', () => {
      const before = {
        attributes: [{ key: 'Size' }, { key: 'Brand' }],
      }
      const now = { attributes: [{ key: 'Size' }] }

      const actual = attributeGroupSync.buildActions(now, before)
      const expected = [
        { action: 'removeAttribute', attribute: before.attributes[1] },
      ]
      expect(actual).toEqual(expected)
    })
    test('should build `removeAttribute` action removing two attributes', () => {
      const before = {
        attributes: [{ key: 'Size' }, { key: 'Brand' }],
      }
      const now = { attributes: [] }

      const actual = attributeGroupSync.buildActions(now, before)
      const expected = [
        { action: 'removeAttribute', attribute: before.attributes[0] },
        { action: 'removeAttribute', attribute: before.attributes[1] },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('Swap attributes (create one + delete one)', () => {
    test('should build `removeAttribute` and `addAttribute`', () => {
      const before = { attributes: [{ key: 'Size' }] }
      const now = { attributes: [{ key: 'Brand' }] }

      const actual = attributeGroupSync.buildActions(now, before)
      const expected = [
        { action: 'removeAttribute', attribute: before.attributes[0] },
        { action: 'addAttribute', attribute: now.attributes[0] },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('Multiple actions', () => {
    test('should build multiple actions for required changes', () => {
      const before = {
        attributes: [{ key: 'Size' }, { key: 'Brand' }],
      }
      const now = {
        attributes: [{ key: 'Quality' }, { key: 'Brand' }, { key: 'color' }],
      }

      const actual = attributeGroupSync.buildActions(now, before)
      const expected = [
        { action: 'removeAttribute', attribute: before.attributes[0] },
        { action: 'addAttribute', attribute: now.attributes[0] },
        { action: 'addAttribute', attribute: now.attributes[2] },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('Delete first attributes', () => {
    test('should build multiple actions for required changes', () => {
      const before = {
        attributes: [{ key: 'Size' }, { key: 'Brand' }, { key: 'Color' }],
      }
      const now = {
        attributes: [{ key: 'Color' }],
      }

      const actual = attributeGroupSync.buildActions(now, before)
      const expected = [
        { action: 'removeAttribute', attribute: before.attributes[0] },
        { action: 'removeAttribute', attribute: before.attributes[1] },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('Delete multiple attributes', () => {
    test('should build multiple actions for required changes', () => {
      const before = {
        attributes: [
          { key: 'Size' },
          { key: 'Brand' },
          { key: 'Quality' },
          { key: 'Color' },
          { key: 'Model' },
          { key: 'attr-1' },
        ],
      }
      const now = {
        attributes: [
          { key: 'Brand' },
          { key: 'Quality' },
          { key: 'Model' },
          { key: 'attr-2' },
        ],
      }

      const actual = attributeGroupSync.buildActions(now, before)
      const expected = [
        { action: 'removeAttribute', attribute: before.attributes[0] },
        { action: 'removeAttribute', attribute: before.attributes[3] },
        { action: 'addAttribute', attribute: now.attributes[3] },
        { action: 'removeAttribute', attribute: before.attributes[5] },
      ]
      expect(actual).toEqual(expected)
    })
  })
})
