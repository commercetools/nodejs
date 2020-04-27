import parseHeaders from '../src/parse-headers'

describe('Parse headers', () => {
  test('return headers for polyfill (node-fetch)', () => {
    const spy = jest.fn()
    parseHeaders({ raw: spy })
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('return headers for polyfill (whatwg-fetch)', () => {
    const spy = jest
      .fn()
      .mockImplementation((cb) => cb(['application/json'], 'content-type'))
    expect(parseHeaders({ forEach: spy })).toEqual({
      'content-type': ['application/json'],
    })
  })

  test('patch fix for firefox', () => {
    expect(parseHeaders({})).toEqual({})
  })
})
