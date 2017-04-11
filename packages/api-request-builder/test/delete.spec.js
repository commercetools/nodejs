import toDelete from '../src/delete'

describe('toDelete', () => {
  let service

  beforeEach(() => {
    service = { params: {}, toDelete }
  })

  it('should set the version number of an item', () => {
    service.toDelete(3)
    expect(service.params.version).toBe(3)
  })

  it('should throw if not passed any value', () => {
    expect(() => service.toDelete())
      .toThrow(/Required version to delete missing or not valid/)
  })

  it('should throw if not passed a number', () => {
    expect(() => service.toDelete('foo'))
      .toThrow(/Required version to delete missing or not valid/)
  })
})
