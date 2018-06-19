import productTypesSyncFn from '../src/product-types'

const createTestProductType = custom => ({
  id: 'product-type-id',
  attributes: [],
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
            {
              type: {
                name: 'enum',
                values: [],
              },
            },
          ],
        })
        now = createTestProductType({
          attributes: [
            {
              type: {
                name: 'enum',
                values: [
                  {
                    key: 'enum_1',
                    label: 'enum-1',
                  },
                ],
              },
            },
          ],
        })
        // we get a change operation only here.
        updateActions = productTypesSync.buildActions(now, before)
      })
      test('should return `addPlainEnumValue` updateAction', () => {
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
            {
              type: {
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
              },
            },
          ],
        })
        now = createTestProductType({
          attributes: [
            {
              type: {
                name: 'enum',
                values: [],
              },
            },
          ],
        })
        updateActions = productTypesSync.buildActions(now, before)
      })
      test('should return `removeEnumValues` updateAction', () => {
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
            {
              type: {
                name: 'enum',
                values: [
                  { key: 'enum_0', label: 'enum-0' },
                  { key: 'enum_2', label: 'enum-2' },
                  { key: 'enum_4', label: 'enum-4' },
                ],
              },
            },
          ],
        })
        now = createTestProductType({
          attributes: [
            {
              type: {
                name: 'enum',
                values: [
                  { key: 'enum_1', label: 'enum-1' },
                  { key: 'enum_3', label: 'enum-3' },
                  { key: 'enum_5', label: 'enum-5' },
                ],
              },
            },
          ],
        })
        updateActions = productTypesSync.buildActions(now, before)
      })
      test('should return `removeEnumValues` and `addPlainEnumValue` updateAction', () => {
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
            {
              type: {
                name: 'enum',
                values: [
                  { key: 'enum_0', label: 'enum-0' },
                  { key: 'enum_2', label: 'enum-2' },
                  { key: 'enum_4', label: 'enum-4' },
                ],
              },
            },
          ],
        })
        now = createTestProductType({
          attributes: [
            {
              type: {
                name: 'enum',
                values: [
                  { key: 'enum_0', label: 'enum-0' },
                  { key: 'enum_3', label: 'enum-3' },
                ],
              },
            },
          ],
        })

        updateActions = productTypesSync.buildActions(now, before)
      })
      test('should return `removeEnumValues` and `addPlainEnumValue` updateAction', () => {
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
            {
              type: {
                name: 'enum',
                values: [
                  { key: 'enum_1', label: 'enum-1' },
                  { key: 'enum_2', label: 'enum-2' },
                  { key: 'enum_4', label: 'enum-4' },
                ],
              },
            },
          ],
        })
        now = createTestProductType({
          attributes: [
            {
              type: {
                name: 'enum',
                values: [
                  { key: 'enum_4', label: 'enum-4' },
                  { key: 'enum_1', label: 'enum-1' },
                  { key: 'enum_2', label: 'enum-2' },
                ],
              },
            },
          ],
        })
        updateActions = productTypesSync.buildActions(now, before)
      })
      test('should return `changePlainEnumValueOrder` updateAction', () => {
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
            {
              type: {
                name: 'enum',
                values: [{ key: 'enum_1', label: 'enum-1' }],
              },
            },
          ],
        })
        now = createTestProductType({
          attributes: [
            {
              type: {
                name: 'enum',
                values: [{ key: 'enum_1', label: 'enum-4' }],
              },
            },
          ],
        })
        updateActions = productTypesSync.buildActions(now, before)
      })
      test('should return `changePlainEnumValueLabel` updateAction', () => {
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
  describe('localized enum values', () => {
    describe('with new enum', () => {
      beforeEach(() => {
        before = createTestProductType({
          attributes: [
            {
              type: {
                name: 'lenum',
                values: [],
              },
            },
          ],
        })
        now = createTestProductType({
          attributes: [
            {
              type: {
                name: 'lenum',
                values: [
                  {
                    key: 'lenum_1',
                    label: {
                      en: 'lenum-en',
                      de: 'lenum-de',
                    },
                  },
                ],
              },
            },
          ],
        })
        // we get a change operation only here.
        updateActions = productTypesSync.buildActions(now, before)
      })
      test('should return `addLocalizedEnumValue` updateAction', () => {
        expect(updateActions).toEqual([
          {
            action: 'addLocalizedEnumValue',
            attributeName: 'lenum',
            value: {
              key: 'lenum_1',
              label: {
                en: 'lenum-en',
                de: 'lenum-de',
              },
            },
          },
        ])
      })
    })
    describe('with removed lenum', () => {
      beforeEach(() => {
        before = createTestProductType({
          attributes: [
            {
              type: {
                name: 'lenum',
                values: [
                  {
                    key: 'lenum_1',
                    label: {
                      en: 'lenum-1',
                    },
                  },
                  {
                    key: 'lenum_2',
                    label: {
                      en: 'lenum-2',
                    },
                  },
                  {
                    key: 'lenum_4',
                    label: {
                      en: 'lenum-4',
                    },
                  },
                ],
              },
            },
          ],
        })
        now = createTestProductType({
          attributes: [
            {
              type: {
                name: 'lenum',
                values: [],
              },
            },
          ],
        })
        updateActions = productTypesSync.buildActions(now, before)
      })
      test('should return `removeEnumValues` updateAction', () => {
        expect(updateActions).toEqual([
          {
            action: 'removeEnumValues',
            attributeName: 'lenum',
            keys: ['lenum_1', 'lenum_2', 'lenum_4'],
          },
        ])
      })
    })
    describe('with lenum replaced', () => {
      beforeEach(() => {
        before = createTestProductType({
          attributes: [
            {
              type: {
                name: 'lenum',
                values: [
                  { key: 'enum_0', label: { en: 'enum-0' } },
                  { key: 'enum_2', label: { en: 'enum-2' } },
                  { key: 'enum_4', label: { en: 'enum-4' } },
                ],
              },
            },
          ],
        })
        now = createTestProductType({
          attributes: [
            {
              type: {
                name: 'lenum',
                values: [
                  { key: 'enum_1', label: { en: 'enum-1' } },
                  { key: 'enum_3', label: { en: 'enum-3' } },
                  { key: 'enum_5', label: { en: 'enum-5' } },
                ],
              },
            },
          ],
        })
        updateActions = productTypesSync.buildActions(now, before)
      })
      test('should return `removeEnumValues` and `addLocalizedEnumValue` updateAction', () => {
        expect(updateActions).toEqual([
          {
            action: 'addLocalizedEnumValue',
            attributeName: 'lenum',
            value: { key: 'enum_1', label: { en: 'enum-1' } },
          },
          {
            action: 'addLocalizedEnumValue',
            attributeName: 'lenum',
            value: { key: 'enum_3', label: { en: 'enum-3' } },
          },
          {
            action: 'addLocalizedEnumValue',
            attributeName: 'lenum',
            value: { key: 'enum_5', label: { en: 'enum-5' } },
          },
          {
            action: 'removeEnumValues',
            attributeName: 'lenum',
            keys: ['enum_0', 'enum_2', 'enum_4'],
          },
        ])
      })
    })
    describe('with some replaced and some removed', () => {
      beforeEach(() => {
        before = createTestProductType({
          attributes: [
            {
              type: {
                name: 'lenum',
                values: [
                  { key: 'enum_0', label: { en: 'enum-0' } },
                  { key: 'enum_2', label: { en: 'enum-2' } },
                  { key: 'enum_4', label: { en: 'enum-4' } },
                ],
              },
            },
          ],
        })
        now = createTestProductType({
          attributes: [
            {
              type: {
                name: 'lenum',
                values: [
                  { key: 'enum_0', label: { en: 'enum-0' } },
                  { key: 'enum_3', label: { en: 'enum-3' } },
                ],
              },
            },
          ],
        })

        updateActions = productTypesSync.buildActions(now, before)
      })
      test('should return `removeEnumValues` and `addLocalizedEnumValue` updateAction', () => {
        expect(updateActions).toEqual([
          {
            attributeName: 'lenum',
            action: 'addLocalizedEnumValue',
            value: {
              key: 'enum_3',
              label: { en: 'enum-3' },
            },
          },
          {
            attributeName: 'lenum',
            action: 'removeEnumValues',
            keys: ['enum_2', 'enum_4'],
          },
        ])
      })
    })
    describe('with lenum reordered', () => {
      beforeEach(() => {
        before = createTestProductType({
          attributes: [
            {
              type: {
                name: 'lenum',
                values: [
                  { key: 'enum_1', label: { en: 'enum-1' } },
                  { key: 'enum_2', label: { en: 'enum-2' } },
                  { key: 'enum_4', label: { en: 'enum-4' } },
                ],
              },
            },
          ],
        })
        now = createTestProductType({
          attributes: [
            {
              type: {
                name: 'lenum',
                values: [
                  { key: 'enum_4', label: { en: 'enum-4' } },
                  { key: 'enum_1', label: { en: 'enum-1' } },
                  { key: 'enum_2', label: { en: 'enum-2' } },
                ],
              },
            },
          ],
        })
        updateActions = productTypesSync.buildActions(now, before)
      })
      test('should return `changeLocalizedEnumValueOrder` updateAction', () => {
        expect(updateActions).toEqual([
          {
            action: 'changeLocalizedEnumValueOrder',
            attributeName: 'lenum',
            values: [
              { key: 'enum_4', label: { en: 'enum-4' } },
              { key: 'enum_1', label: { en: 'enum-1' } },
              { key: 'enum_2', label: { en: 'enum-2' } },
            ],
          },
        ])
      })
    })
    describe('with label changed', () => {
      beforeEach(() => {
        before = createTestProductType({
          attributes: [
            {
              type: {
                name: 'lenum',
                values: [{ key: 'enum_1', label: { en: 'enum-1' } }],
              },
            },
          ],
        })
        now = createTestProductType({
          attributes: [
            {
              type: {
                name: 'lenum',
                values: [{ key: 'enum_1', label: { en: 'enum-4' } }],
              },
            },
          ],
        })
        updateActions = productTypesSync.buildActions(now, before)
      })
      test('should return `changeLocalizedEnumValueLabel` updateAction', () => {
        expect(updateActions).toEqual([
          {
            action: 'changeLocalizedEnumValueLabel',
            attributeName: 'lenum',
            newValue: { key: 'enum_1', label: { en: 'enum-4' } },
          },
        ])
      })
    })
  })
})
