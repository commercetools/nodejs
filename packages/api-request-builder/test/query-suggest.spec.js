import * as querySuggest from '../src/query-suggest'

describe('querySuggest', () => {
  let service

  beforeEach(() => {
    service = { params: { searchKeywords: [] }, ...querySuggest }
  })

  it('should set the searchKeywords param', () => {
    service.searchKeywords('Foo Bar', 'en')
    service.searchKeywords('Wir laufen', 'de')
    expect(service.params.searchKeywords).toEqual([{
      lang: 'en',
      value: encodeURIComponent('Foo Bar'),
    }, {
      lang: 'de',
      value: encodeURIComponent('Wir laufen'),
    }])
  })

  it('should throw if searchKeywords params are missing', () => {
    expect(() => service.searchKeywords()).toThrowError(
      /Required arguments for `searchKeywords` are missing/,
    )
    expect(() => service.searchKeywords('Foo Bar')).toThrowError(
      /Required arguments for `searchKeywords` are missing/,
    )
  })
})
