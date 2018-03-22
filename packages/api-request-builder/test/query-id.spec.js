import * as queryId from '../src/query-id'

describe('queryId', () => {
  let service

  beforeEach(() => {
    service = { params: {}, ...queryId }
  })

  test('should set the id param', () => {
    service.byId('123')
    expect(service.params.id).toBe('123')
  })

  test('should throw if id is missing', () => {
    expect(() => service.byId()).toThrowError(
      /Required argument for `byId` is missing/
    )
  })

  test('should set the key param', () => {
    service.byKey('bar')
    expect(service.params.key).toBe('bar')
  })

  test('should throw if key is missing', () => {
    expect(() => service.byKey()).toThrowError(
      /Required argument for `byKey` is missing/
    )
  })

  test('should set the customerId param', () => {
    service.byCustomerId('myCustomer')
    expect(service.params.customerId).toBe('myCustomer')
  })

  test('should throw if customerId is missing', () => {
    expect(() => service.byCustomerId()).toThrowError(
      /Required argument for `byCustomerId` is missing/
    )
  })

  test('should set the cartId param', () => {
    service.byCartId('myCart')
    expect(service.params.cartId).toBe('myCart')
  })

  test('should throw if cartId is missing', () => {
    expect(() => service.byCartId()).toThrowError(
      /Required argument for `byCartId` is missing/
    )
  })

  test('throw if byId is used after byKey', () => {
    expect(() => service.byKey('bar').byId('123')).toThrowError(
      'A key for this resource has already been set. ' +
        'You cannot use both `byKey` and `byId`.'
    )
  })

  test('throw if byKey is used after byId', () => {
    expect(() => service.byId('123').byKey('bar')).toThrowError(
      'An ID for this resource has already been set. ' +
        'You cannot use both `byId` and `byKey`.'
    )
  })

  test('throw if byCustomerId is used after byId', () => {
    expect(() => service.byId('theId').byCustomerId('theCustId')).toThrowError(
      'An ID for this resource has already been set. ' +
        'You cannot use both `byId` and `byCustomerId`.'
    )
  })

  test('throw if byId is used after byCustomerId', () => {
    expect(() => service.byCustomerId('foo').byId('789')).toThrowError(
      'A customerId for this resource has already been set. ' +
        'You cannot use both `byId` and `byCustomerId`.'
    )
  })

  test('throw if byCartId is used after byId', () => {
    expect(() => service.byId('theId').byCartId('theCartId')).toThrowError(
      'An ID for this resource has already been set. ' +
        'You cannot use both `byId` and `byCartId`.'
    )
  })

  test('throw if byId is used after byCartId', () => {
    expect(() => service.byCartId('foo').byId('789')).toThrowError(
      'A cartId for this resource has already been set. ' +
        'You cannot use both `byId` and `byCartId`.'
    )
  })
})
