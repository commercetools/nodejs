import addSum from '../src/main'

describe('addSum', () => {
  it('should be a function', () => {
    expect(typeof addSum).toBe('function')
  })

  it('should return the sum of two numbers', () => {
    expect(addSum(2, 5)).toBe(7)
  })
})
