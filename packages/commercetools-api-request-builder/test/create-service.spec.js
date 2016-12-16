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
  ],
}

const expectedServiceProperties = [
  'where',
  'whereOperator',
  'sort',
  'page',
  'perPage',
  'byId',
  'expand',
  'text',
  'facet',
  'filter',
  'filterByQuery',
  'filterByFacets',
  'staged',
  'build',
]


describe('createService', () => {
  it('should create a fully service', () => {
    const service = createService(fakeService)

    expectedServiceProperties.forEach((key) => {
      it(`has property ${key}`, () => {
        expect(service[key]).toBeDefined()
      })
    })
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

  it('should throw if definition prop (features) is a non empty array', () => {
    expect(
      () => createService({ type: 'foo', endpoint: '/foo', features: 'wrong' }),
    ).toThrowError(
     /Definition requires `features` to be a non empty array/,
    )
    expect(
      () => createService({ type: 'foo', endpoint: '/foo', features: [] }),
    ).toThrowError(
     /Definition requires `features` to be a non empty array/,
    )
  })
})
