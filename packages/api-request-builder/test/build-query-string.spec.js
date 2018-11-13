import buildQueryString from '../src/build-query-string'

describe('buildQueryString', () => {
  test('should throw if no argument is passed', () => {
    expect(() => buildQueryString()).toThrow(
      /Missing options object to build query string/
    )
  })

  test('should build fully encoded query string', () => {
    const params = {
      expand: [
        encodeURIComponent('productType'),
        encodeURIComponent('categories[*]'),
      ],
      staged: false,
      priceCurrency: 'EUR',
      priceCountry: 'DE',
      pagination: {
        page: 3,
        perPage: 10,
        sort: [
          encodeURIComponent('name.en desc'),
          encodeURIComponent('createdAt asc'),
        ],
        withTotal: false,
      },
      query: {
        operator: 'or',
        where: [
          encodeURIComponent('name(en = "Foo")'),
          encodeURIComponent('name(en = "Bar") and categories(id = "123")'),
        ],
      },
      location: {
        country: 'DE',
        currency: 'EUR',
        state: 'Germany',
      },
      search: {
        facet: [
          encodeURIComponent('variants.attributes.foo:"bar")'),
          encodeURIComponent('variants.sku:"foo123"'),
        ],
        filter: [
          encodeURIComponent('variants.attributes.color.key:"red")'),
          encodeURIComponent('categories.id:"123"'),
        ],
        filterByQuery: [
          encodeURIComponent('variants.attributes.color.key:"red")'),
          encodeURIComponent('categories.id:"123"'),
        ],
        filterByFacets: [
          encodeURIComponent('variants.attributes.color.key:"red")'),
          encodeURIComponent('categories.id:"123"'),
        ],
        fuzzy: true,
        fuzzyLevel: 2,
        markMatchingVariants: true,
        text: { lang: 'en', value: 'Foo' },
      },
      searchKeywords: [{ lang: 'en', value: 'Foo' }],
    }
    /* eslint-disable max-len */
    const expectedQueryString =
      'staged=false&' +
      'priceCurrency=EUR&' +
      'priceCountry=DE&' +
      'expand=productType&' +
      `expand=${encodeURIComponent('categories[*]')}&` +
      `where=${encodeURIComponent(
        'name(en = "Foo") or name(en = "Bar") and categories(id = "123")'
      )}&` +
      'country=DE&currency=EUR&state=Germany&' +
      'limit=10&offset=20&' +
      `sort=${encodeURIComponent('name.en desc')}&` +
      `sort=${encodeURIComponent('createdAt asc')}&` +
      `withTotal=false&` +
      `text.en=${encodeURIComponent('Foo')}&` +
      'fuzzy=true&' +
      'fuzzyLevel=2&' +
      'markMatchingVariants=true&' +
      `facet=${encodeURIComponent('variants.attributes.foo:"bar")')}&` +
      `facet=${encodeURIComponent('variants.sku:"foo123"')}&` +
      `filter=${encodeURIComponent('variants.attributes.color.key:"red")')}&` +
      `filter=${encodeURIComponent('categories.id:"123"')}&` +
      `filter.query=${encodeURIComponent(
        'variants.attributes.color.key:"red")'
      )}&` +
      `filter.query=${encodeURIComponent('categories.id:"123"')}&` +
      `filter.facets=${encodeURIComponent(
        'variants.attributes.color.key:"red")'
      )}&` +
      `filter.facets=${encodeURIComponent('categories.id:"123"')}&` +
      `searchKeywords.en=${encodeURIComponent('Foo')}`
    /* eslint-enable max-len */

    expect(buildQueryString(params)).toEqual(expectedQueryString)
  })

  test('should build perPage with zero value', () => {
    const params = {
      pagination: {
        perPage: 0,
      },
    }
    const expectedQueryString = 'limit=0'
    expect(buildQueryString(params)).toEqual(expectedQueryString)
  })

  test('should disable markMatchingVariants by default', () => {
    const params = {
      search: {
        facet: [
          encodeURIComponent('variants.attributes.foo:"bar")'),
          encodeURIComponent('variants.sku:"foo123"'),
        ],
        filter: [
          encodeURIComponent('variants.attributes.color.key:"red")'),
          encodeURIComponent('categories.id:"123"'),
        ],
        filterByQuery: [
          encodeURIComponent('variants.attributes.color.key:"red")'),
          encodeURIComponent('categories.id:"123"'),
        ],
        filterByFacets: [
          encodeURIComponent('variants.attributes.color.key:"red")'),
          encodeURIComponent('categories.id:"123"'),
        ],
        fuzzy: true,
        fuzzyLevel: 2,
        markMatchingVariants: false,
        text: { lang: 'en', value: 'Foo' },
      },
    }
    /* eslint-disable max-len */
    const expectedQueryString =
      `text.en=${encodeURIComponent('Foo')}&` +
      'fuzzy=true&' +
      'fuzzyLevel=2&' +
      'markMatchingVariants=false&' +
      `facet=${encodeURIComponent('variants.attributes.foo:"bar")')}&` +
      `facet=${encodeURIComponent('variants.sku:"foo123"')}&` +
      `filter=${encodeURIComponent('variants.attributes.color.key:"red")')}&` +
      `filter=${encodeURIComponent('categories.id:"123"')}&` +
      `filter.query=${encodeURIComponent(
        'variants.attributes.color.key:"red")'
      )}&` +
      `filter.query=${encodeURIComponent('categories.id:"123"')}&` +
      `filter.facets=${encodeURIComponent(
        'variants.attributes.color.key:"red")'
      )}&` +
      `filter.facets=${encodeURIComponent('categories.id:"123"')}`
    /* eslint-enable max-len */

    expect(buildQueryString(params)).toEqual(expectedQueryString)
  })
})
