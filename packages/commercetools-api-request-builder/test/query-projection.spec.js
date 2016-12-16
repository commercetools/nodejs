import * as queryProjection from '../src/query-projection'

describe('queryProjection', () => {
  let service

  beforeEach(() => {
    service = { params: {}, ...queryProjection }
  })

  it('should set the staged param', () => {
    service.staged()
    expect(service.params.staged).toBeTruthy()

    service.staged(false)
    expect(service.params.staged).toBeFalsy()

    service.staged(true)
    expect(service.params.staged).toBeTruthy()
  })
})
