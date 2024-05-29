import * as diffpatcher from '../../src/utils/diffpatcher'
import createBuildActions from '../../src/utils/create-build-actions'
import doMapActions from '../../src/utils/action-map-custom'

describe('buildActions', () => {
  let buildActions
  beforeEach(() => {
    buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  })

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
    const actual = buildActions(now, before)
    const expected = [{ action: 'setCustomType', ...now.custom }]
    expect(actual).toEqual(expected)
  })

  test('should build `setCustomType` action with key', () => {
    const before = {
      custom: {
        type: {
          typeId: 'type',
          key: 'customType1',
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
          key: 'customType2',
        },
        fields: {
          customField1: true,
        },
      },
    }
    const actual = buildActions(now, before)
    const expected = [{ action: 'setCustomType', ...now.custom }]
    expect(actual).toEqual(expected)
  })

  test('should build `setCustomField` action', () => {
    const before = {
      custom: {
        type: {
          typeId: 'type',
          id: 'customType1',
        },
        fields: {
          customField1: true, // will change
          customField2: true, // will stay unchanged
          customField3: false, // will be removed
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
          customField1: false,
          customField2: true,
          customField4: true, // was added
        },
      },
    }
    const actual = buildActions(now, before)
    const expected = [
      {
        action: 'setCustomField',
        name: 'customField1',
        value: false,
      },
      {
        action: 'setCustomField',
        name: 'customField3',
        value: undefined,
      },
      {
        action: 'setCustomField',
        name: 'customField4',
        value: true,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setCustomField` action for a long text field', () => {
    const before = {
      custom: {
        type: {
          typeId: 'type',
          id: 'customType',
        },
        fields: {
          customField: 'word '.repeat(200),
        },
      },
    }
    const updatedValue = before.custom.fields.customField.concat('1')
    const now = {
      custom: {
        ...before.custom,
        fields: {
          customField: updatedValue,
        },
      },
    }
    const actual = buildActions(now, before)
    const expected = [
      {
        action: 'setCustomField',
        name: 'customField',
        value: updatedValue,
      },
    ]
    expect(actual).toEqual(expected)
  })

  describe('changing the custom type of a category', () => {
    describe('existing category has no `custom` object', () => {
      test('should build `setCustomType` action with the new type', () => {
        const before = {
          key: 'category-key',
        }
        const now = {
          key: 'category-key',
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
        const actual = buildActions(now, before)
        const expected = [{ action: 'setCustomType', ...now.custom }]
        expect(actual).toEqual(expected)
      })
    })

    describe('existing category has an empty `custom` object', () => {
      test('should build `setCustomType` action with the new type', () => {
        const before = {
          key: 'category-key',
          custom: {},
        }
        const now = {
          key: 'category-key',
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
        const actual = buildActions(now, before)
        const expected = [{ action: 'setCustomType', ...now.custom }]
        expect(actual).toEqual(expected)
      })
    })

    describe('existing category has a `custom` object', () => {
      describe('new category has no `custom` object', () => {
        test('build `setCustomType` action to unset the `custom` type', () => {
          const before = {
            key: 'category-key',
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
          const now = {
            key: 'category-key',
            custom: {},
          }
          const actual = buildActions(now, before)
          const expected = [{ action: 'setCustomType' }]
          expect(actual).toEqual(expected)
        })
      })

      describe('new category has an empty `custom` object', () => {
        test('build `setCustomType` action to unset the `custom` type', () => {
          const before = {
            key: 'category-key',
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
          const now = {
            key: 'category-key',
            // no custom object
          }
          const actual = buildActions(now, before)
          const expected = [{ action: 'setCustomType' }]
          expect(actual).toEqual(expected)
        })
        test('throw error if either argument function arguments are not provided', () => {
          expect(() => buildActions(null, null)).toThrow()
        })
      })
    })
  })
})
