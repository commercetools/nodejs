import add from '../src/main'

describe('::add', () => {
  test('should add two numbers', () => {
    expect(add(3, 5)).toBe(8)
  })
})
