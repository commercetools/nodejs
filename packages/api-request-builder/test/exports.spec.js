import { createRequestBuilder, features } from '../src'

describe('exports', () => {
  test('default', () => {
    expect(typeof createRequestBuilder).toBe('function')
  })

  test('features', () => {
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
