import createService from '../src/create-service'

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
    expectedServiceProperties.forEach((key) => {
      expect(service[key]).toBeDefined()
    })
  })

  it('should throw if project key is missing', () => {
    expect(() => createService(fakeService)).toThrowError(
      /No project defined. Please enter a project key/,
    )
  })

  it('should throw if definition is missing', () => {
    expect(() => createService()).toThrowError(
      /Cannot create a service without its definition/,
    )
  })

  it('should throw if definition prop (type) is missing', () => {
    expect(() => createService({ endpoint: '/foo' })).toThrowError(
      /Definition is missing required parameter type/,
    )
  })

  it('should throw if definition prop (endpoint) is missing', () => {
    expect(() => createService({ type: 'foo' })).toThrowError(
      /Definition is missing required parameter endpoint/,
    )
  })

  it('should throw if definition prop (features) is missing', () => {
    expect(() => createService({ type: 'foo', endpoint: '/foo' })).toThrowError(
      /Definition is missing required parameter features/,
    )
  })

  it('should throw if definition prop (features) is not an array', () => {
    expect(
      () => createService({ type: 'foo', endpoint: '/foo', features: 'wrong' }),
    ).toThrowError(
      /Definition requires `features` to be a non empty array/,
    )
  })
  it('should throw if definition prop (features) is an empty array', () => {
    expect(
      () => createService({ type: 'foo', endpoint: '/foo', features: [] }),
    ).toThrowError(
      /Definition requires `features` to be a non empty array/,
    )
  })

  describe('build', () => {
    const options = {
      type: 'foo',
      endpoint: '/foo',
      features: ['queryOne', 'queryExpand'],
    }

    it('include projectkey in uri by default', () => {
      expect(createService(options, projectKey)
        .build())
        .toBe('/my-project1/foo')
    })
    it('exclude projectkey from uri using flag', () => {
      const excludeProjectKey = { withProjectKey: false }
      expect(createService(options, projectKey)
        .build(excludeProjectKey))
        .toBe('/foo')
    })
    it('only base endpoint', () => {
      expect(createService(options, projectKey)
        .build())
        .toBe('/my-project1/foo')
    })
    it('endpoint with id', () => {
      expect(createService(options, projectKey)
        .byId('123').build())
        .toBe('/my-project1/foo/123')
    })
    it('endpoint with key', () => {
      expect(createService(options, projectKey)
        .byKey('bar').build())
        .toBe('/my-project1/foo/key=bar')
    })
    it('endpoint with query params', () => {
      expect(createService(options, projectKey)
        .expand('channel').build())
        .toBe('/my-project1/foo?expand=channel')
    })
    it('include version in uri', () => {
      expect(createService(options, projectKey)
        .withVersion(2).build())
        .toBe('/my-project1/foo?version=2')
    })
    it('full endpoint', () => {
      expect(
        createService(options, projectKey)
          .byId('123')
          .expand('channel')
          .build(),
      ).toBe('/my-project1/foo/123?expand=channel')
    })
  })
})
