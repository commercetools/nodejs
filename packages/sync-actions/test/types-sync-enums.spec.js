import typesSyncFn from '../src/types'

const createTestType = custom => ({
  id: 'type-id',
  fieldDefinitions: [],
  ...custom,
})

describe('Actions', () => {
  let before
  let now
  let typesSync
  let updateActions
  beforeEach(() => {
    typesSync = typesSyncFn()
  })
  describe('enum values', () => {
    describe('with new enum', () => {
      beforeEach(() => {
        before = createTestType({
          fieldDefinitions: [
            {
              type: {
                name: 'enum',
                values: [],
              },
            },
          ],
        })
        now = createTestType({
          fieldDefinitions: [
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
        updateActions = typesSync.buildActions(now, before)
      })
      test('should return `addEnumValue` updateAction', () => {
        expect(updateActions).toEqual([
          {
            action: 'addEnumValue',
            fieldName: 'enum',
            value: {
              key: 'enum_1',
              label: 'enum-1',
            },
          },
        ])
      })
    })
    describe('with multiple enums added to non-empty stack', () => {
      beforeEach(() => {
        before = createTestType({
          fieldDefinitions: [
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
        now = createTestType({
          fieldDefinitions: [
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
        updateActions = typesSync.buildActions(now, before)
      })
      test('should return multiple `addEnumValue` updateActions', () => {
        expect(updateActions).toEqual([
          {
            action: 'addEnumValue',
            fieldName: 'enum',
            value: { key: 'enum_1', label: 'enum-1' },
          },
          {
            action: 'addEnumValue',
            fieldName: 'enum',
            value: { key: 'enum_3', label: 'enum-3' },
          },
          {
            action: 'addEnumValue',
            fieldName: 'enum',
            value: { key: 'enum_5', label: 'enum-5' },
          },
        ])
      })
    })
    describe('with enum reordered', () => {
      beforeEach(() => {
        before = createTestType({
          fieldDefinitions: [
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
        now = createTestType({
          fieldDefinitions: [
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
        updateActions = typesSync.buildActions(now, before)
      })
      test('should return `changeEnumValueOrder` updateAction', () => {
        expect(updateActions).toEqual([
          {
            action: 'changeEnumValueOrder',
            fieldName: 'enum',
            keys: [
              { key: 'enum_4', label: 'enum-4' },
              { key: 'enum_1', label: 'enum-1' },
              { key: 'enum_2', label: 'enum-2' },
            ],
          },
        ])
      })
    })
  })
  describe('localized enum values', () => {
    describe('with new enum', () => {
      beforeEach(() => {
        before = createTestType({
          fieldDefinitions: [
            {
              type: {
                name: 'lenum',
                values: [],
              },
            },
          ],
        })
        now = createTestType({
          fieldDefinitions: [
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
        updateActions = typesSync.buildActions(now, before)
      })
      test('should return `addLocalizedEnumValue` updateAction', () => {
        expect(updateActions).toEqual([
          {
            action: 'addLocalizedEnumValue',
            fieldName: 'lenum',
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
    describe('with added to non-empty stack', () => {
      beforeEach(() => {
        before = createTestType({
          fieldDefinitions: [
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
        now = createTestType({
          fieldDefinitions: [
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

        updateActions = typesSync.buildActions(now, before)
      })
      test('should return `addLocalizedEnumValue` updateAction', () => {
        expect(updateActions).toEqual([
          {
            fieldName: 'lenum',
            action: 'addLocalizedEnumValue',
            value: {
              key: 'enum_3',
              label: { en: 'enum-3' },
            },
          },
        ])
      })
    })
    describe('with lenum reordered', () => {
      beforeEach(() => {
        before = createTestType({
          fieldDefinitions: [
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
        now = createTestType({
          fieldDefinitions: [
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
        updateActions = typesSync.buildActions(now, before)
      })
      test('should return `changeLocalizedEnumValueOrder` updateAction', () => {
        expect(updateActions).toEqual([
          {
            action: 'changeLocalizedEnumValueOrder',
            fieldName: 'lenum',
            keys: [
              { key: 'enum_4', label: { en: 'enum-4' } },
              { key: 'enum_1', label: { en: 'enum-1' } },
              { key: 'enum_2', label: { en: 'enum-2' } },
            ],
          },
        ])
      })
    })
  })
})
