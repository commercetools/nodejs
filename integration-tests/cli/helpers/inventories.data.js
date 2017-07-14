export const inventories = [{
  sku: '12345',
  quantityOnStock: 20,
  custom: {
    type: {
      key: 'custom-type',
    },
    fields: {
      description: 'integration tests!! arrgggh',
    },
  },
}]

export const customFields = [{
  key: 'custom-type',
  name: {
    en: 'customized fields',
  },
  description: {
    en: 'custom description',
  },
  resourceTypeIds: ['inventory-entry'],
  fieldDefinitions: [{
    name: 'description',
    type: {
      name: 'String',
    },
    required: false,
    label: {
      en: 'owner',
    },
    inputHint: 'SingleLine',
  }],
}]
