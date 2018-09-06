import createSyncProductTypes from '../src/product-types'

describe('actions', () => {
  let previous
  let next
  let updateActions
  let productTypesSync
  describe('when changing attribute name and enum value label', () => {
    beforeEach(() => {
      productTypesSync = createSyncProductTypes([], {
        shouldOmitEmptyString: true,
      })
      previous = {
        id: 'product-type-id',
        name: 'product-type-name',
        description: 'slightly informative',
        key: 'product-type-key',
        attributes: [
          {
            name: 'product-type-enum-attribute-name',
            label: {
              de: 'enum attribute (de)',
              en: 'enum attribute (en)',
            },
            attributeConstraint: 'SameForAll',
            inputTip: {
              de: 'input-tip-de',
              en: 'input-tip-en',
            },
            isSearchable: false,
            type: {
              name: 'enum',
              values: [
                {
                  // to be changed
                  key: 'enum-key-one',
                  label: 'enum-label-one',
                },
                {
                  // to be overriden..
                  key: 'enum-about-to-be-overidden',
                  label: 'enum-about-to-be-overriden',
                },
              ],
            },
          },
        ],
      }
      next = {
        id: 'product-type-id',
        name: 'product-type-name-new',
        description: 'very informative',
        key: 'product-type-key-new',
        attributes: [
          {
            name: 'product-type-enum-attribute-name',
            label: {
              de: 'enum attribute (de) - new',
              en: 'enum attribute (en)',
            },
            attributeConstraint: 'CombinationUnique',
            inputTip: {
              de: 'input-tip-de new',
              en: 'input-tip-en new',
            },
            isSearchable: true,
            type: {
              name: 'enum',
              values: [
                {
                  key: 'enum-key-one-new',
                  label: 'enum-label-one-new',
                },
                {
                  // an updated enum value in place of `enum-about-to-be-overidden`
                  // at this point, there is an enum at the same position
                  // as the previous version of this product type, how sync-actions can not calculate:
                  // - `changeEnumKey`
                  // - `changePlainEnumValueLabel`
                  // which are the ideal update actions for this.
                  // from an API point of view, it is not recommended to use `removeEnumValue` then `addPlainEnumValue`
                  // since the actual attribute value on the product would disappear!
                  key: 'enum-key-two',
                  label: 'enum-label-two',
                },
              ],
            },
          },
        ],
      }
      updateActions = productTypesSync.buildActions(next, previous)
    })
    it('should generate update-actions for product type', () => {
      const productTypeChanges = [
        ['name', { action: 'changeName', name: 'product-type-name-new' }],
        [
          'description',
          { action: 'changeDescription', description: 'very informative' },
        ],
        ['key', { action: 'setKey', key: 'product-type-key-new' }],
      ]
      productTypeChanges.forEach(change => {
        const [, generatedUpdateAction] = change
        expect(updateActions).toEqual(
          expect.arrayContaining([generatedUpdateAction])
        )
      })
    })
    it('should generate update-actions for attributes', () => {
      const attributeDefinitionChanges = [
        [
          'label',
          {
            action: 'changeLabel',
            attributeName: 'product-type-enum-attribute-name',
            label: {
              de: 'enum attribute (de) - new',
              en: 'enum attribute (en)',
            },
          },
        ],
        [
          'inputTip',
          {
            action: 'setInputTip',
            attributeName: 'product-type-enum-attribute-name',
            inputTip: {
              de: 'input-tip-de new',
              en: 'input-tip-en new',
            },
          },
        ],
        [
          'isSearchable',
          {
            action: 'changeIsSearchable',
            attributeName: 'product-type-enum-attribute-name',
            isSearchable: true,
          },
        ],
        [
          'attributeConstraint',
          {
            action: 'changeAttributeConstraint',
            newValue: 'CombinationUnique',
            attributeName: 'product-type-enum-attribute-name',
          },
        ],
      ]
      attributeDefinitionChanges.forEach(change => {
        const [, generatedUpdateAction] = change
        expect(updateActions).toEqual(
          expect.arrayContaining([generatedUpdateAction])
        )
      })
    })

    // ------------------------------------------
    // breaking tests
    // ------------------------------------------
    it('should generate `changePlainEnumValueLabel` for attribute enum value', () => {
      expect(updateActions).toEqual(
        // this is an expected update-action to be generated, however sync-actions can not do that.
        expect.arrayContaining([
          {
            action: 'changePlainEnumValueLabel',
            attributeName: 'product-type-enum-attribute-name',
            newValue: 'enum-label-two',
          },
        ])
      )
    })
    it('should generate `removeEnumValues` update-actions', () => {
      expect(updateActions).toEqual(
        // this is an expected update-action to be generated, however sync-actions can not do that.
        expect.arrayContaining([
          {
            action: 'removeEnumValues',
            attributeName: 'product-type-enum-attribute-name',
            keys: 'enum-about-to-be-overidden',
          },
        ])
      )
    })
    it('should generate `changeEnumKey` update-actions', () => {
      expect(updateActions).toEqual(
        // this is an expected update-action to be generated, however sync-actions can not do that.
        expect.arrayContaining([
          {
            action: 'changeEnumKey',
            attributeName: 'product-type-enum-attribute-name',
            key: 'enum-about-to-be-overidden',
            newKey: 'enum-key-two',
          },
        ])
      )
    })
    it('should generate `changePlainEnumValueLabel` update-actions', () => {
      expect(updateActions).toEqual(
        // this is an expected update-action to be generated, however sync-actions can not do that.
        expect.arrayContaining([
          {
            action: 'changePlainEnumValueLabel',
            attributeName: 'product-type-enum-attribute-name',
            newValue: 'enum-about-to-be-overidden',
          },
        ])
      )
    })
  })
})
