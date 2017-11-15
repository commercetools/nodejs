import * as queryRestrictResult from '../src/query-restrict-result'

describe('queryRestrictResult', () => {
  let service

  beforeEach(() => {
    service = { params: { expand: [] }, ...queryRestrictResult }
  })

  describe('onlyIds', () => {
    describe('when called with no value', () => {
      beforeEach(() => {
        service.onlyIds()
      })
      it('should set the onlyIds param to `true`', () => {
        expect(service.params.onlyIds).toBe(true)
      })
    })
  })
})
