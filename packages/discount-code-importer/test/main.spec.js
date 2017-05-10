import findSum from '../src/main'

describe('findSum', () => {
  test('main module is a function', () => {
    expect(typeof findSum).toBe('function')
  })

  test('findSum returns the sum of two numbers', () => {
    expect(findSum(2, 3)).toBe(5)
  })
})
