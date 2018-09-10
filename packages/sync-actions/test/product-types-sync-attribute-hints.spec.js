// import clone from '../src/utils/clone'
import createSyncProductTypes from '../src/product-types'

const createAttributeDefinitionDraftItem = custom => ({
  previous: {
    type: { name: 'text' },
    name: 'attribute-name',
    label: { en: 'attribute-label' },
    isRequired: false,
    attributeConstraint: 'SameForAll',
    inputTip: { en: 'input-hint' },
    inputHint: 'SingleLine',
    isSearchable: false,
  },
  next: {
    type: { name: 'text' },
    name: 'attribute-name',
    label: { en: 'attribute-label' },
    isRequired: false,
    attributeConstraint: 'SameForAll',
    inputTip: { en: 'input-hint' },
    inputHint: 'SingleLine',
    isSearchable: false,
  },
  ...custom,
})

const createAttributeEnumDraftItem = custom => ({
  previous: {
    key: 'enum-key',
    label: 'enum-label',
  },
  next: {
    key: 'enum-key',
    label: 'enum-label',
  },
  hint: {
    attributeName: 'attribute-name',
    isLocalized: false,
  },
  ...custom,
})

describe('product type hints', () => {
  let updateActions
  let sync
  beforeEach(() => {
    sync = createSyncProductTypes([], {
      withHints: true,
    })
  })
  describe('attribute enum values', () => {
    let attributeEnumDraftItem
    describe('with previous', () => {
      describe('with no changes', () => {
        beforeEach(() => {
          attributeEnumDraftItem = createAttributeEnumDraftItem()
          updateActions = sync.buildActions(
            {},
            {},
            {
              nestedValuesChangess: {
                attributeEnumValues: [attributeEnumDraftItem],
              },
            }
          )
        })
        it('should not generate any update-actions', () => {
          expect(updateActions).toEqual([])
        })
      })
      describe('with changes', () => {
        describe('when is not localized', () => {
          beforeEach(() => {
            attributeEnumDraftItem = createAttributeEnumDraftItem({
              next: {
                key: 'next-key',
                label: 'next-label',
              },
            })
            updateActions = sync.buildActions(
              {},
              {},
              {
                nestedValuesChangess: {
                  attributeEnumValues: [attributeEnumDraftItem],
                },
              }
            )
          })
          it('should match snapshot', () => {
            expect(updateActions).toMatchSnapshot()
          })
          it('should generate `changeEnumKey` update-action', () => {
            expect(updateActions).toEqual(
              expect.arrayContaining([
                {
                  action: 'changeEnumKey',
                  attributeName: attributeEnumDraftItem.hint.attributeName,
                  key: 'enum-key',
                  newKey: 'next-key',
                },
              ])
            )
          })
          it('should generate `changePlainEnumLabel` update-action', () => {
            expect(updateActions).toEqual(
              expect.arrayContaining([
                {
                  action: 'changePlainEnumValueLabel',
                  attributeName: attributeEnumDraftItem.hint.attributeName,
                  newValue: attributeEnumDraftItem.next,
                },
              ])
            )
          })
        })
        describe('when is localized', () => {
          beforeEach(() => {
            attributeEnumDraftItem = createAttributeEnumDraftItem({
              next: {
                key: 'next-key',
                label: 'next-label',
              },
              hint: {
                isLocalized: true,
                attributeName: 'attribute-name',
              },
            })
            updateActions = sync.buildActions(
              {},
              {},
              {
                nestedValuesChangess: {
                  attributeEnumValues: [attributeEnumDraftItem],
                },
              }
            )
          })
          it('should match snapshot', () => {
            expect(updateActions).toMatchSnapshot()
          })
          it('should generate `changeEnumKey` update-action', () => {
            expect(updateActions).toEqual(
              expect.arrayContaining([
                {
                  action: 'changeEnumKey',
                  attributeName: attributeEnumDraftItem.hint.attributeName,
                  key: 'enum-key',
                  newKey: 'next-key',
                },
              ])
            )
          })
          it('should generate `changeLocalizedEnumValueLabel` update-action', () => {
            expect(updateActions).toEqual(
              expect.arrayContaining([
                {
                  action: 'changeLocalizedEnumValueLabel',
                  attributeName: attributeEnumDraftItem.hint.attributeName,
                  newValue: attributeEnumDraftItem.next,
                },
              ])
            )
          })
        })

        describe('when removing, adding, and editing (in a single batch of actions)', () => {
          let attributeEnumDraftItemToBeRemoved1
          let attributeEnumDraftItemToBeRemoved2
          let attributeEnumDraftItemToBeChanged
          let attributeEnumDraftItemToBeAdded
          beforeEach(() => {
            attributeEnumDraftItemToBeRemoved1 = createAttributeEnumDraftItem({
              previous: { key: 'enum-key-1', label: 'enum-label-1' },
              next: undefined,
              hint: {
                attributeName: 'attribute-enum-with-2-enum-values-to-remove',
                isLocalized: false,
              },
            })
            attributeEnumDraftItemToBeRemoved2 = createAttributeEnumDraftItem({
              previous: { key: 'enum-key-2', label: 'enum-label-2' },
              next: undefined,
              hint: {
                attributeName: 'attribute-enum-with-2-enum-values-to-remove',
                isLocalized: false,
              },
            })
            attributeEnumDraftItemToBeChanged = createAttributeEnumDraftItem({
              next: {
                key: 'next-enum-draft-item',
                label: undefined,
              },
            })
            attributeEnumDraftItemToBeAdded = createAttributeEnumDraftItem({
              previous: undefined,
              next: {
                key: 'new-enum-draft-item',
                label: 'new-enum-draft-item',
              },
            })
            updateActions = sync.buildActions(
              {},
              {},
              {
                nestedValuesChangess: {
                  // we mess around with the order of changes among the hints...
                  // we should expect that sync-actions gives us a list of changes with the following order:
                  // [ updateActionsToRemoveEnumValues, updateActionsToUpdateEnumValues, updateActionsToAddEnumValues ]
                  // when two enumvalues has the same attribute-name, we should also expect that they are "grouped" into a single update action as well.
                  attributeEnumValues: [
                    attributeEnumDraftItemToBeAdded,
                    attributeEnumDraftItemToBeRemoved1,
                    attributeEnumDraftItemToBeChanged,
                    attributeEnumDraftItemToBeRemoved2,
                  ],
                },
              }
            )
          })
          it('should match snapshot', () => {
            expect(updateActions).toMatchSnapshot()
          })
          it('should generate update-actions (with an explicit order)', () => {
            expect(updateActions).toEqual([
              {
                action: 'removeEnumValues',
                attributeName: 'attribute-enum-with-2-enum-values-to-remove',
                keys: ['enum-key-1', 'enum-key-2'],
              },
              {
                action: 'changeEnumKey',
                attributeName: 'attribute-name',
                key: 'enum-key',
                newKey: 'next-enum-draft-item',
              },
              {
                action: 'changePlainEnumValueLabel',
                attributeName: 'attribute-name',
                newValue: {
                  key: 'next-enum-draft-item',
                  // this is a possibility on clients. we ought to rely on the API, to return an error
                  // ref: https://docs.commercetools.com/http-api-projects-productTypes.html#change-the-label-of-an-enumvalue
                  label: undefined,
                },
              },
              {
                action: 'addPlainEnumValue',
                attributeName: 'attribute-name',
                value: attributeEnumDraftItemToBeAdded.next,
              },
            ])
          })
        })
      })
    })
    describe('without previous', () => {
      beforeEach(() => {
        attributeEnumDraftItem = createAttributeEnumDraftItem({
          previous: undefined,
        })
        updateActions = sync.buildActions(
          {},
          {},
          {
            nestedValuesChangess: {
              attributeEnumValues: [attributeEnumDraftItem],
            },
          }
        )
      })
      it('should match snapshot', () => {
        expect(updateActions).toMatchSnapshot()
      })
      it('should generate `addPlainEnumValue`', () => {
        expect(updateActions).toEqual([
          {
            action: 'addPlainEnumValue',
            attributeName: attributeEnumDraftItem.hint.attributeName,
            value: attributeEnumDraftItem.next,
          },
        ])
      })
      describe('when is localized', () => {
        beforeEach(() => {
          attributeEnumDraftItem = createAttributeEnumDraftItem({
            previous: undefined,
            hint: {
              // this hint value is used as `attributeName` for enum update actions
              attributeName: 'attribute-name',
              isLocalized: true,
            },
          })
          updateActions = sync.buildActions(
            {},
            {},
            {
              nestedValuesChangess: {
                attributeEnumValues: [attributeEnumDraftItem],
              },
            }
          )
        })
        it('should match snapshot', () => {
          expect(updateActions).toMatchSnapshot()
        })
        it('should generate `addLocalizedEnumValue`', () => {
          expect(updateActions).toEqual([
            {
              action: 'addLocalizedEnumValue',
              attributeName: attributeEnumDraftItem.hint.attributeName,
              value: attributeEnumDraftItem.next,
            },
          ])
        })
      })
    })
  })
  describe('attribute hints', () => {
    let attributeDefinitionDraftItem
    describe('with previous', () => {
      describe('with next', () => {
        describe('with no changes', () => {
          beforeEach(() => {
            attributeDefinitionDraftItem = createAttributeDefinitionDraftItem()
            updateActions = sync.buildActions(
              {},
              {},
              {
                nestedValuesChangess: {
                  attributeDefinitions: [attributeDefinitionDraftItem],
                },
              }
            )
          })
          it('should match snapshot', () => {
            expect(updateActions).toMatchSnapshot()
          })
          it('should not generate any update-actions', () => {
            expect(updateActions).toEqual([])
          })
        })
        describe('with changes', () => {
          beforeEach(() => {
            attributeDefinitionDraftItem = createAttributeDefinitionDraftItem({
              next: {
                type: { name: 'boolean' },
                name: 'next-attribute-name',
                label: { en: 'next-attribute-label' },
                attributeConstraint: 'SameForAll',
                inputTip: { en: 'next-input-tip' },
                inputHint: 'MultiLine',
                isSearchable: true,
              },
            })
            updateActions = sync.buildActions(
              {},
              {},
              {
                nestedValuesChangess: {
                  attributeDefinitions: [attributeDefinitionDraftItem],
                },
              }
            )
          })
          it('should match snapshot', () => {
            expect(updateActions).toMatchSnapshot()
          })
          it('should not generate update action for `name`', () => {
            // the API supports changeAttributeName for now,
            // however this is not something we support in the node.js for the moment.
            expect(updateActions).toEqual(
              expect.not.arrayContaining([
                {
                  action: 'changeAttributeName',
                },
              ])
            )
          })
          const changes = [
            [
              'label',
              {
                action: 'changeLabel',
                attributeName: 'attribute-name',
                label: { en: 'next-attribute-label' },
              },
            ],
            [
              'inputTip',
              {
                action: 'setInputTip',
                attributeName: 'attribute-name',
                inputTip: {
                  en: 'next-input-tip',
                },
              },
            ],
            [
              'inputHint',
              {
                action: 'changeInputHint',
                attributeName: 'attribute-name',
                newValue: 'MultiLine',
              },
            ],
            [
              'isSearchable',
              {
                action: 'changeIsSearchable',
                attributeName: 'attribute-name',
                isSearchable: true,
              },
            ],
          ]
          it.each(changes)(
            'should generate update action for %s',
            (name, expectedUpdateAction) => {
              expect(updateActions).toEqual(
                expect.arrayContaining([expectedUpdateAction])
              )
            }
          )
        })
      })
      describe('without next', () => {
        beforeEach(() => {
          attributeDefinitionDraftItem = createAttributeDefinitionDraftItem({
            next: undefined,
          })
          updateActions = sync.buildActions(
            {},
            {},
            {
              nestedValuesChangess: {
                attributeDefinitions: [attributeDefinitionDraftItem],
              },
            }
          )
        })
        it('should match snapshot', () => {
          expect(updateActions).toMatchSnapshot()
        })
        it('should generate `removeAttributeDefinition` update-action', () => {
          expect(updateActions).toEqual(
            expect.arrayContaining([
              {
                action: 'removeAttributeDefinition',
                name: 'attribute-name',
              },
            ])
          )
        })
      })
    })
    describe('without previous', () => {
      beforeEach(() => {
        attributeDefinitionDraftItem = createAttributeDefinitionDraftItem({
          previous: undefined,
        })
        updateActions = sync.buildActions(
          {},
          {},
          {
            nestedValuesChangess: {
              attributeDefinitions: [attributeDefinitionDraftItem],
            },
          }
        )
      })
      it('should match snapshot', () => {
        expect(updateActions).toMatchSnapshot()
      })
      it('should generate `addAttributeDefinition` update-action', () => {
        expect(updateActions).toEqual([
          {
            action: 'addAttributeDefinition',
            attribute: attributeDefinitionDraftItem.next,
          },
        ])
      })
    })
  })
})
