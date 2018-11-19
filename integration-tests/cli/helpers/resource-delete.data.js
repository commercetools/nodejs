export const cart = [
  {
    currency: 'EUR',
    shippingAddress: {
      country: 'DE',
    },
  },
]

export const categories = [
  {
    key: 'fooKey',
    name: {
      en: 'categoryA',
    },
    slug: {
      en: 'category-a',
    },
    description: {
      en: 'descA',
    },
    externalId: 'a',
    assets: [],
  },
  {
    key: 'barKey',
    name: {
      en: 'categoryB',
    },
    slug: {
      en: 'category-b',
    },
    description: {
      en: 'descB',
    },
    externalId: 'b',
    assets: [],
  },
  {
    key: 'fooBarKey',
    name: {
      en: 'categoryC',
    },
    slug: {
      en: 'category-c',
    },
    description: {
      en: 'descC',
    },
    externalId: 'c',
    assets: [],
  },
]

export const customer = [
  {
    email: 'foo@bar.de',
    password: 'foobar',
    key: 'myKey',
  },
]

export const customFields = [
  {
    key: 'inventory-custom-type',
    name: {
      en: 'customized fields',
    },
    description: {
      en: 'custom description',
    },
    resourceTypeIds: ['inventory-entry'],
    fieldDefinitions: [
      {
        name: 'description',
        type: {
          name: 'String',
        },
        required: false,
        label: {
          en: 'owner',
        },
        inputHint: 'SingleLine',
      },
    ],
  },
]

export const order = [
  {
    version: 3,
  },
]

export const sampleCustomerGroup = {
  key: 'customer-group-key',
  groupName: 'customerGroupName',
}

export const sampleProductType = {
  name: 'productTypeForPriceExport',
  description: 'blah blah blah',
  key: 'productTypeKey',
}

export const anotherSampleProductType = {
  name: 'anotherProductTypeForProductParse',
  description: 'another blah blah blah',
  key: 'anotherProductTypeKey',
  attributes: [
    {
      type: {
        name: 'text',
      },
      name: 'another-text-attribute',
      label: {
        en: 'another-text-attribute',
      },
      isRequired: false,
    },
  ],
}

export const sampleChannel = {
  key: 'my-channel-key',
}

export const shoppingList = [
  {
    name: {
      de: 'deutscherListenName',
      en: 'englishListName',
    },
  },
]

export const review = [
  {
    text: 'Review text',
  },
]

export const payment = [
  {
    amountPlanned: {
      currencyCode: 'EUR',
      centAmount: 100,
    },
  },
]

export const inventories = [
  {
    sku: '12345',
    quantityOnStock: 20,
    custom: {
      type: {
        key: 'inventory-custom-type',
      },
      fields: {
        description: 'integration tests!! arrgggh',
      },
    },
  },
]
