import discountCodeGenerator from '../src/main'

describe('discountCodeGenerator', () => {
  const options = {
    quantity: 100,
    length: 15,
    prefix: 'CT',
  }

  const data = {
    name: {
      en: 'William',
    },
    description: {
      en: 'something good',
    },
    cartDiscounts: [],
    cartPredicate: 'expensive cart',
    isActive: true,
    maxApplications: 10,
    maxApplicationsPerCustomer: 2,
  }

  test('should throw if no options or options is not valid', () => {
    expect(() => discountCodeGenerator())
      .toThrow(/The generator requires valid parameters/)
    expect(() => discountCodeGenerator('foo'))
      .toThrow(/The generator requires valid parameters/)
  })

  test('should throw if no data object is passed', () => {
    expect(() => discountCodeGenerator(options))
      .toThrow(/The generator requires discount data/)
  })

  test('should throw if quantity is missing', () => {
    expect(() => discountCodeGenerator({ length: 23 }, data))
      .toThrow(/The generator requires valid parameters/)
  })

  test('should generate codes according to required specifications', () => {
    const codes = discountCodeGenerator(options, data)
    expect(Array.isArray(codes)).toBeTruthy()
    expect(codes.length).toBe(100)

    codes.forEach((codeObject) => {
      expect(codeObject).toMatchObject(data)
      expect(codeObject.code.length).toBe(15)
      expect(codeObject.code).toMatch(/^CT/)
    })
  })

  test('should generate codes with default length when not passed', () => {
    const codes = discountCodeGenerator({ quantity: 2 }, data)
    codes.forEach((codeObject) => {
      expect(codeObject).toMatchObject(data)
      expect(codeObject.code.length).toBe(11)
    })
  })
})
