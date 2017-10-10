export const sampleProductType = {
  name: 'productTypeForProductExport',
  description: 'bla bla bla',
  key: `productTypeKey${Date.now()}`,
}

export const sampleTaxCategory = {
  name: 'new-sample-tax-category',
  key: `tax-cat-1${Date.now()}`,
  description: 'sample tax category created for testing',
  rates: [
    {
      name: 'sample-tax-rate-1',
      amount: 0.19,
      includedInPrice: true,
      country: 'DE',
    },
    {
      name: 'sample-tax-rate-1',
      amount: 0.25,
      includedInPrice: false,
      country: 'US',
    },
  ],
}

export const createProducts = (
  productType,
  taxCategory,
) => (
  [
    {
      key: '1',
      name: {
        de: 'Beispiel Entejacke',
        en: 'Sample Duck-jacket',
      },
      slug: {
        de: 'beispiel-sluggy-ente-jacke-123',
        en: 'sample-sluggy-duck-jacke-123',
      },
      description: {
        de: 'Die leichten Freizeitjacken von Save the Duck halten uns wohlig',
        en: 'The light jackets of Save the Duck keep us cozy warm. The slight',
      },
      metaTitle: {
        de: 'Schoene Jacken',
        en: 'Beauitful Jackets',
      },
      masterVariant: {
        id: 1,
        sku: 'M00FCKV',
        key: 'master-var-1',
      },
      variants: [{
        id: 2,
        sku: 'M00FCKV-11',
        key: 'normal-var-1',
      },
      {
        id: 3,
        sku: 'M00FCKV-22',
        key: 'normal-var-2',
      }],
      productType,
      taxCategory,
    },
    {
      key: '2',
      name: {
        de: 'Zwite Beispiel Entejacke',
        en: 'Second Sample Duck-jacket',
      },
      slug: {
        de: 'beispiel-sluggy-ente-jacke-456789',
        en: 'sample-sluggy-duck-jacke-456789',
      },
      description: {
        de: 'Lorem Ipsum Text von Save the Duck halten uns wohlig',
        en: 'Golom Jacop Caesar Icarve the Duck keep us cozy warm. The slight',
      },
      metaTitle: {
        de: 'Schoene Jacken-2',
        en: 'Beauitful Jackets-2',
      },
      masterVariant: {
        id: 1,
        sku: 'M00F56YSS',
        key: 'master-var-111',
      },
      variants: [{
        id: 2,
        sku: 'M00F56YSS-11',
        key: 'normal-var-222',
      }],
      productType,
      taxCategory,
    },
  ]
)

export const expectedProducts = [
  {
    id: expect.any(String),
    version: 1,
    key: '1',
    productType: { typeId: 'product-type', id: expect.any(String) },
    name: {
      de: 'Beispiel Entejacke',
      en: 'Sample Duck-jacket',
    },
    slug: {
      de: 'beispiel-sluggy-ente-jacke-123',
      en: 'sample-sluggy-duck-jacke-123',
    },
    description: {
      de: 'Die leichten Freizeitjacken von Save the Duck halten uns wohlig',
      en: 'The light jackets of Save the Duck keep us cozy warm. The slight',
    },
    metaTitle: {
      de: 'Schoene Jacken',
      en: 'Beauitful Jackets',
    },
    masterVariant: {
      id: 1,
      sku: 'M00FCKV',
      key: 'master-var-1',
      prices: expect.any(Array),
      images: expect.any(Array),
      attributes: expect.any(Array),
      assets: expect.any(Array),
    },
    variants: [{
      id: 2,
      sku: 'M00FCKV-11',
      key: 'normal-var-1',
      prices: expect.any(Array),
      images: expect.any(Array),
      attributes: expect.any(Array),
      assets: expect.any(Array),
    },
    {
      id: 3,
      sku: 'M00FCKV-22',
      key: 'normal-var-2',
      prices: expect.any(Array),
      images: expect.any(Array),
      attributes: expect.any(Array),
      assets: expect.any(Array),
    }],
    taxCategory: { typeId: 'tax-category', id: expect.any(String) },
  },
  {
    id: expect.any(String),
    version: 1,
    key: '2',
    name: {
      de: 'Zwite Beispiel Entejacke',
      en: 'Second Sample Duck-jacket',
    },
    slug: {
      de: 'beispiel-sluggy-ente-jacke-456789',
      en: 'sample-sluggy-duck-jacke-456789',
    },
    description: {
      de: 'Lorem Ipsum Text von Save the Duck halten uns wohlig',
      en: 'Golom Jacop Caesar Icarve the Duck keep us cozy warm. The slight',
    },
    metaTitle: {
      de: 'Schoene Jacken-2',
      en: 'Beauitful Jackets-2',
    },
    masterVariant: {
      id: 1,
      sku: 'M00F56YSS',
      key: 'master-var-111',
      prices: expect.any(Array),
      images: expect.any(Array),
      attributes: expect.any(Array),
      assets: expect.any(Array),
    },
    variants: [{
      id: 2,
      sku: 'M00F56YSS-11',
      key: 'normal-var-222',
      prices: expect.any(Array),
      images: expect.any(Array),
      attributes: expect.any(Array),
      assets: expect.any(Array),
    }],
    productType: { typeId: 'product-type', id: expect.any(String) },
    taxCategory: { typeId: 'tax-category', id: expect.any(String) },
  },
]
