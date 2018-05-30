import fullDataErasure from '../src/data-erasure'

describe('fullDataErasure', () => {
  let service

  beforeEach(() => {
    service = { params: {}, fullDataErasure }
  })

  test('should set the version number of an item', () => {
    service.fullDataErasure(true)
    expect(service.params.dataErasure).toBe(true)
  })

  test('should throw if not passed any value', () => {
    expect(() => service.fullDataErasure()).toThrowErrorMatchingSnapshot()
  })

  test('should throw if not passed a number', () => {
    expect(() => service.fullDataErasure('foo')).toThrowErrorMatchingSnapshot()
  })
})
