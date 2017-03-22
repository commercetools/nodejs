import mapCustomFields from '../src/map-custom-fields'

import customTypeSample from './helpers/custom-type-sample.json'

test('mapCustomFields should have methods', () => {
  expect(typeof mapCustomFields).toBe('object')

  expect(mapCustomFields.mapBoolean).toBeTruthy()
  expect(mapCustomFields.parse).toBeTruthy()
  expect(mapCustomFields.mapMoney).toBeTruthy()
  expect(mapCustomFields.mapSet).toBeTruthy()
  expect(mapCustomFields.mapNumber).toBeTruthy()
  expect(mapCustomFields.isValidValue).toBeFalsy()
})

describe('mapCustomFields::parse', () => {
  test('should return valid customfields object', () => {
    const data = {
      numbertype: '123',
      stringtype: 'nac',
      booleantype: 'true',
      localizedstringtype: {
        nl: 'Selwyn',
        de: 'Merkel',
      },
      enumtype: 'Ready',
      moneytype: 'EUR 1200',
      settype: '1,2,3,5',
    }

    const result = mapCustomFields.parse(data, customTypeSample, 1)

    expect(result.error.length).toBe(0)
    const expected = {
      fields: {
        booleantype: true,
        enumtype: 'Ready',
        localizedstringtype: {
          de: 'Merkel',
          nl: 'Selwyn',
        },
        moneytype: {
          centAmount: 1200,
          currencyCode: 'EUR',
        },
        numbertype: 123,
        settype: [ 1, 2, 3, 5 ],
        stringtype: 'nac',
      },
      type: {
        id: '53 45 4c 57 59 4e 2e',
      },
    }
    expect(result.data).toEqual(expected)
  })

  test('should return errors with customfields object', () => {
    const data = {
      numbertype: 'invalid',
      unsupportedType: 'okay',
      stringtype: undefined,
      booleantype: 'abi§',
      localizedstringtype: {
        nl: 'Selwyn',
        de: 'Merkel',
      },
      enumtype: 'Ready',
      moneytype: 'ABI',
      settype: 'qw,\'2\',v,t',
    }

    const result = mapCustomFields.parse(data, customTypeSample, 1)

    expect(result.error.length).toBe(8)
    const expected = {
      fields: {
        enumtype: 'Ready',
        localizedstringtype: {
          de: 'Merkel',
          nl: 'Selwyn',
        },
      },
      type: {
        id: '53 45 4c 57 59 4e 2e',
      },
    }
    const expectedErrorArray = [
      '[row 1: liqui 63 69 ty] - The number invalid isn\'t valid',
      // eslint-disable-next-line max-len
      '[row 1: liqui 63 69 ty] - \'unsupported\' type is not supported! Kindly raise an issue for this',
      // eslint-disable-next-line max-len
      '[row 1: liqui 63 69 ty] - The value \'abi§\' is not a valid boolean value',
      '[row 1: liqui 63 69 ty] - Invalid money - Cannot parse money ABI',
      '[row 1: liqui 63 69 ty] - The number qw isn\'t valid',
      '[row 1: liqui 63 69 ty] - The number \'2\' isn\'t valid',
      '[row 1: liqui 63 69 ty] - The number v isn\'t valid',
      '[row 1: liqui 63 69 ty] - The number t isn\'t valid',
    ]
    expect(result.data).toEqual(expected)
    expect(result.error.map(error => error.message)).toEqual(expectedErrorArray)
  })
})

describe('mapCustomFields::mapBoolean', () => {
  test('should return boolean value when passed in', () => {
    const result = mapCustomFields.mapBoolean('true')

    expect(result.error).toBeFalsy()
    expect(result.data).toBe(true)
  })

  test('should return no error or data when value is empty', () => {
    const result = mapCustomFields.mapBoolean('')

    expect(result.error).toBeFalsy()
    expect(result.data).toBeFalsy()
  })

  test('should return error when value is not valid boolean', () => {
    const result = mapCustomFields.mapBoolean('{"ok":"yes"}')

    expect(result.error).toBeTruthy()
    expect(result.data).toBeFalsy()
  })

  test('should return error when invalid value is passed in', () => {
    const result = mapCustomFields.mapBoolean('abi')

    expect(result.error).toBeTruthy()
    expect(result.data).toBeFalsy()
  })
})

