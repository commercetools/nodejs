import productTypesSyncFn from '../src/product-types'

const createTestProductType = custom => ({
  id: 'product-type-id',
  attributes: [],
  ...custom,
})

const createAttributeDefinition = custom => ({
  type: {
    name: custom.name,
  },
  ...custom,
})

describe('Actions', () => {
  let before
  let now
  let productTypesSync
  let updateActions
  beforeEach(() => {
    productTypesSync = productTypesSyncFn()
  })
  describe('plain enum values', () => {
    describe('with new enum', () => {
      beforeEach(() => {
        before = createTestProductType({
          attributes: [
            createAttributeDefinition({
              name: 'enum',
              values: [],
            }),
          ],
        })
        now = createTestProductType({
          attributes: [
            createAttributeDefinition({
              name: 'enum',
              values: [
                {
                  key: 'enum_1',
                  label: 'enum-1',
                },
              ],
            }),
          ],
        })
        // we get a change operation only here.
        updateActions = productTypesSync.buildActions(now, before)
      })
      it('should return `addPlainEnumValue` updateAction', () => {
        expect(updateActions).toEqual([
          {
            action: 'addPlainEnumValue',
            attributeName: 'enum',
            value: {
              key: 'enum_1',
              label: 'enum-1',
            },
          },
        ])
      })
    })
    describe('with removed enum', () => {
      beforeEach(() => {
        before = createTestProductType({
          attributes: [
            createAttributeDefinition({
              name: 'enum',
              values: [
                {
                  key: 'enum_1',
                  label: 'enum-1',
                },
                {
                  key: 'enum_2',
                  label: 'enum-2',
                },
                {
                  key: 'enum_4',
                  label: 'enum-4',
                },
              ],
            }),
          ],
        })
        now = createTestProductType({
          attributes: [
            createAttributeDefinition({
              name: 'enum',
              values: [],
            }),
          ],
        })
        updateActions = productTypesSync.buildActions(now, before)
      })
      it('should return `removeEnumValues` updateAction', () => {
        expect(updateActions).toEqual([
          {
            action: 'removeEnumValues',
            attributeName: 'enum',
            keys: ['enum_1', 'enum_2', 'enum_4'],
          },
        ])
      })
    })
    describe('with enum replaced', () => {
      beforeEach(() => {
        before = createTestProductType({
          attributes: [
            createAttributeDefinition({
              name: 'enum',
              values: [
                { key: 'enum_0', label: 'enum-0' },
                { key: 'enum_2', label: 'enum-2' },
                { key: 'enum_4', label: 'enum-4' },
              ],
            }),
          ],
        })
        now = createTestProductType({
          attributes: [
            createAttributeDefinition({
              name: 'enum',
              values: [
                { key: 'enum_1', label: 'enum-1' },
                { key: 'enum_3', label: 'enum-3' },
                { key: 'enum_5', label: 'enum-5' },
              ],
            }),
          ],
        })
        updateActions = productTypesSync.buildActions(now, before)
      })
      it('should return `removeEnumValues` and `addPlainEnumValue` updateAction', () => {
        expect(updateActions).toEqual([
          {
            action: 'addPlainEnumValue',
            attributeName: 'enum',
            value: { key: 'enum_1', label: 'enum-1' },
          },
          {
            action: 'addPlainEnumValue',
            attributeName: 'enum',
            value: { key: 'enum_3', label: 'enum-3' },
          },
          {
            action: 'addPlainEnumValue',
            attributeName: 'enum',
            value: { key: 'enum_5', label: 'enum-5' },
          },
          {
            action: 'removeEnumValues',
            attributeName: 'enum',
            keys: ['enum_0', 'enum_2', 'enum_4'],
          },
        ])
      })
    })
    describe('with some replaced and some removed', () => {
      beforeEach(() => {
        before = createTestProductType({
          attributes: [
            createAttributeDefinition({
              name: 'enum',
              values: [
                { key: 'enum_0', label: 'enum-0' },
                { key: 'enum_2', label: 'enum-2' },
                { key: 'enum_4', label: 'enum-4' },
              ],
            }),
          ],
        })
        now = createTestProductType({
          attributes: [
            createAttributeDefinition({
              name: 'enum',
              values: [
                { key: 'enum_0', label: 'enum-0' },
                { key: 'enum_3', label: 'enum-3' },
              ],
            }),
          ],
        })

        updateActions = productTypesSync.buildActions(now, before)
      })
      it('should return `removeEnumValues` and `addPlainEnumValue` updateAction', () => {
        expect(updateActions).toEqual([
          {
            attributeName: 'enum',
            action: 'addPlainEnumValue',
            value: {
              key: 'enum_3',
              label: 'enum-3',
            },
          },
          {
            attributeName: 'enum',
            action: 'removeEnumValues',
            keys: ['enum_2', 'enum_4'],
          },
        ])
      })
    })
    describe('with enum reordered', () => {
      beforeEach(() => {
        before = createTestProductType({
          attributes: [
            createAttributeDefinition({
              name: 'enum',
              values: [
                { key: 'enum_1', label: 'enum-1' },
                { key: 'enum_2', label: 'enum-2' },
                { key: 'enum_4', label: 'enum-4' },
              ],
            }),
          ],
        })
        now = createTestProductType({
          attributes: [
            createAttributeDefinition({
              name: 'enum',
              values: [
                { key: 'enum_4', label: 'enum-4' },
                { key: 'enum_1', label: 'enum-1' },
                { key: 'enum_2', label: 'enum-2' },
              ],
            }),
          ],
        })
        updateActions = productTypesSync.buildActions(now, before)
      })
      it('should return `changePlainEnumValueOrder` updateAction', () => {
        expect(updateActions).toEqual([
          {
            action: 'changePlainEnumValueOrder',
            attributeName: 'enum',
            values: [
              { key: 'enum_4', label: 'enum-4' },
              { key: 'enum_1', label: 'enum-1' },
              { key: 'enum_2', label: 'enum-2' },
            ],
          },
        ])
      })
    })
    describe('with label changed', () => {
      beforeEach(() => {
        before = createTestProductType({
          attributes: [
            createAttributeDefinition({
              name: 'enum',
              values: [{ key: 'enum_1', label: 'enum-1' }],
            }),
          ],
        })
        now = createTestProductType({
          attributes: [
            createAttributeDefinition({
              name: 'enum',
              values: [{ key: 'enum_1', label: 'enum-4' }],
            }),
          ],
        })
        updateActions = productTypesSync.buildActions(now, before)
      })
      it('should return `changePlainEnumValueLabel` updateAction', () => {
        expect(updateActions).toEqual([
          {
            action: 'changePlainEnumValueLabel',
            attributeName: 'enum',
            newValue: { key: 'enum_1', label: 'enum-4' },
          },
        ])
      })
    })
  })
})
