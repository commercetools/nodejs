import * as queryExpand from '../src/query-expand'

describe('queryExpand', () => {
  let service

  beforeEach(() => {
    service = { params: { expand: [] }, ...queryExpand }
  })

  it('should set the expand param', () => {
    service.expand('productType')
    expect(service.params.expand).toEqual([
      encodeURIComponent('productType'),
    ])
  })

  it('should throw if expansionPath is missing', () => {
    expect(() => service.expand()).toThrowError(
      /Required argument for `expand` is missing/,
    )
  })
})
