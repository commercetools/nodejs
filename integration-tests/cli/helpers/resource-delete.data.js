export const carts = [
  {
    currency: 'EUR',
    shippingAddress: {
      country: 'DE',
    },
  },
  {
    currency: 'USD',
    shippingAddress: {
      country: 'US',
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
    key: 'myKey',
    groupName: 'myGroup',
  },
  {
    groupName: 'fooGroup',
    key: 'fooKey',
  },
  {
    groupName: 'barGroup',
    key: 'barKey',
  },
]

export const customers = [
  {
    email: 'foo@baba.de',
    password: 'foobaba',
    key: 'fooKey',
  },
  {
    email: 'bar@baba.de',
    password: 'barbaba',
    key: 'barKey',
  },
  {
    email: 'foobar@baba.de',
    password: 'foobarbaba',
    key: 'foobarKey',
  },
]

export const customObjects = [
  {
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

export const inventory = [
  {
    sku: 'mySKU',
    quantityOnStock: 1,
  },
  {
    sku: 'fooSKU',
    quantityOnStock: 4,
  },
  {
    sku: 'barSKU',
    quantityOnStock: 8,
  },
  {
    sku: 'foobarSKU',
    quantityOnStock: 13,
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
    name: {
      en: 'FooProductDiscountEN',
      de: 'FooProductDiscountDE',
    },
    value: {
      type: 'relative',
      permyriad: 1000,
    },
    predicate: 'product.key = "fooProduct"',
    sortOrder: '0.1',
    isActive: true,
  },
  {
    name: {
      en: 'BarProductDiscountEN',
      de: 'BarProductDiscountDE',
    },
    value: {
      type: 'relative',
      permyriad: 1000,
    },
    predicate: 'product.key = "barProductType"',
    sortOrder: '0.2',
    isActive: false,
  },
]

export const productTypes = [
  {
    name: 'DefaultProductType1',
    key: 'defaultProductType1',
    description: 'Product Type',
    version: 1,
  },
  {
    name: 'FooProductType',
    key: 'fooProductTypeKey',
    description: 'Product Type',
    version: 1,
  },
  {
    name: 'BarProductType',
    key: 'barProductTypeKey',
    description: 'Product Type',
    version: 1,
  },
]

export const products = [
  {
    key: 'fooProduct',
    name: {
      en: 'fooP',
    },
    slug: {
      en: 'foo-product-type',
    },
    productType: {
      key: 'fooProductTypeKey',
    },
  },
]

export const reviews = [
  {
    text: 'Review text',
  },
  {
    text: 'Review text foo',
  },
  {
    text: 'Review text bar',
  },
]

export const shippingMethods = [
  {
    name: 'fooShippingMethod',
    taxCategory: {
      key: 'fooTaxCategoryKey',
    },
  },
  {
    name: 'barShippingMethod',
    taxCategory: {
      key: 'barTaxCategoryKey',
    },
  },
]

export const taxCategories = [
  {
    name: 'fooTaxCategory',
    key: 'fooTaxCategoryKey',
    rates: [
      { name: 'fooRate', amount: 0.1, includedInPrice: true, country: 'DE' },
    ],
  },
  {
    name: 'barTaxCategory',
    key: 'barTaxCategoryKey',
    rates: [
      { name: 'barRate', amount: 0.3, includedInPrice: true, country: 'US' },
    ],
  },
]

export const types = [
  {
    key: 'DefaultType',
    name: {
      en: 'DefaultTypeEN',
      de: 'DefaultTypeDE',
    },
    resourceTypeIds: ['order'],
  },
]

export const zones = [
  {
    name: 'fooZone',
    key: 'fooZoneKey',
  },
  {
    name: 'barZone',
    key: 'barZoneKey',
  },
  {
    name: 'fooBarZone',
    key: 'foobarZoneKey',
  },
]
