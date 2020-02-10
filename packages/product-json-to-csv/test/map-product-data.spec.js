import { oneLineTrim } from 'common-tags'
import ProductMapping from '../src/map-product-data'

describe('::ProductMapping', () => {
  let productMapping
  beforeEach(() => {
    productMapping = new ProductMapping()
  })

  describe('::constructor', () => {
    test('should be defined', () => {
      expect(productMapping.constructor).toBeDefined()
    })

    test('should initialize with default values', () => {
      expect(productMapping.fillAllRows).toBe(false)
      expect(productMapping.onlyMasterVariants).toBe(false)
      expect(productMapping.categoryBy).toBe('name')
      expect(productMapping.mainLanguage).toBe('en')
      expect(productMapping.languages).toEqual(['en'])
      expect(productMapping.multiValDel).toBe(';')
    })

    test('should initialize with passed in values', () => {
      const options = {
        fillAllRows: true,
        onlyMasterVariants: true,
        categoryBy: 'namedPath',
        language: 'it',
        languages: ['en', 'it'],
        multiValueDelimiter: '|',
      }
      productMapping = new ProductMapping(options)
      expect(productMapping.fillAllRows).toBe(true)
      expect(productMapping.onlyMasterVariants).toBe(true)
      expect(productMapping.categoryBy).toBe('namedPath')
      expect(productMapping.mainLanguage).toBe('it')
      expect(productMapping.languages).toEqual(['en', 'it'])
      expect(productMapping.multiValDel).toBe('|')
    })
  })

  describe('::run', () => {
    let sample

    beforeAll(() => {
      sample = {
        id: '12345ab-id',
        key: 'product-key',
        version: 1,
        productType: {
          name: 'resolved-product-type',
          attributes: [
            { name: 'article' },
            { name: 'designer' },
            { name: 'color' },
            {
              name: 'colorFreeDefinition',
              type: {
                name: 'ltext',
              },
            },
            { name: 'addedAttr' },
            { name: 'anotherAddedAttr' },
            {
              name: 'setOfLtextAttribute',
              type: {
                name: 'set',
                elementType: {
                  name: 'ltext',
                },
              },
            },
          ],
        },
        name: {
          en: 'Phone cover',
          de: 'Handyhülle',
        },
        categories: [
          { name: { en: 'res-cat-name-1' } },
          { name: { en: 'res-cat-name-2' } },
        ],
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
          prices: [
            {
              value: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 6400,
                fractionDigits: 2,
              },
              id: '1f7ecb38-89b6-426e-988c-11bda90456cb',
              country: 'DE',
            },
            {
              value: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 2900,
                fractionDigits: 2,
              },
              id: '7ecffab3-f980-4709-be01-04b5f0aa39eb',
              country: 'IT',
            },
          ],
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
          availability: {
            isOnStock: true,
            availableQuantity: 10,
          },
          attributes: [
            {
              name: 'article',
              value: 'sample 089 WHT',
            },
            {
              name: 'reference',
              value: {
                id: 'uuid',
                typeId: 'product',
                obj: {
                  key: 'referenceKey',
                },
              },
            },
            {
              name: 'referenceSet',
              value: [
                {
                  id: 'uuid',
                  typeId: 'product',
                  obj: {
                    key: 'referenceSetKey',
                  },
                },
                {
                  id: 'uuid2',
                  typeId: 'product',
                  obj: {
                    key: 'referenceSetKey2',
                  },
                },
              ],
            },
            {
              name: 'moneyAttr',
              value: {
                fractionDigits: 2,
                centAmount: 1234,
                currencyCode: 'EUR',
                type: 'centPrecision',
              },
            },
            {
              name: 'setLenums',
              value: [
                {
                  key: 'myLenums',
                  label: {
                    en: 'myLenums-en',
                    es: 'myLenums-es',
                    de: 'myLenums-de',
                  },
                },
                {
                  key: 'myLenums2',
                  label: {
                    en: 'myLenums-en2',
                    // es is missing - will be an empty string in output
                    de: 'myLenums-de2',
                  },
                },
                {
                  key: 'myLenums3',
                  label: {
                    en: 'myLenums-en3',
                    es: 'myLenums-es3',
                    de: 'myLenums-de3',
                  },
                },
              ],
            },
            {
              name: 'setLenumsEmpty',
              value: [
                {
                  key: 'myLenums',
                  label: {
                    en: 'myLenums-en',
                    // es is missing - will be an empty string in output

                    de: 'myLenums-de',
                  },
                },
                {
                  key: 'myLenums2',
                  label: {
                    en: 'myLenums-en2',
                    // es is missing - will be an empty string in output
                    de: 'myLenums-de2',
                  },
                },
                {
                  key: 'myLenums3',
                  label: {
                    en: 'myLenums-en3',
                    es: 'myLenums-es3',
                    de: 'myLenums-de3',
                  },
                },
              ],
            },
            {
              name: 'setEnums',
              value: [
                {
                  key: 'myEnum',
                  label: 'myEnumLabel',
                },
                {
                  key: 'myEnum2',
                  label: 'myEnumLabel2',
                },
              ],
            },
            {
              name: 'emptySet',
              value: [],
            },
            {
              name: 'setText',
              value: ['text1', 'text2'],
            },
            {
              name: 'setLText',
              value: [
                {
                  en: 'enText1',
                  de: 'deText1',
                },
                {
                  en: 'enText2',
                  de: 'deText2',
                },
              ],
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
            {
              name: 'lengthOfProduct',
              value: 0,
            },
            {
              name: 'referenceById',
              value: {
                typeId: 'product',
                id: 'id123',
              },
            },
            {
              name: 'referenceByKey',
              value: {
                typeId: 'product',
                key: 'key123',
              },
            },
          ],
        },
        variants: [
          {
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
                name: 'setLenums-2',
                value: [
                  {
                    key: 'myLenums-2',
                    label: {
                      en: 'myLenums-2-en',
                      es: 'myLenums-2-es',
                      de: 'myLenums-2-de',
                    },
                  },
                ],
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
          },
        ],
        searchKeywords: {},
        hasStagedChanges: false,
        published: true,
        taxCategory: {
          name: 'resolved-tax-name',
        },
        createdAt: '2017-01-06T10:54:51.395Z',
        lastModifiedAt: '2017-01-06T10:54:51.395Z',
      }
    })

    test('should accept a product and return a formatted csv string', () => {
      expect(productMapping.run(sample)).toMatchSnapshot()
    })

    test('should accept a product and map only masterVariants', () => {
      const _productMapping = new ProductMapping({
        onlyMasterVariants: true,
        languages: ['en', 'fr'],
      })
      const res = _productMapping.run(sample)
      expect(res).toHaveLength(1) // only one variant should be exported
      expect(res[0]['variant.sku']).toEqual('A0E200000001YKI') // masterVariant
      expect(res).toMatchSnapshot()
    })

    test('should handle conflicting attribute names', () => {
      const _productMapping = new ProductMapping({
        languages: ['en', 'de', 'fr'],
      })
      const _sample = {
        id: 'a8ca7cba-cfd7-404e-b52b-2150cfa103e3',
        version: 1,
        productType: {
          name: 'resolved-product-type',
        },
        name: {
          en: 'conflictAttributeTest',
        },
        description: {
          en: 'Conflict attribute test',
        },
        categories: [],
        categoryOrderHints: {},
        slug: {
          en: 'conflict-attr-test',
        },
        masterVariant: {
          id: 1,
          sku: 'SKU1',
          key: 'KEY1',
          prices: [],
          images: [],
          attributes: [
            {
              name: 'productType',
              value: {
                label: {
                  de: 'label-de',
                  en: 'label-en',
                },
                key: 'lenum-key-1',
              },
            },
            {
              name: 'description',
              value: {
                de: 'description de',
                en: 'description en',
              },
            },
          ],
          assets: [],
        },
        variants: [],
        searchKeywords: {},
        hasStagedChanges: false,
        published: false,
        key: 'conflict-attr-test',
        createdAt: '2018-11-13T09:43:13.304Z',
        lastModifiedAt: '2018-11-13T09:43:13.304Z',
      }
      const res = _productMapping.run(_sample)
      expect(res).toHaveLength(1)
      expect(res).toMatchSnapshot()
    })
  })

  describe('::mergeVariants', () => {
    test('merge all variants in a product into one array', () => {
      const sampleProduct = {
        masterVariant: { id: 1 },
        variants: [{ id: 2 }, { id: 3 }],
      }
      const expected = {
        variant: [{ id: 1 }, { id: 2 }, { id: 3 }],
      }
      const actual = productMapping._mergeVariants(sampleProduct)
      expect(actual).toEqual(expected)
    })
  })

  describe('::spreadProductInfoOnVariants', () => {
    const sampleProduct = {
      name: { en: 'my-fresh-product' },
      description: { en: 'sample product object' },
      variant: [
        { id: 'masterVariant' },
        { id: 'variant-2' },
        { id: 'variant-3' },
      ],
    }

    test('spread product data for each variant if `fillAllRows`', () => {
      const expected = [
        {
          name: { en: 'my-fresh-product' },
          description: { en: 'sample product object' },
          variant: { id: 'masterVariant' },
        },
        {
          name: { en: 'my-fresh-product' },
          description: { en: 'sample product object' },
          variant: { id: 'variant-2' },
        },
        {
          name: { en: 'my-fresh-product' },
          description: { en: 'sample product object' },
          variant: { id: 'variant-3' },
        },
      ]
      const actual = ProductMapping._spreadProdOnVariants(sampleProduct, true)
      expect(actual).toEqual(expected)
    })

    test('spread product data for only one variant if no fillAllRows', () => {
      const expected = [
        {
          name: { en: 'my-fresh-product' },
          description: { en: 'sample product object' },
          variant: { id: 'masterVariant' },
        },
        {
          variant: { id: 'variant-2' },
        },
        {
          variant: { id: 'variant-3' },
        },
      ]
      const actual = ProductMapping._spreadProdOnVariants(sampleProduct, false)
      expect(actual).toEqual(expected)
    })
  })

  describe('::_mapProduct', () => {
    test('replaces resolved objects with strings', () => {
      const sample = {
        id: '12345ab-id',
        key: 'product-key',
        version: 1,
        productType: {
          name: 'resolved-product-type',
          attributes: [],
        },
        name: {
          en: 'Phone cover',
          de: 'Handyhülle',
        },
        categories: [
          { name: { en: 'res-cat-name-1' } },
          { name: { en: 'res-cat-name-2' } },
        ],
        categoryOrderHints: {
          'res-cat-name-1': '0.015',
          'res-cat-name-2': '0.987',
        },
        searchKeywords: {
          en: [
            {
              text: 'Multi tool',
            },
            {
              text: 'Swiss Army Knife',
              suggestTokenizer: {
                type: 'whitespace',
              },
            },
            {
              text: 'Schweizer Messer',
            },
          ],
        },
        slug: {
          en: 'michaelkors-phonecover',
          de: 'michaelkors-handyhuelle',
        },
        variant: {
          id: 1,
          sku: 'A0E200000001YKI',
        },
        state: {
          key: 'my-resolved-state',
        },
        hasStagedChanges: false,
        published: true,
        taxCategory: {
          name: 'resolved-tax-name',
        },
        createdAt: '2017-01-06T10:54:51.395Z',
        lastModifiedAt: '2017-01-06T10:54:51.395Z',
      }
      const expected = {
        id: '12345ab-id',
        key: 'product-key',
        productType: 'resolved-product-type',
        name: {
          en: 'Phone cover',
          de: 'Handyhülle',
        },
        categories: 'res-cat-name-1;res-cat-name-2',
        categoryOrderHints: 'res-cat-name-1:0.015;res-cat-name-2:0.987',
        searchKeywords: {
          en: 'Multi tool;Schweizer Messer;Swiss | Army | Knife',
        },
        slug: {
          en: 'michaelkors-phonecover',
          de: 'michaelkors-handyhuelle',
        },
        variant: {
          id: 1,
          sku: 'A0E200000001YKI',
        },
        state: 'my-resolved-state',
        hasStagedChanges: 'false',
        published: 'true',
        taxCategory: 'resolved-tax-name',
        createdAt: '2017-01-06T10:54:51.395Z',
        lastModifiedAt: '2017-01-06T10:54:51.395Z',
      }
      expect(productMapping._mapProduct(sample)).toEqual(expected)
    })

    test('add all attributes from productType to top level', () => {
      productMapping = new ProductMapping({
        languages: ['it', 'en', 'de'],
      })

      const sample = {
        id: '12345ab-id',
        name: {
          en: 'nameEn',
          de: 'nameDe',
        },
        key: 'product-key',
        productType: {
          name: 'resolved-product-type',
          attributes: [
            { name: 'article' },
            { name: 'designer' },
            { name: 'color' },
            {
              name: 'colorFreeDefinition',
              type: {
                name: 'ltext',
              },
            },
            {
              name: 'missingLtextValue',
              type: {
                name: 'ltext',
              },
            },
            { name: 'addedAttr' },
            { name: 'anotherAddedAttr' },
          ],
        },
        variant: {
          id: 1,
          sku: 'A0E200000001YKI',
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
        },
        state: {
          key: 'my-resolved-state',
        },
        hasStagedChanges: false,
      }
      const expected = {
        id: '12345ab-id',
        name: {
          en: 'nameEn',
          de: 'nameDe',
          it: '',
        },
        key: 'product-key',
        productType: 'resolved-product-type',
        variant: {
          id: 1,
          sku: 'A0E200000001YKI',
          attributes: {
            article: 'sample 089 WHT',
            designer: 'michaelkors',
            color: 'white',
            'color.de': 'weiss',
            'color.en': 'white',
            'color.it': 'blanco',
            'colorFreeDefinition.en': 'black-white',
            'colorFreeDefinition.de': 'schwarz-weiß',
            'colorFreeDefinition.it': '',
            'missingLtextValue.en': '',
            'missingLtextValue.de': '',
            'missingLtextValue.it': '',
            addedAttr: '',
            anotherAddedAttr: '',
          },
        },
        state: 'my-resolved-state',
        hasStagedChanges: 'false',
      }
      expect(productMapping._mapProduct(sample)).toEqual(expected)
    })

    test('handle conflicting productType names', () => {
      const sample = {
        id: '12345ab-id',
        key: 'product-key',
        productType: {
          name: 'resolved-product-type',
          attributes: [],
        },
        masterVariant: {
          id: 1,
          sku: 'A0E200000001YKI',
          images: [],
          attributes: [
            {
              name: 'productType',
              value: 'prodTypeattributeValue',
            },
            {
              name: 'normalAttribute',
              value: 'normalAttrValue',
            },
            {
              name: 'booleanAttribute',
              value: true,
            },
          ],
        },
        variants: [],
      }

      const [mappedVariant] = productMapping.run(sample)
      expect(mappedVariant.normalAttribute).toEqual('normalAttrValue')
      expect(mappedVariant.productType).toEqual('resolved-product-type')
      expect(mappedVariant['attribute.productType']).toEqual(
        'prodTypeattributeValue'
      )
      expect(mappedVariant).toMatchSnapshot('conflictingPropertyNames')
    })

    test('handle conflicting attribute names which are missing in main product info', () => {
      const sample = {
        id: '12345ab-id',
        key: 'product-key',
        // missing description
        productType: {
          name: 'resolved-product-type',
          attributes: [],
        },
        published: true,
        masterVariant: {
          id: 1,
          sku: 'A0E200000001YKI',
          images: [],
          attributes: [
            {
              name: 'description',
              value: {
                en: 'descAttrEn',
                de: 'descAttrDe',
              },
            },
            {
              name: 'id',
              value: 1,
            },
            {
              name: 'name',
              value: 'nameAttr',
            },
            {
              name: 'slug',
              value: 1234,
            },
            {
              // set of numbers
              name: 'categories',
              value: [1, 2, 3],
            },
            {
              name: 'published',
              value: false,
            },
            {
              name: 'booleanAttribute',
              value: false,
            },
          ],
        },
        variants: [],
      }

      const [mappedVariant] = productMapping.run(sample)
      expect(mappedVariant.booleanAttribute).toEqual('false')
      expect(mappedVariant.description).toEqual(undefined)
      expect(mappedVariant['attribute.description.en']).toEqual('descAttrEn')
      expect(mappedVariant['attribute.description.de']).toEqual('descAttrDe')
      expect(mappedVariant).toMatchSnapshot(
        'conflictingDescriptionAttributeName'
      )
    })

    test('converts variant image array to strings', () => {
      const sample = {
        id: '12345ab-id',
        key: 'product-key',
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
        },
        state: {
          key: 'my-resolved-state',
        },
        hasStagedChanges: false,
      }
      expect(productMapping._mapProduct(sample)).toMatchSnapshot()
    })
  })

  describe('::mapCategories', () => {
    test('resolves categories to string by name', () => {
      const sampleCat = [
        {
          name: {
            en: 'cat-in-en',
            de: 'cat-in-de',
          },
          externalId: 'cat-ext-id',
        },
        {
          name: {
            en: 'cat-foo-en',
            de: 'cat-foo-de',
          },
          externalId: 'cat-foo-id',
        },
      ]
      const expected = 'cat-in-en;cat-foo-en'
      const options = ['name', ';', 'en']
      expect(ProductMapping._mapCategories(sampleCat, ...options)).toBe(
        expected
      )
    })

    test('resolves categories to string by externalId', () => {
      const sampleCat = [
        {
          name: {
            en: 'cat-in-en',
            de: 'cat-in-de',
          },
          externalId: 'cat-ext-id',
        },
        {
          name: {
            en: 'cat-foo-en',
            de: 'cat-foo-de',
          },
          externalId: 'cat-foo-id',
        },
      ]
      const expected = 'cat-ext-id;cat-foo-id'
      const options = ['externalId', ';']
      expect(ProductMapping._mapCategories(sampleCat, ...options)).toBe(
        expected
      )
    })

    test('resolves categories to string by key', () => {
      const sampleCat = [
        {
          name: {
            en: 'cat-in-en',
            de: 'cat-in-de',
          },
          key: 'cat-key',
        },
        {
          name: {
            en: 'cat-foo-en',
            de: 'cat-foo-de',
          },
          key: 'cat-keysss',
        },
      ]
      const expected = 'cat-key;cat-keysss'
      const options = ['key', ';']
      expect(ProductMapping._mapCategories(sampleCat, ...options)).toBe(
        expected
      )
    })

    test('resolves categories to string by `namedPath`', () => {
      const sampleCat = [
        {
          name: {
            en: 'cat-in-en',
            de: 'cat-in-de',
          },
          parent: {
            name: {
              en: 'parent',
            },
            parent: {
              name: {
                en: 'grandparent',
              },
              parent: {
                name: {
                  en: 'greatgrandparent',
                },
              },
            },
          },
          key: 'cat-key',
        },
        {
          name: {
            en: 'cat-foo-en',
            de: 'cat-foo-de',
          },
          parent: {
            name: {
              en: 'another-parent',
            },
          },
          key: 'cat-keysss',
        },
      ]
      const options = ['namedPath', ';', 'en']
      const expected = oneLineTrim`
        greatgrandparent>grandparent>parent>cat-in-en
        ;another-parent>cat-foo-en`
      expect(ProductMapping._mapCategories(sampleCat, ...options)).toBe(
        expected
      )
    })
  })

  describe('::mapPriceToString', () => {
    test('map a simple price', () => {
      const samplePrice = {
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 1230,
          fractionDigits: 2,
        },
        country: 'US',
      }

      const expected = 'US-USD 1230'
      expect(ProductMapping._mapPriceToString(samplePrice)).toBe(expected)
    })

    test('map a price with a channel', () => {
      const samplePrice = {
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 1230,
          fractionDigits: 2,
        },
        country: 'US',
        channel: {
          typeId: 'channel',
          id: '60e97855-d60f-4808-8399-385d67f922e1',
          key: 'priceChannelKey',
        },
      }

      const expected = 'US-USD 1230#priceChannelKey'
      expect(ProductMapping._mapPriceToString(samplePrice)).toBe(expected)
    })
  
    test('map a price with a customer group name and percentage', () => {
      const samplePrice = {
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 1230,
          fractionDigits: 2,
        },
        country: 'US',
        discounted: {
          value: {
            type: 'centPrecision',
            currencyCode: 'EUR',
            centAmount: 4495,
            fractionDigits: 2,
          },
        },
        customerGroup: {
          id: '8882d61e-c4a1-4c63-8430-09ac21383f76',
          version: 1,
          createdAt: '2018-07-13T10:03:04.703Z',
          lastModifiedAt: '2018-07-13T10:03:04.703Z',
          name: 'b2b',
          key: 'b2b'
        }
      };

      const expected = 'US-USD 1230|4495 b2b'
      expect(ProductMapping._mapPriceToString(samplePrice)).toBe(expected)
    })

    test('map a price with a customer group name', () => {
      const samplePrice = {
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 1230,
          fractionDigits: 2,
        },
        country: 'US',
        customerGroup: {
          id: '8882d61e-c4a1-4c63-8430-09ac21383f76',
          version: 1,
          createdAt: '2018-07-13T10:03:04.703Z',
          lastModifiedAt: '2018-07-13T10:03:04.703Z',
          name: 'b2b',
          key: 'b2b'
        }
      };

      const expected = 'US-USD 1230 b2b'
      expect(ProductMapping._mapPriceToString(samplePrice)).toBe(expected)
    })

    test('map a price with a discount', () => {
      const samplePrice = {
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 1230,
          fractionDigits: 2,
        },
        country: 'US',
        discounted: {
          value: {
            type: 'centPrecision',
            currencyCode: 'EUR',
            centAmount: 4495,
            fractionDigits: 2,
          },
        },
      }

      const expected = 'US-USD 1230|4495'
      expect(ProductMapping._mapPriceToString(samplePrice)).toBe(expected)
    })

    test('map a price with valid period', () => {
      const samplePrice = {
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 1230,
          fractionDigits: 2,
        },
        country: 'US',
        validFrom: 'validFrom',
        validUntil: 'validUntil',
      }

      const expected = 'US-USD 1230$validFrom~validUntil'
      expect(ProductMapping._mapPriceToString(samplePrice)).toBe(expected)
    })
  })
})
