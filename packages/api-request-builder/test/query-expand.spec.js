import * as queryExpand from '../src/query-expand'

describe('queryExpand', () => {
  let service

  beforeEach(() => {
    service = { params: { expand: [] }, ...queryExpand }
  })

  test('should set the expand param', () => {
    service.expand('productType')
    expect(service.params.expand).toEqual([encodeURIComponent('productType')])
  })

  test('should throw if expansionPath is missing', () => {
    expect(() => service.expand()).toThrow(
      /Required argument for `expand` is missing/
    )
  })
})
