import createService from '../src/create-service'
import * as defaultFeatures from '../src/features'

const fakeService = {
  type: 'test',
  endpoint: '/test',
  features: [
    'query',
    'queryOne',
    'queryExpand',
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
]
const projectKey = 'my-project1'

describe('createService', () => {
  it('should create a full service', () => {
    const service = createService(fakeService, projectKey)
    expectedServiceProperties.forEach(key => {
      expect(service[key]).toBeDefined()
    })
  })

  it('should throw if project key is missing', () => {
    expect(() => createService(fakeService)).toThrowError(
      /No project defined. Please enter a project key/
    )
  })

  it('should throw if definition is missing', () => {
    expect(() => createService()).toThrowError(
      /Cannot create a service without its definition/
    )
  })

  it('should throw if definition prop (type) is missing', () => {
    expect(() => createService({ endpoint: '/foo' })).toThrowError(
      /Definition is missing required parameter type/
    )
  })

  it('should throw if definition prop (endpoint) is missing', () => {
    expect(() => createService({ type: 'foo' })).toThrowError(
      /Definition is missing required parameter endpoint/
    )
  })

  it('should throw if definition prop (features) is missing', () => {
    expect(() => createService({ type: 'foo', endpoint: '/foo' })).toThrowError(
      /Definition is missing required parameter features/
    )
  })

  it('should throw if definition prop (features) is not an array', () => {
    expect(() =>
      createService({ type: 'foo', endpoint: '/foo', features: 'wrong' })
    ).toThrowError(/Definition requires `features` to be a non empty array/)
  })
  it('should throw if definition prop (features) is an empty array', () => {
    expect(() =>
      createService({ type: 'foo', endpoint: '/foo', features: [] })
    ).toThrowError(/Definition requires `features` to be a non empty array/)
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
          defaultFeatures.projection,
        ],
      }
      service = createService(options, projectKey)
    })

    describe('features of parsed object', () => {
      // query-expand
      it('should support single `expand`', () => {
        expect(service.parse({ expand: ['bar'] }).build()).toBe(
          '/my-project1/foo?expand=bar'
        )
      })
      it('should support mutliple `expand`s', () => {
        expect(service.parse({ expand: ['bar', 'baz'] }).build()).toBe(
          '/my-project1/foo?expand=bar&expand=baz'
        )
      })

      // query-id
      it('should support `id`', () => {
        expect(service.parse({ id: 'bar' }).build()).toBe(
          '/my-project1/foo/bar'
        )
      })
      it('should support `key`', () => {
        expect(service.parse({ key: 'bar' }).build()).toBe(
          '/my-project1/foo/key=bar'
        )
      })
      it('should support `customerId`', () => {
        expect(service.parse({ customerId: 'bar' }).build()).toBe(
          '/my-project1/foo/?customerId=bar'
        )
      })

      // query-page
      it('should support single `sort`', () => {
        expect(
          service.parse({ sort: [{ by: 'foo', direction: 'asc' }] }).build()
        ).toBe('/my-project1/foo?sort=foo%20asc')
      })
      it('should support multiple `sort`', () => {
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
    it('should support `page`', () => {
      expect(service.parse({ page: 1 }).build()).toBe(
        '/my-project1/foo?offset=0'
      )
    })
    it('should support `perPage`', () => {
      expect(service.parse({ perPage: 10 }).build()).toBe(
        '/my-project1/foo?limit=10'
      )
    })

    // query-projection
    it('should support `staged` being  `true`', () => {
      expect(service.parse({ staged: true }).build()).toBe(
        '/my-project1/foo?staged=true'
      )
    })
    it('should support `staged` being `false`', () => {
      expect(service.parse({ staged: false }).build()).toBe(
        '/my-project1/foo?staged=false'
      )
    })
    it('should support `priceCurrency`', () => {
      expect(service.parse({ priceCurrency: 'en' }).build()).toBe(
        '/my-project1/foo?priceCurrency=en'
      )
    })
    it('should support `priceCountry`', () => {
      expect(service.parse({ priceCountry: 'foo' }).build()).toBe(
        '/my-project1/foo?priceCountry=foo'
      )
    })
    it('should support `priceCustomerGroup`', () => {
      expect(service.parse({ priceCustomerGroup: 'foo' }).build()).toBe(
        '/my-project1/foo?priceCustomerGroup=foo'
      )
    })
    it('should support `priceChannel`', () => {
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
      it('should support `text`', () => {
        expect(
          service.parse({ text: { value: 'foo', language: 'bar' } }).build()
        ).toBe(
          '/my-project1/foo' +
            '?staged=true&text.bar=foo&markMatchingVariants=false'
        )
      })
      it('should support `fuzzy` being `true`', () => {
        expect(service.parse({ fuzzy: true }).build()).toBe(
          '/my-project1/foo?staged=true&fuzzy=true&markMatchingVariants=false'
        )
      })
      it('should support `fuzzy` being `false`', () => {
        expect(service.parse({ fuzzy: false }).build()).toBe(
          '/my-project1/foo?staged=true&markMatchingVariants=false'
        )
      })
      it('should support `fuzzyLevel`', () => {
        expect(service.parse({ fuzzyLevel: 1 }).build()).toBe(
          '/my-project1/foo' +
            '?staged=true&fuzzyLevel=1&markMatchingVariants=false'
        )
      })
      it('should support `markMatchingVariants` being `true`', () => {
        expect(service.parse({ markMatchingVariants: true }).build()).toBe(
          '/my-project1/foo?staged=true&markMatchingVariants=true'
        )
      })
      it('should support `markMatchingVariants` being `false`', () => {
        expect(service.parse({ markMatchingVariants: false }).build()).toBe(
          '/my-project1/foo?staged=true&markMatchingVariants=false'
        )
      })
      it('should support a single `facet`', () => {
        expect(service.parse({ facet: ['foo'] }).build()).toBe(
          '/my-project1/foo?staged=true&markMatchingVariants=false&facet=foo'
        )
      })
      it('should support multiple `facet`s', () => {
        expect(service.parse({ facet: ['foo', 'bar'] }).build()).toBe(
          '/my-project1/foo' +
            '?staged=true&markMatchingVariants=false&facet=foo&facet=bar'
        )
      })
      it('should support a single `filter`', () => {
        expect(service.parse({ filter: ['foo'] }).build()).toBe(
          '/my-project1/foo?staged=true&markMatchingVariants=false&filter=foo'
        )
      })
      it('should support multiple `filter`s', () => {
        expect(service.parse({ filter: ['foo', 'bar'] }).build()).toBe(
          '/my-project1/foo' +
            '?staged=true&markMatchingVariants=false&filter=foo&filter=bar'
        )
      })
      it('should support a single `filterByQuery`', () => {
        expect(service.parse({ filterByQuery: ['foo'] }).build()).toBe(
          '/my-project1/foo' +
            '?staged=true&markMatchingVariants=false&filter.query=foo'
        )
      })
      it('should support multiple `filterByQuery`s', () => {
        expect(service.parse({ filterByQuery: ['foo', 'bar'] }).build()).toBe(
          '/my-project1/foo' +
            '?staged=true&markMatchingVariants=false' +
            '&filter.query=foo&filter.query=bar'
        )
      })
      it('should support a single `filterByFacets`', () => {
        expect(service.parse({ filterByFacets: ['foo'] }).build()).toBe(
          '/my-project1/foo' +
            '?staged=true&markMatchingVariants=false&filter.facets=foo'
        )
      })
      it('should support multiple `filterByFacets`s', () => {
        expect(service.parse({ filterByFacets: ['foo', 'bar'] }).build()).toBe(
          '/my-project1/foo' +
            '?staged=true&markMatchingVariants=false' +
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
      it('should support a single `searchKeywords`', () => {
        expect(
          service
            .parse({ searchKeywords: [{ value: 'foo', language: 'en' }] })
            .build()
        ).toBe('/my-project1/foo?searchKeywords.en=foo')
      })
      it('should support multiple `searchKeywords`s', () => {
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

    it('should support a single `where` predicate', () => {
      expect(service.parse({ where: ['foo'] }).build()).toBe(
        '/my-project1/foo?where=foo'
      )
    })
    it('should support multiple `where` predicates', () => {
      expect(service.parse({ where: ['foo', 'bar'] }).build()).toBe(
        '/my-project1/foo?where=foo%20and%20bar'
      )
    })

    it('should support `version`', () => {
      expect(service.parse({ version: 2 }).build()).toBe(
        '/my-project1/foo?version=2'
      )
    })

    it('should throw on unknown keys', () => {
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
      let service
      beforeEach(() => {
        service = createService({
          type: 'test',
          endpoint: '/test',
          features: ['queryOne', 'queryExpand'],
        }, projectKey)
      })
      it('should mix customerId and queryParams', () => {
        expect(service.byCustomerId('foo').expand('baz').build())
        .toBe('/my-project1/test?customerId=foo&expand=baz')
      })

      it('should mix customerId and version', () => {
        expect(service.byCustomerId('foo').withVersion(3).build())
        .toBe('/my-project1/test?customerId=foo&version=3')
      })

      it('should mix queryParams and version', () => {
        expect(service.withVersion(3).expand('baz').build())
        .toBe('/my-project1/test?expand=baz&version=3')
      })
    })

    it('include projectkey in uri by default', () => {
      expect(service.build()).toBe('/my-project1/foo')
    })
    it('exclude projectkey from uri using flag', () => {
      const excludeProjectKey = { withProjectKey: false }
      expect(service.build(excludeProjectKey)).toBe('/foo')
    })
    it('only base endpoint', () => {
      expect(service.build()).toBe('/my-project1/foo')
    })
    it('endpoint with id', () => {
      expect(service.byId('123').build()).toBe('/my-project1/foo/123')
    })
    it('endpoint with customer id', () => {
      expect(createService(options, projectKey)
        .byCustomerId('cust123').build())
        .toBe('/my-project1/foo?customerId=cust123')
    })
    it('endpoint with key', () => {
      expect(service.byKey('bar').build()).toBe('/my-project1/foo/key=bar')
    })
    it('endpoint with query params', () => {
      expect(service.expand('channel').build()).toBe(
        '/my-project1/foo?expand=channel'
      )
    })
    it('include version in uri', () => {
      expect(service.withVersion(2).build()).toBe('/my-project1/foo?version=2')
    })
    it('full endpoint', () => {
      expect(
        service
          .byId('123')
          .expand('channel')
          .build()
      ).toBe('/my-project1/foo/123?expand=channel')
    })
  })
})
