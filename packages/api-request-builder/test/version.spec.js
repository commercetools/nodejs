import withVersion from '../src/version'

describe('withVersion', () => {
  let service

  beforeEach(() => {
    service = { params: {}, withVersion }
  })

  test('should set the version number of an item', () => {
    service.withVersion(3)
    expect(service.params.version).toBe(3)
  })

  test('should throw if not passed any value', () => {
    expect(() => service.withVersion()).toThrow(
      /A resource version is missing or invalid/
    )
  })

  test('should throw if not passed a number', () => {
    expect(() => service.withVersion('foo')).toThrow(
      /A resource version is missing or invalid/
    )
  })
})
