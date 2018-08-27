export const sampleProductType = {
  name: 'productTypeForProductParse',
  description: 'bla bla bla',
  key: 'productTypeKey',
  attributes: [
    {
      type: {
        name: 'text',
      },
      name: 'text-attribute',
      label: {
        en: 'text-attribute',
      },
      isRequired: false,
    },
  ],
}

export const anotherSampleProductType = {
  name: 'anotherProductTypeForProductParse',
  description: 'another bla bla bla again',
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

export const sampleState = {
  key: 'stateKey',
  type: 'ProductState',
}

export const sampleTaxCategory = {
  name: 'new-tax-category',
  key: 'taxCategoryKey',
  description: 'sample tax category created for testing',
  rates: [
    {
      name: 'tax-rate-1',
      amount: 0.19,
      includedInPrice: true,
      country: 'DE',
    },
    {
      name: 'tax-rate-1',
      amount: 0.25,
      includedInPrice: false,
      country: 'US',
    },
  ],
}

export const sampleParentCategory = {
  key: 'parentCatKey',
  name: { en: 'Parent Category' },
  description: { en: 'This will be the root category' },
  slug: { en: 'parent-category-slug' },
  externalId: 'parent-external-id',
}

// function because we need the parent ref and it's not know until runtime
export const sampleCategory = {
  key: 'childCatKey',
  name: { en: 'child Category' },
  description: { en: 'This will be the child category' },
  slug: { en: 'child-category-slug' },
  externalId: 'child-external-id',
  parent: { typeId: 'category', key: 'parentCatKey' },
}

export const samplePriceChannel = {
  key: 'priceChannel',
  roles: ['ProductDistribution', 'Primary'],
  name: {
    en: 'priceChannel',
  },
}

export const createProducts = (state, taxCategory) => [
  {
    key: 'productKey-1',
    name: {
      de: 'Beispiel Entejacke',
      en: 'Sample Duck-jacket',
    },
    productType: {
      typeId: 'product-type',
      key: 'productTypeKey',
    },
    slug: {
      de: 'beispiel-sluggy-ente-jacke-123',
      en: 'sample-sluggy-duck-jacke-123',
    },
    description: {
      de: 'Die leichten Freizeitjacken von Save the Duck halten uns wohlig',
      en: 'The light jackets of Save the Duck keep us cozy warm. The slight',
    },
    categories: [
      {
        typeId: 'category',
        key: 'childCatKey',
      },
    ],
    metaTitle: {
      de: 'Schoene Jacken',
      en: 'Beauitful Jackets',
    },
    masterVariant: {
      id: 1,
      sku: 'M00FCKV',
      key: 'master-var-1',
      attributes: [{ name: 'text-attribute', value: 'Master Var attr' }],
      prices: [
        {
          value: {
            currencyCode: 'USD',
            centAmount: 2233,
          },
          country: 'US',
        },
      ],
    },
    variants: [
      {
        id: 2,
        sku: 'M00FCKV-11',
        key: 'normal-var-1',
        attributes: [{ name: 'text-attribute', value: 'First Var attr' }],
      },
      {
        id: 3,
        sku: 'M00FCKV-22',
        key: 'normal-var-2',
        attributes: [{ name: 'text-attribute', value: 'Second Var attr' }],
      },
    ],
    searchKeywords: {
      en: [
        { text: 'Standard Keyword' },
        {
          text: 'German White Space',
          suggestTokenizer: { type: 'whitespace' },
        },
      ],
    },
    state,
    taxCategory,
  },
  {
    key: 'productKey-2',
    name: {
      de: 'Zwite Beispiel Entejacke',
      en: 'Second Sample Duck-jacket',
    },
    productType: {
      typeId: 'product-type',
      key: 'anotherProductTypeKey',
    },
    slug: {
      de: 'beispiel-sluggy-ente-jacke-456789',
      en: 'sample-sluggy-duck-jacke-456789',
    },
    description: {
      de: 'Lorem Ipsum Text von Save the Duck halten uns wohlig',
      en: 'Golom Jacop Caesar Icarve the Duck keep us cozy warm. The slight',
    },
    categories: [
      {
        typeId: 'category',
        key: 'childCatKey',
      },
    ],
    metaTitle: {
      de: 'Schoene Jacken-2',
      en: 'Beauitful Jackets-2',
    },
    masterVariant: {
      id: 1,
      sku: 'M00F56YSS',
      key: 'master-var-111',
      attributes: [
        { name: 'another-text-attribute', value: 'Another Master Var attr' },
      ],
    },
    variants: [
      {
        id: 2,
        sku: 'M00F56YSS-11',
        key: 'normal-var-222',
        attributes: [
          { name: 'another-text-attribute', value: 'Another First Var attr' },
        ],
      },
    ],
    searchKeywords: {
      en: [
        { text: 'Multi Tool' },
        { text: 'Swiss Army Knife', suggestTokenizer: { type: 'whitespace' } },
      ],
    },
    state,
    taxCategory,
  },
]
