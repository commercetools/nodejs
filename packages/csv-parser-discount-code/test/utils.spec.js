import castTypes from '../src/utils'

describe('castTypes', () => {
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

    const actual = castTypes(sample, ';')
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

    const actual = castTypes(newSample)
    expect(actual).toEqual(newExpected)
  })
})
