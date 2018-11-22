export const carts = [
  {
    type: 'Cart',
    id: '420949ab-31bc-4379-943b-e1d176332091',
    version: 1,
    customerId: '5d64b3d4-1c74-4422-931a-47157150f262',
    cartState: 'Active',
    totalPrice: {
      type: 'centPrecision',
      currencyCode: 'EUR',
      centAmount: 0,
      fractionDigits: 2,
    },
  },
  {
    type: 'Cart',
    id: '6b87adb1-fb4c-49dd-b5d5-4f878c85aa34',
    version: 1,
    customerId: '1980817f-d803-4d3a-92bc-a40871b13501',
    cartState: 'Active',
    totalPrice: {
      type: 'centPrecision',
      currencyCode: 'EUR',
      centAmount: 0,
      fractionDigits: 2,
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

export const channels = [
  {
    key: 'myChannel',
    name: {
      en: 'myChannel',
      de: 'myChannel',
    },
  },
  {
    key: 'fooChannel',
    name: {
      de: 'fooChannel',
      en: 'fooChannel',
    },
  },
  {
    key: 'barChannel',
    name: {
      de: 'barChannel',
      en: 'barChannel',
    },
  },
]

export const customerGroups = [
  {
    name: 'myGroup',
    key: 'myKey',
  },
  {
    name: 'fooGroup',
    key: 'fooKey',
  },
  {
    name: 'barGroup',
    key: 'barKey',
  },
]

export const customers = [
  {
    id: '5d64b3d4-1c74-4422-931a-47157150f262',
    email: 'foo@bar.de',
    key: 'myKey',
  },
  {
    id: '1980817f-d803-4d3a-92bc-a40871b13501',
    email: 'foo@baba.de',
    key: 'fooKey',
  },
  {
    id: '6a48ffb0-e280-44d2-9e6d-df43d7c106d1',
    email: 'bar@baba.de',
    key: 'barKey',
  },
  {
    id: '780dae9d-f587-478e-9bb4-d758bef120d3',
    email: 'foobar@baba.de',
    key: 'foobarKey',
  },
]

export const customObjects = [
  {
    id: '75744b19-8314-48d6-8271-2c21bcd060e1',
    version: 1,
    container: 'my.custom.namespace',
    key: 'myKey',
    value: {
      text: {
        de: 'Das ist ein Text',
        en: 'This is a Text',
      },
      name: {
        de: 'Das ist ein Name',
        en: 'This is a Name',
      },
    },
  },
  {
    id: '1ff7df47-231c-4b43-b6c7-ab9545868a3b',
    version: 1,
    container: 'foo.custom.namespace',
    key: 'fooKey',
    value: {
      text: {
        de: 'Das ist ein Text',
        en: 'This is a Text',
      },
      name: {
        de: 'Das ist ein fooName',
        en: 'This is a fooName',
      },
    },
  },
  {
    id: '1afd3e9f-6454-4af0-88e3-cbc52facffbc',
    version: 1,
    container: 'bar.custom.namespace',
    key: 'barKey',
    value: {
      text: {
        de: 'Das ist ein Text',
        en: 'This is a Text',
      },
      name: {
        de: 'Das ist ein barName',
        en: 'This is a barName',
      },
    },
  },
]

export const discountCodes = [
  {
    name: {
      en: 'foo',
      de: 'foo',
    },
    description: {
      en: 'greatest promo',
      de: 'super angebot',
    },
    cartPredicate: 'lineItemTotal(1 = 1) >  "10.00 USD"',
    isActive: true,
    maxApplications: 10,
    maxApplicationsPerCustomer: 2,
    code: 'IT8MKKZX',
  },
  {
    name: {
      en: 'bar',
      de: 'bar',
    },
    description: {
      en: 'greatest promo',
      de: 'super angebot',
    },
    cartPredicate: 'lineItemTotal(1 = 1) >  "10.00 USD"',
    isActive: true,
    maxApplications: 10,
    maxApplicationsPerCustomer: 2,
    code: 'ITlN85n0',
  },
  {
    name: {
      en: 'foobar',
      de: 'foobar',
    },
    description: {
      en: 'greatest promo',
      de: 'super angebot',
    },
    cartPredicate: 'lineItemTotal(1 = 1) >  "10.00 USD"',
    isActive: true,
    maxApplications: 10,
    maxApplicationsPerCustomer: 2,
    code: 'ITDHzsVX',
  },
]

export const inventoryEntries = [
  {
    id: 'd3700692-ebe7-4ac7-aefe-840e7eb02bf8',
    version: 1,
    createdAt: '2018-11-22T12:18:49.774Z',
    lastModifiedAt: '2018-11-22T12:18:49.774Z',
    sku: 'mySKU',
    quantityOnStock: 1,
    availableQuantity: 1,
    reservations: [],
  },
  {
    id: 'b8adb134-6dee-4dab-bf7a-537bde511959',
    version: 1,
    createdAt: '2018-11-22T12:20:19.017Z',
    lastModifiedAt: '2018-11-22T12:20:19.017Z',
    sku: 'fooSKU',
    quantityOnStock: 4,
    availableQuantity: 4,
    reservations: [],
  },
  {
    id: '9914b195-965b-4a83-af69-12af335651ae',
    version: 1,
    createdAt: '2018-11-22T12:20:31.595Z',
    lastModifiedAt: '2018-11-22T12:20:31.595Z',
    sku: 'barSKU',
    quantityOnStock: 8,
    availableQuantity: 8,
    reservations: [],
  },
  {
    id: '09c1da79-690b-4c03-9f19-be8378d3a549',
    version: 1,
    createdAt: '2018-11-22T12:20:42.289Z',
    lastModifiedAt: '2018-11-22T12:20:42.289Z',
    sku: 'foobarSKU',
    quantityOnStock: 13,
    availableQuantity: 13,
    reservations: [],
  },
]

export const orders = [
  {
    version: 1,
  },
  {
    version: 3,
  },
]

export const payments = [
  {
    amountPlanned: {
      currencyCode: 'EUR',
      centAmount: 100,
    },
  },
  {
    amountPlanned: {
      currencyCode: 'USD',
      centAmount: 100,
    },
  },
]

export const productDiscounts = [
  {
    id: 'c68bab7d-86e0-4e6f-9b38-a87e602d0778',
    version: 1,
    createdAt: '2018-11-22T13:26:59.363Z',
    lastModifiedAt: '2018-11-22T13:26:59.363Z',
    value: {
      type: 'relative',
      permyriad: 1000,
    },
    predicate: 'product.id = "c2bfea76-5cff-4607-a9bd-de135f7ac781"',
    name: {
      en: 'FooProductDiscountEN',
      de: 'FooProductDiscountDE',
    },
    isActive: true,
    sortOrder: '0.1',
    references: [
      {
        typeId: 'product',
        id: 'c2bfea76-5cff-4607-a9bd-de135f7ac781',
      },
    ],
    attributeTypes: {},
  },
  {
    id: '6bcb6309-d7a7-4156-ace6-d787a7503ab6',
    version: 1,
    createdAt: '2018-11-22T13:27:52.885Z',
    lastModifiedAt: '2018-11-22T13:27:52.885Z',
    value: {
      type: 'relative',
      permyriad: 1000,
    },
    predicate: 'product.id = "f2ef73af-cdbf-4211-a972-584583f7b01d"',
    name: {
      en: 'BarProductDiscountEN',
      de: 'BarProductDiscountDE',
    },
    isActive: true,
    sortOrder: '0.2',
    references: [
      {
        typeId: 'product',
        id: 'f2ef73af-cdbf-4211-a972-584583f7b01d',
      },
    ],
    attributeTypes: {},
  },
]

export const products = [
  {
    id: 'c2bfea76-5cff-4607-a9bd-de135f7ac781',
    version: 1,
    lastMessageSequenceNumber: 1,
    createdAt: '2018-11-22T13:21:57.701Z',
    lastModifiedAt: '2018-11-22T13:21:57.701Z',
    productType: {
      typeId: 'product-type',
      id: '52be3293-769a-4d15-94f9-64b4ce3e295c',
    },
    catalogs: [],
    masterData: {
      current: {
        name: {
          en: 'FOOPRODUCT',
        },
        description: {
          en: 'Foo description',
        },
        categories: [],
        categoryOrderHints: {},
        slug: {
          en: 'foo12345',
        },
        masterVariant: {
          id: 1,
          prices: [],
          images: [],
          attributes: [],
          assets: [],
        },
        variants: [],
        searchKeywords: {},
      },
      staged: {
        name: {
          en: 'FOOPRODUCT',
        },
        description: {
          en: 'Foo description',
        },
        categories: [],
        categoryOrderHints: {},
        slug: {
          en: 'foo12345',
        },
        masterVariant: {
          id: 1,
          prices: [],
          images: [],
          attributes: [],
          assets: [],
        },
        variants: [],
        searchKeywords: {},
      },
      published: true,
      hasStagedChanges: false,
    },
    catalogData: {},
    lastVariantId: 1,
  },
  {
    id: 'f2ef73af-cdbf-4211-a972-584583f7b01d',
    version: 1,
    lastMessageSequenceNumber: 1,
    createdAt: '2018-11-22T13:22:58.908Z',
    lastModifiedAt: '2018-11-22T13:22:58.908Z',
    productType: {
      typeId: 'product-type',
      id: 'b8009e92-d7a8-41a0-aac6-c819b812a008',
    },
    catalogs: [],
    masterData: {
      current: {
        name: {
          en: 'BARPRODUCT',
        },
        description: {
          en: 'Bar description',
        },
        categories: [],
        categoryOrderHints: {},
        slug: {
          en: 'bar12345',
        },
        masterVariant: {
          id: 1,
          prices: [],
          images: [],
          attributes: [],
          assets: [],
        },
        variants: [],
        searchKeywords: {},
      },
      staged: {
        name: {
          en: 'BARPRODUCT',
        },
        description: {
          en: 'Bar description',
        },
        categories: [],
        categoryOrderHints: {},
        slug: {
          en: 'bar12345',
        },
        masterVariant: {
          id: 1,
          prices: [],
          images: [],
          attributes: [],
          assets: [],
        },
        variants: [],
        searchKeywords: {},
      },
      published: true,
      hasStagedChanges: false,
    },
    catalogData: {},
    lastVariantId: 1,
  },
]

export const productTypes = [
  {
    id: 'aece3fa9-69f2-4b32-bfe2-dd5e3f4c2a2f',
    version: 1,
    name: 'DefaultProductType1',
    description: 'Product Type',
    key: 'defaultProductType1',
    classifier: 'Complex',
    attributes: [
      {
        name: 'ProductTypeAttribute1',
        label: {
          en: 'ProductTypeAttributeEN',
          de: 'ProductTypeAttributeDE',
        },
        isRequired: false,
        type: {
          name: 'number',
        },
        isSearchable: true,
      },
    ],
  },
  {
    id: '52be3293-769a-4d15-94f9-64b4ce3e295c',
    version: 1,
    name: 'FooProductType',
    description: 'Product Type',
    key: 'defaultProductTypeFoo',
    classifier: 'Complex',
    attributes: [
      {
        name: 'FooProductTypeAttribute',
        label: {
          en: 'FooProductTypeAttributeEN',
          de: 'FooProductTypeAttributeDE',
        },
        isRequired: false,
        type: {
          name: 'number',
        },
        isSearchable: true,
      },
    ],
  },
  {
    id: 'b8009e92-d7a8-41a0-aac6-c819b812a008',
    version: 1,
    name: 'BarProductType',
    description: 'Product Type',
    key: 'defaultProductTypeBar',
    classifier: 'Complex',
    attributes: [
      {
        name: 'BarProductTypeAttribute',
        label: {
          en: 'BarProductTypeAttributeEN',
          de: 'BarProductTypeAttributeDE',
        },
        isRequired: false,
        type: {
          name: 'number',
        },
        isSearchable: true,
      },
    ],
  },
]

export const reviews = [
  {
    id: '5279dbcc-1cc8-4f3a-afda-302293d3dc51',
    version: 1,
    text: 'Review text',
  },
  {
    id: '74c04f0a-2274-463a-9fc8-eb7edf5dbb72',
    version: 1,
    text: 'Review text foo',
  },
  {
    id: '8fa6f2a1-59ca-4050-9080-64346be098f1',
    version: 1,
    text: 'Review text bar',
  },
]

export const shippingMethods = [
  {
    id: 'f91662e4-5f1c-4bd4-9d45-b5942dde95ff',
    version: 1,
    name: 'BarShippingMethod',
    description: 'Bar Shipping Method Description',
    taxCategory: {
      typeId: 'tax-category',
      id: 'c3f336b6-1b08-4571-8f20-41973c1f5a9a',
    },
    zoneRates: [
      {
        zone: {
          typeId: 'zone',
          id: 'a9af3b7c-332c-4f13-bbfb-8b9cf7654125',
        },
        shippingRates: [
          {
            price: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 10,
              fractionDigits: 2,
            },
            tiers: [],
          },
        ],
      },
    ],
    isDefault: true,
    createdAt: '2018-11-22T13:54:24.095Z',
    lastModifiedAt: '2018-11-22T13:54:24.095Z',
    key: 'BarShippingMethodKey',
  },
  {
    id: 'ab9d06a6-ee84-47a8-a264-51f1afef6e00',
    version: 1,
    name: 'FooShippingMethod',
    description: 'Foo Shipping Method Description',
    taxCategory: {
      typeId: 'tax-category',
      id: '45ebab71-d0af-48d8-bff0-799e7081c1bc',
    },
    zoneRates: [
      {
        zone: {
          typeId: 'zone',
          id: '95dc8ccc-e280-4ad3-95d5-df16548e17ae',
        },
        shippingRates: [
          {
            price: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 10,
              fractionDigits: 2,
            },
            tiers: [],
          },
        ],
      },
    ],
    isDefault: false,
    createdAt: '2018-11-22T13:56:06.007Z',
    lastModifiedAt: '2018-11-22T13:56:06.007Z',
    key: 'FooShippingMethodKey',
  },
]

export const states = [
  {
    id: 'a97b83f4-2177-4df3-8c73-7fe6df2174ab',
    version: 1,
    key: 'Initial',
    type: 'LineItemState',
    roles: [],
    name: {
      en: 'Initial',
    },
    description: {
      en:
        "Initial is the first that (custom) line item gets after it's creation",
    },
    builtIn: true,
    initial: true,
  },
  {
    id: '609e0789-e0ee-405c-89fb-423a782fed5d',
    version: 1,
    key: 'FooStateKey',
    type: 'OrderState',
    roles: [],
    builtIn: false,
    initial: true,
  },
  {
    id: 'a64c837b-9515-44ba-b8ce-22d0e95a285c',
    version: 1,
    key: 'BarStateKey',
    type: 'OrderState',
    roles: [],
    builtIn: false,
    initial: true,
  },
]

export const taxCategories = [
  {
    id: '89829ff1-b707-4ef1-a052-05efb6a5f074',
    version: 1,
    name: '',
    rates: [],
  },
  {
    id: '45ebab71-d0af-48d8-bff0-799e7081c1bc',
    version: 1,
    name: 'FooTaxCategory',
    rates: [],
  },
  {
    id: 'c3f336b6-1b08-4571-8f20-41973c1f5a9a',
    version: 1,
    name: 'BarTaxCategory',
    rates: [],
  },
]

export const types = [
  {
    id: '40255d8d-7f43-4382-9649-f287e7cfc3ac',
    version: 1,
    createdAt: '2018-11-22T13:33:46.342Z',
    lastModifiedAt: '2018-11-22T13:33:46.342Z',
    key: 'DefaultType',
    name: {
      en: 'DefaultTypeEN',
      de: 'DefaultTypeDE',
    },
    description: {
      en: 'TypeDescriptionEN',
      de: 'TypeDescriptionDE',
    },
    resourceTypeIds: ['order'],
    fieldDefinitions: [
      {
        name: 'CustomTextField',
        label: {
          en: 'StringCustomField EN',
          de: 'StringCustomField DE',
        },
        required: false,
        type: {
          name: 'String',
        },
        inputHint: 'SingleLine',
      },
      {
        name: 'CustomENumField',
        label: {
          en: 'StringCustomField EN',
          de: 'StringCustomField DE',
        },
        required: false,
        type: {
          name: 'Enum',
          values: [
            {
              key: 'enum2',
              label: 'enumlabel2',
            },
            {
              key: 'enum1',
              label: 'enumlabel1',
            },
            {
              key: 'neweNumKey',
              label: 'neweNumLabel',
            },
          ],
        },
        inputHint: 'SingleLine',
      },
      {
        name: 'CustomLeNumField',
        label: {
          en: 'StringCustomField EN',
          de: 'StringCustomField DE',
        },
        required: false,
        type: {
          name: 'LocalizedEnum',
          values: [
            {
              key: 'lenum2',
              label: {
                de: 'lenum2DE',
                en: 'lenum2EN',
              },
            },
            {
              key: 'lenum1',
              label: {
                de: 'lenumDE',
                en: 'lenumEN',
              },
            },
            {
              key: 'newleNumKey',
              label: {
                de: 'newGermaneNumLabel',
                en: 'newEnglishNumLabel',
              },
            },
          ],
        },
        inputHint: 'SingleLine',
      },
    ],
  },
]

export const zones = [
  {
    id: 'f21b7d6e-4f87-4aa8-9f61-9a8af485dd36',
    version: 1,
    name: 'Zone',
    description: 'sample-zone',
    locations: [
      {
        country: 'ES',
        state: '',
      },
    ],
  },
  {
    id: '95dc8ccc-e280-4ad3-95d5-df16548e17ae',
    version: 1,
    name: 'FooZone',
    description: 'foo-zone',
    locations: [
      {
        country: 'US',
        state: '',
      },
    ],
  },
  {
    id: 'a9af3b7c-332c-4f13-bbfb-8b9cf7654125',
    version: 1,
    name: 'BarZone',
    description: 'bar-zone',
    locations: [
      {
        country: 'NG',
        state: '',
      },
    ],
  },
  {
    id: 'd9ef288e-ee90-4638-a037-041811a9ece1',
    version: 1,
    name: 'FooBarZone',
    description: 'foobar-zone',
    locations: [
      {
        country: 'DE',
        state: '',
      },
    ],
  },
]