describe('mapCustomFields::mapMoney', () => {
  test('should return money object when passed in', () => {
    const result = mapCustomFields.mapMoney('EUR 1400')

    expect(result.error).toBeFalsy()
    const expected = { centAmount: 1400, currencyCode: 'EUR' }
    expect(result.data).toEqual(expected)
  })

  test('should return error when invalid value is passed in', () => {
    const result = mapCustomFields.mapMoney('abi')

    expect(result.error).toBeTruthy()
    expect(result.data).toBeFalsy()
  })

  test('should return no error or data when value is empty', () => {
    const result = mapCustomFields.mapMoney('')

    expect(result.error).toBeFalsy()
    expect(result.data).toBeFalsy()
  })
})

describe('mapCustomFields::mapNumber', () => {
  test('should return a valid number when passed in', () => {
    const result = mapCustomFields.mapNumber('1400')

    expect(result.error).toBeFalsy()
    expect(result.data).toBe(1400)
  })

  test('should parse a valid floating number', () => {
    const result = mapCustomFields.mapNumber('0.5')

    expect(result.error).toBeFalsy()
    expect(result.data).toBe(0.5)
  })

  test('should return error when invalid value is passed in', () => {
    const result = mapCustomFields.mapNumber('abi')

    expect(result.error).toBeTruthy()
    expect(result.data).toBeFalsy()
  })

  test('should return no error or data when value is empty', () => {
    const result = mapCustomFields.mapNumber('')

    expect(result.error).toBeFalsy()
    expect(result.data).toBeFalsy()
  })
})

describe('mapCustomFields::mapSet', () => {
  test('should format all values to money', () => {
    const elementType = { name: 'Number' }
    const result = mapCustomFields.mapSet('1,2,3,4', elementType)

    expect(result.error.length).toBe(0)
    const expected = [1, 2, 3, 4]
    expect(result.data).toEqual(expected)
  })

  test('should format all values to money', () => {
    const elementType = { name: 'Money' }
    const moneySet = 'EUR 1200,USD 40,NGN 200'
    const result = mapCustomFields.mapSet(moneySet, elementType)

    expect(result.error.length).toBe(0)
    const expected = [{
      currencyCode: 'EUR',
      centAmount: 1200,
    }, {
      currencyCode: 'USD',
      centAmount: 40,
    }, {
      currencyCode: 'NGN',
      centAmount: 200,
    }]
    expect(result.data).toEqual(expected)
  })

  test('should return error if values in set is invalid', () => {
    const elementType = { name: 'Boolean' }
    const moneySet = 'true, false, false, abi'
    const result = mapCustomFields.mapSet(moneySet, elementType)
    expect(result.error.length).toBe(1)
    expect(result.error[0])
    .toEqual('The value \'abi\' is not a valid boolean value')
    expect(result.data.length).toBe(3)
  })

  test('should return error if elementType in set is not supported', () => {
    const elementType = { name: 'unsupportedType' }
    const moneySet = 'true, false, false, abi'
    const result = mapCustomFields.mapSet(moneySet, elementType)

    expect(result.error.length).toBe(4)
    expect(result.error[0]).toEqual(
      // eslint-disable-next-line max-len
      '\'unsupportedType\' type is not supported! Kindly raise an issue for this',
    )
  })

  test('should parse all values as a string', () => {
    const elementType = { name: 'String' }
    const moneySet = 'shoe, monitor, abi'
    const result = mapCustomFields.mapSet(moneySet, elementType)

    expect(result.error).toBeTruthy()
    const expected = ['shoe', 'monitor', 'abi']
    expect(result.data).toEqual(expected)
  })
})
