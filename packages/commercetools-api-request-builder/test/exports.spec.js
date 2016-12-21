import {
  createRequestBuilder,
  features,
} from '../src'

describe('exports', () => {
  it('default', () => {
    expect(typeof createRequestBuilder).toBe('function')
  })

  it('features', () => {
    expect(Object.keys(features)).toEqual([
      'query',
      'queryOne',
      'queryExpand',
      'queryString',
      'search',
      'projection',
    ])
  })
})
