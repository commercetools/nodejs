import addTwoNumbers from '../src/main'


describe('findSum', () => {
  it('should be a function', () => {
    expect(typeof addTwoNumbers).toBe('function')
  })

  it('should return the sum of two numbers', () => {
    expect(addTwoNumbers(3, 5)).toBe(8)
  })
})
