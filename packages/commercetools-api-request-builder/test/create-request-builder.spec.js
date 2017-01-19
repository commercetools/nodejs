import {
  createRequestBuilder,
  features,
} from '../src'

// order matters!
const expectedServiceKeys = [
  'categories',
  'channels',
  'customerGroups',
  'productProjections',
  'productProjectionsSearch',
  'products',
  'productTypes',
  'taxCategories',
  'types',
]


describe('createRequestBuilder', () => {
  it('export initialized services', () => {
    const requestBuilder = createRequestBuilder()
    expect(Object.keys(requestBuilder)).toEqual(expectedServiceKeys)
  })

  it('export initialized services with custom services', () => {
    const requestBuilder = createRequestBuilder({
      foo: {
        type: 'foo',
        endpoint: '/foo',
        features: [
          features.query,
        ],
      },
    })
    expect(Object.keys(requestBuilder)).toEqual(
      expectedServiceKeys.concat('foo'),
    )
  })
})
