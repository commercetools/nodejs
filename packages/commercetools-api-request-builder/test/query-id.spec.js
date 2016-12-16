import * as queryId from '../src/query-id'

describe('queryId', () => {
  let service

  beforeEach(() => {
    service = { params: {}, ...queryId }
  })

  it('should set the id param', () => {
    service.byId('123')
    expect(service.params.id).toBe('123')
  })

  it('should throw if id is missing', () => {
    expect(() => service.byId()).toThrowError(
      /Required argument for `byId` is missing/,
    )
  })
})
