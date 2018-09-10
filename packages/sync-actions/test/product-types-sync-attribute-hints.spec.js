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

const createProductType = custom => ({
  key: 'product-type-key',
  name: 'product type name',
  description: 'product type description',
  attributes: [
    /* attributeDefinitions */
  ],
  ...custom,
})

describe('product type hints', () => {
  let attributeDefinitionDraftItem
  let updateActions
  let sync
  beforeEach(() => {
    sync = createSyncProductTypes([], {
      withHints: true,
    })
  })
  describe('attribute hints', () => {
    describe('with previous', () => {
      describe('with `next`', () => {
        describe('with no changes', () => {
          beforeEach(() => {
            attributeDefinitionDraftItem = createAttributeDefinitionDraftItem()
            updateActions = sync.buildActions(
              {},
              {},
              {
                nestedEntityChanges: {
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
                nestedEntityChanges: {
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
      describe('without `next`', () => {
        beforeEach(() => {
          attributeDefinitionDraftItem = createAttributeDefinitionDraftItem({
            next: undefined,
          })
          updateActions = sync.buildActions(
            {},
            {},
            {
              nestedEntityChanges: {
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
            nestedEntityChanges: {
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
