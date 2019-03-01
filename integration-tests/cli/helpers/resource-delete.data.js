export const categories = [
  {
    key: 'fooCatKey',
    name: {
      en: 'categoryFoo',
    },
    slug: {
      en: 'category-foo',
    },
    description: {
      en: 'descFoo',
    },
    externalId: 'foo',
    assets: [],
  },
  {
    key: 'barCatKey',
    name: {
      en: 'categoryBar',
    },
    slug: {
      en: 'category-bar',
    },
    description: {
      en: 'descBar',
    },
    externalId: 'bar',
    assets: [],
  },
  {
    key: 'foobarCatKey',
    name: {
      en: 'categoryFoobar',
    },
    slug: {
      en: 'category-foobar',
    },
    description: {
      en: 'descFoobar',
    },
    externalId: 'foobar',
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
    key: 'fooChKey',
    name: {
      de: 'fooChannel',
      en: 'fooChannel',
    },
  },
  {
    key: 'barChKey',
    name: {
      de: 'barChannel',
      en: 'barChannel',
    },
  },
]

export const customerGroups = [
  {
    key: 'myCGKey',
    groupName: 'myCGName',
  },
  {
    groupName: 'fooCustGroup',
    key: 'fooCGKey',
  },
  {
    groupName: 'barCGName',
    key: 'barCGKey',
  },
]

export const customers = [
  {
    email: 'foo@baba.de',
    password: 'foobaba',
    key: 'fooCKey',
  },
  {
    email: 'bar@baba.de',
    password: 'barbaba',
    key: 'barCKey',
  },
  {
    email: 'foobar@baba.de',
    password: 'foobarbaba',
    key: 'foobarCKey',
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
    key: 'fooCOKey',
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
    key: 'barCOKey',
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
    key: 'fooPTKey',
    description: 'Product Type',
    version: 1,
  },
  {
    name: 'BarProductType',
    key: 'barPTKey',
    description: 'Product Type',
    version: 1,
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

export const taxCategories = [
  {
    name: 'fooTaxCategory',
    key: 'fooTCKey',
    rates: [
      { name: 'fooRate', amount: 0.1, includedInPrice: true, country: 'DE' },
    ],
  },
  {
    name: 'barTaxCategory',
    key: 'barTCKey',
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
    key: 'fooZKey',
  },
  {
    name: 'barZone',
    key: 'barZKey',
  },
  {
    name: 'fooBarZone',
    key: 'foobarZKey',
  },
]

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

export const products = [
  {
    key: 'fooPKey',
    name: {
      en: 'fooP',
    },
    slug: {
      en: 'foo-product-type',
    },
    productType: {
      key: 'fooPTKey',
    },
  },
]

export const shippingMethods = [
  {
    name: 'fooShippingMethod',
    taxCategory: {
      key: 'fooTCKey',
    },
  },
  {
    name: 'barShippingMethod',
    taxCategory: {
      key: 'barTCKey',
    },
  },
]
