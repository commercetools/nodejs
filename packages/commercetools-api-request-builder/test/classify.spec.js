import classify from '../src/classify'

describe('classify', () => {
  it('should freeze non-function property and make it non-enumerable', () => {
    const composed = classify({
      foo: 'bar',
      bar: { a: 1, b: 2 },
      getFoo () { return this.foo },
      getBar () { return this.bar },
    })
    Object.keys(composed).forEach((key) => {
      expect(typeof composed[key]).toBe('function')
    })
    expect(Object.keys(composed)).toHaveLength(2)
    expect(Object.getOwnPropertyNames(composed)).toHaveLength(4)
  })
})
