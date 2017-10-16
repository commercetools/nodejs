import { stripIndent } from 'common-tags'
import ProductMapping from '../src/mappings'

describe('::ProductMapping', () => {
  let productMapping
  beforeEach(() => {
    productMapping = new ProductMapping()
  })
  it('should be defined', () => {
    expect(ProductMapping).toBeDefined()
  })

  describe('::constructor', () => {
    it('should be defined', () => {
      expect(productMapping.constructor).toBeDefined()
    })

    it('should initialize with default values', () => {
      expect(productMapping.fillAllRows).toBe(false)
    })

    it('should initialize with passed in values', () => {
      productMapping = new ProductMapping(true)
      expect(productMapping.fillAllRows).toBe(true)
    })
  })

  describe('::run', () => {
    it('should accept a product and return a formatted csv string', () => {
      const sample = {
        id: '12345ab-id',
        key: 'product-key',
        version: 1,
        productType: {
          name: 'resolved-product-type',
          attributes: [{}],
        },
        name: {
          en: 'Phone cover',
          de: 'Handyhülle',
        },
        categories: [{ name: 'res-cat-name-1' }, { name: 'res-cat-name-2' }],
        categoryOrderHints: {
          'res-cat-name-1': '0.015',
          'res-cat-name-2': '0.987',
        },
        slug: {
          en: 'michaelkors-phonecover',
          de: 'michaelkors-handyhuelle',
        },
        masterVariant: {
          id: 1,
          sku: 'A0E200000001YKI',
          images: [
            {
              url: 'https://example.com/foobar/commer.jpg',
              dimensions: {
                w: 3,
                h: 4,
              },
            },
            {
              url: 'https://example-2.com/demo/tools.jpg',
              dimensions: {
                w: 1,
                h: 5,
              },
              label: 'image-label',
            },
          ],
          attributes: [
            {
              name: 'article',
              value: 'sample 089 WHT',
            },
            {
              name: 'designer',
              value: {
                label: 'Michael Kors',
                key: 'michaelkors',
              },
            },
            {
              name: 'color',
              value: {
                label: {
                  it: 'blanco',
                  de: 'weiss',
                  en: 'white',
                },
                key: 'white',
              },
            },
            {
              name: 'colorFreeDefinition',
              value: {
                en: 'black-white',
                de: 'schwarz-weiß',
              },
            },
          ],
          assets: [],
        },
        variants: [{
          id: 2,
          sku: 'A0E200001YKI123',
          images: [
            {
              url: 'https://example.com/foobar/commer234.jpg',
              dimensions: {
                w: 3,
                h: 3,
              },
            },
            {
              url: 'https://example-2.com/demo/tools67.jpg',
              dimensions: {
                w: 1,
                h: 1,
              },
            },
          ],
          attributes: [
            {
              name: 'article',
              value: 'sample 089 WHT',
            },
            {
              name: 'designer',
              value: {
                label: 'Michael Kors',
                key: 'michaelkors',
              },
            },
            {
              name: 'color',
              value: {
                label: {
                  it: 'blanco',
                  de: 'weiss',
                  en: 'white',
                },
                key: 'white',
              },
            },
            {
              name: 'colorFreeDefinition',
              value: {
                en: 'black-white',
                de: 'schwarz-weiß',
              },
            },
          ],
          assets: [],
        }],
        searchKeywords: {},
        hasStagedChanges: false,
        published: false,
        taxCategory: {
          key: 'resolved-tax-key',
        },
        createdAt: '2017-01-06T10:54:51.395Z',
        lastModifiedAt: '2017-01-06T10:54:51.395Z',
      }

      const expected = [{
        id: '12345ab-id',
        key: 'product-key',
        productType: 'resolved-product-type',
        'name.en': 'Phone cover',
        'name.de': 'Handyhülle',
        categories: 'res-cat-name-1;res-cat-name-2',
        categoryOrderHints: 'res-cat-name-1:0.015;res-cat-name-2:0.987',
        'slug.en': 'michaelkors-phonecover',
        'slug.de': 'michaelkors-handyhuelle',
        taxCategory: 'resolved-tax-key',
        published: false,
        hasStagedChanges: false,
        'variant.id': 1,
        'variant.key': '',
        'variant.sku': 'A0E200000001YKI',
        'variant.images': 'https://example.com/foobar/commer.jpg|3|4;https://example-2.com/demo/tools.jpg|1|5|image-label',
        'attr.article': 'sample 089 WHT',
        'attr.color': 'white',
        'attr.colorFreeDefinition.en': 'black-white',
        'attr.colorFreeDefinition.de': 'schwarz-weiß',
      }, {
        'variant.id': 2,
        'variant.key': '',
        'variant.sku': 'A0E200001YKI123',
        'variant.images': 'https://example.com/foobar/commer234.jpg|3|3;https://example-2.com/demo/tools67.jpg|1|1',
        'attr.article': 'sample 089 WHT',
        'attr.color': 'white',
        'attr.colorFreeDefinition.en': 'black-white',
        'attr.colorFreeDefinition.de': 'schwarz-weiß',
      }]


      expect(productMapping.run(sample)).toEqual(expected)
    })
  })

  describe('::mergeVariants', () => {
    it('merge all variants in a product into one array', () => {
      const sampleProduct = {
        masterVariant: { id: 1 },
        variants: [{ id: 2 }, { id: 3 }],
      }
      const expected = {
        variant: [{ id: 1 }, { id: 2 }, { id: 3 }],
      }
      const actual = ProductMapping._mergeVariants(sampleProduct)
      expect(actual).toEqual(expected)
    })
  })

  describe('::spreadProductInfoOnvariants', () => {
    const sampleProduct = {
      name: { en: 'my-fresh-product' },
      description: { en: 'sample product object' },
      variant: [
        { id: 'masterVariant' },
        { id: 'variant-2' },
        { id: 'variant-3' },
      ],
    }

    it('spread product data for each variant if `fillAllRows`', () => {
      const expected = [{
        name: { en: 'my-fresh-product' },
        description: { en: 'sample product object' },
        variant: { id: 'masterVariant' },
      }, {
        name: { en: 'my-fresh-product' },
        description: { en: 'sample product object' },
        variant: { id: 'variant-2' },
      }, {
        name: { en: 'my-fresh-product' },
        description: { en: 'sample product object' },
        variant: { id: 'variant-3' },
      }]
      const actual = ProductMapping._spreadProductInfoOnvariants(sampleProduct, true)
      expect(actual).toEqual(expected)
    })

    it('spread product data for only one variant if no fillAllRows', () => {
      const expected = [{
        name: { en: 'my-fresh-product' },
        description: { en: 'sample product object' },
        variant: { id: 'masterVariant' },
      }, {
        variant: { id: 'variant-2' },
      }, {
        variant: { id: 'variant-3' },
      }]
      const actual = ProductMapping._spreadProductInfoOnvariants(sampleProduct, false)
      expect(actual).toEqual(expected)
    })
  })

  describe('::mapResolvedTypes', () => {
    it('replaces resolved objects with strings', () => {
      const sample = {
        id: '12345ab-id',
        key: 'product-key',
        version: 1,
        productType: {
          name: 'resolved-product-type',
          attributes: [{}],
        },
        name: {
          en: 'Phone cover',
          de: 'Handyhülle',
        },
        categories: [{ name: 'res-cat-name-1' }, { name: 'res-cat-name-2' }],
        categoryOrderHints: {
          'res-cat-name-1': '0.015',
          'res-cat-name-2': '0.987',
        },
        slug: {
          en: 'michaelkors-phonecover',
          de: 'michaelkors-handyhuelle',
        },
        variant: {
          id: 1,
          sku: 'A0E200000001YKI',
          images: [
            {
              url: 'https://example.com/foobar/commer.jpg',
              dimensions: {
                w: 3,
                h: 4,
              },
            },
            {
              url: 'https://example-2.com/demo/tools.jpg',
              dimensions: {
                w: 1,
                h: 5,
              },
              label: 'image-label',
            },
          ],
          attributes: [
            {
              name: 'article',
              value: 'sample 089 WHT',
            },
            {
              name: 'designer',
              value: {
                label: 'Michael Kors',
                key: 'michaelkors',
              },
            },
            {
              name: 'color',
              value: {
                label: {
                  it: 'blanco',
                  de: 'weiss',
                  en: 'white',
                },
                key: 'white',
              },
            },
            {
              name: 'colorFreeDefinition',
              value: {
                en: 'black-white',
                de: 'schwarz-weiß',
              },
            },
          ],
          assets: [],
        },
        state: {
          key: 'my-resolved-state',
        },
        searchKeywords: {},
        hasStagedChanges: false,
        published: false,
        taxCategory: {
          key: 'resolved-tax-key',
        },
        createdAt: '2017-01-06T10:54:51.395Z',
        lastModifiedAt: '2017-01-06T10:54:51.395Z',
      }
      const expected = {
        id: '12345ab-id',
        key: 'product-key',
        version: 1,
        productType: {
          name: 'resolved-product-type',
          attributes: [{}],
        },
        name: {
          en: 'Phone cover',
          de: 'Handyhülle',
        },
        categories: 'res-cat-name-1;res-cat-name-2',
        categoryOrderHints: 'res-cat-name-1:0.015;res-cat-name-2:0.987',
        slug: {
          en: 'michaelkors-phonecover',
          de: 'michaelkors-handyhuelle',
        },
        variant: {
          id: 1,
          sku: 'A0E200000001YKI',
          images: [
            {
              url: 'https://example.com/foobar/commer.jpg',
              dimensions: {
                w: 3,
                h: 4,
              },
            },
            {
              url: 'https://example-2.com/demo/tools.jpg',
              dimensions: {
                w: 1,
                h: 5,
              },
              label: 'image-label',
            },
          ],
          attributes: [
            {
              name: 'article',
              value: 'sample 089 WHT',
            },
            {
              name: 'designer',
              value: {
                label: 'Michael Kors',
                key: 'michaelkors',
              },
            },
            {
              name: 'color',
              value: {
                label: {
                  it: 'blanco',
                  de: 'weiss',
                  en: 'white',
                },
                key: 'white',
              },
            },
            {
              name: 'colorFreeDefinition',
              value: {
                en: 'black-white',
                de: 'schwarz-weiß',
              },
            },
          ],
          assets: [],
        },
        state: 'my-resolved-state',
        searchKeywords: {},
        hasStagedChanges: false,
        published: false,
        taxCategory: 'resolved-tax-key',
        createdAt: '2017-01-06T10:54:51.395Z',
        lastModifiedAt: '2017-01-06T10:54:51.395Z',
      }
      expect(productMapping._mapResolvedTypes(sample)).toEqual(expected)
    })
  })

  describe('::mapCategoriesToString', () => {
    const sampleCategory = [{
      name: {
        en: 'cat-in-en',
        de: 'cat-in-de',
      },
      externalId: 'cat-ext-id',
    }, {
      name: {
        en: 'cat-foo-en',
        de: 'cat-foo-de',
      },
      externalId: 'cat-foo-id',
    }]
    const expected = 'cat-in-en;cat-foo-en'

    expect(productMapping._mapCategoriesToString(sampleCategory)).toMatch(expected)
  })
})
