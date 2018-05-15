import clone from '../src/utils/clone'
import createSyncProductTypes, { actionGroups } from '../src/product-types'
import { baseActionsList } from '../src/product-types-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'attributes'])
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

  describe('with `shouldOmitEmptyString`', () => {
    beforeEach(() => {
      productTypesSync = createSyncProductTypes([], {
        shouldOmitEmptyString: true,
      })
    })
    describe('with key change', () => {
      describe('when previous value is an empty string', () => {
        describe('when there is a next value', () => {
          beforeEach(() => {
            before = {
              key: '',
            }
            now = {
              key: 'hello world',
            }
            updateActions = productTypesSync.buildActions(now, before)
          })
          it('should return `setKey` update-action', () => {
            expect(updateActions).toEqual([
              {
                action: 'setKey',
                key: 'hello world',
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
      describe('when previous value is `undefined`', () => {
        describe('when there is a next value', () => {
          beforeEach(() => {
            before = {}
            now = {
              key: 'hello world',
            }
            updateActions = productTypesSync.buildActions(now, before)
          })
          it('should return `setKey` update-action', () => {
            expect(updateActions).toEqual([
              {
                action: 'setKey',
                key: 'hello world',
              },
            ])
          })
        })
        describe('when next value is `null`', () => {
          beforeEach(() => {
            before = {}
            now = { key: null }
            updateActions = productTypesSync.buildActions(now, before)
          })
          it('should not return `setKey` update-action', () => {
            expect(updateActions).toEqual([])
          })
        })
        describe('when next value is `undefined`', () => {
          beforeEach(() => {
            before = {}
            now = {}
            updateActions = productTypesSync.buildActions(now, before)
          })
          it('should not return `setKey` update-action', () => {
            expect(updateActions).toEqual([])
          })
        })
      })
    })
  })
})
