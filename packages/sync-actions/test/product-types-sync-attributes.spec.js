import productTypesSyncFn from '../src/product-types'

const createTestProductType = custom => ({
  id: 'product-type-id',
  attributes: [],
  ...custom,
})

describe('Actions', () => {
  let productTypesSync
  let updateActions
  let before
  let now
  beforeEach(() => {
    productTypesSync = productTypesSyncFn()
  })
  describe('with new attributes', () => {
    beforeEach(() => {
      before = createTestProductType({
        attributes: [],
      })
      now = createTestProductType({
        attributes: [
          {
            type: { name: 'text' },
            name: 'name-field-definition',
            label: {
              en: 'EN field definition',
            },
          },
          {
            type: { name: 'number' },
            name: 'number-field-definition',
            label: {
              en: 'EN field definition',
            },
          },
        ],
      })
      updateActions = productTypesSync.buildActions(now, before)
    })
    it('should return `addAttributeDefinition` actions', () => {
      expect(updateActions).toEqual(
        now.attributes.map(attribute => ({
          action: 'addAttributeDefinition',
          attribute,
        }))
      )
    })
  })
  describe('with attributes removed', () => {
    beforeEach(() => {
      before = createTestProductType({
        attributes: [
          {
            type: { name: 'text' },
            name: 'name-field-definition',
            label: {
              en: 'EN field definition',
            },
          },
          {
            type: { name: 'number' },
            name: 'number-field-definition',
            label: {
              en: 'EN field definition',
            },
          },
        ],
      })
      now = createTestProductType({
        attributes: [],
      })
      updateActions = productTypesSync.buildActions(now, before)
    })
    it('should return `removeAttributeDefinition` actions', () => {
      expect(updateActions).toEqual(
        before.attributes.map(fieldDefinition => ({
          action: 'removeAttributeDefinition',
          name: fieldDefinition.name,
        }))
      )
    })
  })
  describe('with changing order of attributes', () => {
    beforeEach(() => {
      before = createTestProductType({
        attributes: [
          {
            name: '1',
          },
          {
            name: '2',
          },
        ],
      })
      now = createTestProductType({
        attributes: [
          {
            name: '2',
          },
          {
            name: '1',
          },
        ],
      })
      updateActions = productTypesSync.buildActions(now, before)
    })
    it('should return `changeAttributeOrder` action', () => {
      expect(updateActions).toEqual([
        {
          action: 'changeAttributeOrder',
          attributes: [{ name: '2' }, { name: '1' }],
        },
      ])
    })
  })
  describe('with attributes replaced', () => {
    beforeEach(() => {
      before = createTestProductType({
        attributes: [
          {
            type: { name: 'number' },
            name: 'number-field-definition',
            label: {
              en: 'number-en',
            },
          },
        ],
      })
      now = createTestProductType({
        attributes: [
          {
            type: { name: 'text' },
            name: 'text-field-definition',
            label: {
              en: 'text-en',
            },
          },
        ],
      })
      updateActions = productTypesSync.buildActions(now, before)
    })
    it('should return `removeAttributeDefinition` and `addAttributeDefinition` actions', () => {
      expect(updateActions).toEqual([
        {
          action: 'addAttributeDefinition',
          attribute: {
            type: { name: 'text' },
            name: 'text-field-definition',
            label: {
              en: 'text-en',
            },
          },
        },
        {
          action: 'removeAttributeDefinition',
          name: 'number-field-definition',
        },
      ])
    })
  })
  describe('when changing field definition label', () => {
    describe('when changing single locale value', () => {
      beforeEach(() => {
        before = createTestProductType({
          attributes: [
            {
              type: { name: 'text' },
              name: 'name-text-field-definition',
              label: {
                en: 'text-en-previous',
              },
            },
          ],
        })
        now = createTestProductType({
          attributes: [
            {
              type: { name: 'text' },
              name: 'name-text-field-definition',
              label: {
                en: 'text-en-next',
              },
            },
          ],
        })
        updateActions = productTypesSync.buildActions(now, before)
      })
      it('should return `changeLabel` action', () => {
        expect(updateActions).toEqual([
          {
            action: 'changeLabel',
            attributeName: 'name-text-field-definition',
            label: {
              en: 'text-en-next',
            },
          },
        ])
      })
    })
    describe('when changing multiple locale value', () => {
      beforeEach(() => {
        before = createTestProductType({
          attributes: [
            {
              type: { name: 'text' },
              name: 'name-text-field-definition',
              label: {
                en: 'text-en-previous',
                de: 'text-de-previous',
              },
            },
          ],
        })
        now = createTestProductType({
          attributes: [
            {
              type: { name: 'text' },
              name: 'name-text-field-definition',
              label: {
                en: 'text-en-next',
                de: 'text-de-next',
              },
            },
          ],
        })
        updateActions = productTypesSync.buildActions(now, before)
      })
      it('should return `changeLabel` action', () => {
        expect(updateActions).toEqual([
          {
            action: 'changeLabel',
            attributeName: 'name-text-field-definition',
            label: {
              en: 'text-en-next',
              de: 'text-de-next',
            },
          },
        ])
      })
    })
    describe('when removing label', () => {
      beforeEach(() => {
        before = createTestProductType({
          attributes: [
            {
              type: { name: 'text' },
              name: 'name-text-field-definition',
              label: {
                en: 'text-en-previous',
                de: 'text-de-previous',
              },
            },
          ],
        })
        now = createTestProductType({
          attributes: [
            {
              type: { name: 'text' },
              name: 'name-text-field-definition',
              label: undefined,
            },
          ],
        })
        updateActions = productTypesSync.buildActions(now, before)
      })
      it('should return `changeLabel` action', () => {
        expect(updateActions).toEqual([
          {
            action: 'changeLabel',
            attributeName: 'name-text-field-definition',
            label: undefined,
          },
        ])
      })
    })
  })
  describe('when changing inputTip', () => {
    describe('when changing single locale value', () => {
      beforeEach(() => {
        before = {
          attributes: [
            {
              type: { name: 'text' },
              name: 'name-text-field-definition',
              inputTip: {
                en: 'text-en-previous',
              },
            },
          ],
        }
        now = {
          attributes: [
            {
              type: { name: 'text' },
              name: 'name-text-field-definition',
              inputTip: {
                en: 'text-en-next',
              },
            },
          ],
        }
        updateActions = productTypesSync.buildActions(now, before)
      })
      it('should return `setInputTip` action', () => {
        expect(updateActions).toEqual([
          {
            action: 'setInputTip',
            attributeName: 'name-text-field-definition',
            inputTip: {
              en: 'text-en-next',
            },
          },
        ])
      })
    })
    describe('when changing multiple locale value', () => {
      beforeEach(() => {
        before = createTestProductType({
          attributes: [
            {
              name: 'name-text-field-definition',
              inputTip: {
                en: 'text-en-previous',
                de: 'text-de-previous',
              },
            },
          ],
        })
        now = createTestProductType({
          attributes: [
            {
              name: 'name-text-field-definition',
              inputTip: {
                en: 'text-en-next',
                de: 'text-de-next',
              },
            },
          ],
        })
        updateActions = productTypesSync.buildActions(now, before)
      })
      it('should return `setInputTip` action', () => {
        expect(updateActions).toEqual([
          {
            action: 'setInputTip',
            attributeName: 'name-text-field-definition',
            inputTip: {
              en: 'text-en-next',
              de: 'text-de-next',
            },
          },
        ])
      })
    })
  })
  describe('when changing inputHint', () => {
    beforeEach(() => {
      before = {
        attributes: [
          {
            name: 'name-text-field-definition',
            inputHint: 'SingleLine',
          },
        ],
      }
      now = {
        attributes: [
          {
            name: 'name-text-field-definition',
            inputHint: 'MultiLine',
          },
        ],
      }
      updateActions = productTypesSync.buildActions(now, before)
    })
    it('should return `changeInputHint` action', () => {
      expect(updateActions).toEqual([
        {
          action: 'changeInputHint',
          attributeName: 'name-text-field-definition',
          inputHint: 'MultiLine',
        },
      ])
    })
  })
  describe('when changing `attributeConstraint`', () => {
    beforeEach(() => {
      before = {
        attributes: [
          {
            name: 'name-text-field-definition',
            attributeConstraint: 'CombinationUnique',
          },
        ],
      }
      now = {
        attributes: [
          {
            name: 'name-text-field-definition',
            attributeConstraint: 'None',
          },
        ],
      }
      updateActions = productTypesSync.buildActions(now, before)
    })
    it('should return `changeAttributeConstraint` action', () => {
      expect(updateActions).toEqual([
        {
          action: 'changeAttributeConstraint',
          attributeName: 'name-text-field-definition',
          newValue: 'None',
        },
      ])
    })
  })
  describe('when changing isSearchable', () => {
    beforeEach(() => {
      before = {
        attributes: [
          {
            name: 'name-text-field-definition',
            isSearchable: true,
          },
        ],
      }
      now = {
        attributes: [
          {
            name: 'name-text-field-definition',
            isSearchable: false,
          },
        ],
      }
      updateActions = productTypesSync.buildActions(now, before)
    })
    it('should return `changeIsSearchable` action', () => {
      expect(updateActions).toEqual([
        {
          action: 'changeIsSearchable',
          attributeName: 'name-text-field-definition',
          isSearchable: false,
        },
      ])
    })
  })
})
