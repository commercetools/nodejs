import { createRequestBuilder } from '../src'
import * as features from '../src/features'

describe('exports', () => {
  test('default', () => {
    expect(typeof createRequestBuilder).toBe('function')
  })

  test('features', () => {
    expect(Object.keys(features).sort()).toEqual(
      [
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
      ].sort()
    )
  })
})
