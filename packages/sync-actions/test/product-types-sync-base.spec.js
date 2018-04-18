import clone from '../src/utils/clone'
import productTypesSyncFn, { actionGroups } from '../src/product-types'
import { updateActionsDefinitions } from '../src/product-types-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'attributes'])
  })

  test('correctly define base actions list', () => {
    expect(updateActionsDefinitions).toEqual([
      { action: 'changeName', key: 'name' },
      { action: 'changeDescription', key: 'description' },
      { action: 'setKey', key: 'key' },
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
    productTypesSync = productTypesSyncFn()
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
      productTypesSync.buildActions(now, before)
      expect(before).toEqual(clone(before))
      expect(now).toEqual(clone(now))
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
    describe('when there is a previous value', () => {
      describe('when there is a next value', () => {
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
      describe('when next value is an empty string', () => {
        beforeEach(() => {
          before = {
            key: 'sneakers-key',
          }
          now = {
            key: '',
          }
          updateActions = productTypesSync.buildActions(now, before)
        })
        it('should return `setKey` update-action', () => {
          expect(updateActions).toEqual([
            {
              action: 'setKey',
            },
          ])
        })
      })
      describe('when next value is `undefined`', () => {
        beforeEach(() => {
          before = {
            key: 'sneakers-key',
          }
          now = {
            key: undefined,
          }
          updateActions = productTypesSync.buildActions(now, before)
        })
        it('should return `setKey` update-action', () => {
          expect(updateActions).toEqual([
            {
              action: 'setKey',
            },
          ])
        })
      })
      describe('when next value is `null`', () => {
        beforeEach(() => {
          before = {
            key: 'sneakers-key',
          }
          now = {
            key: null,
          }
          updateActions = productTypesSync.buildActions(now, before)
        })
        it('should return `setKey` update-action', () => {
          expect(updateActions).toEqual([
            {
              action: 'setKey',
            },
          ])
        })
      })
    })
    describe('when previous value is an empty string', () => {
      describe('when there is a next value', () => {
        beforeEach(() => {
          before = {
            key: '',
          }
          now = {
            key: 'kicks-key',
          }
          updateActions = productTypesSync.buildActions(now, before)
        })
        it('should not return `setKey` update-action', () => {
          expect(updateActions).toEqual([
            {
              action: 'setKey',
              key: 'kicks-key',
            },
          ])
        })
      })
      describe('when next value is `undefined`', () => {
        beforeEach(() => {
          before = {
            key: '',
          }
          now = {
            key: undefined,
          }
          updateActions = productTypesSync.buildActions(now, before)
        })
        it('should not return `setKey` update-action', () => {
          expect(updateActions).toEqual([])
        })
      })
      describe('when next value is `null`', () => {
        beforeEach(() => {
          before = {
            key: '',
          }
          now = {
            key: null,
          }
          updateActions = productTypesSync.buildActions(now, before)
        })
        it('should not return `setKey` update-action', () => {
          expect(updateActions).toEqual([])
        })
      })
    })
    describe('when previous value is `null`', () => {
      describe('when there is a next value', () => {
        beforeEach(() => {
          before = {
            key: null,
          }
          now = {
            key: 'kicks-key',
          }
          updateActions = productTypesSync.buildActions(now, before)
        })
        it('should return `setKey` update-action', () => {
          expect(updateActions).toEqual([
            {
              action: 'setKey',
              key: 'kicks-key',
            },
          ])
        })
      })
      describe('when next value is `undefined`', () => {
        beforeEach(() => {
          before = {
            key: null,
          }
          now = {
            key: undefined,
          }
          updateActions = productTypesSync.buildActions(now, before)
        })
        it('should not return `setKey` update-action', () => {
          expect(updateActions).toEqual([])
        })
      })
      describe('when next value is an empty string', () => {
        beforeEach(() => {
          before = {
            key: null,
          }
          now = {
            key: '',
          }
          updateActions = productTypesSync.buildActions(now, before)
        })
        it('should not return `setKey` update-action', () => {
          expect(updateActions).toEqual([])
        })
      })
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
})
