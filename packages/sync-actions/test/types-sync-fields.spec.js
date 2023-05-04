import typesSyncFn from '../src/types'

const createTestType = (custom) => ({
  id: 'type-id',
  fieldDefinitions: [],
  ...custom,
})

describe('Actions', () => {
  let typesSync
  let updateActions
  let before
  let now
  beforeEach(() => {
    typesSync = typesSyncFn()
  })
  describe('with new fields', () => {
    beforeEach(() => {
      before = createTestType({
        fieldDefinitions: [],
      })
      now = createTestType({
        fieldDefinitions: [
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
      updateActions = typesSync.buildActions(now, before)
    })
    test('should return `addFieldDefinition` action', () => {
      expect(updateActions).toEqual(
        now.fieldDefinitions.map((fieldDefinition) => ({
          action: 'addFieldDefinition',
          fieldDefinition,
        }))
      )
    })
  })
  describe('change InputHint', () => {
    beforeEach(() => {
      before = createTestType({
        fieldDefinitions: [
          {
            type: { name: 'text' },
            name: 'name-field-definition',
            label: {
              en: 'EN field definition',
            },
            inputHint: 'SingleLine',
          },
        ],
      })
      now = createTestType({
        fieldDefinitions: [
          {
            type: { name: 'text' },
            name: 'name-field-definition',
            label: {
              en: 'EN field definition',
            },
            inputHint: 'MultipleLine',
          },
        ],
      })
      updateActions = typesSync.buildActions(now, before)
    })
    test('should return `changeInputHint` action', () => {
      expect(updateActions).toEqual(
        now.fieldDefinitions.map((fieldDefinition) => ({
          action: 'changeInputHint',
          fieldName: fieldDefinition.name,
          inputHint: 'MultipleLine',
        }))
      )
    })
  })
  describe('with fieldDefinitions removed', () => {
    beforeEach(() => {
      before = createTestType({
        fieldDefinitions: [
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
      now = createTestType({
        fieldDefinitions: [],
      })
      updateActions = typesSync.buildActions(now, before)
    })
    test('should return `removeFieldDefinition` actions', () => {
      expect(updateActions).toEqual(
        before.fieldDefinitions.map((fieldDefinition) => ({
          action: 'removeFieldDefinition',
          fieldName: fieldDefinition.name,
        }))
      )
    })
  })
  describe('with changing order of fieldDefinitions', () => {
    beforeEach(() => {
      before = createTestType({
        fieldDefinitions: [
          {
            name: 'first',
          },
          {
            name: 'second',
          },
        ],
      })
      now = createTestType({
        fieldDefinitions: [
          {
            name: 'second',
          },
          {
            name: 'first',
          },
        ],
      })
      updateActions = typesSync.buildActions(now, before)
    })
    test('should return `changeFieldDefinitionOrder` action', () => {
      expect(updateActions).toEqual([
        {
          action: 'changeFieldDefinitionOrder',
          fieldNames: ['second', 'first'],
        },
      ])
    })
  })
  describe('with fieldDefinitions replaced', () => {
    beforeEach(() => {
      before = createTestType({
        fieldDefinitions: [
          {
            type: { name: 'number' },
            name: 'number-field-definition',
            label: {
              en: 'number-en',
            },
          },
        ],
      })
      now = createTestType({
        fieldDefinitions: [
          {
            type: { name: 'text' },
            name: 'text-field-definition',
            label: {
              en: 'text-en',
            },
          },
        ],
      })
      updateActions = typesSync.buildActions(now, before)
    })
    test('should return `removeFieldDefinition` and `addFieldDefinition` actions', () => {
      expect(updateActions).toEqual([
        {
          action: 'removeFieldDefinition',
          fieldName: 'number-field-definition',
        },
        {
          action: 'addFieldDefinition',
          fieldDefinition: {
            type: { name: 'text' },
            name: 'text-field-definition',
            label: {
              en: 'text-en',
            },
          },
        },
      ])
    })
  })
  describe('when changing field definition label', () => {
    describe('when changing single locale value', () => {
      beforeEach(() => {
        before = createTestType({
          fieldDefinitions: [
            {
              type: { name: 'text' },
              name: 'name-text-field-definition',
              label: {
                en: 'text-en-previous',
              },
            },
          ],
        })
        now = createTestType({
          fieldDefinitions: [
            {
              type: { name: 'text' },
              name: 'name-text-field-definition',
              label: {
                en: 'text-en-next',
              },
            },
          ],
        })
        updateActions = typesSync.buildActions(now, before)
      })
      test('should return `changeLabel` action', () => {
        expect(updateActions).toEqual([
          {
            action: 'changeLabel',
            fieldName: 'name-text-field-definition',
            label: {
              en: 'text-en-next',
            },
          },
        ])
      })
    })
    describe('when changing multiple locale value', () => {
      beforeEach(() => {
        before = createTestType({
          fieldDefinitions: [
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
        now = createTestType({
          fieldDefinitions: [
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
        updateActions = typesSync.buildActions(now, before)
      })
      test('should return `changeLabel` action', () => {
        expect(updateActions).toEqual([
          {
            action: 'changeLabel',
            fieldName: 'name-text-field-definition',
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
        before = createTestType({
          fieldDefinitions: [
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
        now = createTestType({
          fieldDefinitions: [
            {
              type: { name: 'text' },
              name: 'name-text-field-definition',
              label: undefined,
            },
          ],
        })
        updateActions = typesSync.buildActions(now, before)
      })
      test('should return `changeLabel` action', () => {
        expect(updateActions).toEqual([
          {
            action: 'changeLabel',
            fieldName: 'name-text-field-definition',
            label: undefined,
          },
        ])
      })
    })
  })
  describe('with removal and changing label of fieldDefinitions', () => {
    beforeEach(() => {
      before = createTestType({
        fieldDefinitions: [
          {
            type: { name: 'text' },
            name: 'should-not-change',
            label: {
              en: 'should-not-change',
            },
          },
          {
            type: { name: 'text' },
            name: 'should-be-removed',
            label: {
              en: 'should-be-removed',
            },
          },
          {
            type: { name: 'text' },
            name: 'should-change',
            label: {
              en: 'from-this',
            },
          },
        ],
      })
      now = createTestType({
        fieldDefinitions: [
          {
            type: { name: 'text' },
            name: 'should-not-change',
            label: {
              en: 'should-not-change',
            },
          },
          {
            type: { name: 'text' },
            name: 'should-change',
            label: {
              en: 'to-this',
            },
          },
        ],
      })
      updateActions = typesSync.buildActions(now, before)
    })
    test('should return `changeLabel` and `removeFieldDefinition` action', () => {
      expect(updateActions).toEqual([
        { action: 'removeFieldDefinition', fieldName: 'should-be-removed' },
        {
          action: 'changeLabel',
          fieldName: 'should-change',
          label: {
            en: 'to-this',
          },
        },
      ])
    })
  })

  /**
   * there is no update action for fieldDefinition -> required,
   * so this field is immutable and unchangeable.
   * in case of changing it, this were throwing `Cannot read properties of undefined` cause its nested field.
   * below test is making sure this field is ignored and without any internal package errors.
   */
  describe('should ignore changes in required field in fieldDefinition', () => {
    beforeEach(() => {
      before = createTestType({
        fieldDefinitions: [
          {
            name: 'first',
            required: true,
          },
        ],
      })
      now = createTestType({
        fieldDefinitions: [
          {
            name: 'first',
            required: false,
          },
        ],
      })
      updateActions = typesSync.buildActions(now, before)
    })
    test('should return no action', () => {
      expect(updateActions).toEqual([])
    })
  })
})
