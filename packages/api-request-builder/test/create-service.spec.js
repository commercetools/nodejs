import createService from '../src/create-service'
import * as defaultFeatures from '../src/features'

const fakeService = {
  type: 'test',
  endpoint: '/test',
  features: [
    'query',
    'queryOne',
    'queryExpand',
    'queryLocation',
    'search',
    'projection',
    'suggest',
  ],
}

const expectedServiceProperties = [
  'where',
  'whereOperator',
  'sort',
  'page',
  'perPage',
  'byId',
  'byCustomerId',
  'byCartId',
  'byKey',
  'expand',
  'text',
  'facet',
  'filter',
  'filterByQuery',
  'filterByFacets',
  'staged',
  'searchKeywords',
  'build',
  'byCurrency',
  'byCountry',
  'byState',
]
const projectKey = 'my-project1'

describe('createService', () => {
  test('should create a full service', () => {
    const service = createService(fakeService, projectKey)
    expectedServiceProperties.forEach(key => {
      expect(service[key]).toBeDefined()
    })
  })

  test('should throw if project key is missing', () => {
    expect(() => createService(fakeService)).toThrow(
      /No project defined. Please enter a project key/
    )
  })

  test('should throw if definition is missing', () => {
    expect(() => createService()).toThrow(
      /Cannot create a service without its definition/
    )
  })

  test('should throw if definition prop (type) is missing', () => {
    expect(() => createService({ endpoint: '/foo' })).toThrow(
      /Definition is missing required parameter type/
    )
  })

  test('should throw if definition prop (endpoint) is missing', () => {
    expect(() => createService({ type: 'foo' })).toThrow(
      /Definition is missing required parameter endpoint/
    )
  })

  test('should throw if definition prop (features) is missing', () => {
    expect(() => createService({ type: 'foo', endpoint: '/foo' })).toThrow(
      /Definition is missing required parameter features/
    )
  })

  test('should throw if definition prop (features) is not an array', () => {
    expect(() =>
      createService({ type: 'foo', endpoint: '/foo', features: 'wrong' })
    ).toThrow(/Definition requires `features` to be a non empty array/)
  })
  test('should throw if definition prop (features) is an empty array', () => {
    expect(() =>
      createService({ type: 'foo', endpoint: '/foo', features: [] })
    ).toThrow(/Definition requires `features` to be a non empty array/)
  })

  describe('parse', () => {
    let service
    beforeEach(() => {
      const options = {
        type: 'foo',
        endpoint: '/foo',
        features: [
          defaultFeatures.query,
          defaultFeatures.queryOne,
          defaultFeatures.queryExpand,
          defaultFeatures.queryLocation,
          defaultFeatures.projection,
        ],
      }
      service = createService(options, projectKey)
    })

    describe('features of parsed object', () => {
      // query-expand
      test('should support single `expand`', () => {
        expect(service.parse({ expand: ['bar'] }).build()).toBe(
          '/my-project1/foo?expand=bar'
        )
      })
      test('should support mutliple `expand`s', () => {
        expect(service.parse({ expand: ['bar', 'baz'] }).build()).toBe(
          '/my-project1/foo?expand=bar&expand=baz'
        )
      })

      // query-id
      test('should support `id`', () => {
        expect(service.parse({ id: 'bar' }).build()).toBe(
          '/my-project1/foo/bar'
        )
      })
      test('should support `key`', () => {
        expect(service.parse({ key: 'bar' }).build()).toBe(
          '/my-project1/foo/key=bar'
        )
      })
      test('should support `customerId`', () => {
        expect(service.parse({ customerId: 'bar' }).build()).toBe(
          '/my-project1/foo?customerId=bar'
        )
      })

      // query-location
      test('should support `country`', () => {
        expect(service.parse({ country: 'DE' }).build()).toBe(
          '/my-project1/foo?country=DE'
        )
      })
      test('should support `currency`', () => {
        expect(service.parse({ country: 'DE', currency: 'EUR' }).build()).toBe(
          '/my-project1/foo?country=DE&currency=EUR'
        )
      })
      test('should support `state`', () => {
        expect(service.parse({ country: 'DE', state: 'Germany' }).build()).toBe(
          '/my-project1/foo?country=DE&state=Germany'
        )
      })

      // query-page
      test('should support single `sort`', () => {
        expect(
          service.parse({ sort: [{ by: 'foo', direction: 'asc' }] }).build()
        ).toBe('/my-project1/foo?sort=foo%20asc')
      })
      test('should support multiple `sort`', () => {
        expect(
          service
            .parse({
              sort: [
                { by: 'foo', direction: 'asc' },
                { by: 'bar', direction: 'desc' },
              ],
            })
            .build()
        ).toBe('/my-project1/foo?sort=foo%20asc&sort=bar%20desc')
      })
    })
    test('should support `page`', () => {
      expect(service.parse({ page: 1 }).build()).toBe(
        '/my-project1/foo?offset=0'
      )
    })
    test('should support `perPage`', () => {
      expect(service.parse({ perPage: 10 }).build()).toBe(
        '/my-project1/foo?limit=10'
      )
    })

    // query-projection
    test('should return same url for every build', () => {
      expect(service.build()).toBe('/my-project1/foo')
      expect(service.build()).toBe('/my-project1/foo')
      expect(service.build()).toBe('/my-project1/foo')
      expect(service.build()).toBe('/my-project1/foo')
      expect(service.build()).toBe('/my-project1/foo')
    })

    test('should support `staged` being  `true`', () => {
      expect(service.parse({ staged: true }).build()).toBe(
        '/my-project1/foo?staged=true'
      )
    })
    test('should support `staged` being `false`', () => {
      expect(service.parse({ staged: false }).build()).toBe(
        '/my-project1/foo?staged=false'
      )
    })
    test('should support `priceCurrency`', () => {
      expect(service.parse({ priceCurrency: 'en' }).build()).toBe(
        '/my-project1/foo?priceCurrency=en'
      )
    })
    test('should support `priceCountry`', () => {
      expect(service.parse({ priceCountry: 'foo' }).build()).toBe(
        '/my-project1/foo?priceCountry=foo'
      )
    })
    test('should support `priceCustomerGroup`', () => {
      expect(service.parse({ priceCustomerGroup: 'foo' }).build()).toBe(
        '/my-project1/foo?priceCustomerGroup=foo'
      )
    })
    test('should support `priceChannel`', () => {
      expect(service.parse({ priceChannel: 'foo' }).build()).toBe(
        '/my-project1/foo?priceChannel=foo'
      )
    })

    // query-search
    describe('with feature "query-search"', () => {
      beforeEach(() => {
        const options = {
          type: 'foo',
          endpoint: '/foo',
          features: [defaultFeatures.search],
        }
        service = createService(options, projectKey)
      })
      test('should support `text`', () => {
        expect(
          service.parse({ text: { value: 'foo', language: 'bar' } }).build()
        ).toBe('/my-project1/foo?text.bar=foo&markMatchingVariants=false')
      })
      test('should support `fuzzy` being `true`', () => {
        expect(service.parse({ fuzzy: true }).build()).toBe(
          '/my-project1/foo?fuzzy=true&markMatchingVariants=false'
        )
      })
      test('should support `fuzzy` being `false`', () => {
        expect(service.parse({ fuzzy: false }).build()).toBe(
          '/my-project1/foo?markMatchingVariants=false'
        )
      })
      test('should support `fuzzyLevel`', () => {
        expect(service.parse({ fuzzyLevel: 1 }).build()).toBe(
          '/my-project1/foo?fuzzyLevel=1&markMatchingVariants=false'
        )
      })
      test('should support `markMatchingVariants` being `true`', () => {
        expect(service.parse({ markMatchingVariants: true }).build()).toBe(
          '/my-project1/foo?markMatchingVariants=true'
        )
      })
      test('should support `markMatchingVariants` being `false`', () => {
        expect(service.parse({ markMatchingVariants: false }).build()).toBe(
          '/my-project1/foo?markMatchingVariants=false'
        )
      })
      test('should support a single `facet`', () => {
        expect(service.parse({ facet: ['foo'] }).build()).toBe(
          '/my-project1/foo?markMatchingVariants=false&facet=foo'
        )
      })
      test('should support multiple `facet`s', () => {
        expect(service.parse({ facet: ['foo', 'bar'] }).build()).toBe(
          '/my-project1/foo?markMatchingVariants=false&facet=foo&facet=bar'
        )
      })
      test('should support a single `filter`', () => {
        expect(service.parse({ filter: ['foo'] }).build()).toBe(
          '/my-project1/foo?markMatchingVariants=false&filter=foo'
        )
      })
      test('should support multiple `filter`s', () => {
        expect(service.parse({ filter: ['foo', 'bar'] }).build()).toBe(
          '/my-project1/foo' +
            '?markMatchingVariants=false&filter=foo&filter=bar'
        )
      })
      test('should support a single `filterByQuery`', () => {
        expect(service.parse({ filterByQuery: ['foo'] }).build()).toBe(
          '/my-project1/foo?markMatchingVariants=false&filter.query=foo'
        )
      })
      test('should support multiple `filterByQuery`s', () => {
        expect(service.parse({ filterByQuery: ['foo', 'bar'] }).build()).toBe(
          '/my-project1/foo' +
            '?markMatchingVariants=false' +
            '&filter.query=foo&filter.query=bar'
        )
      })
      test('should support a single `filterByFacets`', () => {
        expect(service.parse({ filterByFacets: ['foo'] }).build()).toBe(
          '/my-project1/foo?markMatchingVariants=false&filter.facets=foo'
        )
      })
      test('should support multiple `filterByFacets`s', () => {
        expect(service.parse({ filterByFacets: ['foo', 'bar'] }).build()).toBe(
          '/my-project1/foo' +
            '?markMatchingVariants=false' +
            '&filter.facets=foo&filter.facets=bar'
        )
      })
    })

    describe('with feature "query-suggest"', () => {
      beforeEach(() => {
        const options = {
          type: 'foo',
          endpoint: '/foo',
          features: [defaultFeatures.suggest],
        }
        service = createService(options, projectKey)
      })
      test('should support a single `searchKeywords`', () => {
        expect(
          service
            .parse({ searchKeywords: [{ value: 'foo', language: 'en' }] })
            .build()
        ).toBe('/my-project1/foo?searchKeywords.en=foo')
      })
      test('should support multiple `searchKeywords`s', () => {
        expect(
          service
            .parse({
              searchKeywords: [
                { value: 'foo', language: 'en' },
                { value: 'bar', language: 'de' },
              ],
            })
            .build()
        ).toBe('/my-project1/foo?searchKeywords.en=foo&searchKeywords.de=bar')
      })
    })

    test('should support a single `where` predicate', () => {
      expect(service.parse({ where: ['foo'] }).build()).toBe(
        '/my-project1/foo?where=foo'
      )
    })
    test('should support multiple `where` predicates', () => {
      expect(service.parse({ where: ['foo', 'bar'] }).build()).toBe(
        '/my-project1/foo?where=foo%20and%20bar'
      )
    })

    test('should support `version`', () => {
      expect(service.parse({ version: 2 }).build()).toBe(
        '/my-project1/foo?version=2'
      )
    })

    test('should support `dataErasure`', () => {
      expect(service.parse({ dataErasure: true }).build()).toBe(
        '/my-project1/foo?dataErasure=true'
      )
    })

    test('should throw on unknown keys', () => {
      expect(() => service.parse({ foo: 'bar' })).toThrow('Unknown key "foo"')
    })
  })

  describe('build', () => {
    let service
    beforeEach(() => {
      const options = {
        type: 'foo',
        endpoint: '/foo',
        features: ['queryOne', 'queryExpand'],
      }
      service = createService(options, projectKey)
    })

    describe('with additional services', () => {
      // let service
      beforeEach(() => {
        service = createService(
          {
            type: 'test',
            endpoint: '/test',
            features: ['queryOne', 'queryExpand'],
          },
          projectKey
        )
      })
      test('should mix customerId and queryParams', () => {
        expect(
          service
            .byCustomerId('foo')
            .expand('baz')
            .build()
        ).toBe('/my-project1/test?customerId=foo&expand=baz')
      })

      test('should mix customerId and version', () => {
        expect(
          service
            .byCustomerId('foo')
            .withVersion(3)
            .build()
        ).toBe('/my-project1/test?customerId=foo&version=3')
      })

      test('should mix customerId and dataErasure', () => {
        expect(
          service
            .byCustomerId('foo')
            .withFullDataErasure()
            .build()
        ).toBe('/my-project1/test?customerId=foo&dataErasure=true')
      })

      test('should mix cartId and queryParams', () => {
        expect(
          service
            .byCartId('foo')
            .expand('baz')
            .build()
        ).toBe('/my-project1/test?cartId=foo&expand=baz')
      })

      test('should mix cartId and version', () => {
        expect(
          service
            .byCartId('foo')
            .withVersion(3)
            .build()
        ).toBe('/my-project1/test?cartId=foo&version=3')
      })

      test('should mix cartId, version and dataErasure', () => {
        expect(
          service
            .byCartId('foo')
            .withVersion(3)
            .withFullDataErasure()
            .build()
        ).toBe('/my-project1/test?cartId=foo&version=3&dataErasure=true')
      })

      test('should mix queryParams and version', () => {
        expect(
          service
            .withVersion(3)
            .expand('baz')
            .build()
        ).toBe('/my-project1/test?expand=baz&version=3')
      })
    })

    test('include projectkey in uri by default', () => {
      expect(service.build()).toBe('/my-project1/foo')
    })
    test('exclude projectkey from uri using flag', () => {
      const excludeProjectKey = { withProjectKey: false }
      expect(service.build(excludeProjectKey)).toBe('/foo')
    })
    test('only base endpoint', () => {
      expect(service.build()).toBe('/my-project1/foo')
    })
    test('endpoint with id', () => {
      expect(service.byId('123').build()).toBe('/my-project1/foo/123')
    })
    test('endpoint with customer id', () => {
      expect(service.byCustomerId('cust123').build()).toBe(
        '/my-project1/foo?customerId=cust123'
      )
    })
    test('endpoint with cart id', () => {
      expect(service.byCartId('cart123').build()).toBe(
        '/my-project1/foo?cartId=cart123'
      )
    })
    test('endpoint with key', () => {
      expect(service.byKey('bar').build()).toBe('/my-project1/foo/key=bar')
    })
    test('endpoint with query params', () => {
      expect(service.expand('channel').build()).toBe(
        '/my-project1/foo?expand=channel'
      )
    })
    test('include version in uri', () => {
      expect(service.withVersion(2).build()).toBe('/my-project1/foo?version=2')
    })
    test('full endpoint', () => {
      expect(
        service
          .byId('123')
          .expand('channel')
          .build()
      ).toBe('/my-project1/foo/123?expand=channel')
    })
  })
})
