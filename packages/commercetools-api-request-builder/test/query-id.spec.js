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

  it('should set the key param', () => {
    service.byKey('bar')
    expect(service.params.key).toBe('bar')
  })

  it('should throw if key is missing', () => {
    expect(() => service.byKey()).toThrowError(
      /Required argument for `byKey` is missing/,
    )
  })

  it('throw if byId is used after byKey', () => {
    expect(() => service.byKey('bar').byId('123'))
      .toThrowError(
        'A key for this resource has already been set. ' +
        'You cannot use both `byKey` and `byId`.',
      )
  })

  it('throw if byKey is used after byId', () => {
    expect(() => service.byId('123').byKey('bar'))
      .toThrowError(
        'An ID for this resource has already been set. ' +
        'You cannot use both `byId` and `byKey`.',
      )
  })
})
