import findSum from '../src/main'

describe('findSum', () => {
  it('should be a function', () => {
    expect(typeof findSum).toBe('function')
  })

  it('should return the sum of two numbers', () => {
    expect(findSum(3, 5)).toBe(8)
  })
})
