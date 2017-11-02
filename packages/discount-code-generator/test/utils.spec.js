import prepareInput from '../src/utils'

describe('prepareInput', () => {
  test('should properly cast object types', () => {
    const sample = {
      name: {
        de: 'Valerian',
      },
      description: {
        en: 'greatest promo',
      },
      cartPredicate: 'value more than 20',
      isActive: 'false',
      maxApplications: '10',
      maxApplicationsPerCustomer: '2',
    }

    const expected = {
      name: {
        de: 'Valerian',
      },
      description: {
        en: 'greatest promo',
      },
      cartPredicate: 'value more than 20',
      isActive: false,
      maxApplications: 10,
      maxApplicationsPerCustomer: 2,
    }

    const actual = prepareInput(sample)
    expect(actual).toEqual(expected)
  })

  test('should properly hadle `cartDiscounts`', () => {
    const sample = {
      cartDiscounts: 'id1;id2;id3',
      cartPredicate: 'value more than 20',
      isActive: 'false',
      maxApplications: '10',
      maxApplicationsPerCustomer: '2',
    }

    const expected = {
      cartDiscounts: [
        {
          typeId: 'cart-discount',
          id: 'id1',
        },
        {
          typeId: 'cart-discount',
          id: 'id2',
        },
        {
          typeId: 'cart-discount',
          id: 'id3',
        },
      ],
      cartPredicate: 'value more than 20',
      isActive: false,
      maxApplications: 10,
      maxApplicationsPerCustomer: 2,
    }

    const actual = prepareInput(sample, ';')
    expect(actual).toEqual(expected)
  })

  test('should not mutate object if no field to cast or mutate', () => {
    const newSample = {
      name: {
        de: 'Valerian',
      },
      description: {
        en: 'greatest promo',
      },
      cartPredicate: 'value more than 20',
    }
    const newExpected = {
      name: {
        de: 'Valerian',
      },
      description: {
        en: 'greatest promo',
      },
      cartPredicate: 'value more than 20',
    }

    const actual = prepareInput(newSample)
    expect(actual).toEqual(newExpected)
  })
})
