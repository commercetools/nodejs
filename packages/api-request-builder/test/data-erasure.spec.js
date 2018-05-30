import withFullDataErasure from '../src/data-erasure'

describe('withFullDataErasure', () => {
  let service

  beforeEach(() => {
    service = { params: {}, withFullDataErasure }
  })

  test('should set the dataErasure option to true', () => {
    service.withFullDataErasure()
    expect(service.params.dataErasure).toMatchSnapshot()
  })
})
