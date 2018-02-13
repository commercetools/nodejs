import { createRequestBuilder, features } from '../src'

describe('exports', () => {
  it('default', () => {
    expect(typeof createRequestBuilder).toBe('function')
  })

  it('features', () => {
    expect(Object.keys(features)).toEqual([
      'create',
      'update',
      'del',
      'query',
      'queryOne',
      'queryExpand',
      'queryLocation',
      'search',
      'projection',
      'suggest',
    ])
  })
})
