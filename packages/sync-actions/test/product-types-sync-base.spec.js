import clone from '../src/utils/clone'
import createSyncProductTypes, { actionGroups } from '../src/product-types'
import {
  baseActionsList,
  generateBaseFieldsUpdateActions,
} from '../src/product-types-actions'

describe('ProductTypes sync', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base'])
  })

  test('correctly define base actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'changeName', key: 'name' },
      { action: 'setKey', key: 'key' },
      { action: 'changeDescription', key: 'description' },
    ])
  })
  test('correctly define attribute definitions actions list', () => {})
})

describe('Actions', () => {
  let productTypesSync
  let updateActions
  let before
  let now
  beforeEach(() => {
    productTypesSync = createSyncProductTypes()
  })
  describe('mutation', () => {
    test('should ensure given objects are not mutated', () => {
      before = {
        name: 'Sneakers',
        key: 'unique-key',
      }
      now = {
        name: 'Sneakers',
        key: 'unique-key-2',
      }
      const beforeClone = clone(before)
      const nowClone = clone(now)
      productTypesSync.buildActions(nowClone, beforeClone)
      expect(before).toEqual(beforeClone)
      expect(now).toEqual(nowClone)
    })
  })
  describe('with name change', () => {
    beforeEach(() => {
      before = {
        name: 'Sneakers',
      }
      now = {
        name: 'Kicks',
      }
      updateActions = productTypesSync.buildActions(now, before)
    })
    test('should return `changeName` update-action', () => {
      expect(updateActions).toEqual([
        {
          action: 'changeName',
          name: 'Kicks',
        },
      ])
    })
  })
  describe('with key change', () => {
    beforeEach(() => {
      before = {
        key: 'sneakers-key',
      }
      now = {
        key: 'kicks-key',
      }
      updateActions = productTypesSync.buildActions(now, before)
    })
    test('should return `setKey` update-action', () => {
      expect(updateActions).toEqual([
        {
          action: 'setKey',
          key: 'kicks-key',
        },
      ])
    })
  })
  describe('with description change', () => {
    beforeEach(() => {
      before = {
        description: 'sneakers-description',
      }
      now = {
        description: 'kicks-description',
      }
      updateActions = productTypesSync.buildActions(now, before)
    })
    test('should return `changeKey` update-action', () => {
      expect(updateActions).toEqual([
        {
          action: 'changeDescription',
          description: 'kicks-description',
        },
      ])
    })
  })
  describe('with attribute order change', () => {
    beforeEach(() => {
      productTypesSync = createSyncProductTypes(undefined, {
        withHints: true,
      })
    })

    test('should return `changeAttributeOrderByName` update-action', () => {
      before = {
        name: 'Product Type',
        attributes: [{ name: 'color' }, { name: 'material' }],
      }
      now = {
        name: 'Product Type',
        attributes: [{ name: 'material' }, { name: 'color' }],
      }

      updateActions = productTypesSync.buildActions(now, before)
      expect(updateActions).toEqual([
        {
          action: 'changeAttributeOrderByName',
          attributeNames: ['material', 'color'],
        },
      ])
    })

    test('should remove, add and change order of attributes', () => {
      before = {
        name: 'Product Type',
        attributes: [
          { name: 'attr1' },
          { name: 'attr2' }, // removed
          { name: 'attr3' },
        ],
      }
      now = {
        name: 'Product Type',
        attributes: [
          { name: 'attr3' },
          { name: 'attr4' }, // added
          { name: 'attr1' },
        ],
      }

      updateActions = productTypesSync.buildActions(now, before, {
        nestedValuesChanges: {
          attributeDefinitions: [
            {
              previous: {
                name: 'attr2',
              },
            },
            {
              next: {
                name: 'attr4',
              },
            },
          ],
        },
      })

      expect(updateActions).toEqual([
        {
          action: 'removeAttributeDefinition',
          name: 'attr2',
        },
        {
          action: 'addAttributeDefinition',
          attribute: {
            name: 'attr4',
          },
        },
        {
          action: 'changeAttributeOrderByName',
          attributeNames: ['attr3', 'attr4', 'attr1'],
        },
      ])
    })
  })
})

describe('generateBaseFieldsUpdateActions', () => {
  let previous
  let next
  let updateActions
  const field = 'name'
  const actionDefinition = {
    [field]: { action: 'changeName' },
  }
  describe('with change', () => {
    beforeEach(() => {
      previous = { [field]: 'previous' }
      next = { [field]: 'next' }
      updateActions = generateBaseFieldsUpdateActions(
        previous,
        next,
        actionDefinition
      )
    })
    it('should generate `changeName` update action', () => {
      expect(updateActions).toEqual([
        {
          action: 'changeName',
          [field]: next[field],
        },
      ])
    })
    describe('with previous and empty `next`', () => {
      const cases = [
        [null, { action: 'changeName' }],
        [undefined, { action: 'changeName' }],
        ['', { action: 'changeName' }],
      ]
      it.each(cases)(
        'should generate `changeName` for %s update action with omitted field indicating removing value',
        (nextValue, updateActionWithMissingValue) => {
          next = { [field]: nextValue }
          updateActions = generateBaseFieldsUpdateActions(
            previous,
            next,
            actionDefinition
          )
          expect(updateActions).toEqual([updateActionWithMissingValue])
        }
      )
    })
  })
  describe('without change', () => {
    describe('with value on `previous` and `next`', () => {
      beforeEach(() => {
        previous = { [field]: 'foo' }
        next = { [field]: 'foo' }
        updateActions = generateBaseFieldsUpdateActions(
          previous,
          next,
          actionDefinition
        )
      })
      it('should not generate `changeName` update action', () => {
        expect(updateActions).toEqual([])
      })
    })
    describe('without value on `previous` and `next`', () => {
      beforeEach(() => {
        previous = { [field]: '' }
        next = { [field]: '' }
        updateActions = generateBaseFieldsUpdateActions(
          previous,
          next,
          actionDefinition
        )
      })
      it('should not generate `changeName` update action', () => {
        expect(updateActions).toEqual([])
      })
    })
  })
})
